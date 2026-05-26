import type { MatrixLike } from "./types/matrixLike.ts";
import type { Pair } from "./types/pair.ts";

import { exec } from "./core/munkres.ts";
import { toPairs } from "./utils/matching.ts";

import type { MunkresOptions } from "./munkres.options.ts";

/**
 * Find the optimal assignments of `y` workers to `x` jobs to
 * minimize total cost.
 *
 * @param costMatrix - The cost matrix, where `mat[y][x]` represents the cost
 * of assigning worker `y` to job `x`.
 * @param options - Optional behavior modifiers. See {@link MunkresOptions}.
 *
 * @returns An array of pairs `[y, x]` representing the optimal assignment
 * of workers to jobs. Each pair consists of a worker index `y` and a job
 * index `x`, indicating that worker `y` is assigned to job `x`.
 *
 * @throws TypeError if a `number` cost matrix contains `NaN`. Pass
 *   `Infinity` to mark forbidden assignments instead.
 * @throws RangeError if a `number` cost matrix's range
 *   `max(c) - min(c)` exceeds `Number.MAX_VALUE / 2`, the algorithm's
 *   worst-case intermediate magnitude is `2 * range`, and this guard
 *   keeps all intermediate arithmetic representable. Scale your cost
 *   matrix down or use `bigint`. Typical assignment-problem inputs
 *   have ranges well below this threshold.
 *
 *   Pass `{ finite: true }` to skip this validation when the caller
 *   has already established the input is in-range; mis-using that
 *   option can produce undefined output but never throws.
 *
 * @example
 *   munkres([[1, 2], [3, 4]]);
 *   // → [[0, 0], [1, 1]]
 *
 * @example
 *   // Skip the O(Y*X) finiteness scan when you know your matrix is
 *   // all-finite (no Infinity, no NaN). Faster for large matrices.
 *   munkres(largeFiniteMatrix, { finite: true });
 */
export function munkres(
  costMatrix: MatrixLike<number>,
  options?: MunkresOptions,
): Pair<number>[];
export function munkres(
  costMatrix: MatrixLike<bigint>,
  options?: MunkresOptions,
): Pair<number>[];
export function munkres<T extends number | bigint>(
  costMatrix: MatrixLike<T>,
  options: MunkresOptions = {},
): Pair<number>[] {
  return toPairs(exec(costMatrix as MatrixLike<number>, options));
}
