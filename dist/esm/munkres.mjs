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
  return getMin$1(costMatrix);
}
function invertCostMatrix(costMatrix, bigVal) {
  invert(costMatrix, bigVal);
}
function negateCostMatrix(costMatrix) {
  negate(costMatrix);
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
function step1$1(matrix, dualX, dualY) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y <= X) {
    for (let y = 0; y < Y; ++y) {
      dualY[y] = getMin(matrix[y]);
    }
  }
  if (Y >= X) {
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
function step4(matrix) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y > X) {
    throw new RangeError("invalid MxN matrix: M > N");
  }
  const dualX = new Array(X).fill(0);
  const dualY = new Array(Y).fill(0);
  step1$1(matrix, dualX, dualY);
  const starsX = new Array(X).fill(-1);
  const starsY = new Array(Y).fill(-1);
  let stars = steps2To3$1(matrix, dualX, dualY, starsX, starsY);
  if (stars >= Y) {
    return starsY;
  }
  const coveredX = new Array(X);
  const coveredY = new Array(Y).fill(-1);
  const slackV = new Array(X);
  const slackX = new Array(X);
  const exposedX = new Array(X);
  for (let rootY = 0; stars < Y; ++rootY) {
    if (starsY[rootY] !== -1) {
      continue;
    }
    coveredX.fill(-1);
    coveredY[rootY] = rootY;
    initExposed(exposedX);
    initSlack$1(rootY, matrix, dualX, dualY, slackV, slackX);
    while (true) {
      const [y, x] = findUncoveredMin(exposedX, slackV, slackX);
      if (slackV[x] > 0) {
        step6$1(slackV[x], rootY, coveredX, coveredY, dualX, dualY, slackV);
      }
      coveredX[x] = y;
      cover(exposedX, x);
      if (starsX[x] === -1) {
        step5(x, coveredX, starsX, starsY);
        ++stars;
        break;
      }
      const sy = starsX[x];
      coveredY[sy] = rootY;
      updateSlack$1(sy, matrix, dualX, dualY, exposedX, slackV, slackX);
    }
  }
  return starsY;
}
function step5(x, coveredX, starX, starY) {
  do {
    const y = coveredX[x];
    const sx = starY[y];
    starX[x] = y;
    starY[y] = x;
    x = sx;
  } while (x !== -1);
}
function step6$1(min, rootY, coveredX, coveredY, dualX, dualY, slackV) {
  const X = dualX.length;
  const Y = dualY.length;
  for (let y = 0; y < Y; ++y) {
    if (coveredY[y] === rootY) {
      dualY[y] = dualY[y] === -min ? 0 : dualY[y] + min;
    }
  }
  for (let x = 0; x < X; ++x) {
    if (coveredX[x] === -1) {
      slackV[x] = slackV[x] === min ? 0 : slackV[x] - min;
    } else {
      dualX[x] = dualX[x] === min ? 0 : dualX[x] - min;
    }
  }
}
function initExposed(exposed) {
  const N = exposed.length;
  for (let i = 0; i < N; ++i) {
    exposed[i] = i;
  }
}
function cover(exposed, i) {
  const N = exposed.length;
  const next = i + 1 < N ? exposed[i + 1] : N;
  for (let j = i; j >= 0 && exposed[j] === i; --j) {
    exposed[j] = next;
  }
}
function findUncoveredMin(exposedX, slackV, slackX) {
  const X = slackV.length;
  let minX = exposedX[0];
  let minV = slackV[minX];
  for (let x = minX + 1; x < X && exposedX[x] < X; ++x) {
    x = exposedX[x];
    if (slackV[x] < minV) {
      minV = slackV[x];
      minX = x;
      if (minV === 0) {
        break;
      }
    }
  }
  return [slackX[minX], minX];
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
function step1(matrix, dualX, dualY) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y <= X) {
    for (let y = 0; y < Y; ++y) {
      dualY[y] = getMin(matrix[y]);
    }
  }
  if (Y >= X) {
    for (let x = 0; x < X; ++x) {
      dualX[x] = matrix[0][x] - dualY[0];
    }
    for (let y = 1; y < Y; ++y) {
      const row = matrix[y];
      const dy = dualY[y];
      for (let x = 0; x < X; ++x) {
        if (row[x] - dy < dualX[x]) {
          dualX[x] = row[x] - dy;
        }
      }
    }
  }
}
function steps2To3(matrix, dualX, dualY, starsX, starsY) {
  const X = dualX.length;
  const Y = dualY.length;
  let stars = 0;
  for (let y = 0; y < Y; ++y) {
    const row = matrix[y];
    const dy = dualY[y];
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
function bigStep4(matrix) {
  var _a;
  const Y = matrix.length;
  const X = ((_a = matrix[0]) == null ? void 0 : _a.length) ?? 0;
  if (Y > X) {
    throw new RangeError("invalid MxN matrix: M > N");
  }
  const dualX = new Array(X).fill(0n);
  const dualY = new Array(Y).fill(0n);
  step1(matrix, dualX, dualY);
  const starsX = new Array(X).fill(-1);
  const starsY = new Array(Y).fill(-1);
  let stars = steps2To3(matrix, dualX, dualY, starsX, starsY);
  if (stars >= Y) {
    return starsY;
  }
  const coveredX = new Array(X);
  const coveredY = new Array(Y).fill(-1);
  const slackV = new Array(X);
  const slackX = new Array(X);
  const exposedX = new Array(X);
  for (let rootY = 0; stars < Y; ++rootY) {
    if (starsY[rootY] !== -1) {
      continue;
    }
    coveredX.fill(-1);
    coveredY[rootY] = rootY;
    initExposed(exposedX);
    initSlack(rootY, matrix, dualX, dualY, slackV, slackX);
    while (true) {
      const [y, x] = findUncoveredMin(exposedX, slackV, slackX);
      if (slackV[x] > 0n) {
        step6(slackV[x], rootY, coveredX, coveredY, dualX, dualY, slackV);
      }
      coveredX[x] = y;
      cover(exposedX, x);
      if (starsX[x] === -1) {
        step5(x, coveredX, starsX, starsY);
        ++stars;
        break;
      }
      const sy = starsX[x];
      coveredY[sy] = rootY;
      updateSlack(sy, matrix, dualX, dualY, exposedX, slackV, slackX);
    }
  }
  return starsY;
}
function step6(min, rootY, coveredX, coveredY, dualX, dualY, slackV) {
  const X = dualX.length;
  const Y = dualY.length;
  for (let y = 0; y < Y; ++y) {
    if (coveredY[y] === rootY) {
      dualY[y] += min;
    }
  }
  for (let x = 0; x < X; ++x) {
    if (coveredX[x] === -1) {
      slackV[x] -= min;
    } else {
      dualX[x] -= min;
    }
  }
}
function initSlack(y, matrix, dualX, dualY, slackV, slackX) {
  const X = slackV.length;
  const row = matrix[y];
  const dy = dualY[y];
  slackX.fill(y);
  for (let x = 0; x < X; ++x) {
    slackV[x] = row[x] - dualX[x] - dy;
  }
}
function updateSlack(y, matrix, dualX, dualY, exposedX, slackV, slackX) {
  const X = slackV.length;
  const row = matrix[y];
  const dy = dualY[y];
  for (let x = 0; x < X && exposedX[x] < X; ++x) {
    x = exposedX[x];
    const slack = row[x] - dualX[x] - dy;
    if (slack < slackV[x]) {
      slackV[x] = slack;
      slackX[x] = y;
    }
  }
}
function isBigInt(value) {
  return typeof value === "bigint";
}
function munkres(costMatrix) {
  var _a;
  const Y = costMatrix.length;
  const X = ((_a = costMatrix[0]) == null ? void 0 : _a.length) ?? 0;
  if (X <= 0) {
    return [];
  }
  if (Y > X) {
    costMatrix = copy(costMatrix);
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
export {
  createCostMatrix,
  munkres as default,
  getMaxCost,
  getMinCost,
  invertCostMatrix,
  munkres,
  negateCostMatrix
};
//# sourceMappingURL=munkres.mjs.map
