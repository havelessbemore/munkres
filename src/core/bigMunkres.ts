import { MatrixLike } from "../types/matrixLike";
import { Matching } from "../types/matching";
import { MutableArrayLike } from "../types/mutableArrayLike";

import { getMin } from "../utils/arrayLike";
import { isBigInt } from "../utils/is";
import { partitionByMin } from "../utils/mutableArrayLike";

import { step4B } from "./bigMunkresB";

export function exec(matrix: MatrixLike<number>): Matching<number>;
export function exec(matrix: MatrixLike<bigint>): Matching<bigint>;
export function exec<T extends number | bigint>(
  matrix: MatrixLike<T>,
): Matching<T> {
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
  const starsX = new Array<number>(X).fill(-1);
  const starsY = new Array<number>(Y).fill(-1);
  // @ts-expect-error ts(2769)
  const stars = steps2To3(matrix, dualX, dualY, starsX, starsY);

  // Step 4: Find complete matching
  Y <= X
    ? // @ts-expect-error ts(2769)
      step4(Y - stars, matrix, dualX, dualY, starsX, starsY)
    : // @ts-expect-error ts(2769)
      step4B(X - stars, matrix, dualX, dualY, starsX, starsY);

  // Return matching
  return { dualX, dualY, matrix, starsX, starsY };
}

/**
 * Initializes the dual variables for the Munkres algorithm.
 *
 * This is a preprocessing step that effectively performs
 * row-wise and column-wise reductions on the cost matrix. This
 * helps find an initial matching and improves the efficiency
 * of subsequent steps.
 *
 * @param matrix - The cost matrix.
 * @param dualX - The dual variables for each matrix column. Modified in place.
 * @param dualY - The dual variables for each matrix row. Modified in place.
 */
export function step1(
  matrix: MatrixLike<number>,
  dualX: MutableArrayLike<number>,
  dualY: MutableArrayLike<number>,
): void;
export function step1(
  matrix: MatrixLike<bigint>,
  dualX: MutableArrayLike<bigint>,
  dualY: MutableArrayLike<bigint>,
): void;
export function step1<T extends number | bigint>(
  matrix: MatrixLike<T>,
  dualX: MutableArrayLike<T>,
  dualY: MutableArrayLike<T>,
): void {
  const X = dualX.length;
  const Y = dualY.length;

  // If matrix is tall, skip row reduction
  if (Y > X) {
    dualY.fill((isBigInt(matrix[0][0]) ? 0n : 0) as T);
  } else {
    // Reduce rows
    for (let y = 0; y < Y; ++y) {
      // @ts-expect-error ts(2769)
      dualY[y] = getMin(matrix[y])!;
    }
  }

  // If matrix is wide, skip column reduction
  if (Y < X) {
    dualX.fill((isBigInt(matrix[0][0]) ? 0n : 0) as T);
    return;
  }

  // Initialize dualX
  let dy = dualY[0];
  let row = matrix[0];
  for (let x = 0; x < X; ++x) {
    dualX[x] = (row[x] - dy) as T;
  }

  // Reduce columns
  for (let y = 1; y < Y; ++y) {
    dy = dualY[y];
    row = matrix[y];
    for (let x = 0; x < X; ++x) {
      const dx = row[x] - dy;
      if (dx < dualX[x]) {
        dualX[x] = dx as T;
      }
    }
  }
}

/**
 * Finds an initial matching for the munkres algorithm.
 *
 * @param matrix - The cost matrix.
 * @param dualX - The dual variables for each matrix column.
 * @param dualY - The dual variables for each matrix row.
 * @param starsX - An array mapping star columns to row. Modified in place.
 * @param starsY - An array mapping star rows to columns. Modified in place.
 *
 * @returns The number of matches (stars) found.
 */
export function steps2To3(
  matrix: MatrixLike<number>,
  dualX: ArrayLike<number>,
  dualY: ArrayLike<number>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
): number;
export function steps2To3(
  matrix: MatrixLike<bigint>,
  dualX: ArrayLike<bigint>,
  dualY: ArrayLike<bigint>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
): number;
export function steps2To3<T extends number | bigint>(
  matrix: MatrixLike<T>,
  dualX: ArrayLike<T>,
  dualY: ArrayLike<T>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
): number {
  const X = dualX.length;
  const Y = dualY.length;
  const S = Y <= X ? Y : X;

  let stars = 0;
  for (let y = 0; y < Y && stars < S; ++y) {
    const dy = dualY[y];
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      if (starsX[x] === -1 && dy === row[x] - dualX[x]) {
        starsX[x] = y;
        starsY[y] = x;
        ++stars;
        break;
      }
    }
  }

  return stars;
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
  unmatched: number,
  matrix: MatrixLike<number>,
  dualX: MutableArrayLike<number>,
  dualY: MutableArrayLike<number>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
): void;
export function step4(
  unmatched: number,
  matrix: MatrixLike<bigint>,
  dualX: MutableArrayLike<bigint>,
  dualY: MutableArrayLike<bigint>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
): void;
export function step4<T extends number | bigint>(
  unmatched: number,
  matrix: MatrixLike<T>,
  dualX: MutableArrayLike<T>,
  dualY: MutableArrayLike<T>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
): void {
  // If no unmatched row
  if (unmatched <= 0) {
    return;
  }

  const X = dualX.length;
  const slack = new Uint32Array(X);
  const slackV = new Array<T>(X);
  const slackY = new Uint32Array(X);

  // Match unmatched rows
  for (let y = 0; unmatched > 0; ++y) {
    if (starsY[y] !== -1) {
      continue;
    }

    // @ts-expect-error ts(2769)
    const N = match(y, matrix, dualX, dualY, starsX, slack, slackV, slackY);
    --unmatched;

    // Update dual variables
    // @ts-expect-error ts(2769)
    step6(y, N, dualX, dualY, slack, slackV, starsX);

    // Update matching
    step5(slack[N - 1], slackY, starsX, starsY);
  }
}

/**
 * Augments the current matching.
 *
 * This step effectively increases the number of matches (stars)
 * by 1, bringing the algorithm closer to an optimal assignment.
 *
 * Augmentation is performed by flipping matched and unmatched edges along
 * an augmenting path, starting from an unmatched node / edge and
 * continuing until no matched edge can be found.
 *
 * @param x - The starting node's column.
 * @param primeX - An array mapping primed columns to rows.
 * @param starsX - An array mapping star columns to row. Modified in place.
 * @param starsY - An array mapping star rows to columns. Modified in place.
 */
export function step5(
  x: number,
  primeX: ArrayLike<number>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
): void {
  do {
    const y = primeX[x];
    const sx = starsY[y];
    starsX[x] = y;
    starsY[y] = x;
    x = sx;
  } while (x !== -1);
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
  dualX: MutableArrayLike<number>,
  dualY: MutableArrayLike<number>,
  slack: ArrayLike<number>,
  slackV: ArrayLike<number>,
  starsX: ArrayLike<number>,
): void;
export function step6(
  y: number,
  N: number,
  dualX: MutableArrayLike<bigint>,
  dualY: MutableArrayLike<bigint>,
  slack: ArrayLike<number>,
  slackV: ArrayLike<bigint>,
  starsX: ArrayLike<number>,
): void;
export function step6<T extends number | bigint>(
  y: number,
  N: number,
  dualX: MutableArrayLike<T>,
  dualY: MutableArrayLike<T>,
  slack: ArrayLike<number>,
  slackV: ArrayLike<T>,
  starsX: ArrayLike<number>,
): void {
  const sum = slackV[slack[N - 1]];

  let min = sum;
  for (let i = 0; i < N; ++i) {
    const x = slack[i];
    // @ts-expect-error ts(2365)
    dualY[y] += min;
    min = (sum - slackV[x]) as T;
    // @ts-expect-error ts(2322)
    dualX[x] -= min;
    y = starsX[x];
  }
}

export function match(
  y: number,
  matrix: MatrixLike<number>,
  dualX: ArrayLike<number>,
  dualY: ArrayLike<number>,
  starsX: ArrayLike<number>,
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<number>,
  slackY: MutableArrayLike<number>,
): number;
export function match(
  y: number,
  matrix: MatrixLike<bigint>,
  dualX: ArrayLike<bigint>,
  dualY: ArrayLike<bigint>,
  starsX: ArrayLike<number>,
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<bigint>,
  slackY: MutableArrayLike<number>,
): number;
export function match<T extends number | bigint>(
  y: number,
  matrix: MatrixLike<T>,
  dualX: ArrayLike<T>,
  dualY: ArrayLike<T>,
  starsX: ArrayLike<number>,
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<T>,
  slackY: MutableArrayLike<number>,
): number {
  const X = slack.length;

  // Initialize slack
  let dy = dualY[y];
  let row = matrix[y];
  for (let x = 0; x < X; ++x) {
    slack[x] = x;
    slackV[x] = (row[x] - dualX[x] - dy) as T;
    slackY[x] = y;
  }

  // Initialize zeros
  let zeros = partitionByMin(slack, slackV, 0);
  let zero = slackV[slack[0]];

  // Grow a hungarian tree until an augmenting path is found
  let steps = 1;
  for (let x = slack[0]; starsX[x] !== -1; x = slack[steps++]) {
    // Update slack
    y = starsX[x];
    dy = (dualY[y] - zero) as T;
    row = matrix[y];
    for (let i = zeros; i < X; ++i) {
      x = slack[i];
      const value = (row[x] - dualX[x] - dy) as T;
      if (value >= slackV[x]) {
        continue;
      }
      slackY[x] = y;
      slackV[x] = value;
      if (value === zero) {
        slack[i] = slack[zeros];
        slack[zeros++] = x;
      }
    }

    // Update zeros
    if (steps >= zeros) {
      zeros = partitionByMin(slack, slackV, zeros);
      zero = slackV[slack[steps]];
    }
  }

  return steps;
}
