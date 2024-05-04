import type { Runner } from "./types/runner";
import type { MatrixLike } from "./types/matrixLike";
import type { Pair } from "./types/pair";

import { exec } from "./core/munkres";
import { toPairs } from "./utils/matching";
import { exec as execAsync } from "./core/munkresAsync";

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
export function munkres(costMatrix: MatrixLike<number>): Pair<number>[];
export function munkres(costMatrix: MatrixLike<bigint>): Pair<number>[];
export function munkres<T extends number | bigint>(
  costMatrix: MatrixLike<T>,
): Pair<number>[] {
  // @ts-expect-error ts(2769)
  return toPairs(exec(costMatrix));
}

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
export function munkresAsync(
  costMatrix: MatrixLike<number>,
  matcher: Runner<number>,
): Promise<Pair<number>[]>;
export function munkresAsync(
  costMatrix: MatrixLike<bigint>,
  matcher: Runner<bigint>,
): Promise<Pair<number>[]>;
export async function munkresAsync<T extends number | bigint>(
  costMatrix: MatrixLike<T>,
  matcher: Runner<T>,
): Promise<Pair<number>[]> {
  // @ts-expect-error ts(2345)
  return toPairs(await execAsync(costMatrix, matcher));
}
