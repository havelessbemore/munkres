import { Matrix } from "..";
import { CostMatrix } from "../types/costMatrix";
import { reduceCols, reduceRows } from "./costMatrix";
import { map } from "./matrix";

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
export function findUncoveredZeroOrMin(
  mat: CostMatrix,
  primeY: number[],
  starX: number[]
): [number, number] {
  const X = starX.length;
  const Y = primeY.length;

  let minX = -1;
  let minY = -1;
  let min = Infinity;

  for (let y = 0; y < Y; ++y) {
    if (primeY[y] >= 0) {
      continue;
    }
    const vals = mat[y];
    for (let x = 0; x < X; ++x) {
      if (starX[x] >= 0 && primeY[starX[x]] < 0) {
        continue;
      }
      if (vals[x] == 0) {
        return [y, x];
      }
      if (vals[x] < min) {
        min = vals[x];
        minX = x;
        minY = y;
      }
    }
  }

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
export function step1(mat: CostMatrix): void {
  reduceRows(mat);
  reduceCols(mat);
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
export function step2(mat: CostMatrix, starX: number[], starY: number[]): void {
  const X = starX.length;
  const Y = starY.length;

  for (let y = 0; y < Y; ++y) {
    const vals = mat[y];
    for (let x = 0; x < X; ++x) {
      if (vals[x] == 0 && starX[x] < 0) {
        starX[x] = y;
        starY[y] = x;
        break;
      }
    }
  }
}

export function step3(starX: number[]): number {
  const X = starX.length;

  let stars = 0;
  for (let x = 0; x < X; ++x) {
    stars += +(starX[x] >= 0);
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
 * @param stars - The initial number of stars found in the matrix.
 * @param mat - The cost matrix. Modified in place.
 * @param starX - An array of star x coordinates to y coordinates.
 * @param starY - An array of star y coordinates to x coordinates.
 */
export function step4(mat: CostMatrix, starX: number[], starY: number[]): void {
  const X = starX.length;
  const primeY = new Array<number>(starY.length).fill(-1);

  let stars = step3(starX);
  while (stars < X) {
    // Find an uncovered zero
    const [y, x] = findUncoveredZeroOrMin(mat, primeY, starX);

    // If not found
    if (mat[y][x] != 0) {
      step6(mat[y][x], mat, primeY, starX);
      continue;
    }

    // Prime the zero / cover the row
    primeY[y] = x;

    // Find a star in the same row
    const sx = starY[y];

    // If not found, replace stars with primes
    if (sx < 0) {
      step5(y, primeY, starX, starY);
      ++stars;
    }
  }
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

  let sy = y;
  while (sy >= 0) {
    // Go to the next prime
    const x = primeY[sy];
    y = sy;
    sy = starX[x];

    // Mark prime as a star
    primeY[y] = -1;
    starX[x] = y;
    starY[y] = x;
  }
}

/**
 * Adjusts a cost matrix to uncover more zeros.
 *
 * The matrix is modified by adding a given value to each element in a row
 * with a prime, and subtracting the given value to each element not in a
 * column with a star.
 *
 * @param val - The value to adjust the matrix by.
 * Should be the smallest uncovered value.
 * @param mat - The cost matrix. Modified in place.
 * @param primeY - An array of prime y coordinates to x coordinates.
 * @param starX - An array of star x coordinates to y coordinates.
 */
export function step6(
  val: number,
  mat: CostMatrix,
  primeY: number[],
  starX: number[]
): void {
  const X = starX.length;
  const Y = primeY.length;

  for (let y = 0; y < Y; ++y) {
    const vals = mat[y];
    for (let x = 0; x < X; ++x) {
      if (starX[x] < 0 || primeY[starX[x]] >= 0) {
        vals[x] -= val;
      }
      if (primeY[y] >= 0) {
        vals[x] += val;
      }
    }
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
 * @param mat - The cost matrix.
 * @param primeY - An array of prime y coordinates to x coordinates.
 * @param starX - An array of star x coordinates to y coordinates.
 *
 * @returns A string visualization of the matrix with stars and primes.
 */
export function toString(
  mat: CostMatrix,
  primeY: number[],
  starX: number[]
): string {
  const strs: Matrix<string> = map(mat, v => `${v}`);
  const Y = strs.length;
  const X = strs[0]?.length ?? 0;

  // Mark values as stars or primes
  for (let y = 0; y < Y; ++y) {
    const row = strs[y];
    for (let x = 0; x < X; ++x) {
      if (starX[x] == y) {
        row[x] = "*" + row[x];
      }
      if (primeY[y] == x) {
        row[x] = '"' + row[x];
      }
    }
  }

  // Get column width
  let width = 0;
  for (let y = 0; y < Y; ++y) {
    for (let x = 0; x < X; ++x) {
      width = Math.max(width, strs[y][x].length);
    }
  }

  // Adjust widths
  for (let y = 0; y < Y; ++y) {
    const row = strs[y];
    for (let x = 0; x < X; ++x) {
      if (row[x].length < width) {
        row[x] = row[x].padStart(width, " ");
      }
    }
  }

  // Create output
  const buf: string[] = new Array(Y);
  for (let y = 0; y < Y; ++y) {
    buf[y] = strs[y].join(", ");
  }
  return buf.join("\n");
}
