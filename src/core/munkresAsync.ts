import type { MatrixLike } from "../types/matrixLike";
import type { Matching } from "../types/matching";
import type { MutableArrayLike } from "../types/mutableArrayLike";

import { match, step1, step4B, step5, step6, steps2To3 } from "./finMunkres";
import { MatchRequest, MatchResult, Runner } from "../types/runner";
import { isTypedArray } from "util/types";
import { Constructor } from "../types/constructor";
import { Mutex } from "../utils/mutex";
import { SharedStack } from "../utils/sharedStack";
import { copy } from "../utils/mutableArrayLike";

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
  const [starsX, starsY] = getStarArrays(matrix);
  // @ts-expect-error ts(2769)
  const stars = steps2To3(matrix, dualX, dualY, starsX, starsY);

  // Step 4: Find complete matching
  try {
    Y <= X
      ? // @ts-expect-error ts(2769)
        await step4(runner, Y - stars, matrix, dualX, dualY, starsX, starsY)
      : // @ts-expect-error ts(2769)
        step4B(X - stars, matrix, dualX, dualY, starsX, starsY);
  } catch (err) {
    console.error(err);
  }

  // Return matching
  return { dualX, dualY, matrix, starsX, starsY };
}

/**
 * This step iteratively improves upon an initial matching until a complete
 * matching is found. This involves updating dual variables and managing
 * slack values to uncover new opportunities for optimal assignments.
 *
 * @param unmatched - The number of missing matches.
 * @param mat - An MxN cost matrix.
 * @param dualX - The dual variables for each matrix column. Modified in place.
 * @param dualY - The dual variables for each matrix row. Modified in place.
 * @param starsX - An array mapping star columns to row. Modified in place.
 * @param starsY - An array mapping star rows to columns. Modified in place.
 */
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

  // Initialize buffer
  let byteLength = 2 * Int32Array.BYTES_PER_ELEMENT;
  const mutexBuffer = new SharedArrayBuffer(byteLength);

  // Initialize size buffer
  byteLength = Int32Array.BYTES_PER_ELEMENT;
  const sizeBuffer = new SharedArrayBuffer(byteLength);

  // Find unmatched indices
  byteLength = unmatched * Uint32Array.BYTES_PER_ELEMENT;
  const indexBuffer = new SharedArrayBuffer(byteLength);
  const mutex = new Mutex(mutexBuffer);
  const stack = new SharedStack(indexBuffer, sizeBuffer, mutex);
  for (let y = 0; unmatched > 0; ++y) {
    if (starsY[y] === -1) {
      await stack.push(y);
      --unmatched;
    }
  }

  // Perform matching
  const P = Math.min(runner.size, stack.size);
  const promises = new Array<Promise<MatchResult>>(P);
  const matching: Matching<T> = { matrix, dualX, dualY, starsX, starsY };
  for (let i = 0; i < P; ++i) {
    promises[i] = runner.match({
      indexBuffer,
      matching,
      mutexBuffer,
      sizeBuffer,
    });
  }

  await Promise.all(promises);
}

export function getDualArrays<T>(matrix: MatrixLike<T>): MutableArrayLike<T>[] {
  const Y = matrix.length;
  const X = matrix[0].length;
  if (!isTypedArray(matrix[0])) {
    return [new Array<T>(X), new Array<T>(Y)];
  }
  const BPE = matrix[0].BYTES_PER_ELEMENT;
  const ctor = matrix[0].constructor as Constructor<MutableArrayLike<T>>;
  return [
    new ctor(new SharedArrayBuffer(X * BPE)),
    new ctor(new SharedArrayBuffer(Y * BPE)),
  ];
}

export function getStarArrays(
  matrix: MatrixLike<unknown>,
): MutableArrayLike<number>[] {
  const Y = matrix.length;
  const X = matrix[0].length;
  const BPE = Int32Array.BYTES_PER_ELEMENT;
  return [
    new Int32Array(new SharedArrayBuffer(X * BPE)).fill(-1),
    new Int32Array(new SharedArrayBuffer(Y * BPE)).fill(-1),
  ];
}

export function isAugmentingPath(
  x: number,
  primeY: ArrayLike<number>,
  starsY: ArrayLike<number>,
): boolean {
  while (x !== -1) {
    const y = primeY[x];
    if (starsY[y] === x) {
      return false;
    }
    x = starsY[y];
  }
  return true;
}

export function matchAsync(req: MatchRequest<number>): Promise<MatchResult>;
export function matchAsync(req: MatchRequest<bigint>): Promise<MatchResult>;
export async function matchAsync<T extends number | bigint>(
  req: MatchRequest<T>,
): Promise<MatchResult> {
  // Shared
  const { indexBuffer, matching, mutexBuffer, sizeBuffer } = req;
  const { matrix, dualX, dualY, starsX, starsY } = matching;
  const mutex = new Mutex(mutexBuffer, Int32Array.BYTES_PER_ELEMENT);
  const stack = new SharedStack(
    indexBuffer,
    sizeBuffer,
    new Mutex(mutexBuffer),
  );

  // Local
  const X = dualX.length;
  const dx = new Array<T>(X);
  const dy = new Array<T>(dualY.length);
  const slack = new Uint32Array(X);
  const slackV = new Array<T>(X);
  const slackY = new Uint32Array(X);
  const sx = new Int32Array(X);

  let y: number | undefined;
  while ((y = await stack.pop()) != null) {
    await mutex.lock(5000);
    try {
      copy(dualX, dx);
      copy(dualY, dy);
      copy(starsX, sx);
    } finally {
      mutex.unlock();
    }

    // @ts-expect-error ts(2769)
    const N = match(y, matrix, dx, dy, sx, slack, slackV, slackY);

    await mutex.lock(5000);
    try {
      // Check if valid augmenting path found. Confirms path is
      // pairwise disjoint from any previously accepted paths.
      const x = slack[N - 1];
      if (!isAugmentingPath(x, slackY, starsY)) {
        await stack.push(y);
        continue;
      } else {
        // Update dual variables
        // @ts-expect-error ts(2769)
        step6(y, N, dualX, dualY, slack, slackV, sx);

        // Update matching
        step5(x, slackY, starsX, starsY);
      }
    } finally {
      mutex.unlock();
    }
  }

  return {};
}

// B

export function isAugmentingPathB(
  y: number,
  primeX: ArrayLike<number>,
  starsX: ArrayLike<number>,
): boolean {
  while (y !== -1) {
    const x = primeX[y];
    if (starsX[x] === y) {
      return false;
    }
    y = starsX[x];
  }
  return true;
}
