import { CostMatrix } from "./types/costMatrix";
import { copy, pad } from "./utils/matrix";
import { step4 } from "./utils/munkres";

/**
 * Find the optimal assignments of `y` workers to `x` jobs to
 * minimize total cost.
 *
 * @param costMatrix - The cost matrix, where `mat[y][x]` represents the cost
 * of assigning worker `y` to job `x`.
 *
 * @returns An array of pairs `[y, x]` representing the optimal assignment
 * of workers to jobs. Each pair consists of a worker index `y` and a job
 * index `x`, indicating that worker `y` is assigned to job `x`.
 *
 * @remarks
 * Runs the {@link https://en.wikipedia.org/wiki/Hungarian_algorithm | Munkres algorithm (aka Hungarian algorithm)} to solve
 * the {@link https://en.wikipedia.org/wiki/Assignment_problem | assignment problem}.
 */
export function munkres(costMatrix: CostMatrix): [number, number][] {
  // Get dimensions
  const Y = costMatrix.length;
  const X = costMatrix[0]?.length ?? 0;

  // If matrix is empty
  if (X <= 0) {
    return [];
  }

  // Make a copy of the cost matrix
  costMatrix = copy(costMatrix);

  // Square the matrix with dummy rows / columns
  pad(costMatrix, X, Y, 0);

  // Get optimal assignments
  const y2x = step4(costMatrix);

  // Filter out dummy assignments
  const pairs: [number, number][] = new Array(Math.min(Y, X));
  for (let y = 0, i = 0; y < Y; ++y) {
    if (y2x[y] < X) {
      pairs[i++] = [y, y2x[y]];
    }
  }

  // Return assignments
  return pairs;
}
