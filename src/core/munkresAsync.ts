import type { MatrixLike } from "../types/matrixLike";
import type { Matching } from "../types/matching";
import type { MutableArrayLike } from "../types/mutableArrayLike";

import { match, step1, step4B, step5, steps2To3 } from "./finMunkres";
import { MatchRequest, MatchResult, Runner } from "../types/runner";
import { isTypedArray } from "util/types";
import { Constructor } from "../types/constructor";
import { isBigInt } from "../utils/is";

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
  let dualX: MutableArrayLike<T>;
  let dualY: MutableArrayLike<T>;
  if (isTypedArray(matrix[0])) {
    const BPE = matrix[0].BYTES_PER_ELEMENT;
    const ctor = matrix[0].constructor as Constructor<MutableArrayLike<T>>;
    dualX = new ctor(new SharedArrayBuffer(X * BPE));
    dualY = new ctor(new SharedArrayBuffer(Y * BPE));
  } else {
    dualX = new Array<T>(X);
    dualY = new Array<T>(Y);
  }
  // @ts-expect-error ts(2769)
  step1(matrix, dualX, dualY);

  // Steps 2 & 3: Find initial matching
  const BPE = Int32Array.BYTES_PER_ELEMENT;
  const starsX = new Int32Array(new SharedArrayBuffer(X * BPE)).fill(-1);
  const starsY = new Int32Array(new SharedArrayBuffer(Y * BPE)).fill(-1);
  // @ts-expect-error ts(2769)
  const stars = steps2To3(matrix, dualX, dualY, starsX, starsY);

  // Step 4: Find complete matching
  Y <= X
    ? // @ts-expect-error ts(2769)
      await step4(runner, Y - stars, matrix, dualX, dualY, starsX, starsY)
    : // @ts-expect-error ts(2769)
      step4B(X - stars, matrix, dualX, dualY, starsX, starsY);

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

  // Find unmatched rows
  const tasks: number[] = new Array(unmatched);
  for (let y = 0; unmatched > 0; ++y) {
    if (starsY[y] === -1) {
      tasks[--unmatched] = y;
    }
  }

  const X = dualX.length;
  const Y = dualY.length;
  const zero = (isBigInt(matrix[0][0]) ? 0n : 0) as T;
  const diffX = new Array<T>(X);
  const diffY = new Array<T>(Y);

  // Initialize slack
  const B = X * Uint32Array.BYTES_PER_ELEMENT;
  let S = Math.min(runner.size, tasks.length);
  const slacks = new Array<[Uint32Array, Uint32Array]>(S);
  for (let i = 0; i < S; ++i) {
    slacks[i] = [
      new Uint32Array(new SharedArrayBuffer(B)),
      new Uint32Array(new SharedArrayBuffer(B)),
    ];
  }

  // While there are tasks
  const proms: Promise<MatchResult<T>>[] = new Array(S);
  const matching: Matching<T> = { matrix, dualX, dualY, starsX, starsY };
  while (tasks.length > 0) {
    // Get phase size
    S = Math.min(runner.size, tasks.length);
    proms.length = S;

    // Phase 0: Find augmenting paths
    for (let i = 0; i < S; ++i) {
      const y = tasks.pop()!;
      const [slack, slackY] = slacks[i];
      proms[i] = runner.match({ id: i, y, matching, slack, slackY });
    }
    const results = await Promise.all(proms);

    // Sort paths by lengths to reduce conflicts
    results.sort((a, b) => a.N - b.N);

    // Phase 1: Apply augmenting paths
    diffX.fill(zero);
    diffY.fill(zero);
    for (let i = 0; i < S; ++i) {
      const { id, y, N, slackV } = results[i];
      const [slack, slackY] = slacks[id];
      const x = slack[N - 1];

      // Check if valid augmenting path found. Confirms path is
      // pairwise disjoint from any previously accepted paths.
      if (!isAugmentingPath(x, slackY, starsY)) {
        tasks.push(y);
        continue;
      }

      // Update dual variables
      // @ts-expect-error ts(2769)
      step6(y, N, diffX, diffY, slack, slackV, starsX);

      // Update matching
      step5(x, slackY, starsX, starsY);
    }

    for (let x = 0; x < X; ++x) {
      // @ts-expect-error ts(2365)
      dualX[x] -= diffX[x];
    }

    for (let y = 0; y < Y; ++y) {
      // @ts-expect-error ts(2365)
      dualY[y] += diffY[y];
    }
  }
}

/**
 * Adjusts dual variables to uncover more admissible edges.
 *
 * @param N - The number of adjustments to make.
 * @param min - The value to adjust by.
 * @param coveredY - An array indicating whether a row is covered.
 * @param dualX - The dual variables for each matrix column. Modified in place.
 * @param dualY - The dual variables for each matrix row. Modified in place.
 * @param slack - An array of covered column indices.
 * @param slackV - The slack values for each column. Modified in place.
 */
export function step6(
  y: number,
  N: number,
  diffX: MutableArrayLike<number>,
  diffY: MutableArrayLike<number>,
  slack: ArrayLike<number>,
  slackV: ArrayLike<number>,
  starsX: ArrayLike<number>,
): void;
export function step6(
  y: number,
  N: number,
  diffX: MutableArrayLike<bigint>,
  diffY: MutableArrayLike<bigint>,
  slack: ArrayLike<number>,
  slackV: ArrayLike<bigint>,
  starsX: ArrayLike<number>,
): void;
export function step6<T extends number | bigint>(
  y: number,
  N: number,
  diffX: MutableArrayLike<T>,
  diffY: MutableArrayLike<T>,
  slack: ArrayLike<number>,
  slackV: ArrayLike<T>,
  starsX: ArrayLike<number>,
): void {
  const sum = slackV[slack[N - 1]];

  let min = sum;
  for (let i = 0; i < N; ++i) {
    if (min > diffY[y]) {
      diffY[y] = min;
    }
    const x = slack[i];
    min = (sum - slackV[x]) as T;
    if (min > diffX[x]) {
      diffX[x] = min;
    }
    y = starsX[x];
  }
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

export function matchAsync(req: MatchRequest<number>): MatchResult<number>;
export function matchAsync(req: MatchRequest<bigint>): MatchResult<bigint>;
export function matchAsync<T extends number | bigint>(
  req: MatchRequest<T>,
): MatchResult<T> {
  const {
    id,
    y,
    matching: { matrix, dualX, dualY, starsX },
    slack,
    slackY,
  } = req;

  const X = dualX.length;
  const slackV = isTypedArray(dualX)
    ? new (dualX.constructor as Constructor<MutableArrayLike<T>>)(
        new SharedArrayBuffer(dualX.byteLength),
      )
    : new Array<T>(X);

  // @ts-expect-error ts(2769)
  const N = match(y, matrix, dualX, dualY, starsX, slack, slackV, slackY);
  return { id, y, N, slackV };
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
