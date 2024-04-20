import { MatrixLike } from "../types/matrixLike";
import { MutableArrayLike } from "../types/mutableArrayLike";

import { step5B } from "./bigMunkresB";
import { zeroUncoveredMin } from "./munkres";

export function step4B(
  unmatched: number,
  matrix: MatrixLike<number>,
  dualX: number[],
  dualY: number[],
  starsX: number[],
  starsY: number[],
): void {
  if (unmatched <= 0) {
    return;
  }

  const Y = dualY.length;
  const slack = new Uint32Array(Y);
  const slackV = new Array<number>(Y);
  const slackX = new Uint32Array(Y);

  for (let rootX = 0; unmatched > 0; ++rootX) {
    if (starsX[rootX] !== -1) {
      continue;
    }

    // Initialize stage
    let zeros = initStageB(rootX, matrix, dualX, dualY, slack, slackV, slackX);

    // Run stage
    let steps = 1;
    let y: number;
    for (y = slack[0]; starsY[y] !== -1; y = slack[steps++]) {
      // Update stage
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

      // If no zeros, zero the min
      if (steps >= zeros) {
        zeros = zeroUncoveredMin(zeros, slack, slackV);
      }
    }

    // Update dual variables
    step6B(rootX, steps, dualX, dualY, slack, slackV, starsY);

    // Turn primes into stars
    step5B(y, slackX, starsX, starsY);

    // Update unmatched count
    --unmatched;
  }
}

export function step6B(
  x: number,
  N: number,
  dualX: number[],
  dualY: number[],
  slack: ArrayLike<number>,
  slackV: ArrayLike<number>,
  starsY: number[],
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

export function initStageB(
  x: number,
  matrix: MatrixLike<number>,
  dualX: number[],
  dualY: number[],
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<number>,
  slackX: MutableArrayLike<number>,
): number {
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
