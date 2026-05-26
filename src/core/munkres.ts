import type { MatrixLike } from "../types/matrixLike.ts";
import type { Matching } from "../types/matching.ts";

import { isBigInt } from "../utils/is.ts";
import { inspectNumeric } from "../utils/inspectNumeric.ts";

import { exec as bigExec } from "./bigMunkres.ts";
import { exec as numExec } from "./numMunkres.ts";

/**
 * Internal options for the dispatcher. The public-facing
 * `MunkresOptions` (in `src/munkres.options.ts`) is shaped to match.
 */
interface ExecOptions {
  finite?: boolean;
}

/**
 * Find the optimal assignments of `y` workers to `x` jobs to
 * minimize total cost.
 *
 * @param costMatrix - The cost matrix, where `mat[y][x]` represents the cost
 * of assigning worker `y` to job `x`.
 * @param options - Internal dispatch options. See {@link ExecOptions}.
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
export function exec(
  costMatrix: MatrixLike<number>,
  options?: ExecOptions,
): Matching<number>;
export function exec(
  costMatrix: MatrixLike<bigint>,
  options?: ExecOptions,
): Matching<bigint>;
export function exec<T extends number | bigint>(
  costMatrix: MatrixLike<T>,
  options?: ExecOptions,
): Matching<T> {
  // If bigint (i.e. finite) matrix
  if (isBigInt((costMatrix[0] ?? [])[0])) {
    return bigExec(costMatrix as MatrixLike<bigint>) as Matching<T>;
  }

  // If caller promises finite values
  const numMatrix = costMatrix as MatrixLike<number>;
  if (options?.finite) {
    return bigExec(numMatrix) as Matching<T>;
  }

  // Inspect the matrix
  const inspection = inspectNumeric(numMatrix);

  // If the matrix contains NaN
  if (inspection.nanAt) {
    throw new TypeError(
      `munkres: cost matrix contains NaN at ` +
        `[${inspection.nanAt[0]}][${inspection.nanAt[1]}]. ` +
        `Use Infinity to mark forbidden assignments.`,
    );
  }

  // If the matrix contains ±Infinity
  if (inspection.infinityAt) {
    // Use route with Infinity-handling logic
    return numExec(numMatrix) as Matching<T>;
  }

  // Check the input range is safe. The algorithm's worst-case intermediate
  // values is 2 * (max - min). If 2 * (max - min) > MAX_VALUE, overflow
  // may occur. Enforcement ensures safe inputs and representable values.
  if (
    inspection.rangeMin != null &&
    inspection.rangeMax != null &&
    inspection.rangeMax - inspection.rangeMin > Number.MAX_VALUE / 2
  ) {
    throw new RangeError(
      `munkres: cost matrix range (max - min = ${
        inspection.rangeMax - inspection.rangeMin
      }) exceeds Number.MAX_VALUE / 2; intermediate arithmetic may overflow. ` +
        `Scale your cost matrix down, or use a bigint cost matrix.`,
    );
  }

  return bigExec(numMatrix) as Matching<T>;
}
