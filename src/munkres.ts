import { CostMatrix } from "./types/costMatrix";

import { colReduction, rowReduction } from "./utils/costMatrix";
import { copy } from "./utils/matrix";
import { toString } from "./utils/munkres";

export class Munkres {
  protected covY: boolean[];
  protected mat: CostMatrix;
  protected starY: number[];
  protected starX: number[];

  constructor(mat: CostMatrix) {
    const X = mat[0].length;
    const Y = mat.length;

    this.mat = copy(mat);
    this.covY = new Array(Y).fill(false);
    this.starX = new Array(X).fill(-1);
    this.starY = new Array(Y).fill(-1);
  }

  run(): [number, number][] {
    this._step4();

    // Get assignments
    return this._getAssignments();
  }

  protected _steps1to3(): number {
    const mat = this.mat;
    const starX = this.starX;
    const starY = this.starY;
    const X = starX.length;
    const Y = starY.length;

    // Step 1: Reduction
    rowReduction(mat);
    colReduction(mat);

    // Step 2: Look for zeros to star in the matrix.
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

    // Check if all columns have a star
    return stars;
  }

  protected _step4(): void {
    const covY = this.covY;
    const starX = this.starX;
    const starY = this.starY;
    const X = starX.length;
    const Y = starY.length;
    const primeY = new Array(Y).fill(-1);

    let stars = this._steps1to3();
    while (stars < X) {
      // Find an uncovered zero
      const [y, x] = this._findUncoveredZero();
      if (y < 0) {
        this._step6();
        continue;
      }

      // Prime the zero
      primeY[y] = x;

      // Find a star in the same row
      const sx = starY[y];

      // If star not found
      if (sx < 0) {
        covY.fill(false);
        this._step5(y, x, primeY);
        ++stars;
        continue;
      }

      // Cover the row and unstar the zero
      covY[y] = true;
      starX[sx] = -1;
      starY[y] = -1;
      --stars;
    }

    console.log("DONE");
    console.log(toString(this.mat, starX, primeY));
  }

  protected _step5(y: number, x: number, primeY: number[]): void {
    const path: number[] = [y, x];
    const starX = this.starX;
    const starY = this.starY;

    // Find alternating path between
    // stars in columns and primes in rows
    while (starX[x] >= 0) {
      y = starX[x];
      x = primeY[y];
      path.push(y, x);
    }

    // Reset primes
    primeY.fill(-1);

    // Replace stars with primes
    const N = path.length;
    for (let i = 1; i < N; i += 2) {
      y = path[i - 1];
      x = path[i];
      starX[x] = y;
      starY[y] = x;
    }
  }

  protected _step6(): void {
    const covY = this.covY;
    const mat = this.mat;
    const starX = this.starX;
    const X = starX.length;
    const Y = covY.length;

    const min = this._findMinUncovered();
    for (let y = 0; y < Y; ++y) {
      const vals = mat[y];
      for (let x = 0; x < X; ++x) {
        if (covY[y]) {
          vals[x] += starX[x] >= 0 ? min : 0;
        } else if (starX[x] < 0) {
          vals[x] -= min;
        }
      }
    }
  }

  protected _getAssignments(): [number, number][] {
    const starX = this.starX;
    const X = starX.length;
    const pairs: [number, number][] = new Array(X);
    for (let x = 0; x < X; ++x) {
      pairs[x] = [starX[x], x];
    }
    return pairs;
  }

  protected _findMinUncovered(): number {
    const covY = this.covY;
    const mat = this.mat;
    const starX = this.starX;
    const X = starX.length;
    const Y = covY.length;

    let min = Infinity;
    for (let y = 0; y < Y; ++y) {
      if (covY[y]) {
        continue;
      }
      const vals = mat[y];
      for (let x = 0; x < X; ++x) {
        if (starX[x] < 0 && vals[x] < min) {
          min = vals[x];
        }
      }
    }

    return min;
  }

  protected _findUncoveredZero(): [number, number] {
    const covY = this.covY;
    const mat = this.mat;
    const starX = this.starX;
    const X = starX.length;
    const Y = covY.length;

    for (let y = 0; y < Y; ++y) {
      if (covY[y]) {
        continue;
      }
      const vals = mat[y];
      for (let x = 0; x < X; ++x) {
        if (starX[x] < 0 && vals[x] == 0) {
          return [y, x];
        }
      }
    }

    return [-1, -1];
  }
}
