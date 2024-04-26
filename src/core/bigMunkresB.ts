import { MatrixLike } from "../types/matrixLike";
import { MutableArrayLike } from "../types/mutableArrayLike";

import { partitionByMin } from "../utils/mutableArrayLike";

export function step4B(
  unmatched: number,
  matrix: MatrixLike<number>,
  dualX: number[],
  dualY: number[],
  starsX: number[],
  starsY: number[],
): void;
export function step4B(
  unmatched: number,
  matrix: MatrixLike<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  starsX: number[],
  starsY: number[],
): void;
export function step4B<T extends number | bigint>(
  unmatched: number,
  matrix: MatrixLike<T>,
  dualX: T[],
  dualY: T[],
  starsX: number[],
  starsY: number[],
): void {
  // If no unmatched column
  if (unmatched <= 0) {
    return;
  }

  const Y = dualY.length;
  const slack = new Uint32Array(Y);
  const slackV = new Array<T>(Y);
  const slackX = new Uint32Array(Y);

  // Match unmatched columns
  for (let x = 0; unmatched > 0; ++x) {
    if (starsX[x] === -1) {
      // @ts-expect-error ts(2769)
      matchB(x, matrix, dualX, dualY, starsX, starsY, slack, slackV, slackX);
      --unmatched;
    }
  }
}

export function step5B(
  y: number,
  primeY: ArrayLike<number>,
  starsX: number[],
  starsY: number[],
): void {
  do {
    const x = primeY[y];
    const sy = starsX[x];
    starsX[x] = y;
    starsY[y] = x;
    y = sy;
  } while (y !== -1);
}

export function step6B(
  N: number,
  dualX: number[],
  dualY: number[],
  slack: ArrayLike<number>,
  slackV: ArrayLike<number>,
  slackX: number[],
): void;
export function step6B(
  N: number,
  dualX: bigint[],
  dualY: bigint[],
  slack: ArrayLike<number>,
  slackV: ArrayLike<bigint>,
  slackX: number[],
): void;
export function step6B<T extends number | bigint>(
  N: number,
  dualX: T[],
  dualY: T[],
  slack: ArrayLike<number>,
  slackV: ArrayLike<T>,
  slackX: number[],
): void {
  const sum = slackV[slack[N - 1]];

  let min = sum;
  for (let i = 0; i < N; ++i) {
    const y = slack[i];
    const x = slackX[y];
    // @ts-expect-error ts(2365)
    dualX[x] += min;
    min = (sum - slackV[y]) as T;
    // @ts-expect-error ts(2322)
    dualY[y] -= min;
  }
}

export function matchB(
  x: number,
  matrix: MatrixLike<number>,
  dualX: number[],
  dualY: number[],
  starsX: number[],
  starsY: number[],
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<number>,
  slackX: MutableArrayLike<number>,
): void;
export function matchB(
  x: number,
  matrix: MatrixLike<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  starsX: number[],
  starsY: number[],
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<bigint>,
  slackX: MutableArrayLike<number>,
): void;
export function matchB<T extends number | bigint>(
  x: number,
  matrix: MatrixLike<T>,
  dualX: T[],
  dualY: T[],
  starsX: number[],
  starsY: number[],
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<T>,
  slackX: MutableArrayLike<number>,
): void {
  const Y = slack.length;

  // Initialize slack
  let dx = dualX[x];
  for (let y = 0; y < Y; ++y) {
    slack[y] = y;
    slackV[y] = (matrix[y][x] - dualY[y] - dx) as T;
    slackX[y] = x;
  }

  // Initialize zeros
  let zeros = partitionByMin(slack, slackV, 0);
  let zero = slackV[slack[0]];

  // Grow a hungarian tree until an augmenting path is found
  let steps = 1;
  let y: number;
  for (y = slack[0]; starsY[y] !== -1; y = slack[steps++]) {
    // Update slack
    x = starsY[y];
    dx = (dualX[x] - zero) as T;
    for (let i = zeros; i < Y; ++i) {
      y = slack[i];
      const value = (matrix[y][x] - dualY[y] - dx) as T;
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

    // Update zeros
    if (steps >= zeros) {
      zeros = partitionByMin(slack, slackV, zeros);
      zero = slackV[slack[steps]];
    }
  }

  // Update matching
  step5B(y, slackX, starsX, starsY);

  // Update dual variables
  // @ts-expect-error ts(2769)
  step6B(steps, dualX, dualY, slack, slackV, slackX);
}
