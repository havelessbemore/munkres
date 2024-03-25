import { CostMatrix } from "./types/costMatrix";
import { copy } from "./utils/matrix";
import { step1, step2, step3, step4 } from "./utils/munkres";

/**
 * Find the optimal assignments of `y` workers to `x` jobs to
 * minimize total cost.
 *
 * @param mat - The cost matrix where `mat[y][x]` represents the cost of
 * assigning worker `y` to job `x`.
 *
 * @returns An array of pairs `[y, x]` representing the optimal assignment
 * of workers to jobs. Each pair consists of a worker index `y` and a job
 * index `x`, indicating that worker `y` is assigned to job `x`.
 *
 * @remarks
 * Runs the {@link https://en.wikipedia.org/wiki/Hungarian_algorithm | Munkres algorithm (aka Hungarian algorithm)} to solve
 * the {@link https://en.wikipedia.org/wiki/Assignment_problem | assignment problem}.
 *
 * @privateRemarks
 * Based on {@link https://users.cs.duke.edu/~brd/Teaching/Bio/asmb/current/Handouts/munkres.html | this outline} and enhanced with custom optimizations.
 */
export function munkres(mat: CostMatrix): [number, number][] {
  // Check input
  const Y = mat.length;
  const X = mat[0]?.length ?? 0;
  if (Y <= 0 || X <= 0) {
    return [];
  }

  // Make a copy of the matrix
  mat = copy(mat);

  // Initialize variables
  const covX = new Array<boolean>(X).fill(false);
  const covY = new Array<boolean>(Y).fill(false);
  const starX = new Array<number>(X).fill(-1);
  const starY = new Array<number>(Y).fill(-1);

  // Step 1: Reduce
  step1(mat);

  // Steps 2 and 3: Look for and star zeros
  //const stars = steps2to3(mat, starX, starY);
  step2(mat, starX, starY);
  const stars = step3(starX, covX);

  // Step 4: Find optimal assignments
  step4(stars, mat, starX, starY, covX, covY);

  // Return assignments
  return Array.from(starY.entries());
}
