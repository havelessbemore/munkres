import { CostMatrix } from "../types/costMatrix";
import { reduceCols, reduceRows } from "./costMatrix";

export function steps1to3(
  mat: CostMatrix,
  starX: number[],
  starY: number[]
): number {
  const X = starX.length;
  const Y = starY.length;

  // Step 1: Reduction
  reduceRows(mat);
  reduceCols(mat);

  // Step 2: Look for zeros to star.
  // There can only be 1 star in a column / row.
  let stars = 0;
  for (let y = 0; y < Y; ++y) {
    const vals = mat[y];
    for (let x = 0; x < X; ++x) {
      if (vals[x] == 0 && starX[x] < 0) {
        // Star the zero
        starX[x] = y;
        starY[y] = x;
        ++stars;

        // Go to next row
        break;
      }
    }
  }

  // Step 3: Return the number of stars found
  return stars;
}

/**
 * Given a prime, walks an alternating path to stars in columns and primes
 * in rows, starring each prime and removing each star along the way.
 * The path continues until a prime cannot alternate with a star.
 *
 * @param y - The initial prime's y coordinate.
 * @param x - The initial prime's x coordinate.
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

export function step6(
  min: number,
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
        vals[x] -= min;
      }
      if (primeY[y] >= 0) {
        vals[x] += min;
      }
    }
  }
}

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

export function toString(
  mat: CostMatrix,
  starX: number[],
  primeY: number[]
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
