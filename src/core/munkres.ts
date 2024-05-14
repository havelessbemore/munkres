import type { MatrixLike } from "../types/matrixLike";
import type { Matching } from "../types/matching";

import { isBigInt } from "../utils/is";

import { exec as finExec } from "./finMunkres";
import { exec as infExec } from "./infMunkres";
import { exec as asyncExec } from "./munkresAsync";
import { Runner } from "../types/async";

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
 * @privateRemarks
 * Citations:
 * 1. {@link https://users.cs.duke.edu/~brd/Teaching/Bio/asmb/current/Handouts/munkres.html | Munkres' Assignment Algorithm, Modified for Rectangular Matrices}
 *     - Used as the foundation and enhanced with custom optimizations.
 *
 * 1. {@link https://www.ri.cmu.edu/pub_files/pub4/mills_tettey_g_ayorkor_2007_3/mills_tettey_g_ayorkor_2007_3.pdf | Mills-Tettey, Ayorkor & Stent, Anthony & Dias, M.. (2007). The Dynamic Hungarian Algorithm for the Assignment Problem with Changing Costs.}
 *     - Used to implement primal-dual variables and dynamic updates.
 *
 * 1. {@link https://public.websites.umich.edu/~murty/612/612slides4.pdf | Murty, K. G.. Primal-Dual Algorithms. [IOE 612, Lecture slides 4]. Department of Industrial and Operations Engineering, University of Michigan.}
 *     - Used to implement primal-dual and slack variables.
 */
export function exec(matrix: MatrixLike<number>): Matching<number>;
export function exec(matrix: MatrixLike<bigint>): Matching<bigint>;
export function exec<T extends number | bigint>(
  matrix: MatrixLike<T>,
): Matching<T> {
  return (
    isBigInt((matrix[0] ?? [])[0])
      ? finExec(matrix as MatrixLike<bigint>)
      : infExec(matrix as MatrixLike<number>)
  ) as Matching<T>;
}

/**
 * Find the optimal assignments of `y` workers to `x` jobs to
 * minimize total cost.
 *
 * @param costMatrix - The cost matrix, where `mat[y][x]` represents the cost
 * of assigning worker `y` to job `x`.
 *
 * @param runner - An adapter for managing communication with web workers.
 *
 * @returns An array of pairs `[y, x]` representing the optimal assignment
 * of workers to jobs. Each pair consists of a worker index `y` and a job
 * index `x`, indicating that worker `y` is assigned to job `x`.
 *
 * @privateRemarks
 * Citations:
 * 1. {@link https://dl.acm.org/doi/pdf/10.1145/115234.115349 | Balas, E., Miller, D., Pekny, J., & Toth, P. (1991). A parallel shortest augmenting path algorithm for the assignment problem. Journal of the Association for Computing Machinery, 38(4), 985-1004.}
 *
 * 1. {@link https://www.sciencedirect.com/science/article/abs/pii/S016781911630045X | Date, K., & Nagi, R. (2016). GPU-accelerated Hungarian algorithms for the Linear Assignment Problem. Parallel Computing, 57, 52-72.}
 */
export function execAsync(
  matrix: MatrixLike<number>,
  runner: Runner<number>,
): Promise<Matching<number>> {
  return asyncExec(matrix, runner);
}
