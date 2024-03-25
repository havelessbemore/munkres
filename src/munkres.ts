import { CostMatrix } from "./types/costMatrix";
import { copy } from "./utils/matrix";
import {
  findUncoveredZeroOrMin,
  step1,
  step5,
  step6,
  steps2to3,
} from "./utils/munkres";

export class Munkres {
  run(mat: CostMatrix): [number, number][] {
    return munkres(mat);
  }
}

/**
 * Find the minimum total cost of assigning `y` workers to `x` jobs.
 *
 * Runs the {@link https://en.wikipedia.org/wiki/Hungarian_algorithm | Munkres algorithm (aka Hungarian algorithm)} to solve
 * the {@link https://en.wikipedia.org/wiki/Assignment_problem | assignment problem}.
 *
 * @param mat - The cost matrix where `mat[y][x]` represents the cost of
 * assigning worker `y` to job `x`.
 *
 * @returns An array of pairs `[y, x]` representing the optimal assignment
 * of workers to jobs. Each pair consists of a worker index `y` and a job
 * index `x`, indicating that worker `y` is assigned to job `x`.
 *
 * @remarks
 *
 * - The input cost matrix is not modified.
 * - Based on {@link https://users.cs.duke.edu/~brd/Teaching/Bio/asmb/current/Handouts/munkres.html | this description} and enhanced with custom optimizations.
 */
export function munkres(mat: CostMatrix): [number, number][] {
  const Y = mat.length;
  const X = mat[0]?.length ?? 0;
  const starX = new Array<number>(X).fill(-1);
  const starY = new Array<number>(Y).fill(-1);
  const primeY = new Array<number>(Y).fill(-1);

  // Make a copy of the cost matrix
  mat = copy(mat);

  // Step 1: Reduce
  step1(mat);

  // Steps 2 and 3: Look for and star zeros
  let stars = steps2to3(mat, starX, starY);

  // Step 4
  while (stars < X) {
    // Find an uncovered zero
    const [y, x] = findUncoveredZeroOrMin(mat, primeY, starX);

    // If not found
    if (mat[y][x] != 0) {
      step6(mat[y][x], mat, primeY, starX);
      continue;
    }

    // Prime the zero
    primeY[y] = x;

    // Find a star in the same row
    const sx = starY[y];

    // If star found
    if (sx >= 0) {
      // Cover the row and remove the star
      starX[sx] = -1;
      starY[y] = -1;
      --stars;
    } else {
      // Replace stars with primes and reset coverage
      step5(y, x, primeY, starX, starY);
      primeY.fill(-1);
      ++stars;
    }
  }

  // Return assignments
  return Array.from(starY.entries());
}
