import { Matrix } from "./types/matrix";
import { Tuple } from "./types/tuple";

import { entries } from "./utils/array";
import { flipH } from "./utils/matrix";

import { safeExec } from "./utils/munkres/munkres";

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
 */
export function munkres(costMatrix: Matrix<number>): Tuple<number>[];
export function munkres(costMatrix: Matrix<bigint>): Tuple<number>[];
export function munkres<T extends number | bigint>(
  costMatrix: Matrix<T>
): Tuple<number>[] {
  // Get optimal assignments
  const { starsY } = safeExec(costMatrix as Matrix<number>);

  // Create assignment pairs
  const pairs = entries(starsY);

  // Transpose if Y > X
  if (costMatrix.length > (costMatrix[0]?.length ?? 0)) {
    flipH(pairs);
  }

  // Return assignments
  return pairs;
}
