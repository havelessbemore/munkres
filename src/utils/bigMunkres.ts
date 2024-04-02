import { Matrix } from "../types/matrix";
import { Tuple } from "../types/tuple";

import { step1, step5 } from "./munkres";

/**
 * Searches for an uncovered zero in the matrix and returns its coordinates.
 * If not found, the coordinates of the smallest uncovered value are returned
 * instead.
 *
 * @param mat - The cost matrix.
 * @param primeY - An array of prime y coordinates to x coordinates.
 * @param starX - An array of star x coordinates to y coordinates.
 *
 * @returns The coordinates of an uncovered zero, if found.
 * Otherwise, the coordinates to the smallest uncovered value.
 */
export function bigFindUncoveredZeroOrMin(
  mat: Matrix<bigint>,
  primeY: number[],
  starX: number[]
): Tuple<number> {
  const X = starX.length;
  const Y = primeY.length;

  let minX = -1;
  let minY = -1;
  let minV = undefined as unknown as bigint;

  // For each cell
  for (let y = 0; y < Y; ++y) {
    // Skip if the row is covered
    if (primeY[y] >= 0) {
      continue;
    }
    const vals = mat[y];
    for (let x = 0; x < X; ++x) {
      // Skip if the column is covered
      if (starX[x] >= 0 && primeY[starX[x]] < 0) {
        continue;
      }
      // Return immediately if a zero is found
      if (vals[x] == 0n) {
        return [y, x];
      }
      // Track the smallest uncovered value
      if (!(minV <= vals[x])) {
        minV = vals[x];
        minX = x;
        minY = y;
      }
    }
  }

  // Return the smallest value's coordinates
  return [minY, minX];
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
export function bigSteps2To3(
  mat: Matrix<bigint>,
  starX: number[],
  starY: number[]
): number {
  const X = starX.length;
  const Y = starY.length;

  let stars = 0;
  for (let y = 0; y < Y; ++y) {
    const vals = mat[y];
    for (let x = 0; x < X; ++x) {
      if (vals[x] == 0n && starX[x] < 0) {
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
export function bigStep4(mat: Matrix<bigint>): number[] {
  const Y = mat.length;
  const X = mat[0]?.length ?? 0;

  // Check input
  if (Y > X) {
    throw new RangeError("invalid MxN matrix: M > N");
  }

  const starX = new Array<number>(X).fill(-1);
  const starY = new Array<number>(Y).fill(-1);
  const primeY = new Array<number>(Y).fill(-1);

  // Step 1: Reduce
  step1(mat);

  // Steps 2 & 3: Find initial stars
  let stars = bigSteps2To3(mat, starX, starY);

  // Step 4: Find optimal assignments
  while (stars < Y) {
    // Find an uncovered zero or the uncovered min
    const [y, x] = bigFindUncoveredZeroOrMin(mat, primeY, starX);

    // Step 6: If no zero found, create a zero(s) from the min
    if (mat[y][x] != 0n) {
      bigStep6(mat[y][x], mat, primeY, starX);
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
export function bigStep6(
  min: bigint,
  mat: Matrix<bigint>,
  primeY: number[],
  starX: number[]
): void {
  const X = starX.length;
  const Y = primeY.length;

  // For each cell
  for (let y = 0; y < Y; ++y) {
    const vals = mat[y];
    for (let x = 0; x < X; ++x) {
      if (starX[x] >= 0 && primeY[starX[x]] < 0) {
        if (primeY[y] >= 0) {
          // The cell's column and row are covered
          vals[x] += min;
        }
      } else if (primeY[y] < 0) {
        // The cell's column and row are uncovered
        vals[x] -= min;
      }
    }
  }
}
