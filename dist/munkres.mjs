/*!
 * munkres
 * https://github.com/havelessbemore/munkres
 *
 * MIT License
 *
 * Copyright (C) 2024-2026 Michael Rojas <dev.michael.rojas@gmail.com> (https://github.com/havelessbemore)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// src/utils/matrixLike.ts
function getMax(matrix) {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
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
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
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

// src/utils/matrix.ts
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
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
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
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
  for (let y = 0; y < Y; ++y) {
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      row[x] = -row[x];
    }
  }
}

// src/helpers.ts
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
  return getMin(matrix);
}
function invertMatrix(matrix, bigVal) {
  invert(matrix, bigVal);
}
function negateMatrix(matrix) {
  negate(matrix);
}

// src/utils/is.ts
function isBigInt(value) {
  return typeof value === "bigint";
}

// src/utils/inspectNumeric.ts
function inspectNumeric(matrix) {
  const Y = matrix.length;
  if (Y === 0) return {};
  const X = matrix[0]?.length ?? 0;
  if (X === 0) return {};
  let infinityAt;
  let rangeMin = Infinity;
  let rangeMax = -Infinity;
  for (let y = 0; y < Y; ++y) {
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      const v = row[x];
      if (v !== v) return { nanAt: [y, x] };
      if (v === Infinity || v === -Infinity) {
        if (!infinityAt) infinityAt = [y, x];
        continue;
      }
      if (v < rangeMin) rangeMin = v;
      if (v > rangeMax) rangeMax = v;
    }
  }
  return { infinityAt, rangeMin, rangeMax };
}

// src/utils/arrayLike.ts
function entries(array) {
  const N = array.length;
  const out = new Array(N);
  for (let i = 0; i < N; ++i) {
    out[i] = [i, array[i]];
  }
  return out;
}
function getMin2(array) {
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

// src/utils/mutableArrayLike.ts
function partitionByMin(indices, values, min = 0, max = indices.length) {
  let mid = min + 1;
  let minIndex = indices[min];
  for (let pos = mid; pos < max; ++pos) {
    const index = indices[pos];
    if (values[index] > values[minIndex]) {
      continue;
    }
    if (values[index] < values[minIndex]) {
      minIndex = index;
      mid = min;
    }
    indices[pos] = indices[mid];
    indices[mid++] = index;
  }
  return mid;
}

// src/core/bigMunkresB.ts
function step4B(unmatched, matrix, dualX, dualY, starsX, starsY) {
  if (unmatched <= 0) {
    return;
  }
  const Y = dualY.length;
  const slack = new Uint32Array(Y);
  const slackV = new Array(Y);
  const slackX = new Uint32Array(Y);
  for (let x = 0; unmatched > 0; ++x) {
    if (starsX[x] !== -1) {
      continue;
    }
    const N = matchB(x, matrix, dualX, dualY, starsY, slack, slackV, slackX);
    --unmatched;
    step6B(x, N, dualX, dualY, slack, slackV, starsY);
    step5B(slack[N - 1], slackX, starsX, starsY);
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
function step6B(x, N, dualX, dualY, slack, slackV, starsY) {
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
function matchB(x, matrix, dualX, dualY, starsY, slack, slackV, slackX) {
  const Y = slack.length;
  let dx = dualX[x];
  for (let y = 0; y < Y; ++y) {
    slack[y] = y;
    slackV[y] = matrix[y][x] - dualY[y] - dx;
    slackX[y] = x;
  }
  let zeros = partitionByMin(slack, slackV, 0);
  let zero = slackV[slack[0]];
  let steps = 1;
  for (let y = slack[0]; starsY[y] !== -1; y = slack[steps++]) {
    x = starsY[y];
    dx = dualX[x] - zero;
    for (let i = zeros; i < Y; ++i) {
      y = slack[i];
      const value = matrix[y][x] - dualY[y] - dx;
      if (value >= slackV[y]) {
        continue;
      }
      slackX[y] = x;
      slackV[y] = value;
      if (value === zero) {
        slack[i] = slack[zeros];
        slack[zeros++] = y;
      }
    }
    if (steps >= zeros) {
      zeros = partitionByMin(slack, slackV, zeros);
      zero = slackV[slack[steps]];
    }
  }
  return steps;
}

// src/core/bigMunkres.ts
function exec(matrix) {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
  if (Y <= 0 || X <= 0) {
    return { dualX: [], dualY: [], matrix, starsX: [], starsY: [] };
  }
  const dualX = new Array(X);
  const dualY = new Array(Y);
  step1(matrix, dualX, dualY);
  const starsX = new Array(X).fill(-1);
  const starsY = new Array(Y).fill(-1);
  const stars = steps2To3(matrix, dualX, dualY, starsX, starsY);
  if (Y <= X) {
    step4(Y - stars, matrix, dualX, dualY, starsX, starsY);
  } else {
    step4B(X - stars, matrix, dualX, dualY, starsX, starsY);
  }
  return { dualX, dualY, matrix, starsX, starsY };
}
function step1(matrix, dualX, dualY) {
  const X = dualX.length;
  const Y = dualY.length;
  if (Y > X) {
    dualY.fill(isBigInt(matrix[0][0]) ? 0n : 0);
  } else {
    for (let y = 0; y < Y; ++y) {
      dualY[y] = getMin2(matrix[y]);
    }
  }
  if (Y < X) {
    dualX.fill(isBigInt(matrix[0][0]) ? 0n : 0);
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
function step4(unmatched, matrix, dualX, dualY, starsX, starsY) {
  if (unmatched <= 0) {
    return;
  }
  const X = dualX.length;
  const slack = new Uint32Array(X);
  const slackV = new Array(X);
  const slackY = new Uint32Array(X);
  for (let y = 0; unmatched > 0; ++y) {
    if (starsY[y] !== -1) {
      continue;
    }
    const N = match(y, matrix, dualX, dualY, starsX, slack, slackV, slackY);
    --unmatched;
    step6(y, N, dualX, dualY, slack, slackV, starsX);
    step5(slack[N - 1], slackY, starsX, starsY);
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
function step6(y, N, dualX, dualY, slack, slackV, starsX) {
  const sum = slackV[slack[--N]];
  dualY[y] += sum;
  for (let i = 0; i < N; ++i) {
    const x = slack[i];
    y = starsX[x];
    const min = sum - slackV[x];
    dualX[x] -= min;
    dualY[y] += min;
  }
}
function match(y, matrix, dualX, dualY, starsX, slack, slackV, slackY) {
  const X = slack.length;
  let dy = dualY[y];
  let row = matrix[y];
  for (let x = 0; x < X; ++x) {
    slack[x] = x;
    slackV[x] = row[x] - dualX[x] - dy;
    slackY[x] = y;
  }
  let zeros = partitionByMin(slack, slackV, 0);
  let zero = slackV[slack[0]];
  let steps = 1;
  for (let x = slack[0]; starsX[x] !== -1; x = slack[steps++]) {
    y = starsX[x];
    dy = dualY[y] - zero;
    row = matrix[y];
    for (let i = zeros; i < X; ++i) {
      x = slack[i];
      const value = row[x] - dualX[x] - dy;
      if (value >= slackV[x]) {
        continue;
      }
      slackY[x] = y;
      slackV[x] = value;
      if (value === zero) {
        slack[i] = slack[zeros];
        slack[zeros++] = x;
      }
    }
    if (steps >= zeros) {
      zeros = partitionByMin(slack, slackV, zeros);
      zero = slackV[slack[steps]];
    }
  }
  return steps;
}

// src/core/numMunkresB.ts
function step4B2(unmatched, matrix, dualX, dualY, starsX, starsY) {
  if (unmatched <= 0) {
    return;
  }
  const Y = dualY.length;
  const slack = new Uint32Array(Y);
  const slackV = new Array(Y);
  const slackX = new Uint32Array(Y);
  for (let x = 0; unmatched > 0; ++x) {
    if (starsX[x] !== -1) {
      continue;
    }
    const N = matchB2(x, matrix, dualX, dualY, starsY, slack, slackV, slackX);
    --unmatched;
    step6B2(x, N, dualX, dualY, slack, slackV, starsY);
    step5B(slack[N - 1], slackX, starsX, starsY);
  }
}
function step6B2(x, N, dualX, dualY, slack, slackV, starsY) {
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
function matchB2(x, matrix, dualX, dualY, starsY, slack, slackV, slackX) {
  const Y = slack.length;
  let dx = dualX[x];
  for (let y = 0; y < Y; ++y) {
    slack[y] = y;
    slackV[y] = matrix[y][x] - (dx + dualY[y] || 0) || 0;
    slackX[y] = x;
  }
  let zeros = partitionByMin(slack, slackV, 0);
  let zero = slackV[slack[0]];
  let steps = 1;
  for (let y = slack[0]; starsY[y] !== -1; y = slack[steps++]) {
    x = starsY[y];
    dx = dualX[x];
    for (let i = zeros; i < Y; ++i) {
      y = slack[i];
      const value = (matrix[y][x] - (dx + dualY[y] || 0) || 0) + zero || 0;
      if (value >= slackV[y]) {
        continue;
      }
      slackX[y] = x;
      slackV[y] = value;
      if (value === zero) {
        slack[i] = slack[zeros];
        slack[zeros++] = y;
      }
    }
    if (steps >= zeros) {
      zeros = partitionByMin(slack, slackV, zeros);
      zero = slackV[slack[steps]];
    }
  }
  return steps;
}

// src/core/numMunkres.ts
function exec2(matrix) {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
  if (Y <= 0 || X <= 0) {
    return { dualX: [], dualY: [], matrix, starsX: [], starsY: [] };
  }
  const dualX = new Array(X);
  const dualY = new Array(Y);
  step12(matrix, dualX, dualY);
  const starsX = new Array(X).fill(-1);
  const starsY = new Array(Y).fill(-1);
  const stars = steps2To32(matrix, dualX, dualY, starsX, starsY);
  if (Y <= X) {
    step42(Y - stars, matrix, dualX, dualY, starsX, starsY);
  } else {
    step4B2(X - stars, matrix, dualX, dualY, starsX, starsY);
  }
  return { dualX, dualY, matrix, starsX, starsY };
}
function step12(matrix, dualX, dualY) {
  const X = dualX.length;
  const Y = dualY.length;
  if (Y > X) {
    dualY.fill(0);
  } else {
    for (let y = 0; y < Y; ++y) {
      dualY[y] = getMin2(matrix[y]);
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
function steps2To32(matrix, dualX, dualY, starsX, starsY) {
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
function step42(unmatched, matrix, dualX, dualY, starsX, starsY) {
  if (unmatched <= 0) {
    return;
  }
  const X = dualX.length;
  const slack = new Uint32Array(X);
  const slackV = new Array(X);
  const slackY = new Uint32Array(X);
  for (let y = 0; unmatched > 0; ++y) {
    if (starsY[y] !== -1) {
      continue;
    }
    const N = match2(y, matrix, dualX, dualY, starsX, slack, slackV, slackY);
    --unmatched;
    step62(y, N, dualX, dualY, slack, slackV, starsX);
    step52(slack[N - 1], slackY, starsX, starsY);
  }
}
function step62(y, N, dualX, dualY, slack, slackV, starsX) {
  const sum = slackV[slack[--N]];
  dualY[y] = dualY[y] + sum || 0;
  for (let i = 0; i < N; ++i) {
    const x = slack[i];
    y = starsX[x];
    const min = sum - slackV[x] || 0;
    dualX[x] = dualX[x] - min || 0;
    dualY[y] = dualY[y] + min || 0;
  }
}
function step52(x, primeX, starsX, starsY) {
  do {
    const y = primeX[x];
    const sx = starsY[y];
    starsX[x] = y;
    starsY[y] = x;
    x = sx;
  } while (x !== -1);
}
function match2(y, matrix, dualX, dualY, starsX, slack, slackV, slackY) {
  const X = slack.length;
  let dy = dualY[y];
  let row = matrix[y];
  for (let x = 0; x < X; ++x) {
    slack[x] = x;
    slackV[x] = row[x] - (dualX[x] + dy || 0) || 0;
    slackY[x] = y;
  }
  let zeros = partitionByMin(slack, slackV, 0);
  let zero = slackV[slack[0]];
  let steps = 1;
  for (let x = slack[0]; starsX[x] !== -1; x = slack[steps++]) {
    y = starsX[x];
    dy = dualY[y];
    row = matrix[y];
    for (let i = zeros; i < X; ++i) {
      x = slack[i];
      const value = (row[x] - (dualX[x] + dy || 0) || 0) + zero || 0;
      if (value >= slackV[x]) {
        continue;
      }
      slackY[x] = y;
      slackV[x] = value;
      if (value === zero) {
        slack[i] = slack[zeros];
        slack[zeros++] = x;
      }
    }
    if (steps >= zeros) {
      zeros = partitionByMin(slack, slackV, zeros);
      zero = slackV[slack[steps]];
    }
  }
  return steps;
}

// src/core/munkres.ts
function exec3(costMatrix, options) {
  if (isBigInt((costMatrix[0] ?? [])[0])) {
    return exec(costMatrix);
  }
  const numMatrix = costMatrix;
  if (options?.finite) {
    return exec(numMatrix);
  }
  const inspection = inspectNumeric(numMatrix);
  if (inspection.nanAt) {
    throw new TypeError(
      `munkres: cost matrix contains NaN at [${inspection.nanAt[0]}][${inspection.nanAt[1]}]. Use Infinity to mark forbidden assignments.`
    );
  }
  if (inspection.infinityAt) {
    return exec2(numMatrix);
  }
  if (inspection.rangeMin != null && inspection.rangeMax != null && inspection.rangeMax - inspection.rangeMin > Number.MAX_VALUE / 2) {
    throw new RangeError(
      `munkres: cost matrix range (max - min = ${inspection.rangeMax - inspection.rangeMin}) exceeds Number.MAX_VALUE / 2; intermediate arithmetic may overflow. Scale your cost matrix down, or use a bigint cost matrix.`
    );
  }
  return exec(numMatrix);
}

// src/utils/matching.ts
function toPairs(matching) {
  if (matching.starsY.length <= matching.starsX.length) {
    return entries(matching.starsY);
  }
  const pairs = entries(matching.starsX);
  flipH(pairs);
  return pairs;
}

// src/munkres.ts
function munkres(costMatrix, options) {
  return toPairs(exec3(costMatrix, options));
}

// src/index.ts
var src_default = munkres;
export {
  copyMatrix,
  createMatrix,
  src_default as default,
  genMatrix,
  getMatrixMax,
  getMatrixMin,
  invertMatrix,
  munkres,
  negateMatrix
};
//# sourceMappingURL=munkres.mjs.map