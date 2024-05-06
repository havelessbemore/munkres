import { isTypedArray } from "util/types";

import type { MatrixLike } from "../types/matrixLike";
import type { Matching } from "../types/matching";
import type { MutableArrayLike } from "../types/mutableArrayLike";
import type { MatchRequest, MatchResponse, Runner } from "../types/async";

import { Mutex } from "../utils/async/mutex";
import { SharedStack } from "../utils/async/sharedStack";
import { copy } from "../utils/mutableArrayLike";

import {
  match,
  matchB,
  step1,
  step5,
  step5B,
  step6,
  step6B,
  steps2To3,
} from "./finMunkres";
import { isBigInt } from "../utils/is";
import { toTypedMatrix } from "../utils/matrixLike";

/**
 * Find the optimal assignments of `y` workers to `x` jobs to
 * minimize total cost.
 *
 * @param costMatrix - The cost matrix, where `mat[y][x]` represents the cost
 * of assigning worker `y` to job `x`.
 *
 * @returns An array of pairs `[y, x]` representing the optimal assignment
 * of workers to jobs. Each pair consists of a worker index `y` and a job
 * index `x`, indicating that worker `y` is assigned to job `x`.
 *
 * @privateRemarks
 * Citations:
 * 1. {@link https://dl.acm.org/doi/pdf/10.1145/115234.115349 | Egon Balas, Donald Miller, Joseph Pekny, and Paolo Toth. 1991. A parallel shortest augmenting path algorithm for the assignment problem. J. ACM 38, 4 (Oct. 1991), 985–1004.}
 *        - Used to explore asynchronous assignment problem.
 */
export function exec(
  matrix: MatrixLike<number>,
  runner: Runner<number>,
): Promise<Matching<number>>;
export function exec(
  matrix: MatrixLike<bigint>,
  runner: Runner<bigint>,
): Promise<Matching<bigint>>;
export async function exec<T extends number | bigint>(
  matrix: MatrixLike<T>,
  runner: Runner<T>,
): Promise<Matching<T>> {
  // Get dimensions
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;

  // Check if empty matrix
  if (Y <= 0 || X <= 0) {
    return { dualX: [], dualY: [], matrix, starsX: [], starsY: [] };
  }

  // Step 1: Reduce
  const [dualX, dualY] = getDualArrays(matrix);
  // @ts-expect-error ts(2769)
  step1(matrix, dualX, dualY);

  // Steps 2 & 3: Find initial matching
  const bInt32 = Int32Array.BYTES_PER_ELEMENT;
  const starsX = new Int32Array(new SharedArrayBuffer(X * bInt32)).fill(-1);
  const starsY = new Int32Array(new SharedArrayBuffer(Y * bInt32)).fill(-1);
  // @ts-expect-error ts(2769)
  const stars = steps2To3(matrix, dualX, dualY, starsX, starsY);

  // Step 4: Find complete matching
  const unmatched = Y <= X ? Y - stars : X - stars;
  // @ts-expect-error ts(2769)
  await step4(runner, unmatched, matrix, dualX, dualY, starsX, starsY);

  // Return matching
  return { dualX, dualY, matrix, starsX, starsY };
}

export function step4(
  runner: Runner<number>,
  unmatched: number,
  matrix: MatrixLike<number>,
  dualX: MutableArrayLike<number>,
  dualY: MutableArrayLike<number>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
): Promise<void>;
export function step4(
  runner: Runner<bigint>,
  unmatched: number,
  matrix: MatrixLike<bigint>,
  dualX: MutableArrayLike<bigint>,
  dualY: MutableArrayLike<bigint>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
): Promise<void>;
export async function step4<T extends number | bigint>(
  runner: Runner<T>,
  unmatched: number,
  matrix: MatrixLike<T>,
  dualX: MutableArrayLike<T>,
  dualY: MutableArrayLike<T>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
): Promise<void> {
  // If no unmatched row
  if (unmatched <= 0) {
    return;
  }

  // Initialize mutex
  const bInt32 = Int32Array.BYTES_PER_ELEMENT;
  const mutexBuffer = new SharedArrayBuffer(bInt32);

  // Initialize stack
  const stackMutexBuffer = new SharedArrayBuffer(bInt32);
  const stackSizeBuffer = new SharedArrayBuffer(bInt32);
  const stackValueBuffer = new SharedArrayBuffer(unmatched * bInt32);

  // Populate stack
  const mutex = new Mutex(stackMutexBuffer);
  const stack = new SharedStack(stackValueBuffer, stackSizeBuffer, mutex);
  const starsZ = dualY.length <= dualX.length ? starsY : starsX;
  for (let z = 0; unmatched > 0; ++z) {
    if (starsZ[z] === -1) {
      await stack.push(z);
      --unmatched;
    }
  }

  matrix = toTypedMatrix(matrix);

  // Perform matching
  const P = Math.min(runner.size, stack.size);
  const promises = new Array<Promise<void>>(P);
  const matching: Matching<T> = { matrix, dualX, dualY, starsX, starsY };
  for (let i = 0; i < P; ++i) {
    promises[i] = runner.match({
      matching,
      mutexBuffer,
      stack: {
        mutexBuffer: stackMutexBuffer,
        sizeBuffer: stackSizeBuffer,
        valueBuffer: stackValueBuffer,
      },
    });
  }

  await Promise.allSettled(promises);
}

export function getDualArrays<T>(matrix: MatrixLike<T>): MutableArrayLike<T>[] {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
  type Ctor<T> = new (buf: SharedArrayBuffer) => MutableArrayLike<T>;

  let BPE: number;
  let ctor: Ctor<T>;

  if (isTypedArray(matrix[0])) {
    BPE = matrix[0].BYTES_PER_ELEMENT;
    ctor = matrix[0].constructor as Ctor<T>;
  } else if (isBigInt(matrix[0][0])) {
    BPE = BigInt64Array.BYTES_PER_ELEMENT;
    ctor = BigInt64Array as unknown as Ctor<T>;
  } else {
    BPE = Float64Array.BYTES_PER_ELEMENT;
    ctor = Float64Array as unknown as Ctor<T>;
  }

  return [
    new ctor(new SharedArrayBuffer(X * BPE)),
    new ctor(new SharedArrayBuffer(Y * BPE)),
  ];
}

export function matchAsync(req: MatchRequest<number>): Promise<MatchResponse>;
export function matchAsync(req: MatchRequest<bigint>): Promise<MatchResponse>;
export async function matchAsync<T extends number | bigint>(
  req: MatchRequest<T>,
): Promise<MatchResponse> {
  const {
    matching: { matrix },
  } = req;
  return matrix.length <= (matrix[0]?.length ?? 0)
    ? // @ts-expect-error ts(2769)
      await matchAsyncA(req)
    : // @ts-expect-error ts(2769)
      await matchAsyncB(req);
}

// A

export function isAugmentingPathA(
  x: number,
  primeY: ArrayLike<number>,
  starsX: ArrayLike<number>,
  starsY: ArrayLike<number>,
  sx: ArrayLike<number>,
): boolean {
  while (x !== -1) {
    const y = primeY[x];
    if (starsY[y] === x || starsX[x] !== sx[x]) {
      return false;
    }
    x = starsY[y];
  }
  return true;
}

export function matchAsyncA(req: MatchRequest<number>): Promise<MatchResponse>;
export function matchAsyncA(req: MatchRequest<bigint>): Promise<MatchResponse>;
export async function matchAsyncA<T extends number | bigint>(
  req: MatchRequest<T>,
): Promise<MatchResponse> {
  // Shared
  const { matching, mutexBuffer } = req;
  const { matrix: mat, dualX, dualY, starsX, starsY } = matching;
  const mutex = new Mutex(mutexBuffer);
  const stack = new SharedStack(
    req.stack.valueBuffer,
    req.stack.sizeBuffer,
    new Mutex(req.stack.mutexBuffer),
  );

  // Local
  const X = dualX.length;
  const LDualX = new Array<T>(X);
  const LDualY = new Array<T>(dualY.length);
  const slack = new Uint32Array(X);
  const slackV = new Array<T>(X);
  const slackY = new Uint32Array(X);
  const LStarsX = new Int32Array(X);

  while (stack.size > 0) {
    const y = await stack.pop(500).catch(() => undefined);
    if (y == null) {
      continue;
    }

    await mutex.request(() => {
      copy(dualX, LDualX);
      copy(dualY, LDualY);
      copy(starsX, LStarsX);
    });

    // @ts-expect-error ts(2769)
    const N = match(y, mat, LDualX, LDualY, LStarsX, slack, slackV, slackY);

    await mutex.request(async () => {
      // Check if valid augmenting path found. Confirms path is
      // pairwise disjoint from any previously accepted paths.
      const x = slack[N - 1];
      if (!isAugmentingPathA(x, slackY, starsX, starsY, LStarsX)) {
        await stack.push(y);
        return;
      }

      // Update dual variables
      // @ts-expect-error ts(2769)
      step6(y, N, dualX, dualY, slack, slackV, starsX);

      // Update matching
      step5(x, slackY, starsX, starsY);
    });
  }

  return {};
}

// B

export function isAugmentingPathB(
  y: number,
  primeX: ArrayLike<number>,
  starsX: ArrayLike<number>,
  starsY: ArrayLike<number>,
  sy: ArrayLike<number>,
): boolean {
  while (y !== -1) {
    const x = primeX[y];
    if (starsX[x] === y || starsY[y] !== sy[y]) {
      return false;
    }
    y = starsX[x];
  }
  return true;
}

export function matchAsyncB(req: MatchRequest<number>): Promise<MatchResponse>;
export function matchAsyncB(req: MatchRequest<bigint>): Promise<MatchResponse>;
export async function matchAsyncB<T extends number | bigint>(
  req: MatchRequest<T>,
): Promise<MatchResponse> {
  // Shared
  const { matching, mutexBuffer } = req;
  const { matrix: mat, dualX, dualY, starsX, starsY } = matching;
  const mutex = new Mutex(mutexBuffer);
  const stack = new SharedStack(
    req.stack.valueBuffer,
    req.stack.sizeBuffer,
    new Mutex(req.stack.mutexBuffer),
  );

  // Local
  const Y = dualY.length;
  const LDualX = new Array<T>(dualX.length);
  const LDualY = new Array<T>(Y);
  const slack = new Uint32Array(Y);
  const slackV = new Array<T>(Y);
  const slackX = new Uint32Array(Y);
  const LStarsY = new Int32Array(Y);

  while (stack.size > 0) {
    const x = await stack.pop(500).catch(() => undefined);
    if (x == null) {
      continue;
    }

    await mutex.request(() => {
      copy(dualX, LDualX);
      copy(dualY, LDualY);
      copy(starsY, LStarsY);
    });

    // @ts-expect-error ts(2769)
    const N = matchB(x, mat, LDualX, LDualY, LStarsY, slack, slackV, slackX);

    await mutex.request(async () => {
      // Check if valid augmenting path found. Confirms path is
      // pairwise disjoint from any previously accepted paths.
      const y = slack[N - 1];
      if (!isAugmentingPathB(x, slackX, starsX, starsY, LStarsY)) {
        await stack.push(x);
        return;
      }

      // Update dual variables
      // @ts-expect-error ts(2769)
      step6B(x, N, dualX, dualY, slack, slackV, starsY);

      // Update matching
      step5B(y, slackX, starsX, starsY);
    });
  }

  return {};
}
