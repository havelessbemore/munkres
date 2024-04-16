import { Matrix } from "../../types/matrix";
import { MatrixLike } from "../../types/matrixLike";
import { MunkresResult } from "../../types/munkres";

import { getMin } from "../arrayLike";
import { from, transpose } from "../matrix";
import { step5 } from "./numMunkres";

export function safeExec(matrix: MatrixLike<bigint>): MunkresResult<bigint> {
  // Get dimensions
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;

  // Transpose if Y > X
  if (Y > X) {
    matrix = from(matrix);
    transpose(matrix as Matrix<bigint>);
  }

  // Get optimal assignments
  return exec(matrix);
}

export function exec(matrix: MatrixLike<bigint>): MunkresResult<bigint> {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;

  // If empty matrix
  if (Y <= 0 || X <= 0) {
    return { dualX: [], dualY: [], starsX: [], starsY: [] };
  }

  // If invalid matrix
  if (Y > X) {
    throw new RangeError("invalid MxN matrix: M > N");
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
  return { dualX, dualY, starsX, starsY };
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

  // Reduce columns
  if (Y < X) {
    dualX.fill(0n);
    return;
  }

  let dy = dualY[0];
  let row = matrix[0];
  for (let x = 0; x < X; ++x) {
    dualX[x] = row[x] - dy;
  }
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
      if (starsX[x] === -1 && row[x] === dualX[x] + dy) {
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
  const Y = dualY.length;
  const coveredY = new Uint32Array(Y);
  const slack = new Uint32Array(X);
  const slackV = new Array<bigint>(X);
  const slackX = new Uint32Array(X);

  for (let rootY = 0; unmatched > 0; ++rootY) {
    if (starsY[rootY] !== -1) {
      continue;
    }

    // Initialize stage
    let slackMin = 0;
    slackX.fill(rootY);
    coveredY[rootY] = unmatched;
    let slackMid = initSlack(rootY, matrix, dualX, dualY, slack, slackV);

    // Run stage
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // If no zero, zero the min
      if (slackMin >= slackMid) {
        slackMid = step6(
          findUncoveredMin(slackMid, slack, slackV),
          unmatched,
          slackMid,
          coveredY,
          dualX,
          dualY,
          slack,
          slackV
        );
      }

      // Prime the zero / cover the prime's column
      const x = slack[slackMin++];

      // Step 5: If no star in the column, turn primes into stars
      if (starsX[x] === -1) {
        step5(x, slackX, starsX, starsY);
        --unmatched;
        break;
      }

      // Cover the star's row
      const sy = starsX[x];
      coveredY[sy] = unmatched;

      // Update slack
      slackMid = updateSlack(
        sy,
        slackMid,
        matrix,
        dualX,
        dualY,
        slack,
        slackV,
        slackX
      );
    }
  }
}

/**
 * Adjusts dual variables and slack to uncover more admissible edges.
 *
 * @param min - The value to adjust by.
 * @param covV - The value indicating a row is covered.
 * @param coveredY - An array indicating whether a row is covered.
 * @param dualX - The dual variables associated with each column of the matrix. Modified in place.
 * @param dualY - The dual variables associated with each row of the matrix. Modified in place.
 * @param exposedX - An array indicating uncovered columns.
 * @param slackV - The slack values for each column. Modified in place.
 */
export function step6(
  min: bigint,
  covV: number,
  mid: number,
  coveredY: number[] | Uint32Array,
  dualX: bigint[],
  dualY: bigint[],
  slack: number[] | Uint32Array,
  slackV: bigint[]
): number {
  const X = dualX.length;
  const Y = dualY.length;

  for (let i = 0; i < mid; ++i) {
    dualX[slack[i]] -= min;
  }

  for (let i = mid; i < X; ++i) {
    const x = slack[i];
    slackV[x] -= min;
    if (slackV[x] === 0n) {
      slack[i] = slack[mid];
      slack[mid++] = x;
    }
  }

  for (let y = 0; y < Y; ++y) {
    if (coveredY[y] === covV) {
      dualY[y] += min;
    }
  }

  return mid;
}

export function findUncoveredMin(
  mid: number,
  slack: number[] | Uint32Array,
  slackV: bigint[]
): bigint {
  const X = slack.length;

  let minV = slackV[slack[mid]];
  for (let i = mid + 1; i < X; ++i) {
    if (slackV[slack[i]] < minV) {
      minV = slackV[slack[i]];
    }
  }

  return minV;
}

export function initSlack(
  y: number,
  matrix: MatrixLike<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  slack: number[] | Uint32Array,
  slackV: bigint[]
): number {
  const dy = dualY[y];
  const row = matrix[y];
  const X = dualX.length;

  let mid = 0;
  for (let x = 0; x < X; ++x) {
    slack[x] = x;
    slackV[x] = row[x] - dualX[x] - dy;
    if (slackV[x] === 0n) {
      slack[x] = slack[mid];
      slack[mid++] = x;
    }
  }

  return mid;
}

export function updateSlack(
  y: number,
  midS: number,
  matrix: MatrixLike<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  slack: number[] | Uint32Array,
  slackV: bigint[],
  slackX: number[] | Uint32Array
): number {
  const dy = dualY[y];
  const row = matrix[y];
  const X = slackX.length;

  for (let i = midS; i < X; ++i) {
    const x = slack[i];
    const value = row[x] - dualX[x] - dy;
    if (value < slackV[x]) {
      if (value === 0n) {
        slack[i] = slack[midS];
        slack[midS++] = x;
      }
      slackV[x] = value;
      slackX[x] = y;
    }
  }

  return midS;
}
