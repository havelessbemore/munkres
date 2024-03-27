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
"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
function getMin(array) {
  const N = array.length;
  if (N <= 0) {
    return void 0;
  }
  let min = array[0];
  for (let i = 1; i < N; ++i) {
    if (min > array[i]) {
      min = array[i];
    }
  }
  return min;
}
function copy(matrix) {
  const Y = matrix.length;
  const dupe = new Array(Y);
  for (let y = 0; y < Y; ++y) {
    dupe[y] = Array.from(matrix[y]);
  }
  return dupe;
}
function getColMin(matrix, x) {
  const Y = matrix.length;
  if (Y <= 0 || x < 0 || x >= matrix[0].length) {
    return void 0;
  }
  let min = matrix[0][x];
  for (let y = 1; y < Y; ++y) {
    if (min > matrix[y][x]) {
      min = matrix[y][x];
    }
  }
  return min;
}
function map(matrix, callbackFn) {
  const Y = matrix.length;
  const out = new Array(Y);
  for (let y = 0; y < Y; ++y) {
    const from = matrix[y];
    const X = from.length;
    const to = new Array(X);
    for (let x = 0; x < X; ++x) {
      to[x] = callbackFn(from[x], y, x, matrix);
    }
    out[y] = to;
  }
  return out;
}
function createCostMatrix(workers, jobs, costFn) {
  const X = jobs.length;
  const Y = workers.length;
  const mat = new Array(Y);
  for (let y = 0; y < Y; ++y) {
    const row = new Array(X);
    for (let x = 0; x < X; ++x) {
      row[x] = costFn(workers[y], jobs[x]);
    }
    mat[y] = row;
  }
  return mat;
}
function getMaxCost(mat) {
  var _a;
  const Y = mat.length;
  const X = ((_a = mat[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y <= 0 || X <= 0) {
    return void 0;
  }
  let max = mat[0][0];
  for (let y = 0; y < Y; ++y) {
    const row = mat[y];
    for (let x = 0; x < X; ++x) {
      if (max < row[x]) {
        max = row[x];
      }
    }
  }
  return max;
}
function getMinCost(mat) {
  var _a;
  const Y = mat.length;
  const X = ((_a = mat[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y <= 0 || X <= 0) {
    return void 0;
  }
  let min = mat[0][0];
  for (let y = 0; y < Y; ++y) {
    const row = mat[y];
    for (let x = 0; x < X; ++x) {
      if (min > row[x]) {
        min = row[x];
      }
    }
  }
  return min;
}
function invertCostMatrix(mat, bigVal) {
  var _a;
  const Y = mat.length;
  const X = ((_a = mat[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y <= 0 || X <= 0) {
    return void 0;
  }
  bigVal = bigVal ?? getMaxCost(mat);
  for (let y = 0; y < Y; ++y) {
    const row = mat[y];
    for (let x = 0; x < X; ++x) {
      row[x] = bigVal - row[x];
    }
  }
}
function negateCostMatrix(mat) {
  var _a;
  const Y = mat.length;
  const X = ((_a = mat[0]) == null ? void 0 : _a.length) ?? 0;
  for (let y = 0; y < Y; ++y) {
    const row = mat[y];
    for (let x = 0; x < X; ++x) {
      row[x] = -row[x];
    }
  }
}
function reduceCols(mat) {
  var _a;
  const Y = mat.length;
  const X = ((_a = mat[0]) == null ? void 0 : _a.length) ?? 0;
  for (let x = 0; x < X; ++x) {
    const min = getColMin(mat, x);
    if (isFinite(min)) {
      for (let y = 0; y < Y; ++y) {
        mat[y][x] -= min;
      }
    } else {
      for (let y = 0; y < Y; ++y) {
        mat[y][x] = mat[y][x] == min ? 0 : Infinity;
      }
    }
  }
}
function reduceRows(mat) {
  var _a;
  const Y = mat.length;
  const X = ((_a = mat[0]) == null ? void 0 : _a.length) ?? 0;
  for (let y = 0; y < Y; ++y) {
    const row = mat[y];
    const min = getMin(row);
    if (isFinite(min)) {
      for (let x = 0; x < X; ++x) {
        row[x] -= min;
      }
    } else {
      for (let x = 0; x < X; ++x) {
        row[x] = row[x] == min ? 0 : Infinity;
      }
    }
  }
}
function findUncoveredZeroOrMin(mat, primeY, starX) {
  const X = starX.length;
  const Y = primeY.length;
  let minX = -1;
  let minY = -1;
  let minV = void 0;
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
function step1(mat) {
  reduceRows(mat);
  reduceCols(mat);
}
function steps2To3(mat, starX, starY) {
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
function step4(mat, debug = false) {
  var _a;
  const starX = new Array(((_a = mat[0]) == null ? void 0 : _a.length) ?? 0).fill(-1);
  const starY = new Array(mat.length).fill(-1);
  const primeY = new Array(mat.length).fill(-1);
  debug && console.log("0:\n\n%s\n", toString(mat, starY, primeY));
  step1(mat);
  debug && console.log("1:\n\n%s\n", toString(mat, starY, primeY));
  let stars = steps2To3(mat, starX, starY);
  debug && console.log("2&3:\n\n%s\n", toString(mat, starY, primeY));
  const S = Math.min(starX.length, starY.length);
  while (stars < S) {
    const [y, x] = findUncoveredZeroOrMin(mat, primeY, starX);
    if (mat[y][x] != 0) {
      step6(mat[y][x], mat, primeY, starX);
      debug && console.log("6:\n\n%s\n", toString(mat, starY, primeY));
    }
    primeY[y] = x;
    debug && console.log("4:\n\n%s\n", toString(mat, starY, primeY));
    if (starY[y] < 0) {
      step5(y, primeY, starX, starY);
      ++stars;
      debug && console.log("5:\n\n%s\n", toString(mat, starY, primeY));
    }
  }
  return starY;
}
function step5(y, primeY, starX, starY) {
  if (primeY[y] < 0) {
    throw new Error("Input must be prime.");
  }
  let sy = y;
  while (sy >= 0) {
    const x = primeY[sy];
    y = sy;
    sy = starX[x];
    primeY[y] = -1;
    starX[x] = y;
    starY[y] = x;
  }
}
function step6(min, mat, primeY, starX) {
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
function step6Inf(mat, primeY, starX) {
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
function toString(mat, starY, primeY = []) {
  var _a;
  const strs = map(mat, (v) => `${v}`);
  const Y = strs.length;
  const X = ((_a = strs[0]) == null ? void 0 : _a.length) ?? 0;
  for (let y = 0; y < Y; ++y) {
    const row = strs[y];
    if (starY[y] >= 0) {
      row[starY[y]] = "*" + row[starY[y]];
    }
    if (primeY[y] >= 0) {
      row[primeY[y]] = '"' + row[primeY[y]];
    }
  }
  let width = 0;
  for (let y = 0; y < Y; ++y) {
    for (let x = 0; x < X; ++x) {
      width = Math.max(width, strs[y][x].length);
    }
  }
  for (let y = 0; y < Y; ++y) {
    const row = strs[y];
    for (let x = 0; x < X; ++x) {
      if (row[x].length < width) {
        row[x] = row[x].padStart(width, " ");
      }
    }
  }
  const buf = new Array(Y);
  for (let y = 0; y < Y; ++y) {
    buf[y] = `[${strs[y].join(", ")}]`;
  }
  return buf.join(",\n");
}
function munkres(mat, debug = false) {
  return Array.from(step4(copy(mat), debug).entries()).filter(
    ([, x]) => x >= 0
  );
}
exports.createCostMatrix = createCostMatrix;
exports.getMaxCost = getMaxCost;
exports.getMinCost = getMinCost;
exports.invertCostMatrix = invertCostMatrix;
exports.munkres = munkres;
exports.negateCostMatrix = negateCostMatrix;
//# sourceMappingURL=munkres.cjs.map
