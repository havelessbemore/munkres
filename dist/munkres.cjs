/*!
 * munkres
 * https://github.com/havelessbemore/munkres
 *
 * MIT License
 *
 * Copyright (C) 2024-2024 Michael Rojas <dev.michael.rojas@gmail.com> (https://github.com/havelessbemore)
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

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var types = require('util/types');

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
function getMin$1(matrix) {
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

function copy(a, b) {
  const N = a.length;
  for (let i = 0; i < N; ++i) {
    b[i] = a[i];
  }
}
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

function exec$3(matrix) {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
  if (Y <= 0 || X <= 0) {
    return { dualX: [], dualY: [], matrix, starsX: [], starsY: [] };
  }
  const dualX = new Array(X);
  const dualY = new Array(Y);
  step1$1(matrix, dualX, dualY);
  const starsX = new Array(X).fill(-1);
  const starsY = new Array(Y).fill(-1);
  const stars = steps2To3$1(matrix, dualX, dualY, starsX, starsY);
  Y <= X ? (
    // @ts-expect-error ts(2769)
    step4$2(Y - stars, matrix, dualX, dualY, starsX, starsY)
  ) : (
    // @ts-expect-error ts(2769)
    step4B$1(X - stars, matrix, dualX, dualY, starsX, starsY)
  );
  return { dualX, dualY, matrix, starsX, starsY };
}
function step1$1(matrix, dualX, dualY) {
  const X = dualX.length;
  const Y = dualY.length;
  if (Y > X) {
    dualY.fill(isBigInt(matrix[0][0]) ? 0n : 0);
  } else {
    for (let y = 0; y < Y; ++y) {
      dualY[y] = getMin(matrix[y]);
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
function step4$2(unmatched, matrix, dualX, dualY, starsX, starsY) {
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
    const N = match$1(y, matrix, dualX, dualY, starsX, slack, slackV, slackY);
    --unmatched;
    step6$1(y, N, dualX, dualY, slack, slackV, starsX);
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
function match$1(y, matrix, dualX, dualY, starsX, slack, slackV, slackY) {
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
function step4B$1(unmatched, matrix, dualX, dualY, starsX, starsY) {
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
    const N = matchB$1(x, matrix, dualX, dualY, starsY, slack, slackV, slackX);
    --unmatched;
    step6B$1(x, N, dualX, dualY, slack, slackV, starsY);
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
function matchB$1(x, matrix, dualX, dualY, starsY, slack, slackV, slackX) {
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

function exec$2(matrix) {
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
  Y <= X ? step4$1(Y - stars, matrix, dualX, dualY, starsX, starsY) : step4B(X - stars, matrix, dualX, dualY, starsX, starsY);
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
function step4$1(unmatched, matrix, dualX, dualY, starsX, starsY) {
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
function match(y, matrix, dualX, dualY, starsX, slack, slackV, slackY) {
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
function matchB(x, matrix, dualX, dualY, starsY, slack, slackV, slackX) {
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

function exec$1(matrix) {
  return isBigInt((matrix[0] ?? [])[0]) ? exec$3(matrix) : exec$2(matrix);
}

function toPairs(matching) {
  if (matching.starsY.length <= matching.starsX.length) {
    return entries(matching.starsY);
  }
  const pairs = entries(matching.starsX);
  flipH(pairs);
  return pairs;
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, key + "" , value);
  return value;
};
class TimeOutError extends Error {
  constructor(message, duration) {
    super(message);
    /**
     * Duration in milliseconds after which the timeout error was thrown
     */
    __publicField$2(this, "duration");
    this.duration = duration;
    this.name = TimeOutError.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimeOutError);
    }
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const ATOMICS_TIMED_OUT = "timed-out";
const ERR_MSG_TIMEOUT = "Timed out acquiring mutex";
const LOCKED = 1;
const UNLOCKED = 0;
class Mutex {
  constructor(sharedBuffer, byteOffset = 0) {
    __publicField$1(this, "_hasLock");
    __publicField$1(this, "_lock");
    this._hasLock = false;
    this._lock = new Int32Array(sharedBuffer, byteOffset, 1);
  }
  get buffer() {
    return this._lock.buffer;
  }
  async request(callbackfn, timeout) {
    try {
      await this.lock(timeout);
      return await callbackfn();
    } finally {
      this.unlock();
    }
  }
  async lock(timeout) {
    while (!this.tryLock()) {
      const res = Atomics.waitAsync(this._lock, 0, LOCKED, timeout);
      const value = res.async ? await res.value : res.value;
      if (value === ATOMICS_TIMED_OUT) {
        throw new TimeOutError(ERR_MSG_TIMEOUT, timeout ?? 0);
      }
    }
  }
  tryLock() {
    return this._hasLock || (this._hasLock = Atomics.compareExchange(this._lock, 0, UNLOCKED, LOCKED) === UNLOCKED);
  }
  unlock() {
    if (this._hasLock) {
      this._hasLock = false;
      Atomics.store(this._lock, 0, UNLOCKED);
      Atomics.notify(this._lock, 0);
    }
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const ERR_MSG_POP = "Unexpected update during pop. Check push / pop operations are awaited on and mutex is shared properly";
const ERR_MSG_PUSH = "Unexpected update during push. Check push / pop operations are awaited on and mutex is shared properly";
class SharedStack {
  constructor(valueBuffer, sizeBuffer, mutex) {
    __publicField(this, "_mutex");
    __publicField(this, "_size");
    __publicField(this, "_values");
    this._mutex = mutex;
    this._size = new Int32Array(sizeBuffer);
    this._values = new Int32Array(valueBuffer);
  }
  get size() {
    return Atomics.load(this._size, 0);
  }
  async pop(timeout) {
    return this._mutex.request(() => {
      const size = Atomics.load(this._size, 0);
      if (size <= 0) {
        return void 0;
      }
      const act = Atomics.compareExchange(this._size, 0, size, size - 1);
      if (size !== act) {
        throw new Error(ERR_MSG_POP);
      }
      return Atomics.load(this._values, size - 1);
    }, timeout);
  }
  async push(value, timeout) {
    return this._mutex.request(() => {
      const size = Atomics.load(this._size, 0);
      if (size >= this._values.length) {
        return false;
      }
      const act = Atomics.compareExchange(this._size, 0, size, size + 1);
      if (size !== act) {
        throw new Error(ERR_MSG_PUSH);
      }
      Atomics.store(this._values, size, value);
      return true;
    }, timeout);
  }
}

async function exec(matrix, runner) {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
  if (Y <= 0 || X <= 0) {
    return { dualX: [], dualY: [], matrix, starsX: [], starsY: [] };
  }
  const [dualX, dualY] = getDualArrays(matrix);
  step1$1(matrix, dualX, dualY);
  const [starsX, starsY] = getStarArrays(matrix);
  const stars = steps2To3$1(matrix, dualX, dualY, starsX, starsY);
  try {
    Y <= X ? (
      // @ts-expect-error ts(2769)
      await step4(runner, Y - stars, matrix, dualX, dualY, starsX, starsY)
    ) : (
      // @ts-expect-error ts(2769)
      step4B$1(X - stars, matrix, dualX, dualY, starsX, starsY)
    );
  } catch (err) {
    console.error(err);
  }
  return { dualX, dualY, matrix, starsX, starsY };
}
async function step4(runner, unmatched, matrix, dualX, dualY, starsX, starsY) {
  if (unmatched <= 0) {
    return;
  }
  const bInt32 = Int32Array.BYTES_PER_ELEMENT;
  const mutexBuffer = new SharedArrayBuffer(bInt32);
  const stackMutexBuffer = new SharedArrayBuffer(bInt32);
  const stackSizeBuffer = new SharedArrayBuffer(bInt32);
  const stackValueBuffer = new SharedArrayBuffer(unmatched * bInt32);
  const mutex = new Mutex(stackMutexBuffer);
  const stack = new SharedStack(stackValueBuffer, stackSizeBuffer, mutex);
  for (let y = 0; unmatched > 0; ++y) {
    if (starsY[y] === -1) {
      await stack.push(y);
      --unmatched;
    }
  }
  const P = Math.min(runner.size, stack.size);
  const promises = new Array(P);
  const matching = { matrix, dualX, dualY, starsX, starsY };
  for (let i = 0; i < P; ++i) {
    promises[i] = runner.match({
      matching,
      mutexBuffer,
      stack: {
        mutexBuffer: stackMutexBuffer,
        sizeBuffer: stackSizeBuffer,
        valueBuffer: stackValueBuffer
      }
    });
  }
  await Promise.allSettled(promises);
}
function getDualArrays(matrix) {
  const Y = matrix.length;
  const X = matrix[0].length;
  if (!types.isTypedArray(matrix[0])) {
    return [new Array(X), new Array(Y)];
  }
  const BPE = matrix[0].BYTES_PER_ELEMENT;
  const ctor = matrix[0].constructor;
  return [
    new ctor(new SharedArrayBuffer(X * BPE)),
    new ctor(new SharedArrayBuffer(Y * BPE))
  ];
}
function getStarArrays(matrix) {
  const Y = matrix.length;
  const X = matrix[0].length;
  const BPE = Int32Array.BYTES_PER_ELEMENT;
  return [
    new Int32Array(new SharedArrayBuffer(X * BPE)).fill(-1),
    new Int32Array(new SharedArrayBuffer(Y * BPE)).fill(-1)
  ];
}
function isAugmentingPath(x, primeY, starsX, starsY, sx) {
  while (x !== -1) {
    const y = primeY[x];
    if (starsY[y] === x || starsX[x] !== sx[x]) {
      return false;
    }
    x = starsY[y];
  }
  return true;
}
async function matchAsync(req) {
  const { matching, mutexBuffer } = req;
  const { matrix: mat, dualX, dualY, starsX, starsY } = matching;
  const mutex = new Mutex(mutexBuffer);
  const stack = new SharedStack(
    req.stack.valueBuffer,
    req.stack.sizeBuffer,
    new Mutex(req.stack.mutexBuffer)
  );
  const X = dualX.length;
  const LDualX = new Array(X);
  const LDualY = new Array(dualY.length);
  const slack = new Uint32Array(X);
  const slackV = new Array(X);
  const slackY = new Uint32Array(X);
  const LStarsX = new Int32Array(X);
  while (stack.size > 0) {
    const y = await stack.pop(500).catch(() => void 0);
    if (y == null) {
      continue;
    }
    await mutex.request(() => {
      copy(dualX, LDualX);
      copy(dualY, LDualY);
      copy(starsX, LStarsX);
    });
    const N = match$1(y, mat, LDualX, LDualY, LStarsX, slack, slackV, slackY);
    await mutex.request(async () => {
      const x = slack[N - 1];
      if (!isAugmentingPath(x, slackY, starsX, starsY, LStarsX)) {
        await stack.push(y);
        return;
      }
      step6$1(y, N, dualX, dualY, slack, slackV, starsX);
      step5(x, slackY, starsX, starsY);
    });
  }
  return {};
}

function munkres(costMatrix) {
  return toPairs(exec$1(costMatrix));
}
async function munkresAsync(costMatrix, matcher) {
  return toPairs(await exec(costMatrix, matcher));
}

exports.copyMatrix = copyMatrix;
exports.createMatrix = createMatrix;
exports.default = munkres;
exports.genMatrix = genMatrix;
exports.getMatrixMax = getMatrixMax;
exports.getMatrixMin = getMatrixMin;
exports.invertMatrix = invertMatrix;
exports.matchAsync = matchAsync;
exports.munkres = munkres;
exports.munkresAsync = munkresAsync;
exports.negateMatrix = negateMatrix;
//# sourceMappingURL=munkres.cjs.map
