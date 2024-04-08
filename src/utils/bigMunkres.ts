import { Matrix } from "../types/matrix";
import { getMin } from "../utils/array";
import { step5 } from "./dualMunkres";

export function findUncoveredMin(
  coveredX: number[],
  slackV: bigint[],
  slackX: number[]
): [number, number] {
  const X = slackV.length;

  let minY = -1;
  let minX = -1;
  let minV = undefined as unknown as bigint;
  for (let x = 0; x < X; ++x) {
    if (!(minV <= slackV[x]) && coveredX[x] === -1) {
      minV = slackV[x];
      minY = slackX[x];
      minX = x;
      if (minV === 0n) {
        break;
      }
    }
  }

  return [minY, minX];
}

export function initSlack(
  y: number,
  mat: Matrix<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  slackV: bigint[],
  slackX: number[]
): void {
  const X = slackV.length;
  const row = mat[y];

  slackX.fill(y);
  for (let x = 0; x < X; ++x) {
    slackV[x] = row[x] - dualY[y] - dualX[x];
  }
}

export function updateSlack(
  y: number,
  mat: Matrix<bigint>,
  coveredX: number[],
  dualX: bigint[],
  dualY: bigint[],
  slackV: bigint[],
  slackX: number[]
): void {
  const X = slackV.length;
  const row = mat[y];

  for (let x = 0; x < X; ++x) {
    if (coveredX[x] !== -1) {
      continue;
    }
    const slack = row[x] - dualY[y] - dualX[x];
    if (slack < slackV[x]) {
      slackV[x] = slack;
      slackX[x] = y;
    }
  }
}

export function initStage(
  y: number,
  mat: Matrix<bigint>,
  coveredX: number[],
  coveredY: boolean[],
  dualX: bigint[],
  dualY: bigint[],
  slackV: bigint[],
  slackX: number[]
): void {
  // Initialize cover
  coveredX.fill(-1);
  coveredY.fill(false);
  coveredY[y] = true;

  // Initialize slack
  initSlack(y, mat, dualX, dualY, slackV, slackX);
}

export function stage(
  mat: Matrix<bigint>,
  coveredX: number[],
  coveredY: boolean[],
  dualX: bigint[],
  dualY: bigint[],
  slackV: bigint[],
  slackX: number[],
  starsX: number[],
  starsY: number[]
): void {
  initStage(
    starsY.indexOf(-1),
    mat,
    coveredX,
    coveredY,
    dualX,
    dualY,
    slackV,
    slackX
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Find an uncovered min
    const [y, x] = findUncoveredMin(coveredX, slackV, slackX);

    // Step 6: If not zero, zero the min
    if (slackV[x] > 0n) {
      bigStep6(slackV[x], coveredX, coveredY, dualX, dualY, slackV);
    }

    // Cover the column
    coveredX[x] = y;

    // Step 5: If no star in the column, turn primes into stars
    if (starsX[x] === -1) {
      step5(x, coveredX, starsX, starsY);
      break;
    }

    // Cover the star's row and update slack
    const sy = starsX[x];
    coveredY[sy] = true;
    updateSlack(sy, mat, coveredX, dualX, dualY, slackV, slackX);
  }
}

export function step1(
  mat: Matrix<bigint>,
  dualX: bigint[],
  dualY: bigint[]
): void {
  const Y = mat.length;
  const X = mat[0]?.length ?? 0;

  // Reduce rows
  if (Y <= X) {
    for (let y = 0; y < Y; ++y) {
      dualY[y] = getMin(mat[y])!;
    }
  }

  // Reduce columns
  if (Y >= X) {
    for (let x = 0; x < X; ++x) {
      dualX[x] = mat[0][x] - dualY[0];
    }
    for (let y = 1; y < Y; ++y) {
      const row = mat[y];
      const dy = dualY[y];
      for (let x = 0; x < X; ++x) {
        if (row[x] - dy < dualX[x]) {
          dualX[x] = row[x] - dy;
        }
      }
    }
  }
}

export function bigSteps2To3(
  mat: Matrix<bigint>,
  dualX: bigint[],
  dualY: bigint[],
  starsX: number[],
  starsY: number[]
): number {
  const X = dualX.length;
  const Y = dualY.length;

  let stars = 0;
  for (let y = 0; y < Y; ++y) {
    const row = mat[y];
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

export function bigStep4(mat: Matrix<bigint>): number[] {
  const Y = mat.length;
  const X = mat[0]?.length ?? 0;

  // Check input
  if (Y > X) {
    throw new RangeError("invalid MxN matrix: M > N");
  }

  const coveredX: number[] = new Array(X);
  const coveredY: boolean[] = new Array(Y);
  const dualX: bigint[] = new Array(X).fill(0n);
  const dualY: bigint[] = new Array(Y).fill(0n);
  const slackV: bigint[] = new Array(X);
  const slackX: number[] = new Array(X);
  const starsX: number[] = new Array(X).fill(-1);
  const starsY: number[] = new Array(Y).fill(-1);

  // Step 1: Reduce
  step1(mat, dualX, dualY);

  // Steps 2 & 3: Find initial matching
  let stars = bigSteps2To3(mat, dualX, dualY, starsX, starsY);

  // Step 4: Find complete matching
  while (stars < Y) {
    stage(
      mat,
      coveredX,
      coveredY,
      dualX,
      dualY,
      slackV,
      slackX,
      starsX,
      starsY
    );
    ++stars;
  }

  // Return assignments ([y] -> x)
  return starsY;
}

export function bigStep6(
  min: bigint,
  coveredX: number[],
  coveredY: boolean[],
  dualX: bigint[],
  dualY: bigint[],
  slackV: bigint[]
): void {
  const X = dualX.length;
  const Y = dualY.length;

  for (let y = 0; y < Y; ++y) {
    if (coveredY[y]) {
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
