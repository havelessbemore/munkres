import type { MatrixLike } from "../types/matrixLike";
import type { Matching } from "../types/matching";
import type { MutableArrayLike } from "../types/mutableArrayLike";

import { match, step1, step4B, step5, step6, steps2To3 } from "./finMunkres";

export interface AsyncMatcher<T> {
  size: Readonly<number>;
  match(data: MatchRequest<T>): Promise<MatchResult<T>>;
}

export interface MatchRequest<T> {
  y?: number;
  x?: number;
  matching: Matching<T>;
}

export interface MatchResult<T> {
  y?: number;
  x?: number;
  N: number;
  slack: ArrayLike<number>;
  slackV: ArrayLike<T>;
  slackY: ArrayLike<number>;
}

export function exec(
  matrix: MatrixLike<number>,
  runner: AsyncMatcher<number>,
): Promise<Matching<number>>;
export function exec(
  matrix: MatrixLike<bigint>,
  runner: AsyncMatcher<bigint>,
): Promise<Matching<bigint>>;
export async function exec<T extends number | bigint>(
  matrix: MatrixLike<T>,
  runner: AsyncMatcher<T>,
): Promise<Matching<T>> {
  // Get dimensions
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;

  // Check if empty matrix
  if (Y <= 0 || X <= 0) {
    return { dualX: [], dualY: [], matrix, starsX: [], starsY: [] };
  }

  // Step 1: Reduce
  const dualX = new Array<T>(X);
  const dualY = new Array<T>(Y);
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
  runner: AsyncMatcher<number>,
  unmatched: number,
  matrix: MatrixLike<number>,
  dualX: MutableArrayLike<number>,
  dualY: MutableArrayLike<number>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
): Promise<void>;
export function step4(
  runner: AsyncMatcher<bigint>,
  unmatched: number,
  matrix: MatrixLike<bigint>,
  dualX: MutableArrayLike<bigint>,
  dualY: MutableArrayLike<bigint>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
): Promise<void>;
export async function step4<T extends number | bigint>(
  runner: AsyncMatcher<T>,
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

  // While there are tasks
  const matching: Matching<T> = { matrix, dualX, dualY, starsX, starsY };
  while (tasks.length > 0) {
    // Phase 0: Find augmenting paths
    const S = Math.min(runner.size, tasks.length);
    const proms: Promise<MatchResult<T>>[] = new Array(S);
    for (let i = 0; i < S; ++i) {
      proms[i] = runner.match({ y: tasks.pop()!, matching });
    }
    const results = await Promise.all(proms);

    // Sort paths by lengths to reduce conflicts
    results.sort((a, b) => a.N - b.N);

    // Phase 1: Apply augmenting paths
    for (let i = 0; i < S; ++i) {
      const { y, N, slack, slackV, slackY } = results[i];
      const x = slack[N - 1];

      // Discard result if conflict detected
      if (starsX[x] !== -1) {
        tasks.push(y!);
        continue;
      }

      // Update dual variables
      // @ts-expect-error ts(2769)
      step6(y, N, dualX, dualY, slack, slackV, starsX);

      // Update matching
      step5(x, slackY, starsX, starsY);
    }
  }
}

export function matchAsync(req: MatchRequest<number>): MatchResult<number>;
export function matchAsync(req: MatchRequest<bigint>): MatchResult<bigint>;
export function matchAsync<T extends number | bigint>(
  req: MatchRequest<T>,
): MatchResult<T> {
  const {
    y,
    matching: { matrix, dualX, dualY, starsX },
  } = req;

  const X = dualX.length;
  const B = X * Uint32Array.BYTES_PER_ELEMENT;
  const slack = new Uint32Array(new SharedArrayBuffer(B));
  const slackV = new Array<T>(X);
  const slackY = new Uint32Array(new SharedArrayBuffer(B));

  // @ts-expect-error ts(2769)
  const N = match(y, matrix, dualX, dualY, starsX, slack, slackV, slackY);
  return { y, N, slack, slackV, slackY };
}
