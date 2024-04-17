import { IndexArray } from "../types/indexArray";
import { Matrix } from "../types/matrix";
import { MatrixLike } from "../types/matrixLike";
import { MunkresResult } from "../types/munkresResult";

import { getMin } from "../utils/arrayLike";
import { toString as _toString, from, transpose } from "../utils/matrix";

export function safeExec(matrix: MatrixLike<number>): MunkresResult<number> {
  // Get dimensions
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;

  // Transpose if Y > X
  if (Y > X) {
    matrix = from(matrix);
    transpose(matrix as Matrix<number>);
  }

  // Get optimal assignments
  return exec(matrix);
}

export function exec(matrix: MatrixLike<number>): MunkresResult<number> {
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
  const dualX = new Array<number>(X);
  const dualY = new Array<number>(Y);
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
  matrix: MatrixLike<number>,
  dualX: number[],
  dualY: number[]
): void {
  const X = dualX.length;
  const Y = dualY.length;

  // Reduce rows
  for (let y = 0; y < Y; ++y) {
    dualY[y] = getMin(matrix[y])!;
  }

  // Reduce columns
  if (Y < X) {
    dualX.fill(0);
    return;
  }

  let dy = dualY[0];
  let row = matrix[0];
  for (let x = 0; x < X; ++x) {
    dualX[x] = row[x] - dy || 0;
  }
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
 * @param dualX - The dual variables associated with each column of the matrix.
 * @param dualY - The dual variables associated with each row of the matrix.
 * @param starsX - An array mapping star columns to row. Modified in place.
 * @param starsY - An array mapping star rows to columns. Modified in place.
 *
 * @returns The number of matches (stars) found.
 */
export function steps2To3(
  matrix: MatrixLike<number>,
  dualX: ArrayLike<number>,
  dualY: ArrayLike<number>,
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
  const Y = dualY.length;
  const coveredY = new Uint32Array(Y);
  const slack = new Uint32Array(X);
  const slackV = new Array<number>(X);
  const slackX = new Uint32Array(X);

  for (let rootY = 0; unmatched > 0; ++rootY) {
    if (starsY[rootY] !== -1) {
      continue;
    }

    // Initialize stage
    let step = 0;
    slackX.fill(rootY);
    coveredY[0] = rootY;
    let zeros = initSlack(rootY, matrix, dualX, dualY, slack, slackV);

    // Run stage
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // If no zero
      if (step >= zeros) {
        // Zero the min
        const min = findUncoveredMin(zeros, slack, slackV);
        zeros = partition(min, zeros, slack, slackV);
        slackV[slack[step]] = min;
      }

      // Prime the zero / cover the prime's column
      const x = slack[step++];

      // If no star in the column
      if (starsX[x] === -1) {
        // Turn primes into stars
        step5(x, slackX, starsX, starsY);

        // Update dual variables
        step6(step, coveredY, dualX, dualY, slack, slackV);

        // Terminate stage
        --unmatched;
        break;
      }

      // Cover the star's row
      const sy = starsX[x];
      coveredY[step] = sy;

      // Update slack
      zeros = updateSlack(
        sy,
        zeros,
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
  starsX: number[],
  starsY: number[]
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
 * @param dualX - The dual variables associated with each column of the matrix. Modified in place.
 * @param dualY - The dual variables associated with each row of the matrix. Modified in place.
 * @param slack - An array of covered column indices.
 * @param slackV - The slack values for each column. Modified in place.
 */
export function step6(
  N: number,
  coveredY: ArrayLike<number>,
  dualX: number[],
  dualY: number[],
  slack: ArrayLike<number>,
  slackV: ArrayLike<number>
): void {
  let min = 0;
  for (let i = 0; i < N; ++i) {
    min = min + slackV[slack[i]] || 0;
  }

  for (let i = 0; i < N; ++i) {
    let j = coveredY[i];
    dualY[j] = dualY[j] + min || 0;
    j = slack[i];
    min = min - slackV[j] || 0;
    dualX[j] = dualX[j] - min || 0;
  }
}

export function partition(
  pivot: number,
  min: number,
  slack: IndexArray,
  slackV: number[]
): number {
  const max = slack.length;
  for (let i = min; i < max; ++i) {
    const x = slack[i];
    slackV[x] = slackV[x] - pivot || 0;
    if (slackV[x] === 0) {
      slack[i] = slack[min];
      slack[min++] = x;
    }
  }
  return min;
}

export function findUncoveredMin(
  mid: number,
  slack: ArrayLike<number>,
  slackV: ArrayLike<number>
): number;
export function findUncoveredMin(
  mid: number,
  slack: ArrayLike<number>,
  slackV: ArrayLike<bigint>
): bigint;
export function findUncoveredMin<T extends number | bigint>(
  mid: number,
  slack: ArrayLike<number>,
  slackV: ArrayLike<T>
): T {
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
  matrix: MatrixLike<number>,
  dualX: ArrayLike<number>,
  dualY: ArrayLike<number>,
  slack: IndexArray,
  slackV: number[]
): number {
  const dy = dualY[y];
  const row = matrix[y];
  const X = dualX.length;

  let mid = 0;
  for (let x = 0; x < X; ++x) {
    slack[x] = x;
    slackV[x] = row[x] - (dualX[x] + dy || 0) || 0;
    if (slackV[x] === 0) {
      slack[x] = slack[mid];
      slack[mid++] = x;
    }
  }

  return mid;
}

/**
 * Generates a string representation of the cost matrix,
 * annotating starred (*) and primed (") elements.
 *
 * Stars (*) indicate part of a potential solution, while primes (") mark
 * elements considered for augmenting the current solution. This visualization
 * aids in understanding and debugging the matrix's state at various steps of
 * the algorithm.
 *
 * @param matrix - The cost matrix.
 * @param starsY - An array of star y coordinates to x coordinates.
 * @param primeX - (Optional) An array of prime x coordinates to y coordinates.
 *
 * @returns A string visualization of the matrix with stars and primes.
 */
export function toString<T>(
  matrix: Matrix<T>,
  starsY: ArrayLike<number>,
  primeX: ArrayLike<number>
): string {
  // Mark values as stars or primes
  return _toString(matrix, (v, y, x): string => {
    let str = `${v}`;
    if (x == starsY[y]) {
      str = "*" + str;
    }
    if (y == primeX[x]) {
      str = '"' + str;
    }
    return str;
  });
}

export function updateSlack(
  y: number,
  midS: number,
  matrix: MatrixLike<number>,
  dualX: ArrayLike<number>,
  dualY: ArrayLike<number>,
  slack: IndexArray,
  slackV: number[],
  slackX: IndexArray
): number {
  const dy = dualY[y];
  const row = matrix[y];
  const X = slack.length;

  for (let i = midS; i < X; ++i) {
    const x = slack[i];
    const value = row[x] - (dualX[x] + dy || 0) || 0;
    if (value < slackV[x]) {
      if (value === 0) {
        slack[i] = slack[midS];
        slack[midS++] = x;
      }
      slackV[x] = value;
      slackX[x] = y;
    }
  }

  return midS;
}
