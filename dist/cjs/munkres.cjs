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
function getMin$1(array) {
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
function isBigInt(value) {
  return typeof value === "bigint";
}
function copy(matrix) {
  const Y = matrix.length;
  const dupe = new Array(Y);
  for (let y = 0; y < Y; ++y) {
    dupe[y] = Array.from(matrix[y]);
  }
  return dupe;
}
function create(rows, columns, callbackFn) {
  const Y = rows.length;
  const X = columns.length;
  const mat = new Array(Y);
  for (let y = 0; y < Y; ++y) {
    const row = new Array(X);
    for (let x = 0; x < X; ++x) {
      row[x] = callbackFn(rows[y], columns[x]);
    }
    mat[y] = row;
  }
  return mat;
}
function flipH(matrix) {
  const Y = matrix.length;
  for (let y = 0; y < Y; ++y) {
    matrix[y].reverse();
  }
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
function getMax(matrix) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y <= 0 || X <= 0) {
    return void 0;
  }
  let max = matrix[0][0];
  for (let y = 0; y < Y; ++y) {
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      if (max < row[x]) {
        max = row[x];
      }
    }
  }
  return max;
}
function getMin(matrix) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y <= 0 || X <= 0) {
    return void 0;
  }
  let min = matrix[0][0];
  for (let y = 0; y < Y; ++y) {
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      if (min > row[x]) {
        min = row[x];
      }
    }
  }
  return min;
}
function invert(matrix, bigVal) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y <= 0 || X <= 0) {
    return void 0;
  }
  bigVal = bigVal ?? getMax(matrix);
  for (let y = 0; y < Y; ++y) {
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      row[x] = bigVal - row[x];
    }
  }
}
function negate(matrix) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  for (let y = 0; y < Y; ++y) {
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      row[x] = -row[x];
    }
  }
}
function reduceCols(matrix) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  if (X <= 0) {
    return;
  }
  for (let x = 0; x < X; ++x) {
    const min = getColMin(matrix, x);
    if (isBigInt(min) || isFinite(min)) {
      for (let y = 0; y < Y; ++y) {
        matrix[y][x] = matrix[y][x] - min;
      }
    } else {
      for (let y = 0; y < Y; ++y) {
        matrix[y][x] = matrix[y][x] == min ? 0 : Infinity;
      }
    }
  }
}
function reduceRows(matrix) {
  const Y = matrix.length;
  for (let y = 0; y < Y; ++y) {
    const row = matrix[y];
    const min = getMin$1(row);
    if (min == null) {
      continue;
    }
    const X = row.length;
    if (isBigInt(min) || isFinite(min)) {
      for (let x = 0; x < X; ++x) {
        row[x] = row[x] - min;
      }
    } else {
      for (let x = 0; x < X; ++x) {
        row[x] = row[x] == min ? 0 : Infinity;
      }
    }
  }
}
function transpose(matrix) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  const N = Math.min(Y, X);
  for (let y = 1; y < N; ++y) {
    for (let x = 0; x < y; ++x) {
      const temp = matrix[y][x];
      matrix[y][x] = matrix[x][y];
      matrix[x][y] = temp;
    }
  }
  if (Y > X) {
    for (let y = 0; y < X; ++y) {
      matrix[y].length = Y;
      for (let x = X; x < Y; ++x) {
        matrix[y][x] = matrix[x][y];
      }
    }
    matrix.length = X;
  }
  if (Y < X) {
    matrix.length = X;
    for (let y = Y; y < X; ++y) {
      matrix[y] = new Array(Y);
      for (let x = 0; x < Y; ++x) {
        matrix[y][x] = matrix[x][y];
      }
    }
    for (let y = 0; y < Y; ++y) {
      matrix[y].length = Y;
    }
  }
}
function createCostMatrix(workers, jobs, costFn) {
  return create(workers, jobs, costFn);
}
function getMaxCost(costMatrix) {
  return getMax(costMatrix);
}
function getMinCost(costMatrix) {
  return getMin(costMatrix);
}
function invertCostMatrix(costMatrix, bigVal) {
  invert(costMatrix, bigVal);
}
function negateCostMatrix(costMatrix) {
  negate(costMatrix);
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
  var _a;
  const Y = mat.length;
  const X = ((_a = mat[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y <= X) {
    reduceRows(mat);
  }
  if (Y >= X) {
    reduceCols(mat);
  }
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
function step4(mat) {
  var _a;
  const Y = mat.length;
  const X = ((_a = mat[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y > X) {
    throw new RangeError("invalid NxM matrix: N > M");
  }
  const starX = new Array(X).fill(-1);
  const starY = new Array(Y).fill(-1);
  const primeY = new Array(Y).fill(-1);
  step1(mat);
  let stars = steps2To3(mat, starX, starY);
  while (stars < Y) {
    const [y, x] = findUncoveredZeroOrMin(mat, primeY, starX);
    if (mat[y][x] != 0) {
      step6(mat[y][x], mat, primeY, starX);
    }
    primeY[y] = x;
    if (starY[y] < 0) {
      step5(y, primeY, starX, starY);
      primeY.fill(-1);
      ++stars;
    }
  }
  return starY;
}
function step5(y, primeY, starX, starY) {
  if (primeY[y] < 0) {
    throw new Error("Input must be prime.");
  }
  do {
    const x = primeY[y];
    const sy = starX[x];
    starX[x] = y;
    starY[y] = x;
    y = sy;
  } while (y >= 0);
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
function bigFindUncoveredZeroOrMin(mat, primeY, starX) {
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
      if (vals[x] == 0n) {
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
function bigSteps2To3(mat, starX, starY) {
  const X = starX.length;
  const Y = starY.length;
  let stars = 0;
  for (let y = 0; y < Y; ++y) {
    const vals = mat[y];
    for (let x = 0; x < X; ++x) {
      if (vals[x] == 0n && starX[x] < 0) {
        starX[x] = y;
        starY[y] = x;
        ++stars;
        break;
      }
    }
  }
  return stars;
}
function bigStep4(mat) {
  var _a;
  const Y = mat.length;
  const X = ((_a = mat[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y > X) {
    throw new RangeError("invalid NxM matrix: N > M");
  }
  const starX = new Array(X).fill(-1);
  const starY = new Array(Y).fill(-1);
  const primeY = new Array(Y).fill(-1);
  step1(mat);
  let stars = bigSteps2To3(mat, starX, starY);
  while (stars < Y) {
    const [y, x] = bigFindUncoveredZeroOrMin(mat, primeY, starX);
    if (mat[y][x] != 0n) {
      bigStep6(mat[y][x], mat, primeY, starX);
    }
    primeY[y] = x;
    if (starY[y] < 0) {
      step5(y, primeY, starX, starY);
      primeY.fill(-1);
      ++stars;
    }
  }
  return starY;
}
function bigStep6(min, mat, primeY, starX) {
  const X = starX.length;
  const Y = primeY.length;
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
function munkres(costMatrix) {
  var _a;
  const Y = costMatrix.length;
  const X = ((_a = costMatrix[0]) == null ? void 0 : _a.length) ?? 0;
  if (X <= 0) {
    return [];
  }
  costMatrix = copy(costMatrix);
  if (Y > X) {
    transpose(costMatrix);
  }
  const y2x = isBigInt(costMatrix[0][0]) ? bigStep4(costMatrix) : step4(costMatrix);
  const P = y2x.length;
  const pairs = new Array(P);
  for (let y = 0; y < P; ++y) {
    pairs[y] = [y, y2x[y]];
  }
  if (Y > X) {
    flipH(pairs);
  }
  return pairs;
}
exports.createCostMatrix = createCostMatrix;
exports.getMaxCost = getMaxCost;
exports.getMinCost = getMinCost;
exports.invertCostMatrix = invertCostMatrix;
exports.munkres = munkres;
exports.negateCostMatrix = negateCostMatrix;
//# sourceMappingURL=munkres.cjs.map
