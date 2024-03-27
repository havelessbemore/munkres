import { CostFn } from "../types/costFn";
import { CostMatrix } from "../types/costMatrix";
import { getMin as getRowMin } from "./array";
import { getColMin } from "./matrix";

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
  const Y = costMatrix.length;
  const X = costMatrix[0]?.length ?? 0;
  if (Y <= 0 || X <= 0) {
    return undefined;
  }

  let max = costMatrix[0][0];
  for (let y = 0; y < Y; ++y) {
    const row = costMatrix[y];
    for (let x = 0; x < X; ++x) {
      if (max < row[x]) {
        max = row[x];
      }
    }
  }

  return max;
}

/**
 * Finds the maximum value in a given cost matrix.
 *
 * @param costMatrix - The cost matrix.
 *
 * @returns The maximum value, or `undefined` if the matrix is empty.
 */
export function getMinCost(costMatrix: CostMatrix): number | undefined {
  const Y = costMatrix.length;
  const X = costMatrix[0]?.length ?? 0;
  if (Y <= 0 || X <= 0) {
    return undefined;
  }

  let min = costMatrix[0][0];
  for (let y = 0; y < Y; ++y) {
    const row = costMatrix[y];
    for (let x = 0; x < X; ++x) {
      if (min > row[x]) {
        min = row[x];
      }
    }
  }

  return min;
}

/**
 * Inverts the values in a given cost matrix by
 * subtracting each element from a specified large value.
 *
 * This is useful for converting a minimized cost matrix
 * into a maximized cost matrix (or vice versa).
 *
 * @param costMatrix - The cost matrix to be inverted. The matrix is modified in place.
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
  const Y = costMatrix.length;
  const X = costMatrix[0]?.length ?? 0;
  if (Y <= 0 || X <= 0) {
    return undefined;
  }

  bigVal = bigVal ?? getMaxCost(costMatrix)!;
  for (let y = 0; y < Y; ++y) {
    const row = costMatrix[y];
    for (let x = 0; x < X; ++x) {
      row[x] = bigVal - row[x];
    }
  }
}

/**
 * Negates the values in a given cost matrix.
 *
 * This is useful for converting a minimized cost matrix
 * into a maximized cost matrix (or vice versa).
 *
 * @param costMatrix - The cost matrix to be negated. The matrix is modified in place.
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
  const Y = costMatrix.length;
  const X = costMatrix[0]?.length ?? 0;
  for (let y = 0; y < Y; ++y) {
    const row = costMatrix[y];
    for (let x = 0; x < X; ++x) {
      row[x] = -row[x];
    }
  }
}

/**
 * Performs column-wise reduction on a given cost matrix.
 *
 * Each column of the matrix is reduced by subtracting the minimum value
 * in the column from every value in the column.
 *
 * @param costMatrix - The cost matrix. The matrix is modified in place.
 *
 * @example
 * const costMatrix = [
 *   [4, 1, 3],
 *   [2, 0, 5],
 *   [3, 2, 2]
 * ];
 *
 * // Perform reduction
 * reduceCols(costMatrix);
 *
 * // costMatrix now:
 * // [
 * //   [2, 1, 1],
 * //   [0, 0, 3],
 * //   [1, 2, 0]
 * // ]
 */
export function reduceCols(costMatrix: CostMatrix): void {
  const Y = costMatrix.length;
  const X = costMatrix[0]?.length ?? 0;

  for (let x = 0; x < X; ++x) {
    const min = getColMin(costMatrix, x)!;
    if (isFinite(min)) {
      for (let y = 0; y < Y; ++y) {
        costMatrix[y][x] -= min;
      }
    } else {
      for (let y = 0; y < Y; ++y) {
        costMatrix[y][x] = costMatrix[y][x] == min ? 0 : Infinity;
      }
    }
  }
}

/**
 * Performs row-wise reduction on a given cost matrix.
 *
 * Each row of the matrix is reduced by subtracting the minimum value
 * in the row from every value in the row.
 *
 * @param costMatrix - The cost matrix. The matrix is modified in place.
 *
 * @example
 * const costMatrix = [
 *   [4, 1, 3],
 *   [2, 0, 5],
 *   [3, 2, 2]
 * ];
 *
 * // Perform reduction
 * reduceRows(costMatrix);
 *
 * // costMatrix is now:
 * // [
 * //   [3, 0, 2],
 * //   [2, 0, 5],
 * //   [1, 0, 0]
 * // ]
 */
export function reduceRows(costMatrix: CostMatrix): void {
  const Y = costMatrix.length;
  const X = costMatrix[0]?.length ?? 0;

  for (let y = 0; y < Y; ++y) {
    const row = costMatrix[y];
    const min = getRowMin(row)!;
    if (isFinite(min)) {
      for (let x = 0; x < X; ++x) {
        row[x] -= min;
      }
    } else {
      for (let x = 0; x < X; ++x) {
        row[x] = row[x] == min ? 0 : Infinity;
      }
    }
  }
}
