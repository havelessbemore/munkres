import type { MatrixLike } from "../types/matrixLike.ts";
import type { Matching } from "../types/matching.ts";
import type { MutableArrayLike } from "../types/mutableArrayLike.ts";

import { getMin } from "../utils/arrayLike.ts";
import { partitionByMin } from "../utils/mutableArrayLike.ts";

import { step5 } from "./bigMunkres.ts";
import { step4B } from "./numMunkresB.ts";

export function exec(matrix: MatrixLike<number>): Matching<number> {
  // Get dimensions
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;

  // Check if empty matrix
  if (Y <= 0 || X <= 0) {
    return { dualX: [], dualY: [], matrix, starsX: [], starsY: [] };
  }

  // Step 1: Reduce
  const dualX = new Array<number>(X);
  const dualY = new Array<number>(Y);
  step1(matrix, dualX, dualY);

  // Steps 2 & 3: Find initial matching
  const starsX = new Array<number>(X).fill(-1);
  const starsY = new Array<number>(Y).fill(-1);
  const stars = steps2To3(matrix, dualX, dualY, starsX, starsY);

  // Step 4: Find complete matching
  if (Y <= X) {
    step4(Y - stars, matrix, dualX, dualY, starsX, starsY);
  } else {
    step4B(X - stars, matrix, dualX, dualY, starsX, starsY);
  }

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
  dualX: number[],
  dualY: number[],
): void {
  const X = dualX.length;
  const Y = dualY.length;

  // If matrix is tall, skip row reduction
  if (Y > X) {
    dualY.fill(0);
  } else {
    // Reduce rows
    for (let y = 0; y < Y; ++y) {
      dualY[y] = getMin(matrix[y])!;
    }
  }

  // If matrix is wide, skip column reduction
  if (Y < X) {
    dualX.fill(0);
    return;
  }

  // Initialize dualX
  let dy = dualY[0];
  let row = matrix[0];
  for (let x = 0; x < X; ++x) {
    dualX[x] = row[x] - dy || 0;
  }

  // Reduce columns
  for (let y = 1; y < Y; ++y) {
    dy = dualY[y];
    row = matrix[y];
    for (let x = 0; x < X; ++x) {
      const dx = row[x] - dy || 0;
      if (dx < dualX[x]) {
        dualX[x] = dx;
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
  dualX: number[],
  dualY: number[],
  starsX: number[],
  starsY: number[],
): number {
  const X = dualX.length;
  const Y = dualY.length;
  const S = Y <= X ? Y : X;

  let stars = 0;
  for (let y = 0; y < Y && stars < S; ++y) {
    const dy = dualY[y];
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      if (starsX[x] === -1 && row[x] === (dualX[x] + dy || 0)) {
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
  dualX: number[],
  dualY: number[],
  starsX: number[],
  starsY: number[],
): void {
  // If no unmatched row
  if (unmatched <= 0) {
    return;
  }

  const X = dualX.length;
  const slack = new Uint32Array(X);
  const slackV = new Array<number>(X);
  const slackY = new Uint32Array(X);

  // Match unmatched rows
  for (let y = 0; unmatched > 0; ++y) {
    if (starsY[y] !== -1) {
      continue;
    }

    const N = match(y, matrix, dualX, dualY, starsX, slack, slackV, slackY);
    --unmatched;

    // Update dual variables
    step6(y, N, dualX, dualY, slack, slackV, starsX);

    // Update matching
    step5(slack[N - 1], slackY, starsX, starsY);
  }
}

/**
 * Adjusts dual variables to uncover more admissible edges.
 *
 * @param y - The starting node's row.
 * @param N - The number of adjustments to make.
 * @param dualX - The dual variables for each matrix column. Modified in place.
 * @param dualY - The dual variables for each matrix row. Modified in place.
 * @param slack - An array of covered column indices.
 * @param slackV - The slack values for each column.
 * @param starsX - An array mapping star columns to row.
 */
export function step6(
  y: number,
  N: number,
  dualX: number[],
  dualY: number[],
  slack: ArrayLike<number>,
  slackV: ArrayLike<number>,
  starsX: ArrayLike<number>,
): void {
  const sum = slackV[slack[--N]];
  dualY[y] = dualY[y] + sum || 0;

  for (let i = 0; i < N; ++i) {
    const x = slack[i];
    y = starsX[x];
    const min = sum - slackV[x] || 0;
    dualX[x] = dualX[x] - min || 0;
    dualY[y] = dualY[y] + min || 0;
  }
}

/**
 * Matches a given unmatched row to an unmatched column.
 *
 * @param y - An unmatched row.
 * @param matrix - An MxN cost matrix.
 * @param dualX - The dual variables for each matrix column.
 * @param dualY - The dual variables for each matrix row.
 * @param starsX - An array mapping star columns to row.
 * @param slack - An array of covered column indices. Modified in place.
 * @param slackV - The slack values for each column. Modified in place.
 * @param slackY - An array mapping a slack column to row. Modified in place.
 */
export function match(
  y: number,
  matrix: MatrixLike<number>,
  dualX: number[],
  dualY: number[],
  starsX: number[],
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<number>,
  slackY: MutableArrayLike<number>,
): number {
  const X = slack.length;

  // Initialize slack
  let dy = dualY[y];
  let row = matrix[y];
  for (let x = 0; x < X; ++x) {
    slack[x] = x;
    slackV[x] = row[x] - (dualX[x] + dy || 0) || 0;
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
    dy = dualY[y];
    row = matrix[y];
    for (let i = zeros; i < X; ++i) {
      x = slack[i];
      const value = (row[x] - (dualX[x] + dy || 0) || 0) + zero || 0;
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
