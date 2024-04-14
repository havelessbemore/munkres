import { Matrix } from "../../types/matrix";
import { MunkresResult } from "../../types/munkres";

import { getMin } from "../array";
import { copy, transpose } from "../matrix";
import { initExposed, step5 } from "./numMunkres";

export function safeExec(matrix: Matrix<bigint>): MunkresResult<bigint> {
  // Get dimensions
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;

  // Transpose if Y > X
  if (Y > X) {
    matrix = copy(matrix);
    transpose(matrix);
  }

  // Get optimal assignments
  return exec(matrix);
}

export function exec(matrix: Matrix<bigint>): MunkresResult<bigint> {
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
  matrix: Matrix<bigint>,
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
  matrix: Matrix<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  starsX: number[],
  starsY: number[]
): number {
  const X = dualX.length;
  const Y = dualY.length;

  let stars = 0;
  for (let y = 0; y < Y; ++y) {
    const dy = -dualY[y];
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      if (starsX[x] === -1 && row[x] === dualX[x] - dy) {
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
  matrix: Matrix<bigint>,
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
  const exposedX = new Uint32Array(X);
  const primeX = new Uint32Array(X);
  const slackV = new Array<bigint>(X);
  const slackX = new Uint32Array(X);

  for (let rootY = 0; unmatched > 0; ++rootY) {
    if (starsY[rootY] !== -1) {
      continue;
    }

    // Initialize stage
    coveredY[rootY] = unmatched;
    initExposed(exposedX);
    initSlack(rootY, matrix, dualX, dualY, slackV, slackX);

    // Run stage
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Find an uncovered min
      const [x, px] = findUncoveredMin(exposedX, slackV);

      // Step 6: If not zero, zero the min
      if (slackV[x] > 0n) {
        step6(slackV[x], unmatched, coveredY, dualX, dualY, exposedX, slackV);
      }

      // Prime the zero
      primeX[x] = slackX[x];

      // Cover the prime's column
      exposedX[x] = x + 1 < X ? exposedX[x + 1] : X;
      exposedX[px] = exposedX[x];

      // Step 5: If no star in the column, turn primes into stars
      if (starsX[x] === -1) {
        step5(x, primeX, starsX, starsY);
        --unmatched;
        break;
      }

      // Cover the star's row
      const sy = starsX[x];
      coveredY[sy] = unmatched;

      // Update slack
      updateSlack(sy, matrix, dualX, dualY, exposedX, slackV, slackX);
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
  coveredY: number[] | Uint32Array,
  dualX: bigint[],
  dualY: bigint[],
  exposedX: number[] | Uint32Array,
  slackV: bigint[]
): void {
  const X = dualX.length;
  const Y = dualY.length;

  for (let x = 0; x < X; ++x) {
    if (exposedX[x] === x) {
      slackV[x] -= min;
    } else {
      dualX[x] -= min;
    }
  }

  for (let y = 0; y < Y; ++y) {
    if (coveredY[y] === covV) {
      dualY[y] += min;
    }
  }
}

export function findUncoveredMin(
  exposedX: number[] | Uint32Array,
  slackV: bigint[]
): [number, number] {
  const X = slackV.length;

  let minP = 0;
  let minV = slackV[exposedX[minP]];
  for (let px = exposedX[0] + 1; px < X && exposedX[px] < X; ++px) {
    const x = exposedX[px];
    if (slackV[x] < minV) {
      minV = slackV[x];
      minP = px;
      if (minV === 0n) {
        break;
      }
    }
    px = x;
  }

  return [exposedX[minP], minP];
}

export function initSlack(
  y: number,
  matrix: Matrix<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  slackV: bigint[],
  slackX: number[] | Uint32Array
): void {
  const dy = dualY[y];
  const row = matrix[y];
  const X = slackX.length;

  slackX.fill(y);
  for (let x = 0; x < X; ++x) {
    slackV[x] = row[x] - dualX[x] - dy;
  }
}

export function updateSlack(
  y: number,
  matrix: Matrix<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  exposedX: number[] | Uint32Array,
  slackV: bigint[],
  slackX: number[] | Uint32Array
): void {
  const dy = dualY[y];
  const row = matrix[y];
  const X = slackX.length;

  for (let x = 0; x < X && exposedX[x] < X; ++x) {
    x = exposedX[x];
    const slack = row[x] - dualX[x] - dy;
    if (slack < slackV[x]) {
      slackV[x] = slack;
      slackX[x] = y;
    }
  }
}
