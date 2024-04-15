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
function copy(matrix) {
  const Y = matrix.length;
  const dupe = new Array(Y);
  for (let y = 0; y < Y; ++y) {
    dupe[y] = matrix[y].slice(0);
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
function createCostMatrix(workers, jobs, costFn) {
  return create(workers, jobs, costFn);
}
function getMaxCost(costMatrix) {
  return getMax(costMatrix);
}
function getMinCost(costMatrix) {
  return getMin$1(costMatrix);
}
function invertCostMatrix(costMatrix, bigVal) {
  invert(costMatrix, bigVal);
}
function negateCostMatrix(costMatrix) {
  negate(costMatrix);
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
    matrix = copy(matrix);
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
    dualX[x] = row[x] === dy ? 0 : row[x] - dy;
  }
  for (let y = 1; y < Y; ++y) {
    dy = dualY[y];
    row = matrix[y];
    for (let x = 0; x < X; ++x) {
      const dx = row[x] === dy ? 0 : row[x] - dy;
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
    const dy = -dualY[y];
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      const dual = dualX[x] === dy ? 0 : dualX[x] - dy;
      if (starsX[x] === -1 && row[x] === dual) {
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
  const exposedX = new Uint32Array(X);
  const primeX = new Uint32Array(X);
  const slackV = new Array(X);
  const slackX = new Uint32Array(X);
  for (let rootY = 0; unmatched > 0; ++rootY) {
    if (starsY[rootY] !== -1) {
      continue;
    }
    coveredY[rootY] = unmatched;
    initExposed(exposedX);
    initSlack$1(rootY, matrix, dualX, dualY, slackV, slackX);
    while (true) {
      const [y, x, px] = findUncoveredMin$1(exposedX, slackV, slackX);
      if (slackV[x] > 0) {
        step6$1(slackV[x], unmatched, coveredY, dualX, dualY, exposedX, slackV);
      }
      primeX[x] = y;
      exposedX[x] = x + 1 < X ? exposedX[x + 1] : X;
      exposedX[px] = exposedX[x];
      if (starsX[x] === -1) {
        step5(x, primeX, starsX, starsY);
        --unmatched;
        break;
      }
      const sy = starsX[x];
      coveredY[sy] = unmatched;
      updateSlack$1(sy, matrix, dualX, dualY, exposedX, slackV, slackX);
    }
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
function step6$1(min, covV, coveredY, dualX, dualY, exposedX, slackV) {
  const X = dualX.length;
  const Y = dualY.length;
  for (let x = 0; x < X; ++x) {
    if (exposedX[x] === x) {
      slackV[x] = slackV[x] === min ? 0 : slackV[x] - min;
    } else {
      dualX[x] = dualX[x] === min ? 0 : dualX[x] - min;
    }
  }
  min = -min;
  for (let y = 0; y < Y; ++y) {
    if (coveredY[y] === covV) {
      dualY[y] = dualY[y] === min ? 0 : dualY[y] - min;
    }
  }
}
function initExposed(exposed) {
  const N = exposed.length;
  for (let i = 0; i < N; ++i) {
    exposed[i] = i;
  }
}
function findUncoveredMin$1(exposedX, slackV, slackX) {
  const X = slackV.length;
  let minP = 0;
  let minV = slackV[exposedX[minP]];
  for (let px = exposedX[0] + 1; px < X && exposedX[px] < X; ++px) {
    const x = exposedX[px];
    if (slackV[x] < minV) {
      minV = slackV[x];
      minP = px;
      if (minV === 0) {
        break;
      }
    }
    px = x;
  }
  const minX = exposedX[minP];
  return [slackX[minX], minX, minP];
}
function initSlack$1(y, matrix, dualX, dualY, slackV, slackX) {
  const dy = -dualY[y];
  const row = matrix[y];
  const X = slackX.length;
  slackX.fill(y);
  for (let x = 0; x < X; ++x) {
    const dual = dualX[x] === dy ? 0 : dualX[x] - dy;
    slackV[x] = row[x] === dual ? 0 : row[x] - dual;
  }
}
function updateSlack$1(y, matrix, dualX, dualY, exposedX, slackV, slackX) {
  const dy = -dualY[y];
  const row = matrix[y];
  const X = slackX.length;
  for (let x = 0; x < X && exposedX[x] < X; ++x) {
    x = exposedX[x];
    const dual = dualX[x] === dy ? 0 : dualX[x] - dy;
    const slack = row[x] === dual ? 0 : row[x] - dual;
    if (slack < slackV[x]) {
      slackV[x] = slack;
      slackX[x] = y;
    }
  }
}
function safeExec$1(matrix) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y > X) {
    matrix = copy(matrix);
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
    const dy = -dualY[y];
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      if (starsX[x] === -1 && row[x] === dualX[x] - dy) {
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
  const exposedX = new Uint32Array(X);
  const primeX = new Uint32Array(X);
  const slackV = new Array(X);
  const slackX = new Uint32Array(X);
  for (let rootY = 0; unmatched > 0; ++rootY) {
    if (starsY[rootY] !== -1) {
      continue;
    }
    coveredY[rootY] = unmatched;
    initExposed(exposedX);
    initSlack(rootY, matrix, dualX, dualY, slackV, slackX);
    while (true) {
      const [y, x, px] = findUncoveredMin(exposedX, slackV, slackX);
      if (slackV[x] > 0n) {
        step6(slackV[x], unmatched, coveredY, dualX, dualY, exposedX, slackV);
      }
      primeX[x] = y;
      exposedX[x] = x + 1 < X ? exposedX[x + 1] : X;
      exposedX[px] = exposedX[x];
      if (starsX[x] === -1) {
        step5(x, primeX, starsX, starsY);
        --unmatched;
        break;
      }
      const sy = starsX[x];
      coveredY[sy] = unmatched;
      updateSlack(sy, matrix, dualX, dualY, exposedX, slackV, slackX);
    }
  }
}
function step6(min, covV, coveredY, dualX, dualY, exposedX, slackV) {
  const X = dualX.length;
  const Y = dualY.length;
  for (let x = 0; x < X; ++x) {
    if (exposedX[x] === x) {
      slackV[x] -= min;
    } else {
      dualX[x] -= min;
    }
  }
  for (let y = 0; y < Y; ++y) {
    if (coveredY[y] === covV) {
      dualY[y] += min;
    }
  }
}
function findUncoveredMin(exposedX, slackV, slackX) {
  const X = slackV.length;
  let minP = 0;
  let minV = slackV[exposedX[minP]];
  for (let px = exposedX[0] + 1; px < X && exposedX[px] < X; ++px) {
    const x = exposedX[px];
    if (slackV[x] < minV) {
      minV = slackV[x];
      minP = px;
      if (minV === 0n) {
        break;
      }
    }
    px = x;
  }
  const minX = exposedX[minP];
  return [slackX[minX], minX, minP];
}
function initSlack(y, matrix, dualX, dualY, slackV, slackX) {
  const dy = dualY[y];
  const row = matrix[y];
  const X = slackX.length;
  slackX.fill(y);
  for (let x = 0; x < X; ++x) {
    slackV[x] = row[x] - dualX[x] - dy;
  }
}
function updateSlack(y, matrix, dualX, dualY, exposedX, slackV, slackX) {
  const dy = dualY[y];
  const row = matrix[y];
  const X = slackX.length;
  for (let x = 0; x < X && exposedX[x] < X; ++x) {
    x = exposedX[x];
    const slack = row[x] - dualX[x] - dy;
    if (slack < slackV[x]) {
      slackV[x] = slack;
      slackX[x] = y;
    }
  }
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
exports.createCostMatrix = createCostMatrix;
exports.default = munkres;
exports.getMaxCost = getMaxCost;
exports.getMinCost = getMinCost;
exports.invertCostMatrix = invertCostMatrix;
exports.munkres = munkres;
exports.negateCostMatrix = negateCostMatrix;
//# sourceMappingURL=munkres.cjs.map
