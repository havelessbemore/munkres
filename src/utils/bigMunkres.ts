import { Matrix } from "../types/matrix";
import { getMin } from "./array";
import { findUncoveredMin, initExposed, step5 } from "./munkres";

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
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;

  // Reduce rows
  if (Y <= X) {
    for (let y = 0; y < Y; ++y) {
      dualY[y] = getMin(matrix[y])!;
    }
  }

  // Reduce columns
  if (Y >= X) {
    for (let x = 0; x < X; ++x) {
      dualX[x] = matrix[0][x] - dualY[0];
    }
    for (let y = 1; y < Y; ++y) {
      const row = matrix[y];
      const dy = dualY[y];
      for (let x = 0; x < X; ++x) {
        if (row[x] - dy < dualX[x]) {
          dualX[x] = row[x] - dy;
        }
      }
    }
  }
}

/**
 * Finds an initial matching for the munkres algorithm.
 *
 * @param matrix - The cost matrix.
 * @param starX - An array mapping star columns to row. Modified in place.
 * @param starY - An array mapping star rows to columns. Modified in place.
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
    const row = matrix[y];
    const dy = dualY[y];
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
 * Finds a complete matching of jobs to workers at minimum cost.
 *
 * This step iteratively improves upon an initial matching until a complete
 * matching is found. This involves updating dual variables and managing
 * slack values to uncover new opportunities for optimal assignments.
 *
 * @param mat - An MxN cost matrix.
 *
 * @returns An array representing optimal assignments. Each index / value
 * represents a row / column (respectively) assignment.
 *
 * @throws - {@link RangeError}
 * Thrown if the given MxN matrix has more rows than columns (M \> N).
 *
 * @privateRemarks
 * Citations:
 * 1. {@link https://users.cs.duke.edu/~brd/Teaching/Bio/asmb/current/Handouts/munkres.html | Munkres' Assignment Algorithm, Modified for Rectangular Matrices}
 *     - Used as the foundation and enhanced with custom optimizations.
 *
 * 1. {@link https://www.ri.cmu.edu/pub_files/pub4/mills_tettey_g_ayorkor_2007_3/mills_tettey_g_ayorkor_2007_3.pdf | Mills-Tettey, Ayorkor & Stent, Anthony & Dias, M.. (2007). The Dynamic Hungarian Algorithm for the Assignment Problem with Changing Costs.}
 *     - Used to implement primal-dual variables and dynamic updates.
 *
 * 1. {@link https://public.websites.umich.edu/~murty/612/612slides4.pdf | Murty, K. G.. Primal-Dual Algorithms. [IOE 612, Lecture slides 4]. Department of Industrial and Operations Engineering, University of Michigan.}
 *     - Used to implement primal-dual and slack variables.
 */
export function bigStep4(matrix: Matrix<bigint>): number[] {
  // Check input
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
  if (Y > X) {
    throw new RangeError("invalid MxN matrix: M > N");
  }

  // Step 1: Reduce
  const dualX = new Array<bigint>(X).fill(0n);
  const dualY = new Array<bigint>(Y).fill(0n);
  step1(matrix, dualX, dualY);

  // Steps 2 & 3: Find initial matching
  const starsX = new Array<number>(X).fill(-1);
  const starsY = new Array<number>(Y).fill(-1);
  let stars = steps2To3(matrix, dualX, dualY, starsX, starsY);

  // Check if complete matching
  if (stars >= Y) {
    return starsY;
  }

  // Step 4: Find complete matching
  const coveredX = new Array<number>(X);
  const coveredY = new Array<number>(Y).fill(-1);
  const slackV = new Array<bigint>(X);
  const slackX = new Array<number>(X);
  const exposedX = new Array<number>(X);

  for (let rootY = 0; stars < Y; ++rootY) {
    if (starsY[rootY] !== -1) {
      continue;
    }

    // Initialize stage
    coveredX.fill(-1);
    coveredY[rootY] = rootY;
    initExposed(exposedX);
    initSlack(rootY, matrix, dualX, dualY, slackV, slackX);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Find an uncovered min
      const [y, x, px] = findUncoveredMin(exposedX, slackV, slackX);

      // Step 6: If not zero, zero the min
      if (slackV[x] > 0n) {
        step6(slackV[x], rootY, coveredX, coveredY, dualX, dualY, slackV);
      }

      // Prime the zero
      coveredX[x] = y;

      // Cover the column
      exposedX[x] = x + 1 < X ? exposedX[x + 1] : X;
      exposedX[px] = exposedX[x];

      // Step 5: If no star in the column, turn primes into stars
      if (starsX[x] === -1) {
        step5(x, coveredX, starsX, starsY);
        ++stars;
        break;
      }

      // Cover the star's row and update slack
      const sy = starsX[x];
      coveredY[sy] = rootY;
      updateSlack(sy, matrix, dualX, dualY, exposedX, slackV, slackX);
    }
  }

  // Return assignments ([y] -> x)
  return starsY;
}

/**
 * Adjusts dual variables and slack to uncover more admissible edges.
 *
 * @param min - The value to adjust by.
 * @param coveredX - An array mapping covered columns to rows.
 * @param coveredY - An array indicating whether a row is covered.
 * @param dualX - The dual variables associated with each column of the matrix. Modified in place.
 * @param dualY - The dual variables associated with each row of the matrix. Modified in place.
 * @param slackV - The slack values for each column. Modified in place.
 */
export function step6(
  min: bigint,
  rootY: number,
  coveredX: number[],
  coveredY: number[],
  dualX: bigint[],
  dualY: bigint[],
  slackV: bigint[]
): void {
  const X = dualX.length;
  const Y = dualY.length;

  for (let y = 0; y < Y; ++y) {
    if (coveredY[y] === rootY) {
      dualY[y] += min;
    }
  }

  for (let x = 0; x < X; ++x) {
    if (coveredX[x] === -1) {
      slackV[x] -= min;
    } else {
      dualX[x] -= min;
    }
  }
}

export function initSlack(
  y: number,
  matrix: Matrix<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  slackV: bigint[],
  slackX: number[]
): void {
  const X = slackV.length;
  const row = matrix[y];
  const dy = dualY[y];

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
  exposedX: number[],
  slackV: bigint[],
  slackX: number[]
): void {
  const X = slackV.length;
  const row = matrix[y];
  const dy = dualY[y];

  for (let x = 0; x < X && exposedX[x] < X; ++x) {
    x = exposedX[x];
    const slack = row[x] - dualX[x] - dy;
    if (slack < slackV[x]) {
      slackV[x] = slack;
      slackX[x] = y;
    }
  }
}
