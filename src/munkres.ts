import { CostMatrix } from "./types/costMatrix";
import { getMin } from "./utils/array";
import { copy } from "./utils/matrix";

export class Munkres {
  protected covY: number[];
  protected mat: CostMatrix;
  protected primeY: number[];
  protected starX: number[];

  constructor(mat: CostMatrix) {
    const X = mat[0].length;
    const Y = mat.length;

    this.mat = copy(mat);
    this.covY = new Array(Y).fill(-1);
    this.primeY = new Array(Y).fill(-1);
    this.starX = new Array(X).fill(-1);
  }

  run(): [number, number][] {
    let step = this._steps1And2();

    while (step != 7) {
      console.log(toString(this.mat, this.starX, this.primeY));
      switch (step) {
        case 3:
          step = this._step3();
          break;
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

  protected _steps1And2(): number {
    const covY = this.covY;
    const mat = this.mat;
    const starX = this.starX;
    const X = starX.length;
    const Y = covY.length;

    // Step 1a: Row reduction
    for (let y = 0; y < Y; ++y) {
      const row = mat[y];
      const min = getMin(row)!;
      for (let x = 0; x < X; ++x) {
        row[x] -= min;
      }
    }

    // Step 1b: Column reduction
    for (let x = 0; x < X; ++x) {
      let min = Infinity;
      for (let y = 0; y < Y; ++y) {
        min = min <= mat[y][x] ? min : mat[y][x];
      }
      for (let y = 0; y < Y; ++y) {
        mat[y][x] -= min;
      }
    }

    // Step 2: Look for uncovered zeros in the matrix
    let stars = 0;
    for (let y = 0; y < Y; ++y) {
      const row = mat[y];
      for (let x = 0; x < X; ++x) {
        if (row[x] == 0 && starX[x] < 0) {
          // Star the zero
          starX[x] = y;
          ++stars;

          // Go to next row
          break;
        }
      }
    }

    // Go to DONE if all columns starred.
    // Otherwise, go to next step
    return stars < X ? 4 : 7;
  }

  protected _step3(): number {
    const starX = this.starX;
    const X = starX.length;

    // Count stars
    let stars = 0;
    for (let x = 0; x < X; ++x) {
      stars += +(starX[x] >= 0);
    }

    // Go to DONE if all columns starred.
    // Otherwise, go to next step
    return stars < X ? 4 : 7;
  }

  protected _step4(): number {
    const covY = this.covY;
    const primeY = this.primeY;
    const starX = this.starX;

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
      const sx = this._findStarInRow(y);

      // If not found, go to step 5, then 3
      if (sx < 0) {
        this._step5(y, x);
        return 3;
      }

      // Cover the row and uncover the star's column
      covY[y] = sx;
      starX[sx] = -1;
    }
  }

  protected _step5(y: number, x: number): void {
    const covY = this.covY;
    const path: number[] = [y, x];
    const primeY = this.primeY;
    const starX = this.starX;

    // Find alternating path between
    // stars in columns and primes in rows
    while (starX[x] >= 0) {
      y = starX[x];
      x = primeY[y];
      path.push(y, x);
    }

    const N = path.length;
    for (let i = 1; i < N; ++i) {
      y = path[i - (i & 1)];
      x = path[i - (i ^ 1)];
      if (starX[x] == y) {
        starX[x] = -1;
      } else {
        starX[x] = y;
      }
    }

    primeY.fill(-1);
    covY.fill(-1);
  }

  protected _step6(): number {
    const covY = this.covY;
    const mat = this.mat;
    const starX = this.starX;
    const X = starX.length;
    const Y = covY.length;

    const min = this._findMinUncovered();
    for (let y = 0; y < Y; ++y) {
      for (let x = 0; x < X; ++x) {
        if (covY[y] >= 0) {
          mat[y][x] += min;
        }
        if (starX[x] < 0) {
          mat[y][x] -= min;
        }
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
      if (covY[y] >= 0) {
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

  protected _findStarInRow(y: number): number {
    const starX = this.starX;
    const X = starX.length;

    for (let x = 0; x < X; ++x) {
      if (starX[x] == y) {
        return x;
      }
    }

    return -1;
  }

  protected _findUncoveredZero(): [number, number] {
    const covY = this.covY;
    const mat = this.mat;
    const starX = this.starX;
    const X = starX.length;
    const Y = covY.length;

    for (let y = 0; y < Y; ++y) {
      if (covY[y] >= 0) {
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

  for (let y = 0; y < Y; ++y) {
    for (let x = 0; x < X; ++x) {
      let val = `${mat[y][x]}`;
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
