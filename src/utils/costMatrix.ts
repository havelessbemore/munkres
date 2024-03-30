import { CostFn } from "../types/costFn";
import { CostMatrix } from "../types/costMatrix";
import { getMax, getMin, invert, negate } from "./matrix";

/**
 * Constructs a cost matrix for a set of
 * workers and jobs using a provided cost function.
 *
 * Each element of the matrix represents the cost associated with assigning a
 * specific worker to a specific job. The cost is determined by `costFn`,
 * which computes the cost based on a worker-job pair.
 *
 * @param workers - An array of workers.
 * @param jobs - An array of jobs.
 * @param costFn - Given a worker and a job, returns the
 * numeric cost of assigning that worker to that job.
 *
 * @returns A {@link CostMatrix} where the values at position `[y][x]`
 * represent the cost of assigning the `y`-th worker to the `x`-th job.
 *
 * @example
 * // Define workers, jobs, and a simple cost function
 * const workers = ['Alice', 'Bob'];
 * const jobs = ['Job1', 'Job2'];
 * const costFn = (worker: string, job: string) =\> worker.length + job.length;
 *
 * // Create the cost matrix
 * const matrix = createCostMatrix(workers, jobs, costFn);
 * // [
 * //   [9, 9], // ['Alice' + 'Job1', 'Alice' + 'Job2']
 * //   [7, 7]  // [  'Bob' + 'Job1',   'Bob' + 'Job2']
 * // ]
 */
export function createCostMatrix<W, J>(
  workers: W[],
  jobs: J[],
  costFn: CostFn<W, J>
): CostMatrix {
  const X = jobs.length;
  const Y = workers.length;
  const mat = new Array<number[]>(Y);
  for (let y = 0; y < Y; ++y) {
    const row = new Array<number>(X);
    for (let x = 0; x < X; ++x) {
      row[x] = costFn(workers[y], jobs[x]);
    }
    mat[y] = row;
  }
  return mat;
}

/**
 * Finds the maximum value in a given cost matrix.
 *
 * @param costMatrix - The cost matrix.
 *
 * @returns The maximum value, or `undefined` if the matrix is empty.
 */
export function getMaxCost(costMatrix: CostMatrix): number | undefined {
  return getMax(costMatrix);
}

/**
 * Finds the maximum value in a given cost matrix.
 *
 * @param costMatrix - The cost matrix.
 *
 * @returns The maximum value, or `undefined` if the matrix is empty.
 */
export function getMinCost(costMatrix: CostMatrix): number | undefined {
  return getMin(costMatrix);
}

/**
 * Inverts the values in a given cost matrix by
 * subtracting each element from a specified large value.
 *
 * This is useful for converting a minimized cost matrix
 * into a maximized cost matrix (or vice versa).
 *
 * @param costMatrix - The cost matrix to be inverted. Modified in place.
 * @param bigVal - (Optional) A large value used as the basis for inversion.
 * If not provided, the maximum value in the matrix is used.
 *
 * @example
 * const costMatrix = [
 *   [1, 2, 3],
 *   [4, 5, 6]
 * ];
 *
 * // Invert the matrix
 * invertCostMatrix(costMatrix);
 *
 * // costMatrix is now:
 * // [
 * //   [5, 4, 3],
 * //   [2, 1, 0]
 * // ]
 *
 * @example
 * const anotherMatrix = [
 *   [10, 20],
 *   [30, 40]
 * ];
 *
 * // Invert the matrix with a given bigVal
 * invertCostMatrix(anotherMatrix, 50);
 *
 * // costMatrix is now:
 * // [
 * //   [40, 30],
 * //   [20, 10]
 * // ]
 */
export function invertCostMatrix(
  costMatrix: CostMatrix,
  bigVal?: number
): void {
  invert(costMatrix, bigVal);
}

/**
 * Negates the values in a given cost matrix.
 *
 * This is useful for converting a minimized cost matrix
 * into a maximized cost matrix (or vice versa).
 *
 * @param costMatrix - The cost matrix to be negated. Modified in place.
 *
 * @example
 * const costMatrix = [
 *   [1,  2, 3],
 *   [4, -5, 6],
 *   [7,  8, 9]
 * ];
 *
 * // Negate the cost matrix
 * negateCostMatrix(costMatrix);
 *
 * // costMatrix is now:
 * // [
 * //   [-1, -2, -3],
 * //   [-4,  5, -6],
 * //   [-7, -8, -9]
 * // ]
 */
export function negateCostMatrix(costMatrix: CostMatrix): void {
  negate(costMatrix);
}
