import { CostMatrix } from "./types/costMatrix";

import { colReduction, rowReduction } from "./utils/costMatrix";
import { copy } from "./utils/matrix";
import { toString } from "./utils/munkres";

export class Munkres {
  protected covY: boolean[];
  protected mat: CostMatrix;
  protected primeY: number[];
  protected stars: number;
  protected starY: number[];
  protected starX: number[];

  constructor(mat: CostMatrix) {
    const X = mat[0].length;
    const Y = mat.length;

    this.mat = copy(mat);
    this.covY = new Array(Y).fill(false);
    this.primeY = new Array(Y).fill(-1);
    this.stars = 0;
    this.starX = new Array(X).fill(-1);
    this.starY = new Array(Y).fill(-1);
  }

  run(): [number, number][] {
    let step = this._steps1to3();

    while (step != 7) {
      console.log(toString(this.mat, this.starX, this.primeY));
      switch (step) {
        case 4:
          step = this._step4();
          break;
        case 6:
          step = this._step6();
          break;
        default:
          throw new Error(`Invalid state ${step}`);
      }
    }

    console.log("DONE");
    console.log(toString(this.mat, this.starX, this.primeY));

    // Get assignments
    const starX = this.starX;
    const X = starX.length;
    const pairs: [number, number][] = new Array(X);
    for (let x = 0; x < X; ++x) {
      pairs[x] = [starX[x], x];
    }

    return pairs;
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
    this.stars = stars;
    return stars < X ? 4 : 7;
  }

  protected _step4(): number {
    const covY = this.covY;
    const primeY = this.primeY;
    const starX = this.starX;
    const starY = this.starY;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Find an uncovered zero
      const [y, x] = this._findUncoveredZero();

      // If not found, go to step 6
      if (y < 0) {
        return 6;
      }

      // Prime the zero
      primeY[y] = x;

      // Find a star in the same row
      const sx = starY[y];

      // If star not found
      if (sx < 0) {
        return this._step5(y, x);
      }

      // Cover the row and unstar the zero
      covY[y] = true;
      starX[sx] = -1;
      starY[y] = -1;
      --this.stars;
    }
  }

  protected _step5(y: number, x: number): number {
    const path: number[] = [y, x];
    const primeY = this.primeY;
    const starX = this.starX;
    const starY = this.starY;

    // Find alternating path between
    // stars in columns and primes in rows
    while (starX[x] >= 0) {
      y = starX[x];
      x = primeY[y];
      path.push(y, x);
    }

    // Star the primes and unstar the stars
    const N = path.length;
    for (let i = 1; i < N; ++i) {
      y = path[i - (i & 1)];
      x = path[i - (i ^ 1)];
      if (starX[x] >= 0) {
        starX[x] = -1;
        starY[y] = -1;
        --this.stars;
      } else {
        starX[x] = y;
        starY[y] = x;
        ++this.stars;
      }
    }

    primeY.fill(-1);
    this.covY.fill(false);

    return this.stars < starX.length ? 4 : 7;
  }

  protected _step6(): number {
    const covY = this.covY;
    const mat = this.mat;
    const starX = this.starX;
    const X = starX.length;
    const Y = covY.length;

    const min = this._findMinUncovered();

    for (let x = 0; x < X; ++x) {
      if (starX[x] >= 0) {
        continue;
      }
      for (let y = 0; y < Y; ++y) {
        mat[y][x] -= min;
      }
    }

    for (let y = 0; y < Y; ++y) {
      if (!covY[y]) {
        continue;
      }
      for (let x = 0; x < X; ++x) {
        mat[y][x] += min;
      }
    }

    return 4;
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
      const row = mat[y];
      for (let x = 0; x < X; ++x) {
        if (starX[x] < 0 && row[x] < min) {
          min = row[x];
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
      const row = mat[y];
      for (let x = 0; x < X; ++x) {
        if (starX[x] < 0 && row[x] == 0) {
          return [y, x];
        }
      }
    }

    return [-1, -1];
  }
}
