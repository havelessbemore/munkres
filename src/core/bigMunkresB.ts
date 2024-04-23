import { MatrixLike } from "../types/matrixLike";
import { MutableArrayLike } from "../types/mutableArrayLike";

import { partitionByMin } from "../utils/mutableArrayLike";

export function step4B(
  unmatched: number,
  matrix: MatrixLike<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  starsX: number[],
  starsY: number[],
): void {
  // If no unmatched column
  if (unmatched <= 0) {
    return;
  }

  const Y = dualY.length;
  const slack = new Uint32Array(Y);
  const slackV = new Array<bigint>(Y);
  const slackX = new Uint32Array(Y);

  // Match unmatched columns
  for (let x = 0; unmatched > 0; ++x) {
    if (starsX[x] === -1) {
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
  x: number,
  N: number,
  dualX: bigint[],
  dualY: bigint[],
  slack: ArrayLike<number>,
  slackV: ArrayLike<bigint>,
  starsY: number[],
): void {
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

export function matchB(
  rootX: number,
  matrix: MatrixLike<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  starsX: number[],
  starsY: number[],
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<bigint>,
  slackX: MutableArrayLike<number>,
): void {
  const Y = slack.length;

  // Initialize slack
  let x = rootX;
  let dx = dualX[x];
  for (let y = 0; y < Y; ++y) {
    slack[y] = y;
    slackV[y] = matrix[y][x] - dualY[y] - dx;
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
    dx = dualX[x] - zero;
    for (let i = zeros; i < Y; ++i) {
      y = slack[i];
      const value = matrix[y][x] - dualY[y] - dx;
      if (value < slackV[y]) {
        if (value === zero) {
          slack[i] = slack[zeros];
          slack[zeros++] = y;
        }
        slackV[y] = value;
        slackX[y] = x;
      }
    }

    // Update zeros
    if (steps >= zeros) {
      zeros = partitionByMin(slack, slackV, zeros);
      zero = slackV[slack[steps]];
    }
  }

  // Update dual variables
  step6B(rootX, steps, dualX, dualY, slack, slackV, starsY);

  // Update matching
  step5B(y, slackX, starsX, starsY);
}
