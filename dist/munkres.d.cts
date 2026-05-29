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
 * Options for {@link munkres}.
 *
 * @see {@link munkres}
 */
interface MunkresOptions {
    /**
     * Promise that the matrix contains only finite values (no `Infinity`,
     * `-Infinity`, or `NaN`) and that its range is in-bounds for the
     * algorithm's arithmetic.
     *
     * When `true`, the algorithm skips the O(Y*X) entry scan and
     * dispatches straight to the faster all-finite code path. This also
     * **bypasses the {@link RangeError} thrown when `max(c) - min(c)`
     * exceeds `Number.MAX_VALUE / 2`** — the caller becomes responsible
     * for that invariant. If the input violates either promise (a
     * non-finite cell, a `NaN`, or a too-wide range), the result is
     * undefined: the algorithm may produce a wrong assignment, return
     * cells containing `Infinity` / `NaN`, or throw a deep arithmetic
     * error. It never throws a clean `RangeError` / `TypeError` from
     * this option's path.
     *
     * Has no effect for bigint matrices (bigint cannot be non-finite and
     * has no overflow bound).
     *
     * @default false
     */
    finite?: boolean;
}

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
 *   `Infinity` to avoid an assignment instead.
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
 *   never range-checked. Those inputs cannot overflow the same way,
 *   since the `±Infinity` cells are saturated rather than summed.
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
declare function munkres(costMatrix: MatrixLike<number>, options?: MunkresOptions): Pair<number>[];
declare function munkres(costMatrix: MatrixLike<bigint>, options?: MunkresOptions): Pair<number>[];

export { type Matrix, type MatrixLike, type MunkresOptions, type Pair, copyMatrix, createMatrix, munkres as default, genMatrix, getMatrixMax, getMatrixMin, invertMatrix, munkres, negateMatrix };
