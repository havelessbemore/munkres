import type { MatrixLike } from "../types/matrixLike.ts";
import type { MutableArrayLike } from "../types/mutableArrayLike.ts";

import { partitionByMin } from "../utils/mutableArrayLike.ts";

import { step5B } from "./bigMunkresB.ts";

export function step4B(
  unmatched: number,
  matrix: MatrixLike<number>,
  dualX: number[],
  dualY: number[],
  starsX: number[],
  starsY: number[],
): void {
  // If no unmatched column
  if (unmatched <= 0) {
    return;
  }

  const Y = dualY.length;
  const slack = new Uint32Array(Y);
  const slackV = new Array<number>(Y);
  const slackX = new Uint32Array(Y);

  // Match unmatched columns
  for (let x = 0; unmatched > 0; ++x) {
    if (starsX[x] !== -1) {
      continue;
    }

    const N = matchB(x, matrix, dualX, dualY, starsY, slack, slackV, slackX);
    --unmatched;

    // Update dual variables
    step6B(x, N, dualX, dualY, slack, slackV, starsY);

    // Update matching
    step5B(slack[N - 1], slackX, starsX, starsY);
  }
}

export function step6B(
  x: number,
  N: number,
  dualX: number[],
  dualY: number[],
  slack: ArrayLike<number>,
  slackV: ArrayLike<number>,
  starsY: ArrayLike<number>,
): void {
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

export function matchB(
  x: number,
  matrix: MatrixLike<number>,
  dualX: number[],
  dualY: number[],
  starsY: number[],
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<number>,
  slackX: MutableArrayLike<number>,
): number {
  const Y = slack.length;

  // Initialize slack
  let dx = dualX[x];
  for (let y = 0; y < Y; ++y) {
    slack[y] = y;
    slackV[y] = matrix[y][x] - (dx + dualY[y] || 0) || 0;
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

    // Update zeros
    if (steps >= zeros) {
      zeros = partitionByMin(slack, slackV, zeros);
      zero = slackV[slack[steps]];
    }
  }

  return steps;
}
