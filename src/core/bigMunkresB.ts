import type { MatrixLike } from "../types/matrixLike";
import type { MutableArrayLike } from "../types/mutableArrayLike";

import { partitionByMin } from "../utils/mutableArrayLike";

export function step4B(
  unmatched: number,
  matrix: MatrixLike<number>,
  dualX: MutableArrayLike<number>,
  dualY: MutableArrayLike<number>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
): void;
export function step4B(
  unmatched: number,
  matrix: MatrixLike<bigint>,
  dualX: MutableArrayLike<bigint>,
  dualY: MutableArrayLike<bigint>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
): void;
export function step4B<T extends number | bigint>(
  unmatched: number,
  matrix: MatrixLike<T>,
  dualX: MutableArrayLike<T>,
  dualY: MutableArrayLike<T>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
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
    if (starsX[x] !== -1) {
      continue;
    }

    // @ts-expect-error ts(2769)
    const N = matchB(x, matrix, dualX, dualY, starsY, slack, slackV, slackX);
    --unmatched;

    // Update dual variables
    // @ts-expect-error ts(2769)
    step6B(x, N, dualX, dualY, slack, slackV, starsY);

    // Update matching
    step5B(slack[N - 1], slackX, starsX, starsY);
  }
}

export function step5B(
  y: number,
  primeY: ArrayLike<number>,
  starsX: MutableArrayLike<number>,
  starsY: MutableArrayLike<number>,
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
  x: number,
  N: number,
  dualX: MutableArrayLike<number>,
  dualY: MutableArrayLike<number>,
  slack: ArrayLike<number>,
  slackV: ArrayLike<number>,
  starsY: ArrayLike<number>,
): void;
export function step6B(
  x: number,
  N: number,
  dualX: MutableArrayLike<bigint>,
  dualY: MutableArrayLike<bigint>,
  slack: ArrayLike<number>,
  slackV: ArrayLike<bigint>,
  starsY: ArrayLike<number>,
): void;
export function step6B<T extends number | bigint>(
  x: number,
  N: number,
  dualX: MutableArrayLike<T>,
  dualY: MutableArrayLike<T>,
  slack: ArrayLike<number>,
  slackV: ArrayLike<T>,
  starsY: ArrayLike<number>,
): void {
  const sum = slackV[slack[N - 1]];

  let min = sum;
  for (let i = 0; i < N; ++i) {
    const y = slack[i];
    // @ts-expect-error ts(2365)
    dualX[x] += min;
    min = (sum - slackV[y]) as T;
    // @ts-expect-error ts(2322)
    dualY[y] -= min;
    x = starsY[y];
  }
}

export function matchB(
  x: number,
  matrix: MatrixLike<number>,
  dualX: ArrayLike<number>,
  dualY: ArrayLike<number>,
  starsY: ArrayLike<number>,
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<number>,
  slackX: MutableArrayLike<number>,
): number;
export function matchB(
  x: number,
  matrix: MatrixLike<bigint>,
  dualX: ArrayLike<bigint>,
  dualY: ArrayLike<bigint>,
  starsY: ArrayLike<number>,
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<bigint>,
  slackX: MutableArrayLike<number>,
): number;
export function matchB<T extends number | bigint>(
  x: number,
  matrix: MatrixLike<T>,
  dualX: ArrayLike<T>,
  dualY: ArrayLike<T>,
  starsY: ArrayLike<number>,
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<T>,
  slackX: MutableArrayLike<number>,
): number {
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
  for (let y = slack[0]; starsY[y] !== -1; y = slack[steps++]) {
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

  return steps;
}
