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
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
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
function getMin$1(matrix) {
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
function from(matrix) {
  const Y = matrix.length;
  const dupe = new Array(Y);
  for (let y = 0; y < Y; ++y) {
    const rowA = matrix[y];
    const X = rowA.length;
    const rowB = new Array(X);
    for (let x = 0; x < X; ++x) {
      rowB[x] = rowA[x];
    }
    dupe[y] = rowB;
  }
  return dupe;
}
function gen(rows, cols, callbackFn) {
  const matrix = new Array(rows);
  for (let r = 0; r < rows; ++r) {
    const row = new Array(cols);
    for (let c = 0; c < cols; ++c) {
      row[c] = callbackFn(r, c);
    }
    matrix[r] = row;
  }
  return matrix;
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
function copyMatrix(matrix) {
  return from(matrix);
}
function createMatrix(rows, cols, callbackFn) {
  return create(rows, cols, callbackFn);
}
function genMatrix(rows, cols, callbackFn) {
  return gen(rows, cols, callbackFn);
}
function getMatrixMax(matrix) {
  return getMax(matrix);
}
function getMatrixMin(matrix) {
  return getMin$1(matrix);
}
function invertMatrix(matrix, bigVal) {
  invert(matrix, bigVal);
}
function negateMatrix(matrix) {
  negate(matrix);
}
function isBigInt(value) {
  return typeof value === "bigint";
}
function entries(array) {
  const N = array.length;
  const out = new Array(N);
  for (let i = 0; i < N; ++i) {
    out[i] = [i, array[i]];
  }
  return out;
}
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
function step4B$1(unmatched, matrix, dualX, dualY, starsX, starsY) {
  if (unmatched <= 0) {
    return;
  }
  const Y = dualY.length;
  const slack = new Uint32Array(Y);
  const slackV = new Array(Y);
  const slackX = new Uint32Array(Y);
  for (let rootX = 0; unmatched > 0; ++rootX) {
    if (starsX[rootX] !== -1) {
      continue;
    }
    let zeros = initStageB$1(rootX, matrix, dualX, dualY, slack, slackV, slackX);
    let steps = 1;
    let y;
    for (y = slack[0]; starsY[y] !== -1; y = slack[steps++]) {
      const x = starsY[y];
      const ds = slackV[y];
      const dx = dualX[x] - ds;
      for (let i = zeros; i < Y; ++i) {
        y = slack[i];
        const value = matrix[y][x] - dualY[y] - dx;
        if (value < slackV[y]) {
          if (value === ds) {
            slack[i] = slack[zeros];
            slack[zeros++] = y;
          }
          slackV[y] = value;
          slackX[y] = x;
        }
      }
      if (steps >= zeros) {
        zeros = zeroUncoveredMin(zeros, slack, slackV);
      }
    }
    step6B$1(rootX, steps, dualX, dualY, slack, slackV, starsY);
    step5B(y, slackX, starsX, starsY);
    --unmatched;
  }
}
function step5B(y, primeY, starsX, starsY) {
  do {
    const x = primeY[y];
    const sy = starsX[x];
    starsX[x] = y;
    starsY[y] = x;
    y = sy;
  } while (y !== -1);
}
function step6B$1(x, N, dualX, dualY, slack, slackV, starsY) {
  const sum = slackV[slack[N - 1]];
  let min = sum;
  for (let i = 0; i < N; ++i) {
    const y = slack[i];
    dualX[x] += min;
    min = sum - slackV[y];
    dualY[y] -= min;
    x = starsY[y];
  }
}
function initStageB$1(x, matrix, dualX, dualY, slack, slackV, slackX) {
  const dx = dualX[x];
  const Y = slack.length;
  let zeros = 0;
  for (let y = 0; y < Y; ++y) {
    slack[y] = y;
    slackX[y] = x;
    slackV[y] = matrix[y][x] - dualY[y] - dx;
    if (slackV[y] === 0n) {
      slack[y] = slack[zeros];
      slack[zeros++] = y;
    }
  }
  return zeros || zeroUncoveredMin(zeros, slack, slackV);
}
function exec$2(matrix) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  const dualX = new Array(X);
  const dualY = new Array(Y);
  step1$1(matrix, dualX, dualY);
  const starsX = new Array(X).fill(-1);
  const starsY = new Array(Y).fill(-1);
  const stars = steps2To3$1(matrix, dualX, dualY, starsX, starsY);
  Y <= X ? step4$1(Y - stars, matrix, dualX, dualY, starsX, starsY) : step4B$1(X - stars, matrix, dualX, dualY, starsX, starsY);
  return { dualX, dualY, matrix, starsX, starsY };
}
function step1$1(matrix, dualX, dualY) {
  const X = dualX.length;
  const Y = dualY.length;
  if (Y > X) {
    dualY.fill(0n);
  } else {
    for (let y = 0; y < Y; ++y) {
      dualY[y] = getMin(matrix[y]);
    }
  }
  if (Y < X) {
    dualX.fill(0n);
    return;
  }
  let dy = dualY[0];
  let row = matrix[0];
  for (let x = 0; x < X; ++x) {
    dualX[x] = row[x] - dy;
  }
  for (let y = 1; y < Y; ++y) {
    dy = dualY[y];
    row = matrix[y];
    for (let x = 0; x < X; ++x) {
      const dx = row[x] - dy;
      if (dx < dualX[x]) {
        dualX[x] = dx;
      }
    }
  }
}
function steps2To3$1(matrix, dualX, dualY, starsX, starsY) {
  const X = dualX.length;
  const Y = dualY.length;
  const S = Y <= X ? Y : X;
  let stars = 0;
  for (let y = 0; y < Y && stars < S; ++y) {
    const dy = dualY[y];
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      if (starsX[x] === -1 && dy === row[x] - dualX[x]) {
        starsX[x] = y;
        starsY[y] = x;
        ++stars;
        break;
      }
    }
  }
  return stars;
}
function step4$1(unmatched, matrix, dualX, dualY, starsX, starsY) {
  if (unmatched <= 0) {
    return;
  }
  const X = dualX.length;
  const slack = new Uint32Array(X);
  const slackV = new Array(X);
  const slackY = new Uint32Array(X);
  for (let rootY = 0; unmatched > 0; ++rootY) {
    if (starsY[rootY] !== -1) {
      continue;
    }
    let zeros = initStage$1(rootY, matrix, dualX, dualY, slack, slackV, slackY);
    let steps = 1;
    let x;
    for (x = slack[0]; starsX[x] !== -1; x = slack[steps++]) {
      const y = starsX[x];
      const ds = slackV[x];
      const dy = dualY[y] - ds;
      const row = matrix[y];
      for (let i = zeros; i < X; ++i) {
        x = slack[i];
        const value = row[x] - dualX[x] - dy;
        if (value < slackV[x]) {
          if (value === ds) {
            slack[i] = slack[zeros];
            slack[zeros++] = x;
          }
          slackV[x] = value;
          slackY[x] = y;
        }
      }
      if (steps >= zeros) {
        zeros = zeroUncoveredMin(zeros, slack, slackV);
      }
    }
    step6$1(rootY, steps, dualX, dualY, slack, slackV, starsX);
    step5(x, slackY, starsX, starsY);
    --unmatched;
  }
}
function step5(x, primeX, starsX, starsY) {
  do {
    const y = primeX[x];
    const sx = starsY[y];
    starsX[x] = y;
    starsY[y] = x;
    x = sx;
  } while (x !== -1);
}
function step6$1(y, N, dualX, dualY, slack, slackV, starsX) {
  const sum = slackV[slack[N - 1]];
  let min = sum;
  for (let i = 0; i < N; ++i) {
    const x = slack[i];
    dualY[y] += min;
    min = sum - slackV[x];
    dualX[x] -= min;
    y = starsX[x];
  }
}
function initStage$1(y, matrix, dualX, dualY, slack, slackV, slackY) {
  const dy = dualY[y];
  const row = matrix[y];
  const X = slack.length;
  let zeros = 0;
  for (let x = 0; x < X; ++x) {
    slack[x] = x;
    slackY[x] = y;
    slackV[x] = row[x] - dualX[x] - dy;
    if (slackV[x] === 0n) {
      slack[x] = slack[zeros];
      slack[zeros++] = x;
    }
  }
  return zeros || zeroUncoveredMin(zeros, slack, slackV);
}
function step4B(unmatched, matrix, dualX, dualY, starsX, starsY) {
  if (unmatched <= 0) {
    return;
  }
  const Y = dualY.length;
  const slack = new Uint32Array(Y);
  const slackV = new Array(Y);
  const slackX = new Uint32Array(Y);
  for (let rootX = 0; unmatched > 0; ++rootX) {
    if (starsX[rootX] !== -1) {
      continue;
    }
    let zeros = initStageB(rootX, matrix, dualX, dualY, slack, slackV, slackX);
    let steps = 1;
    let y;
    for (y = slack[0]; starsY[y] !== -1; y = slack[steps++]) {
      const x = starsY[y];
      const ds = slackV[y];
      const dx = dualX[x];
      for (let i = zeros; i < Y; ++i) {
        y = slack[i];
        const value = (matrix[y][x] - (dx + dualY[y] || 0) || 0) + ds || 0;
        if (value < slackV[y]) {
          if (value === ds) {
            slack[i] = slack[zeros];
            slack[zeros++] = y;
          }
          slackV[y] = value;
          slackX[y] = x;
        }
      }
      if (steps >= zeros) {
        zeros = zeroUncoveredMin(zeros, slack, slackV);
      }
    }
    step6B(rootX, steps, dualX, dualY, slack, slackV, starsY);
    step5B(y, slackX, starsX, starsY);
    --unmatched;
  }
}
function step6B(x, N, dualX, dualY, slack, slackV, starsY) {
  const sum = slackV[slack[N - 1]];
  let min = sum;
  for (let i = 0; i < N; ++i) {
    const y = slack[i];
    dualX[x] = dualX[x] + min || 0;
    min = sum - slackV[y] || 0;
    dualY[y] = dualY[y] - min || 0;
    x = starsY[y];
  }
}
function initStageB(x, matrix, dualX, dualY, slack, slackV, slackX) {
  const dx = dualX[x];
  const Y = slack.length;
  let zeros = 0;
  for (let y = 0; y < Y; ++y) {
    slack[y] = y;
    slackX[y] = x;
    slackV[y] = matrix[y][x] - (dx + dualY[y] || 0) || 0;
    if (slackV[y] === 0) {
      slack[y] = slack[zeros];
      slack[zeros++] = y;
    }
  }
  return zeros || zeroUncoveredMin(zeros, slack, slackV);
}
function exec$1(matrix) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  const dualX = new Array(X);
  const dualY = new Array(Y);
  step1(matrix, dualX, dualY);
  const starsX = new Array(X).fill(-1);
  const starsY = new Array(Y).fill(-1);
  const stars = steps2To3(matrix, dualX, dualY, starsX, starsY);
  Y <= X ? step4(Y - stars, matrix, dualX, dualY, starsX, starsY) : step4B(X - stars, matrix, dualX, dualY, starsX, starsY);
  return { dualX, dualY, matrix, starsX, starsY };
}
function step1(matrix, dualX, dualY) {
  const X = dualX.length;
  const Y = dualY.length;
  if (Y > X) {
    dualY.fill(0);
  } else {
    for (let y = 0; y < Y; ++y) {
      dualY[y] = getMin(matrix[y]);
    }
  }
  if (Y < X) {
    dualX.fill(0);
    return;
  }
  let dy = dualY[0];
  let row = matrix[0];
  for (let x = 0; x < X; ++x) {
    dualX[x] = row[x] - dy || 0;
  }
  for (let y = 1; y < Y; ++y) {
    dy = dualY[y];
    row = matrix[y];
    for (let x = 0; x < X; ++x) {
      const dx = row[x] - dy || 0;
      if (dx < dualX[x]) {
        dualX[x] = dx;
      }
    }
  }
}
function steps2To3(matrix, dualX, dualY, starsX, starsY) {
  const X = dualX.length;
  const Y = dualY.length;
  const S = Y <= X ? Y : X;
  let stars = 0;
  for (let y = 0; y < Y && stars < S; ++y) {
    const dy = dualY[y];
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      if (starsX[x] === -1 && row[x] === (dualX[x] + dy || 0)) {
        starsX[x] = y;
        starsY[y] = x;
        ++stars;
        break;
      }
    }
  }
  return stars;
}
function step4(unmatched, matrix, dualX, dualY, starsX, starsY) {
  if (unmatched <= 0) {
    return;
  }
  const X = dualX.length;
  const slack = new Uint32Array(X);
  const slackV = new Array(X);
  const slackY = new Uint32Array(X);
  for (let rootY = 0; unmatched > 0; ++rootY) {
    if (starsY[rootY] !== -1) {
      continue;
    }
    let zeros = initStage(rootY, matrix, dualX, dualY, slack, slackV, slackY);
    let steps = 1;
    let x;
    for (x = slack[0]; starsX[x] !== -1; x = slack[steps++]) {
      const y = starsX[x];
      const dy = dualY[y];
      const ds = slackV[x];
      const row = matrix[y];
      for (let i = zeros; i < X; ++i) {
        x = slack[i];
        const value = (row[x] - (dualX[x] + dy || 0) || 0) + ds || 0;
        if (value < slackV[x]) {
          if (value === ds) {
            slack[i] = slack[zeros];
            slack[zeros++] = x;
          }
          slackV[x] = value;
          slackY[x] = y;
        }
      }
      if (steps >= zeros) {
        zeros = zeroUncoveredMin(zeros, slack, slackV);
      }
    }
    step6(rootY, steps, dualX, dualY, slack, slackV, starsX);
    step5(x, slackY, starsX, starsY);
    --unmatched;
  }
}
function step6(y, N, dualX, dualY, slack, slackV, starsX) {
  const sum = slackV[slack[N - 1]];
  let min = sum;
  for (let i = 0; i < N; ++i) {
    const x = slack[i];
    dualY[y] = dualY[y] + min || 0;
    min = sum - slackV[x] || 0;
    dualX[x] = dualX[x] - min || 0;
    y = starsX[x];
  }
}
function initStage(y, matrix, dualX, dualY, slack, slackV, slackY) {
  const dy = dualY[y];
  const row = matrix[y];
  const X = slack.length;
  let zeros = 0;
  for (let x = 0; x < X; ++x) {
    slack[x] = x;
    slackY[x] = y;
    slackV[x] = row[x] - (dualX[x] + dy || 0) || 0;
    if (slackV[x] === 0) {
      slack[x] = slack[zeros];
      slack[zeros++] = x;
    }
  }
  return zeros || zeroUncoveredMin(zeros, slack, slackV);
}
function exec(matrix) {
  return isBigInt((matrix[0] ?? [])[0]) ? exec$2(matrix) : exec$1(matrix);
}
function zeroUncoveredMin(min, slack, slackV) {
  const max = slack.length;
  let mid = min + 1;
  let minZ = slack[min];
  for (let i = mid; i < max; ++i) {
    const z = slack[i];
    if (slackV[z] > slackV[minZ]) {
      continue;
    }
    if (slackV[z] < slackV[minZ]) {
      minZ = z;
      mid = min;
    }
    slack[i] = slack[mid];
    slack[mid++] = z;
  }
  return mid;
}
function toPairs(matching) {
  if (matching.starsY.length <= matching.starsX.length) {
    return entries(matching.starsY);
  }
  const pairs = entries(matching.starsX);
  flipH(pairs);
  return pairs;
}
function munkres(costMatrix) {
  return toPairs(exec(costMatrix));
}
exports.copyMatrix = copyMatrix;
exports.createMatrix = createMatrix;
exports.default = munkres;
exports.genMatrix = genMatrix;
exports.getMatrixMax = getMatrixMax;
exports.getMatrixMin = getMatrixMin;
exports.invertMatrix = invertMatrix;
exports.munkres = munkres;
exports.negateMatrix = negateMatrix;
//# sourceMappingURL=munkres.cjs.map
