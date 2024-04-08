import { Matrix } from "../types/matrix";
import { Tuple } from "../types/tuple";
import { getMin } from "./array";

/**
 * Searches for an uncovered zero in the matrix and returns its coordinates.
 *
 * @param mat - The cost matrix.
 * @param primeY - An array of prime y coordinates to x coordinates.
 * @param starX - An array of star x coordinates to y coordinates.
 *
 * @returns The coordinates of an uncovered zero, if found.
 * Otherwise, returns `[-1, -1]`;
 */
export function findUncoveredZero(
  mat: Matrix<number>,
  dualX: number[],
  dualY: number[],
  primeY: number[],
  starX: number[]
): Tuple<number> {
  const X = starX.length;
  const Y = primeY.length;

  // For each cell
  for (let y = 0; y < Y; ++y) {
    // Skip if the row is covered
    if (primeY[y] >= 0) {
      continue;
    }
    const row = mat[y];
    const dy = dualY[y];
    for (let x = 0; x < X; ++x) {
      if (row[x] == dualX[x] + dy && (starX[x] < 0 || primeY[starX[x]] >= 0)) {
        return [y, x];
      }
    }
  }

  return [-1, -1];
}

/**
 * Searches for the smallest uncovered value
 * in the matrix and returns its coordinates.
 *
 * @param mat - The cost matrix.
 * @param primeY - An array of prime y coordinates to x coordinates.
 * @param starX - An array of star x coordinates to y coordinates.
 *
 * @returns The coordinates to the smallest uncovered value.
 */
export function findUncoveredMin(
  mat: Matrix<number>,
  dualX: number[],
  dualY: number[],
  primeY: number[],
  starX: number[]
): Tuple<number> {
  const X = starX.length;
  const Y = primeY.length;

  let minX = -1;
  let minY = -1;
  let minV = undefined as unknown as number;

  // For each cell
  for (let y = 0; y < Y; ++y) {
    // Skip if the row is covered
    if (primeY[y] >= 0) {
      continue;
    }
    const row = mat[y];
    const dy = dualY[y];
    for (let x = 0; x < X; ++x) {
      // Skip if the column is covered
      if (starX[x] >= 0 && primeY[starX[x]] < 0) {
        continue;
      }
      // Track the smallest uncovered value
      const val = row[x] - dualX[x] - dy;
      if (!(minV <= val)) {
        minV = val;
        minX = x;
        minY = y;
      }
    }
  }

  // Return the smallest value's coordinates
  return [minY, minX];
}

/**
 * Reduces the given cost matrix by performing row-wise and column-wise
 * reductions.
 *
 * This is a preprocessing step to simplify the matrix
 * and improve the efficiency of subsequent steps.
 *
 * @param mat - The cost matrix. Modified in place.
 */
export function step1(
  mat: Matrix<number>,
  dualX: number[],
  dualY: number[]
): void {
  const Y = mat.length;
  const X = mat[0]?.length ?? 0;

  // Reduce rows
  if (Y <= X) {
    for (let y = 0; y < Y; ++y) {
      dualY[y] = getMin(mat[y])!;
    }
  }

  // Reduce columns
  if (Y >= X) {
    for (let x = 0; x < X; ++x) {
      dualX[x] = mat[0][x] - dualY[0];
    }
    for (let y = 1; y < Y; ++y) {
      const row = mat[y];
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
 * Performs the initial steps of searching for zeros in the cost matrix to
 * "star", then returns the number of stars made.
 *
 * A star indicates a potential part of the optimal solution. Each star is
 * the only one in its row and column.
 *
 * @param mat - The cost matrix.
 * @param starX - An array tracking the star status of columns.
 * @param starY - An array tracking the star status of rows.
 *
 * @returns The number of stars made.
 */
export function steps2To3(
  mat: Matrix<number>,
  dualX: number[],
  dualY: number[],
  starX: number[],
  starY: number[]
): number {
  const X = starX.length;
  const Y = starY.length;

  let stars = 0;
  for (let y = 0; y < Y; ++y) {
    const vals = mat[y];
    for (let x = 0; x < X; ++x) {
      if (starX[x] < 0 && vals[x] == dualY[y] + dualX[x]) {
        starX[x] = y;
        starY[y] = x;
        ++stars;
        break;
      }
    }
  }

  return stars;
}

/**
 * Find and augment assignments until an optimal set is found.
 *
 * It attempts to either find an uncovered zero to star or adjusts
 * the matrix to create more zeros if none found. If an uncovered zero is
 * found but cannot be starred due to conflicts (i.e., another star in the
 * same row or column), it primes the zero and possibly adjusts existing
 * stars to resolve the conflict, thereby augmenting the current set of
 * assignments. This process is repeated until there are as many stars as
 * there are columns in the matrix, at which point optimal assignments
 * have been found.
 *
 * @param mat - An MxN cost matrix. Modified in place.
 *
 * @throws - {@link RangeError}
 * Thrown if the given MxN matrix has more rows than columns (M \> N).
 *
 * @privateRemarks
 * Based on {@link https://users.cs.duke.edu/~brd/Teaching/Bio/asmb/current/Handouts/munkres.html | this outline}
 * and enhanced with custom optimizations.
 */
export function step4(mat: Matrix<number>): number[] {
  const Y = mat.length;
  const X = mat[0]?.length ?? 0;

  // Check input
  if (Y > X) {
    throw new RangeError("invalid MxN matrix: M > N");
  }

  const dualX = new Array<number>(X).fill(0);
  const dualY = new Array<number>(Y).fill(0);
  const primeY = new Array<number>(Y).fill(-1);
  const starX = new Array<number>(X).fill(-1);
  const starY = new Array<number>(Y).fill(-1);

  // Step 1: Reduce
  step1(mat, dualX, dualY);

  // Steps 2 & 3: Find initial stars
  let stars = steps2To3(mat, dualX, dualY, starX, starY);

  // Step 4: Find optimal assignments
  while (stars < Y) {
    // Find an uncovered zero
    let [y, x] = findUncoveredZero(mat, dualX, dualY, primeY, starX);

    // Step 6: If no zero found, find and zero the min
    if (y < 0) {
      [y, x] = findUncoveredMin(mat, dualX, dualY, primeY, starX);
      step6(mat[y][x] - dualX[x] - dualY[y], dualX, dualY, primeY, starX);
    }

    // Prime the zero / cover the row
    primeY[y] = x;

    // Step 5: If no star in the prime's row, turn primes into stars
    if (starY[y] < 0) {
      step5(y, primeY, starX, starY);
      primeY.fill(-1);
      ++stars;
    }
  }

  // Return assignments ([y] -> x)
  return starY;
}

/**
 * Given a prime, walks an alternating path to a star in the prime's column
 * and then a prime in the star's row, starring each prime and removing each
 * star along the way. The path continues until a star cannot be found.
 *
 * This step effectively increases the number of independent zeros (stars)
 * in the matrix, bringing the algorithm closer to an optimal assignment.
 *
 * @param y - The starting prime's y coordinate.
 * @param primeY - An array of prime y coordinates to x coordinates.
 * @param starX - An array of star x coordinates to y coordinates.
 * @param starY - An array of star y coordinates to x coordinates.
 */
export function step5(
  y: number,
  primeY: number[],
  starX: number[],
  starY: number[]
): void {
  // Sanity check
  if (primeY[y] < 0) {
    throw new Error("Input must be prime.");
  }

  do {
    // Mark prime as a star
    const x = primeY[y];
    const sy = starX[x];
    starX[x] = y;
    starY[y] = x;

    // Move to next prime
    y = sy;
  } while (y >= 0);
}

/**
 * Adjusts a cost matrix to uncover more zeros.
 *
 * The matrix is modified by adding a given value to every element of covered
 * rows, and subtracting `Infinity` from every element of uncovered columns.
 * If an element's row is covered and column is uncovered, no change is made.
 *
 * @param min - The value to adjust the matrix by.
 * Should be the minimum uncovered value (see {@link step4}).
 * @param mat - The cost matrix. Modified in place.
 * @param primeY - An array of prime y coordinates to x coordinates.
 * @param starX - An array of star x coordinates to y coordinates.
 */
export function step6(
  min: number,
  dualX: number[],
  dualY: number[],
  primeY: number[],
  starX: number[]
): void {
  const X = starX.length;
  const Y = primeY.length;

  for (let y = 0; y < Y; ++y) {
    if (primeY[y] >= 0) {
      dualY[y] -= min;
    }
  }

  for (let x = 0; x < X; ++x) {
    if (!(starX[x] >= 0 && primeY[starX[x]] < 0)) {
      dualX[x] += min;
    }
  }
}
