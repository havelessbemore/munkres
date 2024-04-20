import { Matrix } from "../types/matrix";
import { MatrixLike } from "../types/matrixLike";
import { Matching } from "../types/matching";
import { MutableArrayLike } from "../types/mutableArrayLike";

import { getMin } from "../utils/arrayLike";
import { from, transpose } from "../utils/matrix";
import { zeroUncoveredMin, step5 } from "./numMunkres";

export function exec(matrix: MatrixLike<bigint>): Matching<bigint> {
  // Get dimensions
  let Y = matrix.length;
  let X = matrix[0]?.length ?? 0;

  // If empty matrix
  if (Y <= 0 || X <= 0) {
    return { dualX: [], dualY: [], matrix, starsX: [], starsY: [] };
  }

  // Transpose if Y > X
  if (Y > X) {
    X = matrix.length;
    Y = matrix[0].length;
    matrix = from(matrix);
    transpose(matrix as Matrix<bigint>);
  }

  // Step 1: Reduce
  const dualX = new Array<bigint>(X);
  const dualY = new Array<bigint>(Y);
  step1(matrix, dualX, dualY);

  // Steps 2 & 3: Find initial matching
  const starsX = new Array<number>(X).fill(-1);
  const starsY = new Array<number>(Y).fill(-1);
  const stars = steps2To3(matrix, dualX, dualY, starsX, starsY);

  // Step 4: Find complete matching
  step4(Y - stars, matrix, dualX, dualY, starsX, starsY);

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
  matrix: MatrixLike<bigint>,
  dualX: bigint[],
  dualY: bigint[]
): void {
  const X = dualX.length;
  const Y = dualY.length;

  // Reduce rows
  for (let y = 0; y < Y; ++y) {
    dualY[y] = getMin(matrix[y])!;
  }

  // If matrix is wide, skip column reduction
  if (Y < X) {
    dualX.fill(0n);
    return;
  }

  // Initialize column reduction
  let dy = dualY[0];
  let row = matrix[0];
  for (let x = 0; x < X; ++x) {
    dualX[x] = row[x] - dy;
  }

  // Reduce columns
  for (let y = 1; y < Y; ++y) {
    dy = dualY[y];
    row = matrix[y];
    for (let x = 0; x < X; ++x) {
      const dx = row[x] - dy;
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
 * @param dualX - The dual variables associated with each column of the matrix.
 * @param dualY - The dual variables associated with each row of the matrix.
 * @param starsX - An array mapping star columns to row. Modified in place.
 * @param starsY - An array mapping star rows to columns. Modified in place.
 *
 * @returns The number of matches (stars) found.
 */
export function steps2To3(
  matrix: MatrixLike<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  starsX: number[],
  starsY: number[]
): number {
  const X = dualX.length;
  const Y = dualY.length;

  let stars = 0;
  for (let y = 0; y < Y; ++y) {
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
 * @param dualX - The dual variables associated with each column of the matrix. Modified in place.
 * @param dualY - The dual variables associated with each row of the matrix. Modified in place.
 * @param starsX - An array mapping star columns to row. Modified in place.
 * @param starsY - An array mapping star rows to columns. Modified in place.
 */
export function step4(
  unmatched: number,
  matrix: MatrixLike<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  starsX: number[],
  starsY: number[]
): void {
  if (unmatched <= 0) {
    return;
  }

  const X = dualX.length;
  const slack = new Uint32Array(X);
  const slackV = new Array<bigint>(X);
  const slackY = new Uint32Array(X);

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
      const ds = slackV[x];
      const dy = dualY[y] - ds;
      const row = matrix[y];
      for (let i = zeros; i < X; ++i) {
        x = slack[i];
        const value = row[x] - dualX[x] - dy;
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
 * Adjusts dual variables to uncover more admissible edges.
 *
 * @param N - The number of adjustments to make.
 * @param min - The value to adjust by.
 * @param coveredY - An array indicating whether a row is covered.
 * @param dualX - The dual variables associated with each column of the matrix. Modified in place.
 * @param dualY - The dual variables associated with each row of the matrix. Modified in place.
 * @param slack - An array of covered column indices.
 * @param slackV - The slack values for each column. Modified in place.
 */
export function step6(
  y: number,
  N: number,
  dualX: bigint[],
  dualY: bigint[],
  slack: ArrayLike<number>,
  slackV: ArrayLike<bigint>,
  starsX: number[]
): void {
  const min = slackV[slack[N - 1]];

  let prev = 0n;
  for (let i = 0; i < N; ++i) {
    const x = slack[i];
    dualY[y] += min - prev;
    prev = slackV[x];
    dualX[x] -= min - prev;
    y = starsX[x];
  }
}

export function initStage(
  y: number,
  matrix: MatrixLike<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<bigint>,
  slackY: MutableArrayLike<number>
): number {
  const dy = dualY[y];
  const row = matrix[y];
  const X = slack.length;

  let zeros = 0;
  for (let x = 0; x < X; ++x) {
    slack[x] = x;
    slackY[x] = y;
    slackV[x] = row[x] - dualX[x] - dy;
    if (slackV[x] === 0n) {
      slack[x] = slack[zeros];
      slack[zeros++] = x;
    }
  }

  return zeros || zeroUncoveredMin(zeros, slack, slackV);
}
