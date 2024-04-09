import { Tuple } from "..";
import { Matrix } from "../types/matrix";
import { getMin } from "../utils/array";
import { copy, flipH, transpose } from "../utils/matrix";
import { bigStep4 } from "./bigMunkres";
import { isBigInt } from "./is";

export function munkres(costMatrix: Matrix<number>): Tuple<number>[];
export function munkres(costMatrix: Matrix<bigint>): Tuple<number>[];
export function munkres<T extends number | bigint>(
  costMatrix: Matrix<T>
): Tuple<number>[] {
  // Get dimensions
  const Y = costMatrix.length;
  const X = costMatrix[0]?.length ?? 0;

  // If matrix is empty
  if (X <= 0) {
    return [];
  }

  // Transpose if Y > X
  if (Y > X) {
    costMatrix = copy(costMatrix);
    transpose(costMatrix);
  }

  // Get optimal assignments
  const y2x = isBigInt(costMatrix[0][0])
    ? bigStep4(costMatrix as Matrix<bigint>)
    : step4(costMatrix as Matrix<number>);

  // Create pairs
  const P = y2x.length;
  const pairs: Tuple<number>[] = new Array(P);
  for (let y = 0; y < P; ++y) {
    pairs[y] = [y, y2x[y]];
  }

  // Transpose if Y > X
  if (Y > X) {
    flipH(pairs);
  }

  // Return assignments
  return pairs;
}

export function step1(
  mat: Matrix<number>,
  dualX: number[],
  dualY: number[]
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

export function steps2To3(
  mat: Matrix<number>,
  dualX: number[],
  dualY: number[],
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

/**
 * Find and augment assignments until an optimal set is found.
 *
 * It attempts to either find an uncovered zero to star or adjusts
 * the matrix to create more zeros if none found. If an uncovered zero is
 * found but cannot be starred due to conflicts (i.e., another star in the
 * same row or column), it primes the zero and possibly adjusts existing
 * stars to resolve the conflict, thereby augmenting the current set of
 * assignments. This process is repeated until there are as many stars as
 * there are columns in the matrix, at which point optimal assignments
 * have been found.
 *
 * @param mat - An MxN cost matrix. Modified in place.
 *
 * @throws - {@link RangeError}
 * Thrown if the given MxN matrix has more rows than columns (M \> N).
 *
 * @privateRemarks
 * Citations:
 * 1. {@link https://users.cs.duke.edu/~brd/Teaching/Bio/asmb/current/Handouts/munkres.html | Munkres' Assignment Algorithm, Modified for Rectangular Matrices}
 *     - Used as the foundation and enhanced with custom optimizations.
 * 1. {@link https://www.ri.cmu.edu/pub_files/pub4/mills_tettey_g_ayorkor_2007_3/mills_tettey_g_ayorkor_2007_3.pdf | Mills-Tettey, Ayorkor & Stent, Anthony & Dias, M.. (2007). The Dynamic Hungarian Algorithm for the Assignment Problem with Changing Costs.}
 *     - Used to implement primal-dual variables and dynamic updates.
 */
export function step4(mat: Matrix<number>): number[] {
  const Y = mat.length;
  const X = mat[0]?.length ?? 0;

  // Check input
  if (Y > X) {
    throw new RangeError("invalid MxN matrix: M > N");
  }

  const coveredX = new Array(X);
  const coveredY = new Array(Y);
  const dualX = new Array(X).fill(0);
  const dualY = new Array(Y).fill(0);
  const slackV = new Array(X);
  const slackX = new Array(X);
  const starsX = new Array(X).fill(-1);
  const starsY = new Array(Y).fill(-1);

  // Step 1: Reduce
  step1(mat, dualX, dualY);

  // Steps 2 & 3: Find initial matching
  let stars = steps2To3(mat, dualX, dualY, starsX, starsY);

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

export function stage(
  mat: Matrix<number>,
  coveredX: number[],
  coveredY: boolean[],
  dualX: number[],
  dualY: number[],
  slackV: number[],
  slackX: number[],
  starsX: number[],
  starsY: number[]
): void {
  // Initialize cover
  const ry = starsY.indexOf(-1);
  coveredX.fill(-1);
  coveredY.fill(false);
  coveredY[ry] = true;

  // Initialize slack
  initSlack(ry, mat, dualX, dualY, slackV, slackX);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Find an uncovered min
    const [y, x] = findUncoveredMin(coveredX, slackV, slackX);

    // Step 6: If not zero, zero the min
    if (slackV[x] > 0) {
      step6(slackV[x], coveredX, coveredY, dualX, dualY, slackV);
    }

    // Prime the zero / cover the column
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

export function step5(
  x: number,
  coveredX: number[],
  starX: number[],
  starY: number[]
): void {
  do {
    const y = coveredX[x];
    const sx = starY[y];
    starX[x] = y;
    starY[y] = x;
    x = sx;
  } while (x !== -1);
}

export function step6(
  min: number,
  coveredX: number[],
  coveredY: boolean[],
  dualX: number[],
  dualY: number[],
  slackV: number[]
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

export function findUncoveredMin(
  coveredX: number[],
  slackV: number[],
  slackX: number[]
): [number, number] {
  const X = slackV.length;

  let minY = -1;
  let minX = -1;
  let minV = Infinity;
  for (let x = 0; x < X; ++x) {
    if (minV > slackV[x] && coveredX[x] === -1) {
      minV = slackV[x];
      minY = slackX[x];
      minX = x;
      if (minV === 0) {
        break;
      }
    }
  }

  return [minY, minX];
}

export function initSlack(
  y: number,
  mat: Matrix<number>,
  dualX: number[],
  dualY: number[],
  slackV: number[],
  slackX: number[]
): void {
  const X = slackV.length;
  const row = mat[y];
  const dy = dualY[y];

  slackX.fill(y);
  for (let x = 0; x < X; ++x) {
    slackV[x] = row[x] - dualX[x] - dy;
  }
}

export function updateSlack(
  y: number,
  mat: Matrix<number>,
  coveredX: number[],
  dualX: number[],
  dualY: number[],
  slackV: number[],
  slackX: number[]
): void {
  const X = slackV.length;
  const row = mat[y];
  const dy = dualY[y];

  for (let x = 0; x < X; ++x) {
    if (coveredX[x] !== -1) {
      continue;
    }
    const slack = row[x] - dualX[x] - dy;
    if (slack < slackV[x]) {
      slackV[x] = slack;
      slackX[x] = y;
    }
  }
}
