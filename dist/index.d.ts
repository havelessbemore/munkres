import { Matrix } from './types/matrix';
import { MatrixLike } from './types/matrixLike';
import { Pair } from './types/pair';

/**
 * Creates a copy from a given matrix or matrix-like input.
 *
 * @param matrix - The matrix to be copied.
 *
 * @returns A copy of the given matrix.
 */
export declare function copyMatrix<T>(matrix: MatrixLike<T>): Matrix<T>;

/**
 * Constructs a matrix from a set of row
 * and column objects using a provided callback function.
 *
 * @param rows - An array of row objects (such as workers).
 * @param cols - An array of column objects (such as jobs).
 * @param callbackFn - Given a row and a column, returns a value.
 *
 * @returns A matrix where the values at position `[r][c]`
 * represent the value derived from row `r` and column `c`.
 *
 * @example
 * ```typescript
 * // Define workers, jobs, and a simple cost function
 * const workers = ['Alice', 'Bob'];
 * const jobs = ['Job1', 'Job2'];
 * const costFn = (worker: string, job: string) => worker.length + job.length;
 *
 * // Create a cost matrix
 * const costs = createMatrix(workers, jobs, costFn);
 * // [
 * //   [9, 9], // ['Alice' + 'Job1', 'Alice' + 'Job2']
 * //   [7, 7]  // [  'Bob' + 'Job1',   'Bob' + 'Job2']
 * // ]
 * ```
 */
export declare function createMatrix<R, C, T>(rows: ArrayLike<R>, cols: ArrayLike<C>, callbackFn: (row: R, col: C) => T): Matrix<T>;

/**
 * Constructs a matrix with given dimensions
 * using a provided callback function.
 *
 * @param rows - The number of rows in the matrix.
 * @param cols - The number of columns in the matrix.
 * @param callbackFn - Given row and column indices, returns a value.
 *
 * @returns A matrix where the values at position `[r][c]`
 * represent the value derived from row `r` and column `c`.
 *
 * @example
 * ```typescript
 * // Define workers, jobs, and a simple cost function
 * const workers = ['Alice', 'Bob'];
 * const jobs = ['Job1', 'Job2'];
 * const costFn = (w: number, j: number) => workers[w].length + jobs[j].length;
 *
 * // Create a cost matrix
 * const costs = createMatrix(workers.length, jobs.length, costFn);
 * // [
 * //   [9, 9], // ['Alice' + 'Job1', 'Alice' + 'Job2']
 * //   [7, 7]  // [  'Bob' + 'Job1',   'Bob' + 'Job2']
 * // ]
 * ```
 */
export declare function genMatrix<T>(rows: number, cols: number, callbackFn: (row: number, col: number) => T): Matrix<T>;

/**
 * Finds the maximum value in a given matrix.
 *
 * @param matrix - The matrix.
 *
 * @returns The maximum value, or `undefined` if the matrix is empty.
 */
export declare function getMatrixMax(matrix: MatrixLike<number>): number | undefined;

export declare function getMatrixMax(matrix: MatrixLike<bigint>): bigint | undefined;

/**
 * Finds the minimum value in a given matrix.
 *
 * @param matrix - The matrix.
 *
 * @returns The minimum value, or `undefined` if the matrix is empty.
 */
export declare function getMatrixMin(matrix: MatrixLike<number>): number | undefined;

export declare function getMatrixMin(matrix: MatrixLike<bigint>): bigint | undefined;

/**
 * Inverts the values in a given matrix by
 * subtracting each element from a specified large value.
 *
 * This is useful for converting a profit matrix
 * into a cost matrix, or vice versa.
 *
 * @param matrix - The cost matrix to be inverted. Modified in place.
 * @param bigVal - (Optional) A large value used as the basis for inversion.
 * If not provided, the maximum value in the matrix is used.
 *
 * @example
 * const matrix = [
 *   [1, 2, 3],
 *   [4, 5, 6]
 * ];
 *
 * // Invert the matrix
 * invertMatrix(matrix);
 *
 * // matrix is now:
 * // [
 * //   [5, 4, 3],
 * //   [2, 1, 0]
 * // ]
 *
 * @example
 * const matrix = [
 *   [10, 20],
 *   [30, 40]
 * ];
 *
 * // Invert the matrix with a given bigVal
 * invertMatrix(matrix, 50);
 *
 * // matrix is now:
 * // [
 * //   [40, 30],
 * //   [20, 10]
 * // ]
 */
export declare function invertMatrix(matrix: Matrix<number>, bigVal?: number): void;

export declare function invertMatrix(matrix: Matrix<bigint>, bigVal?: bigint): void;

export { Matrix }

export { MatrixLike }

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
declare function munkres(costMatrix: MatrixLike<number>): Pair<number>[];

declare function munkres(costMatrix: MatrixLike<bigint>): Pair<number>[];
export default munkres;
export { munkres }

/**
 * Negates the values in a given matrix.
 *
 * This is useful for converting a profit matrix
 * into a cost matrix, or vice versa.
 *
 * @param matrix - The matrix to be negated. Modified in place.
 *
 * @example
 * const matrix = [
 *   [1,  2, 3],
 *   [4, -5, 6],
 *   [7,  8, 9]
 * ];
 *
 * // Negate the matrix
 * negateMatrix(matrix);
 *
 * // matrix is now:
 * // [
 * //   [-1, -2, -3],
 * //   [-4,  5, -6],
 * //   [-7, -8, -9]
 * // ]
 */
export declare function negateMatrix(matrix: Matrix<number>): void;

export declare function negateMatrix(matrix: Matrix<bigint>): void;

export { Pair }

export { }
