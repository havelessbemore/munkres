import { CostFn } from './types/costFn';
import { CostFn as CostFn_2 } from '../types/costFn';
import { CostMatrix } from './types/costMatrix';
import { CostMatrix as CostMatrix_2 } from '../types/costMatrix';
import { Matrix } from './types/matrix';

export { CostFn }

export { CostMatrix }

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
 * const costFn = (worker: string, job: string) => worker.length + job.length;
 *
 * // Create the cost matrix
 * const matrix = createCostMatrix(workers, jobs, costFn);
 * // [
 * //   [9, 9], // ['Alice' + 'Job1', 'Alice' + 'Job2']
 * //   [7, 7]  // [  'Bob' + 'Job1',   'Bob' + 'Job2']
 * // ]
 */
export declare function createCostMatrix<W, J>(workers: W[], jobs: J[], costFn: CostFn_2<W, J>): CostMatrix_2;

/**
 * Finds the maximum value in a given cost matrix.
 *
 * @param mat - The cost matrix.
 *
 * @returns The maximum value, or `undefined` if the matrix is empty.
 */
export declare function getMaxCost(mat: CostMatrix_2): number | undefined;

/**
 * Finds the maximum value in a given cost matrix.
 *
 * @param mat - The cost matrix.
 *
 * @returns The maximum value, or `undefined` if the matrix is empty.
 */
export declare function getMinCost(mat: CostMatrix_2): number | undefined;

/**
 * Inverts the values in a given cost matrix by
 * subtracting each element from a specified large value.
 *
 * This is useful for converting a minimized cost matrix
 * into a maximized cost matrix (or vice versa).
 *
 * @param mat - The cost matrix to be inverted. The matrix is modified in place.
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
export declare function invertCostMatrix(mat: CostMatrix_2, bigVal?: number): void;

export { Matrix }

/**
 * Find the optimal assignments of `y` workers to `x` jobs to
 * minimize total cost.
 *
 * @param mat - The cost matrix where `mat[y][x]` represents the cost of
 * assigning worker `y` to job `x`.
 *
 * @returns An array of pairs `[y, x]` representing the optimal assignment
 * of workers to jobs. Each pair consists of a worker index `y` and a job
 * index `x`, indicating that worker `y` is assigned to job `x`.
 *
 * @remarks
 * Runs the {@link https://en.wikipedia.org/wiki/Hungarian_algorithm | Munkres algorithm (aka Hungarian algorithm)} to solve
 * the {@link https://en.wikipedia.org/wiki/Assignment_problem | assignment problem}.
 */
export declare function munkres(mat: CostMatrix, debug?: boolean): [number, number][];

/**
 * Negates the values in a given cost matrix.
 *
 * This is useful for converting a minimized cost matrix
 * into a maximized cost matrix (or vice versa).
 *
 * @param mat - The cost matrix to be negated. The matrix is modified in place.
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
export declare function negateCostMatrix(mat: CostMatrix_2): void;

export { }
