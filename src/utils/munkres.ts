import { CostMatrix } from "../types/costMatrix";
import { reduceCols, reduceRows } from "./costMatrix";

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
export function steps2to3(
  mat: CostMatrix,
  starX: number[],
  starY: number[]
): number {
  const X = starX.length;
  const Y = starY.length;

  let stars = 0;
  for (let y = 0; y < Y; ++y) {
    const vals = mat[y];
    for (let x = 0; x < X; ++x) {
      if (vals[x] == 0 && starX[x] < 0) {
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
 * Given a prime, walks an alternating path to a star in the prime's column
 * and then a prime in the star's row, starring each prime and removing each
 * star along the way. The path continues until a star cannot be found.
 *
 * This step effectively increases the number of independent zeros (stars)
 * in the matrix, bringing the algorithm closer to an optimal assignment.
 *
 * @param y - The starting prime's y coordinate.
 * @param x - The starting prime's x coordinate.
 * @param primeY - An array of prime y coordinates to x coordinates.
 * @param starX - An array of star x coordinates to y coordinates.
 * @param starY - An array of star y coordinates to x coordinates.
 */
export function step5(
  y: number,
  x: number,
  primeY: number[],
  starX: number[],
  starY: number[]
): void {
  // Sanity check
  if (primeY[y] != x) {
    throw new Error("Input must be prime.");
  }

  for (let py = starX[x]; py >= 0; py = starX[x]) {
    starX[x] = y;
    starY[y] = x;
    x = primeY[py];
    y = py;
  }
  starX[x] = y;
  starY[y] = x;
}

/**
 * Adjusts a cost matrix to uncover more zeros.
 *
 * The matrix is modified by adding a given value to each element in a row
 * with a prime, and subtracting the given value to each element not in a
 * column with a star.
 *
 * @param val - The value to adjust the matrix by. Should be the smallest uncovered value.
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
      if (starX[x] < 0) {
        vals[x] -= val;
      }
      if (primeY[y] >= 0) {
        vals[x] += val;
      }
    }
  }
}

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
      if (starX[x] >= 0) {
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
  const buf: string[] = [""];
  const X = mat[0].length;
  const Y = mat.length;

  // Get cell width
  let cw = -Infinity;
  for (let y = 0; y < Y; ++y) {
    for (let x = 0; x < X; ++x) {
      cw = Math.max(cw, mat[y][x]);
    }
  }
  cw = `${cw}`.length + 1;

  // Print each value
  for (let y = 0; y < Y; ++y) {
    for (let x = 0; x < X; ++x) {
      let val = `${mat[y][x]}`;

      // Mark value as a star or prime
      if (starX[x] == y) {
        val += "*";
      } else if (primeY[y] == x) {
        val += '"';
      }

      buf.push(val.padEnd(cw, " "));
    }
    buf.push("\n");
  }

  return buf.join(" ");
}
