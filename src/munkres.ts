import { Matrix } from "./types/matrix";
import { Tuple } from "./types/tuple";
import { entries } from "./utils/array";

import { exec as bigExec } from "./utils/bigMunkres";
import { isBigInt } from "./utils/is";
import { copy, flipH, transpose } from "./utils/matrix";
import { exec } from "./utils/munkres";

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
    ? bigExec(costMatrix as Matrix<bigint>)
    : exec(costMatrix as Matrix<number>);

  // Create pairs
  const pairs = entries(y2x);

  // Transpose if Y > X
  if (Y > X) {
    flipH(pairs);
  }

  // Return assignments
  return pairs;
}
