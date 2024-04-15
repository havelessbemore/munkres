import { Matrix } from "../../types/matrix";
import { MunkresResult } from "../../types/munkres";

import { isBigInt } from "../is";

import { safeExec as bigSafeExec } from "./bigMunkres";
import { safeExec as numSafeExec } from "./numMunkres";

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
export function safeExec(matrix: Matrix<number>): MunkresResult<number>;
export function safeExec(matrix: Matrix<bigint>): MunkresResult<bigint>;
export function safeExec<T extends number | bigint>(
  matrix: Matrix<T>
): MunkresResult<T> {
  return (
    isBigInt((matrix[0] ?? [])[0])
      ? bigSafeExec(matrix as Matrix<bigint>)
      : numSafeExec(matrix as Matrix<number>)
  ) as MunkresResult<T>;
}
