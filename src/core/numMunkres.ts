import { MatrixLike } from "../types/matrixLike";
import { Matching } from "../types/matching";
import { MutableArrayLike } from "../types/mutableArrayLike";

import { getMin } from "../utils/arrayLike";

import { step5 } from "./bigMunkres";
import { step4B as step4b } from "./numMunkresB";
import { zeroUncoveredMin } from "./munkres";

export function exec(matrix: MatrixLike<number>): Matching<number> {
  // Get dimensions
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;

  // Check if empty matrix
  if (Y <= 0 && X <= 0) {
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
  Y <= X
    ? step4(Y - stars, matrix, dualX, dualY, starsX, starsY)
    : step4b(X - stars, matrix, dualX, dualY, starsX, starsY);

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
 * @param dualX - The dual variables associated with each column of the matrix. Modified in place.
 * @param dualY - The dual variables associated with each row of the matrix. Modified in place.
 */
export function step1(
  matrix: MatrixLike<number>,
  dualX: number[],
  dualY: number[]
): void {
  const X = dualX.length;
  const Y = dualY.length;

  // Reduce rows
  if (Y > X) {
    dualY.fill(0);
  } else {
    for (let y = 0; y < Y; ++y) {
      dualY[y] = getMin(matrix[y])!;
    }
  }

  // If matrix is wide, skip column reduction
  if (Y < X) {
    dualX.fill(0);
    return;
  }

  // Initialize column reduction
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
  starsY: number[]
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
 * @param dualX - The dual variables associated with each column of the matrix. Modified in place.
 * @param dualY - The dual variables associated with each row of the matrix. Modified in place.
 * @param starsX - An array mapping star columns to row. Modified in place.
 * @param starsY - An array mapping star rows to columns. Modified in place.
 */
export function step4(
  unmatched: number,
  matrix: MatrixLike<number>,
  dualX: number[],
  dualY: number[],
  starsX: number[],
  starsY: number[]
): void {
  if (unmatched <= 0) {
    return;
  }

  const X = dualX.length;
  const slack = new Uint32Array(X);
  const slackV = new Array<number>(X);
  const slackY = new Uint32Array(X);

  // For each unmatched row
  for (let rootY = 0; unmatched > 0; ++rootY) {
    if (starsY[rootY] !== -1) {
      continue;
    }

    // Initialize stage
    let zeros = initStage(rootY, matrix, dualX, dualY, slack, slackV, slackY);

    // Run stage
    let steps = 1;
    let x: number;
    for (x = slack[0]; starsX[x] !== -1; x = slack[steps++]) {
      // Update stage
      const y = starsX[x];
      const dy = dualY[y];
      const ds = slackV[x];
      const row = matrix[y];
      for (let i = zeros; i < X; ++i) {
        x = slack[i];
        const value = (row[x] - (dualX[x] + dy || 0) || 0) + ds || 0;
        if (value < slackV[x]) {
          if (value === ds) {
            slack[i] = slack[zeros];
            slack[zeros++] = x;
          }
          slackV[x] = value;
          slackY[x] = y;
        }
      }

      // If no zeros, zero the min
      if (steps >= zeros) {
        zeros = zeroUncoveredMin(zeros, slack, slackV);
      }
    }

    // Update dual variables
    step6(rootY, steps, dualX, dualY, slack, slackV, starsX);

    // Turn primes into stars
    step5(x, slackY, starsX, starsY);

    // Update unmatched count
    --unmatched;
  }
}

/**
 * Adjusts dual variables and slack to uncover more admissible edges.
 *
 * @param pivot - The value to adjust by.
 * @param covV - The value indicating a row is covered.
 * @param coveredY - An array indicating whether a row is covered.
 * @param dualX - The dual variables associated with each column of the matrix. Modified in place.
 * @param dualY - The dual variables associated with each row of the matrix. Modified in place.
 * @param exposedX - An array indicating uncovered columns.
 * @param slackV - The slack values for each column. Modified in place.
 */
export function step6(
  y: number,
  N: number,
  dualX: number[],
  dualY: number[],
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<number>,
  starsX: number[]
): void {
  const sum = slackV[slack[N - 1]];

  let min = sum;
  for (let i = 0; i < N; ++i) {
    const x = slack[i];
    dualY[y] = dualY[y] + min || 0;
    min = sum - slackV[x] || 0;
    dualX[x] = dualX[x] - min || 0;
    y = starsX[x];
  }
}

export function initStage(
  y: number,
  matrix: MatrixLike<number>,
  dualX: number[],
  dualY: number[],
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<number>,
  slackY: MutableArrayLike<number>
): number {
  const dy = dualY[y];
  const row = matrix[y];
  const X = slack.length;

  let zeros = 0;
  for (let x = 0; x < X; ++x) {
    slack[x] = x;
    slackY[x] = y;
    slackV[x] = row[x] - (dualX[x] + dy || 0) || 0;
    if (slackV[x] === 0) {
      slack[x] = slack[zeros];
      slack[zeros++] = x;
    }
  }

  return zeros || zeroUncoveredMin(zeros, slack, slackV);
}
