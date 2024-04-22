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
  if (unmatched <= 0) {
    return;
  }

  const Y = dualY.length;
  const slack = new Uint32Array(Y);
  const slackV = new Array<bigint>(Y);
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
      const dx = dualX[x] - ds;
      for (let i = zeros; i < Y; ++i) {
        y = slack[i];
        const value = matrix[y][x] - dualY[y] - dx;
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
        zeros = partitionByMin(slack, slackV, zeros);
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

export function initStageB(
  x: number,
  matrix: MatrixLike<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  slack: MutableArrayLike<number>,
  slackV: MutableArrayLike<bigint>,
  slackX: MutableArrayLike<number>,
): number {
  const dx = dualX[x];
  const Y = slack.length;

  for (let y = 0; y < Y; ++y) {
    slack[y] = y;
    slackV[y] = matrix[y][x] - dualY[y] - dx;
    slackX[y] = x;
  }

  return partitionByMin(slack, slackV, 0);
}
