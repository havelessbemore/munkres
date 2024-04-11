import { Matrix } from "../types/matrix";

import { getMin } from "./array";
import { toString as _toString } from "./matrix";

/**
 * Finds a complete matching of jobs to workers at minimum cost.
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
 * 1. {@link https://www.ri.cmu.edu/pub_files/pub4/mills_tettey_g_ayorkor_2007_3/mills_tettey_g_ayorkor_2007_3.pdf | Mills-Tettey, Ayorkor & Stent, Anthony & Dias, M.. (2007). The Dynamic Hungarian Algorithm for the Assignment Problem with Changing Costs.}
 *     - Used to implement primal-dual variables and dynamic updates.
 * 1. {@link https://public.websites.umich.edu/~murty/612/612slides4.pdf | Murty, K. G.. Primal-Dual Algorithms. [IOE 612, Lecture slides 4]. Department of Industrial and Operations Engineering, University of Michigan.}
 *     - Used to implement primal-dual and slack variables.
 */
export function exec(matrix: Matrix<number>): number[] {
  // Check input
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
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

  // Check if complete matching
  if (stars >= Y) {
    return starsY;
  }

  // Step 4: Find complete matching
  step4(Y - stars, matrix, dualX, dualY, starsX, starsY);

  // Return assignments ([y] -> x)
  return starsY;
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
  matrix: Matrix<number>,
  dualX: number[],
  dualY: number[]
): void {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;

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
    dualX[x] = row[x] === dy ? 0 : row[x] - dy;
  }
  for (let y = 1; y < Y; ++y) {
    dy = dualY[y];
    row = matrix[y];
    for (let x = 0; x < X; ++x) {
      const dx = row[x] === dy ? 0 : row[x] - dy;
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
  matrix: Matrix<number>,
  dualX: number[],
  dualY: number[],
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
      const dual = dualX[x] === dy ? 0 : dualX[x] - dy;
      if (starsX[x] === -1 && row[x] === dual) {
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
  matrix: Matrix<number>,
  dualX: number[],
  dualY: number[],
  starsX: number[],
  starsY: number[]
): void {
  const X = dualX.length;
  const Y = dualY.length;
  const coveredX = new Array<number>(X);
  const coveredY = new Array<number>(Y).fill(-1);
  const slackV = new Array<number>(X);
  const slackX = new Array<number>(X);
  const exposedX = new Array<number>(X);

  for (let rootY = 0; unmatched > 0; ++rootY) {
    if (starsY[rootY] !== -1) {
      continue;
    }

    // Initialize stage
    coveredX.fill(-1);
    coveredY[rootY] = rootY;
    initExposed(exposedX);
    initSlack(rootY, matrix, dualX, dualY, slackV, slackX);

    // Run stage
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Find an uncovered min
      const [y, x, px] = findUncoveredMin(exposedX, slackV, slackX);

      // Step 6: If not zero, zero the min
      if (slackV[x] > 0) {
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
        --unmatched;
        break;
      }

      // Cover the star's row and update slack
      const sy = starsX[x];
      coveredY[sy] = rootY;
      updateSlack(sy, matrix, dualX, dualY, exposedX, slackV, slackX);
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
 * @param coveredX - An array mapping covered columns to rows.
 * @param starsX - An array mapping star columns to row. Modified in place.
 * @param starsY - An array mapping star rows to columns. Modified in place.
 */
export function step5(
  x: number,
  coveredX: number[],
  starsX: number[],
  starsY: number[]
): void {
  do {
    const y = coveredX[x];
    const sx = starsY[y];
    starsX[x] = y;
    starsY[y] = x;
    x = sx;
  } while (x !== -1);
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
  min: number,
  rootY: number,
  coveredX: number[],
  coveredY: number[],
  dualX: number[],
  dualY: number[],
  slackV: number[]
): void {
  const X = dualX.length;
  const Y = dualY.length;

  for (let y = 0; y < Y; ++y) {
    if (coveredY[y] === rootY) {
      dualY[y] = dualY[y] === -min ? 0 : dualY[y] + min;
    }
  }

  for (let x = 0; x < X; ++x) {
    if (coveredX[x] === -1) {
      slackV[x] = slackV[x] === min ? 0 : slackV[x] - min;
    } else {
      dualX[x] = dualX[x] === min ? 0 : dualX[x] - min;
    }
  }
}

export function initExposed(exposed: number[]): void {
  const N = exposed.length;
  for (let i = 0; i < N; ++i) {
    exposed[i] = i;
  }
}

export function findUncoveredMin(
  exposedX: number[],
  slackV: number[],
  slackX: number[]
): [number, number, number];
export function findUncoveredMin(
  exposedX: number[],
  slackV: bigint[],
  slackX: number[]
): [number, number, number];
export function findUncoveredMin<T extends number | bigint>(
  exposedX: number[],
  slackV: T[],
  slackX: number[]
): [number, number, number] {
  const X = slackV.length;

  let minP = 0;
  let minV = slackV[exposedX[minP]];
  for (let px = exposedX[0] + 1; px < X && exposedX[px] < X; ++px) {
    const x = exposedX[px];
    if (slackV[x] < minV) {
      minV = slackV[x];
      minP = px;
      if (minV === 0) {
        break;
      }
    }
    px = x;
  }

  const minX = exposedX[minP];
  return [slackX[minX], minX, minP];
}

export function initSlack(
  y: number,
  matrix: Matrix<number>,
  dualX: number[],
  dualY: number[],
  slackV: number[],
  slackX: number[]
): void {
  const dy = -dualY[y];
  const row = matrix[y];
  const X = slackX.length;

  slackX.fill(y);
  for (let x = 0; x < X; ++x) {
    const dual = dualX[x] === dy ? 0 : dualX[x] - dy;
    slackV[x] = row[x] === dual ? 0 : row[x] - dual;
  }
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
 * @param primeY - (Optional) An array of prime y coordinates to x coordinates.
 *
 * @returns A string visualization of the matrix with stars and primes.
 */
export function toString<T>(
  matrix: Matrix<T>,
  starsY: number[],
  coveredX: number[]
): string {
  // Mark values as stars or primes
  return _toString(matrix, (v, y, x): string => {
    let str = `${v}`;
    if (x == starsY[y]) {
      str = "*" + str;
    }
    if (y == coveredX[x]) {
      str = '"' + str;
    }
    return str;
  });
}

export function updateSlack(
  y: number,
  matrix: Matrix<number>,
  dualX: number[],
  dualY: number[],
  exposedX: number[],
  slackV: number[],
  slackX: number[]
): void {
  const dy = -dualY[y];
  const row = matrix[y];
  const X = slackX.length;

  for (let x = 0; x < X && exposedX[x] < X; ++x) {
    x = exposedX[x];
    const dual = dualX[x] === dy ? 0 : dualX[x] - dy;
    const slack = row[x] === dual ? 0 : row[x] - dual;
    if (slack < slackV[x]) {
      slackV[x] = slack;
      slackX[x] = y;
    }
  }
}
