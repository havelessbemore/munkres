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
      const row = matrix[y];
      row.length = Y;
      for (let x = X; x < Y; ++x) {
        row[x] = matrix[x][y];
      }
    }
    matrix.length = X;
  }
  if (Y < X) {
    matrix.length = X;
    for (let y = Y; y < X; ++y) {
      const row = new Array(Y);
      for (let x = 0; x < Y; ++x) {
        row[x] = matrix[x][y];
      }
      matrix[y] = row;
    }
    for (let y = 0; y < Y; ++y) {
      matrix[y].length = Y;
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
function isBigInt(value) {
  return typeof value === "bigint";
}
function safeExec$2(matrix) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y > X) {
    matrix = from(matrix);
    transpose(matrix);
  }
  return exec$1(matrix);
}
function exec$1(matrix) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y <= 0 || X <= 0) {
    return { dualX: [], dualY: [], starsX: [], starsY: [] };
  }
  if (Y > X) {
    throw new RangeError("invalid MxN matrix: M > N");
  }
  const dualX = new Array(X);
  const dualY = new Array(Y);
  step1$1(matrix, dualX, dualY);
  const starsX = new Array(X).fill(-1);
  const starsY = new Array(Y).fill(-1);
  const stars = steps2To3$1(matrix, dualX, dualY, starsX, starsY);
  step4$1(Y - stars, matrix, dualX, dualY, starsX, starsY);
  return { dualX, dualY, starsX, starsY };
}
function step1$1(matrix, dualX, dualY) {
  const X = dualX.length;
  const Y = dualY.length;
  for (let y = 0; y < Y; ++y) {
    dualY[y] = getMin(matrix[y]);
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
function steps2To3$1(matrix, dualX, dualY, starsX, starsY) {
  const X = dualX.length;
  const Y = dualY.length;
  let stars = 0;
  for (let y = 0; y < Y; ++y) {
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
function step4$1(unmatched, matrix, dualX, dualY, starsX, starsY) {
  if (unmatched <= 0) {
    return;
  }
  const X = dualX.length;
  const Y = dualY.length;
  const coveredY = new Uint32Array(Y);
  const slack = new Uint32Array(X);
  const slackV = new Array(X);
  const slackX = new Uint32Array(X);
  for (let rootY = 0; unmatched > 0; ++rootY) {
    if (starsY[rootY] !== -1) {
      continue;
    }
    let zeros = initSlack$1(rootY, matrix, dualX, dualY, slack, slackV, slackX);
    coveredY[0] = rootY;
    let step = 0;
    do {
      if (step >= zeros) {
        const min = findUncoveredMin(zeros, slack, slackV);
        zeros = partition(min, zeros, slack, slackV);
      }
      const x = slack[step++];
      if (starsX[x] === -1) {
        step5(x, slackX, starsX, starsY);
        step6$1(step, slackV[x], coveredY, dualX, dualY, slack, slackV);
        --unmatched;
        break;
      }
      coveredY[step] = starsX[x];
      zeros = updateSlack$1(
        starsX[x],
        zeros,
        slackV[x],
        matrix,
        dualX,
        dualY,
        slack,
        slackV,
        slackX
      );
    } while (true);
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
function step6$1(N, min, coveredY, dualX, dualY, slack, slackV) {
  let prev = 0;
  for (let i = 0; i < N; ++i) {
    let j = coveredY[i];
    dualY[j] = dualY[j] + (min - prev || 0) || 0;
    j = slack[i];
    prev = slackV[j];
    dualX[j] = dualX[j] - (min - prev || 0) || 0;
  }
}
function partition(pivot, min, slack, slackV) {
  const max = slack.length;
  for (let i = min; i < max; ++i) {
    const x = slack[i];
    if (slackV[x] === pivot) {
      slack[i] = slack[min];
      slack[min++] = x;
    }
  }
  return min;
}
function findUncoveredMin(mid, slack, slackV) {
  const X = slack.length;
  let minV = slackV[slack[mid]];
  for (let i = mid + 1; i < X; ++i) {
    if (slackV[slack[i]] < minV) {
      minV = slackV[slack[i]];
    }
  }
  return minV;
}
function initSlack$1(y, matrix, dualX, dualY, slack, slackV, slackX) {
  const dy = dualY[y];
  const row = matrix[y];
  const X = slack.length;
  let zeros = 0;
  for (let x = 0; x < X; ++x) {
    slack[x] = x;
    slackX[x] = y;
    slackV[x] = row[x] - (dualX[x] + dy || 0) || 0;
    if (slackV[x] === 0) {
      slack[x] = slack[zeros];
      slack[zeros++] = x;
    }
  }
  return zeros;
}
function updateSlack$1(y, midS, minV, matrix, dualX, dualY, slack, slackV, slackX) {
  const dy = dualY[y];
  const row = matrix[y];
  const X = slack.length;
  for (let i = midS; i < X; ++i) {
    const x = slack[i];
    const value = (row[x] - (dualX[x] + dy || 0) || 0) + minV || 0;
    if (value < slackV[x]) {
      if (value === minV) {
        slack[i] = slack[midS];
        slack[midS++] = x;
      }
      slackV[x] = value;
      slackX[x] = y;
    }
  }
  return midS;
}
function safeExec$1(matrix) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y > X) {
    matrix = from(matrix);
    transpose(matrix);
  }
  return exec(matrix);
}
function exec(matrix) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y <= 0 || X <= 0) {
    return { dualX: [], dualY: [], starsX: [], starsY: [] };
  }
  if (Y > X) {
    throw new RangeError("invalid MxN matrix: M > N");
  }
  const dualX = new Array(X);
  const dualY = new Array(Y);
  step1(matrix, dualX, dualY);
  const starsX = new Array(X).fill(-1);
  const starsY = new Array(Y).fill(-1);
  const stars = steps2To3(matrix, dualX, dualY, starsX, starsY);
  step4(Y - stars, matrix, dualX, dualY, starsX, starsY);
  return { dualX, dualY, starsX, starsY };
}
function step1(matrix, dualX, dualY) {
  const X = dualX.length;
  const Y = dualY.length;
  for (let y = 0; y < Y; ++y) {
    dualY[y] = getMin(matrix[y]);
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
function steps2To3(matrix, dualX, dualY, starsX, starsY) {
  const X = dualX.length;
  const Y = dualY.length;
  let stars = 0;
  for (let y = 0; y < Y; ++y) {
    const dy = dualY[y];
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      if (starsX[x] === -1 && row[x] === dualX[x] + dy) {
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
  const Y = dualY.length;
  const coveredY = new Uint32Array(Y);
  const slack = new Uint32Array(X);
  const slackV = new Array(X);
  const slackX = new Uint32Array(X);
  for (let rootY = 0; unmatched > 0; ++rootY) {
    if (starsY[rootY] !== -1) {
      continue;
    }
    let zeros = initSlack(rootY, matrix, dualX, dualY, slack, slackV, slackX);
    coveredY[0] = rootY;
    let step = 0;
    do {
      if (step >= zeros) {
        const min = findUncoveredMin(zeros, slack, slackV);
        zeros = partition(min, zeros, slack, slackV);
      }
      const x = slack[step++];
      if (starsX[x] === -1) {
        step5(x, slackX, starsX, starsY);
        step6(step, slackV[x], coveredY, dualX, dualY, slack, slackV);
        --unmatched;
        break;
      }
      coveredY[step] = starsX[x];
      zeros = updateSlack(
        starsX[x],
        zeros,
        slackV[x],
        matrix,
        dualX,
        dualY,
        slack,
        slackV,
        slackX
      );
    } while (true);
  }
}
function step6(N, min, coveredY, dualX, dualY, slack, slackV) {
  let prev = 0n;
  for (let i = 0; i < N; ++i) {
    const x = slack[i];
    dualY[coveredY[i]] += min - prev;
    prev = slackV[x];
    dualX[x] -= min - prev;
  }
}
function initSlack(y, matrix, dualX, dualY, slack, slackV, slackX) {
  const dy = dualY[y];
  const row = matrix[y];
  const X = slack.length;
  let zeros = 0;
  for (let x = 0; x < X; ++x) {
    slack[x] = x;
    slackX[x] = y;
    slackV[x] = row[x] - dualX[x] - dy;
    if (slackV[x] === 0n) {
      slack[x] = slack[zeros];
      slack[zeros++] = x;
    }
  }
  return zeros;
}
function updateSlack(y, midS, minV, matrix, dualX, dualY, slack, slackV, slackX) {
  const dy = dualY[y] - minV;
  const row = matrix[y];
  const X = slack.length;
  for (let i = midS; i < X; ++i) {
    const x = slack[i];
    const value = row[x] - dualX[x] - dy;
    if (value < slackV[x]) {
      if (value === minV) {
        slack[i] = slack[midS];
        slack[midS++] = x;
      }
      slackV[x] = value;
      slackX[x] = y;
    }
  }
  return midS;
}
function safeExec(matrix) {
  return isBigInt((matrix[0] ?? [])[0]) ? safeExec$1(matrix) : safeExec$2(matrix);
}
function munkres(costMatrix) {
  var _a;
  const { starsY } = safeExec(costMatrix);
  const pairs = entries(starsY);
  if (costMatrix.length > (((_a = costMatrix[0]) == null ? void 0 : _a.length) ?? 0)) {
    flipH(pairs);
  }
  return pairs;
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
