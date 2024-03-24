/*! munkres
https://github.com/havelessbemore/munkres

MIT License

Copyright (C) 2024-2024 Michael Rojas <dev.michael.rojas@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function getMin(array) {
  const N = array.length;
  if (N <= 0) {
    return void 0;
  }
  let min = array[0];
  for (let i = 1; i < N; ++i) {
    min = min >= array[i] ? min : array[i];
  }
  return min;
}
const Zero = {
  NONE: 0,
  STAR: 1,
  PRIME: 2
};
class Munkres {
  constructor(mat2) {
    __publicField(this, "covY");
    __publicField(this, "covX");
    __publicField(this, "mask");
    this.mat = mat2;
    const Y = mat2.length;
    const X = mat2[0].length;
    const mask = new Array(Y);
    for (let y = 0; y < Y; ++y) {
      mask[y] = new Array(X).fill(0);
    }
    this.covY = new Array(X).fill(false);
    this.covX = new Array(Y).fill(false);
    this.mask = mask;
  }
  assign() {
    this._step1();
    this._step2();
    let step = 3;
    do {
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
    } while (step != 7);
    console.log(toString(this.mat, this.mask));
  }
  _step1() {
    const mat2 = this.mat;
    const Y = mat2.length;
    const X = mat2[0].length;
    for (let y = 0; y < Y; ++y) {
      const row = mat2[y];
      const min = getMin(row);
      for (let x = 0; x < X; ++x) {
        row[x] -= min;
      }
    }
  }
  _step2() {
    const mat2 = this.mat;
    const Y = mat2.length;
    const X = mat2[0].length;
    const covY = this.covY;
    const covX = this.covX;
    const mask = this.mask;
    for (let y = 0; y < Y; ++y) {
      if (covY[y]) {
        continue;
      }
      const row = mat2[y];
      for (let x = 0; x < X; ++x) {
        if (!covX[x] && row[x] == 0) {
          covX[x] = true;
          covY[y] = true;
          mask[y][x] = Zero.STAR;
        }
      }
    }
    this._resetCoverage();
  }
  _step3() {
    const mat2 = this.mat;
    const Y = mat2.length;
    const X = mat2[0].length;
    const covX = this.covX;
    const mask = this.mask;
    let covered = 0;
    for (let x = 0; x < X; ++x) {
      for (let y = 0; y < Y; ++y) {
        if (mask[y][x] == Zero.STAR) {
          covX[x] = true;
          ++covered;
          break;
        }
      }
    }
    return covered < X ? 4 : 7;
  }
  _step4() {
    const covY = this.covY;
    const covX = this.covX;
    const mask = this.mask;
    while (true) {
      let [y, x] = this._findUncoveredZero();
      if (y < 0) {
        return 6;
      }
      mask[y][x] = Zero.PRIME;
      const sx = this._findStarInRow(y);
      if (sx < 0) {
        this._step5(y, x);
        return 3;
      }
      covY[y] = true;
      covX[sx] = false;
    }
  }
  _step5(y, x) {
    const path = [y, x];
    while (true) {
      y = this._findStarInCol(x);
      if (y < 0) {
        break;
      }
      path.push(y, this._findPrimeInRow(y));
    }
    const mask = this.mask;
    const N = path.length;
    for (let i = 1; i < N; ++i) {
      y = path[i - (i & 1)];
      x = path[i - (i ^ 1)];
      mask[y][x] = mask[y][x] == Zero.STAR ? Zero.NONE : Zero.STAR;
    }
    this._resetCoverage();
    this._resetPrimes();
  }
  _step6() {
    const covY = this.covY;
    const covX = this.covX;
    const mat2 = this.mat;
    const Y = covY.length;
    const X = covX.length;
    const min = this._findMinUncovered();
    for (let y = 0; y < Y; ++y) {
      for (let x = 0; x < X; ++x) {
        if (covY[y]) {
          mat2[y][x] += min;
        }
        if (!covX[x]) {
          mat2[y][x] -= min;
        }
      }
    }
    return 4;
  }
  _findMinUncovered() {
    const covY = this.covY;
    const covX = this.covX;
    const mat2 = this.mat;
    const Y = covY.length;
    const X = covX.length;
    let min = Infinity;
    for (let y = 0; y < Y; ++y) {
      if (covY[y]) {
        continue;
      }
      const row = mat2[y];
      for (let x = 0; x < X; ++x) {
        if (!covX[x] && row[x] < min) {
          min = row[x];
        }
      }
    }
    return min;
  }
  _findPrimeInRow(y) {
    const row = this.mask[y];
    const X = row.length;
    for (let x = 0; x < X; ++x) {
      if (row[x] == Zero.PRIME) {
        return x;
      }
    }
    return -1;
  }
  _findStarInCol(x) {
    const mask = this.mask;
    const Y = mask.length;
    for (let y = 0; y < Y; ++y) {
      if (mask[y][x] == Zero.STAR) {
        return Y;
      }
    }
    return -1;
  }
  _findStarInRow(y) {
    const row = this.mask[y];
    const X = row.length;
    for (let x = 0; x < X; ++x) {
      if (row[x] == Zero.STAR) {
        return x;
      }
    }
    return -1;
  }
  _findUncoveredZero() {
    const mat2 = this.mat;
    const Y = mat2.length;
    const X = mat2[0].length;
    const covY = this.covY;
    const covX = this.covX;
    for (let y = 0; y < Y; ++y) {
      if (covY[y]) {
        continue;
      }
      const row = mat2[y];
      for (let x = 0; x < X; ++x) {
        if (!covX[x] && row[x] == 0) {
          return [y, x];
        }
      }
    }
    return [-1, -1];
  }
  _resetCoverage() {
    this.covX.fill(false);
    this.covY.fill(false);
  }
  _resetPrimes() {
    const mask = this.mask;
    const Y = mask.length;
    const X = mask[0].length;
    for (let y = 0; y < Y; ++y) {
      const row = mask[y];
      for (let x = 0; x < X; ++x) {
        if (row[x] == Zero.PRIME) {
          row[x] = Zero.NONE;
        }
      }
    }
  }
}
function toString(mat2, mask) {
  const buf = [];
  const Y = mat2.length;
  const X = mat2[0].length;
  let cw = -Infinity;
  for (let y = 0; y < Y; ++y) {
    for (let x = 0; x < X; ++x) {
      cw = Math.max(cw, mat2[y][x]);
    }
  }
  cw = `${cw}`.length + 1;
  for (let y = 0; y < Y; ++y) {
    for (let x = 0; x < X; ++x) {
      let val = `${mat2[y][x]}`;
      switch (mask[y][x]) {
        case 1:
          val += "*";
        case 2:
          val += '"';
      }
      buf.push(val.padEnd(cw, " "));
    }
    buf.push("\n");
  }
  return buf.join(" ");
}
const mat = [
  [1, 2, 3],
  [2, 4, 6],
  [3, 6, 9]
];
const a = new Munkres(mat);
a.assign();
export {
  Munkres,
  Zero
};
//# sourceMappingURL=munkres.mjs.map
