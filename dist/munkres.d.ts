/**
 * Defines a two-dimensional matrix with elements of type `T`.
 *
 * The matrix is represented as a double array. The outer array represents
 * the rows of the matrix, and each inner array represents the columns in a
 * row. This type is generic and can be used to create matrices of any
 * given type, including `number`, `string`, `boolean`, `bigint`, etc.
 *
 * @example
 * const numberMatrix: Matrix<number> = [
 *   [1, 2, 3],
 *   [4, 5, 6],
 *   [7, 8, 9]
 * ];
 *
 * @example
 * const bigintMatrix: Matrix<bigint> = [
 *   [1n, 2n, 3n],
 *   [4n, 5n, 6n],
 *   [7n, 8n, 9n]
 * ];
 *
 * @example
 * const stringMatrix: Matrix<string> = [
 *   ['a', 'b', 'c'],
 *   ['d', 'e', 'f'],
 *   ['g', 'h', 'i']
 * ];
 *
 * @example
 * const booleanMatrix: Matrix<boolean> = [
 *   [true, false, true],
 *   [false, true, false],
 *   [true, true, false]
 * ];
 */
type Matrix<T> = T[][];

/**
 * Defines a two-dimensional, read-only matrix with elements of type `T`.
 *
 * Unlike {@link Matrix}, `MatrixLike` uses {@link ArrayLike} objects,
 * allowing for more flexible matrix-like data structures, such as those made
 * with typed arrays or other sequence-like objects.
 *
 * The outer array represents the rows of the matrix, and each inner array
 * represents the columns in a row. This type is generic and can be used to
 * create matrices of any given type.
 *
 * @example
 * ```typescript
 * const matrix: MatrixLike<number> = {
 *   length: 3,
 *   0: { length: 3, 0: 1, 1: 2, 2: 3 },
 *   1: { length: 3, 0: 4, 1: 5, 2: 6 },
 *   2: { length: 3, 0: 7, 1: 8, 2: 9 }
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Using MatrixLike with NodeList in DOM manipulation
 * const divMatrix: MatrixLike<HTMLElement> = document.querySelectorAll('.foo');
 * ```
 */
type MatrixLike<T> = ArrayLike<ArrayLike<T>>;

/**
 * Represents a pair of elements.
 *
 * The first element is of type `A` and the second element is of type `B`.
 * If not specified, `B` defaults to `A`, signifying a pair of the same
 * type.
 *
 * This is useful for scenarios such as key-value pairs, coordinates, and
 * other dual-element structures.
 *
 * @example
 * ```typescript
 * // A pair of numbers
 * const coordinate: Pair<number> = [15, 20];
 * ```
 *
 * @example
 * ```typescript
 * // A pair of a string and a number
 * const keyValue: Pair<string, number> = ['age', 30];
 * ```
 */
type Pair<A, B = A> = [A, B];

/**
 * Creates a copy from a given matrix or matrix-like input.
 *
 * @param matrix - The matrix to be copied.
 *
 * @returns A copy of the given matrix.
 */
declare function copyMatrix<T>(matrix: MatrixLike<T>): Matrix<T>;
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
declare function createMatrix<R, C, T>(rows: ArrayLike<R>, cols: ArrayLike<C>, callbackFn: (row: R, col: C) => T): Matrix<T>;
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
declare function genMatrix<T>(rows: number, cols: number, callbackFn: (row: number, col: number) => T): Matrix<T>;
/**
 * Finds the maximum value in a given matrix.
 *
 * @param matrix - The matrix.
 *
 * @returns The maximum value, or `undefined` if the matrix is empty.
 */
declare function getMatrixMax(matrix: MatrixLike<number>): number | undefined;
declare function getMatrixMax(matrix: MatrixLike<bigint>): bigint | undefined;
/**
 * Finds the minimum value in a given matrix.
 *
 * @param matrix - The matrix.
 *
 * @returns The minimum value, or `undefined` if the matrix is empty.
 */
declare function getMatrixMin(matrix: MatrixLike<number>): number | undefined;
declare function getMatrixMin(matrix: MatrixLike<bigint>): bigint | undefined;
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
declare function invertMatrix(matrix: Matrix<number>, bigVal?: number): void;
declare function invertMatrix(matrix: Matrix<bigint>, bigVal?: bigint): void;
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
declare function negateMatrix(matrix: Matrix<number>): void;
declare function negateMatrix(matrix: Matrix<bigint>): void;

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

export { type Matrix, type MatrixLike, type Pair, copyMatrix, createMatrix, munkres as default, genMatrix, getMatrixMax, getMatrixMin, invertMatrix, munkres, negateMatrix };
