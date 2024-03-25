import { CostMatrix } from "./types/costMatrix";

import { colReduction, rowReduction } from "./utils/costMatrix";
import { copy } from "./utils/matrix";
import { toString } from "./utils/munkres";

export class Munkres {
  protected mat: CostMatrix;

  protected starX: number[];

  constructor(mat: CostMatrix) {
    const X = mat[0]?.length ?? 0;
    this.mat = copy(mat);
    this.starX = new Array(X).fill(-1);
  }

  run(): [number, number][] {
    this._step4(this.mat);

    // Get assignments
    return this._getAssignments(this.starX);
  }

  protected _steps1to3(
    mat: CostMatrix,
    starX: number[],
    starY: number[]
  ): number {
    const X = starX.length;
    const Y = starY.length;

    // Step 1: Reduction
    rowReduction(mat);
    colReduction(mat);

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

  protected _step4(mat: CostMatrix): void {
    const starX = this.starX;
    const X = starX.length;
    const Y = mat.length;
    const starY = new Array(Y).fill(-1);
    const primeY = new Array(Y).fill(-1);

    let stars = this._steps1to3(mat, starX, starY);
    while (stars < X) {
      // Find an uncovered zero
      const [y, x] = this._findUncoveredZeroOrMin(mat, primeY, starX);

      // If not found
      if (mat[y][x] != 0) {
        this._step6(mat[y][x], mat, primeY, starX);
        continue;
      }

      // Prime the zero
      primeY[y] = x;

      // Find a star in the same row
      const sx = starY[y];

      // If star found
      if (sx >= 0) {
        // Cover the row and remove the star
        starX[sx] = -1;
        starY[y] = -1;
        --stars;
      } else {
        // Replace stars with primes and reset coverage
        this._step5(y, x, primeY, starX, starY);
        primeY.fill(-1);
        ++stars;
      }
    }

    console.log("DONE");
    console.log(toString(this.mat, starX, primeY));
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
  protected _step5(
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

  protected _step6(
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

  protected _getAssignments(starX: number[]): [number, number][] {
    const X = starX.length;
    const pairs: [number, number][] = new Array(X);
    for (let x = 0; x < X; ++x) {
      pairs[x] = [starX[x], x];
    }
    return pairs;
  }

  protected _findUncoveredZeroOrMin(
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
}
