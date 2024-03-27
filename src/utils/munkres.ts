import { Matrix } from "..";
import { CostMatrix } from "../types/costMatrix";
import { reduceCols, reduceRows } from "./costMatrix";
import { map } from "./matrix";

/**
 * Displays the current step of the algorithm and the state of the cost matrix.
 *
 * @param step - The current step of the algorithm.
 * @param mat - The cost matrix.
 * @param primeY - An array of prime y coordinates to x coordinates.
 * @param starY - An array of star y coordinates to x coordinates.
 */
export function debug(
  step: string,
  mat: CostMatrix,
  primeY: number[],
  starY: number[]
): void {
  console.log("%s:\n\n%s\n", step, toString(mat, starY, primeY));
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
  let minV = undefined as unknown as number;

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
      if (!(minV <= vals[x])) {
        minV = vals[x];
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
export function steps2To3(
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
 * @param mat - The cost matrix. Modified in place.
 *
 * @privateRemarks
 * Based on {@link https://users.cs.duke.edu/~brd/Teaching/Bio/asmb/current/Handouts/munkres.html | this outline} and enhanced with custom optimizations.
 */
export function step4(mat: CostMatrix): number[] {
  const starX = new Array<number>(mat[0]?.length ?? 0).fill(-1);
  const starY = new Array<number>(mat.length).fill(-1);
  const primeY = new Array<number>(mat.length).fill(-1);

  // Step 1: Reduce
  step1(mat);

  // Steps 2 & 3: Find initial stars
  let stars = steps2To3(mat, starX, starY);

  // Step 4: Find optimal assignments
  const S = Math.min(starX.length, starY.length);
  while (stars < S) {
    // Find an uncovered zero or the uncovered min
    const [y, x] = findUncoveredZeroOrMin(mat, primeY, starX);

    // Step 6: If no zero found, create a zero(s) from the min
    if (mat[y][x] != 0) {
      step6(mat[y][x], mat, primeY, starX);
    }

    // Prime the zero / cover the row
    primeY[y] = x;

    // Step 5: If no star in the prime's row, turn primes into stars
    if (starY[y] < 0) {
      step5(y, primeY, starX, starY);
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
  mat: CostMatrix,
  primeY: number[],
  starX: number[]
): void {
  const X = starX.length;
  const Y = primeY.length;

  if (!isFinite(min)) {
    return step6Inf(mat, primeY, starX);
  }

  for (let y = 0; y < Y; ++y) {
    const vals = mat[y];
    for (let x = 0; x < X; ++x) {
      if (starX[x] >= 0 && primeY[starX[x]] < 0) {
        if (primeY[y] >= 0) {
          vals[x] += min;
        }
      } else if (primeY[y] < 0) {
        vals[x] -= min;
      }
    }
  }
}

/**
 * Adjusts a cost matrix to uncover more zeros, specifically
 * when adjusting by Infinity.
 *
 * The matrix is modified by adding `Infinity` to every element of covered
 * rows, and subtracting `Infinity` from every element of uncovered columns.
 * If an element's row is covered and column is uncovered, no change is made.
 *
 * @param mat - The cost matrix. Modified in place.
 * @param primeY - An array of prime y coordinates to x coordinates.
 * @param starX - An array of star x coordinates to y coordinates.
 *
 * @remarks
 *
 * This variation of step 6 is used when the minimum uncovered value
 * (see {@link step4}) is `Infinity`, as normal subtraction of `Infinity`
 * from `Infinity` equals `NaN`.
 */
export function step6Inf(
  mat: CostMatrix,
  primeY: number[],
  starX: number[]
): void {
  const X = starX.length;
  const Y = primeY.length;

  for (let y = 0; y < Y; ++y) {
    const vals = mat[y];
    for (let x = 0; x < X; ++x) {
      if (starX[x] >= 0 && primeY[starX[x]] < 0) {
        if (primeY[y] >= 0) {
          vals[x] += Infinity;
        }
      } else if (primeY[y] < 0) {
        vals[x] = 0;
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
 * @param starY - An array of star y coordinates to x coordinates.
 * @param primeY - (Optional) An array of prime y coordinates to x coordinates.
 *
 * @returns A string visualization of the matrix with stars and primes.
 */
export function toString(
  mat: CostMatrix,
  starY: number[],
  primeY: number[] = []
): string {
  const strs: Matrix<string> = map(mat, v => `${v}`);
  const Y = strs.length;
  const X = strs[0]?.length ?? 0;

  // Mark values as stars or primes
  for (let y = 0; y < Y; ++y) {
    const row = strs[y];
    if (starY[y] >= 0) {
      row[starY[y]] = "*" + row[starY[y]];
    }
    if (primeY[y] >= 0) {
      row[primeY[y]] = '"' + row[primeY[y]];
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

  /*

  // Create starX
  const starX: number[] = new Array(X).fill(-1);
  for (let y = 0; y < Y; ++y) {
    if (starY[y] >= 0) {
      starX[starY[y]] = y;
    }
  }
  
  // Mark values as covered
  for (let y = 0; y < Y; ++y) {
    for (let x = 0; x < X; ++x) {
      if (starX[x] >= 0 && primeY[starX[x]] < 0) {
        if (primeY[y] >= 0) {
          strs[y][x] = `⫢${strs[y][x]}⫤`;
        } else {
          strs[y][x] = `|${strs[y][x]}|`;
        }
      } else if (primeY[y] >= 0) {
        strs[y][x] = `=${strs[y][x]}=`;
      } else {
        strs[y][x] = ` ${strs[y][x]} `;
      }
    }
  }
  */

  // Create output
  const buf: string[] = new Array(Y);
  for (let y = 0; y < Y; ++y) {
    buf[y] = `[${strs[y].join(", ")}]`;
  }
  return buf.join(",\n");
}
