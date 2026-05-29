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
 * of assigning worker `y` to job `x`. Treated as an `mat.length` by
 * `mat[0].length` rectangle; cells beyond row 0's width are ignored.
 * @param options - Optional behavior modifiers. See {@link MunkresOptions}.
 *
 * @returns An array of pairs `[y, x]` representing the optimal assignment
 * of workers to jobs. The result has length `min(rows, cols)` and pairs
 * are always `[y, x]` (row, then column) regardless of matrix shape.
 * When `rows > cols`, the unmatched rows are simply absent from the
 * result; when `cols > rows`, the unmatched columns are absent.
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
 *   The range check applies only to all-finite matrices. A `number`
 *   matrix containing `Infinity` / `-Infinity` routes to a separate
 *   Infinity-handling path *before* the range check and is therefore
 *   never range-checked — those inputs cannot overflow the same way,
 *   since the forbidden cells are saturated rather than summed.
 *
 *   Pass `{ finite: true }` to skip BOTH the finiteness scan AND this
 *   range check, when the caller has already established the input is
 *   well-formed; mis-using that option can produce undefined output but
 *   never throws.
 *
 * @remarks
 * The `number` path uses IEEE 754 double-precision arithmetic. For
 * matrices of *integer* costs where exact optima are required (e.g.
 * values approaching or exceeding `Number.MAX_SAFE_INTEGER`), pass a
 * `bigint` cost matrix to use the arbitrary-precision path. Floating
 * point inputs are inherently approximate; the `number` path may
 * return a valid but suboptimal assignment when precision is lost in
 * slack comparisons.
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
  options?: MunkresOptions,
): Pair<number>[] {
  return toPairs(exec(costMatrix as MatrixLike<number>, options));
}
