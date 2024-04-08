import { Matrix, MatrixMapFn } from "../types/matrix";

import { getMin as getRowMin } from "./array";
import { isBigInt } from "./is";

/**
 * Creates a copy of a given matrix.
 *
 * @param matrix - The matrix to be copied.
 *
 * @returns A copy of the input matrix.
 */
export function copy<T>(matrix: Matrix<T>): Matrix<T> {
  const Y = matrix.length;
  const dupe: Matrix<T> = new Array(Y);
  for (let y = 0; y < Y; ++y) {
    dupe[y] = matrix[y].slice(0);
  }
  return dupe;
}

/**
 * Creates a matrix with specified rows and columns.
 *
 * The callback function is called for every combination of elements from the
 * `rows` and `columns` arrays, receiving the current row and column elements
 * as arguments, and its return value is used to populate the matrix.
 *
 * @param rows - An array of row elements.
 * @param columns - An array of column elements.
 * @param callbackFn - A function that produces values for the new matrix,
 *                     taking a row element and a column element as arguments.
 *
 * @returns A matrix populated by the results of the `callbackFn` function.
 *
 * @example
 * const rows = [1, 2];
 * const cols = ['a', 'b', 'c'];
 * const callbackFn = (row, col) =\> `${row}${col}`;
 *
 * const matrix = create(rows, cols, callbackFn);
 * // matrix is:
 * // [
 * //   ['1a', '1b', '1c'],
 * //   ['2a', '2b', '2c']
 * // ]
 */
export function create<R, C, T>(
  rows: R[],
  columns: C[],
  callbackFn: (row: R, col: C) => T
): Matrix<T> {
  const Y = rows.length;
  const X = columns.length;
  const mat = new Array<T[]>(Y);
  for (let y = 0; y < Y; ++y) {
    const row = new Array<T>(X);
    for (let x = 0; x < X; ++x) {
      row[x] = callbackFn(rows[y], columns[x]);
    }
    mat[y] = row;
  }
  return mat;
}

/**
 * Flips a matrix horizontally.
 *
 * After the flip, the element at position `[y][x]` moves to `[y][M-x-1]`,
 * where `M` is the number of columns in the matrix.
 *
 * @param matrix - The matrix to be flipped. Modified in place.
 *
 * @example
 * const matrix = [
 *   [1, 2, 3],
 *   [4, 5, 6],
 *   [7, 8, 9]
 * ];
 *
 * flipH(matrix);
 * // matrix is now:
 * // [
 * //   [3, 2, 1],
 * //   [6, 5, 4],
 * //   [9, 8, 7]
 * // ]
 */
export function flipH<T>(matrix: Matrix<T>): void {
  const Y = matrix.length;
  for (let y = 0; y < Y; ++y) {
    matrix[y].reverse();
  }
}

/**
 * Flips a matrix vertically.
 *
 * After the flip, the element at position `[y][x]` moves to `[N-y-1][x]`,
 * where `N` is the number of rows in the matrix.
 *
 * @param matrix - The matrix to be flipped. Modified in place.
 *
 * @example
 * const matrix = [
 *   [1, 2, 3],
 *   [4, 5, 6],
 *   [7, 8, 9]
 * ];
 *
 * flipV(matrix);
 * // matrix is now:
 * // [
 * //   [7, 8, 9],
 * //   [4, 5, 6],
 * //   [1, 2, 3]
 * // ]
 */
export function flipV<T>(matrix: Matrix<T>): void {
  matrix.reverse();
}

/**
 * Generates a matrix with specified rows and columns.
 *
 * The callback function is called with every combination of row and column indices,
 * and its return value is used to populate the matrix.
 *
 * @param rows - The number of rows.
 * @param columns - The number of columns.
 * @param callbackFn - A function that produces values for the new matrix,
 *                     taking a row and column index as arguments.
 *
 * @returns A matrix populated by the results of the `callbackFn` function.
 *
 * @example
 * const rows = 2;
 * const cols = 3;
 * const callbackFn = (row, col) =\> `(${row},${col})`;
 *
 * const matrix = create(rows, cols, callbackFn);
 * // matrix is:
 * // [
 * //   ['(0,0)', '(0,1)', '(0,2)'],
 * //   ['(1,0)', '(1,1)', '(1,2)']
 * // ]
 */
export function gen<T>(
  rows: number,
  cols: number,
  callbackFn: (row: number, col: number) => T
): Matrix<T> {
  const matrix: Matrix<T> = new Array(rows);

  for (let r = 0; r < rows; ++r) {
    const row = new Array(cols);
    for (let c = 0; c < cols; ++c) {
      row[c] = callbackFn(r, c);
    }
    matrix[r] = row;
  }

  return matrix;
}

/**
 * Finds the minimum value in a given column of a matrix.
 *
 * If the matrix is empty, the column is out of bounds, or
 * the function otherwise cannot determine a minimum value,
 * then `undefined` is returned.
 *
 * @param matrix - The matrix to search.
 * @param col - The zero-based column index for the matrix.
 *
 * @returns The minimum value in the given matrix column,
 * or `undefined` if a minimum could not be found.
 *
 * @example
 * const matrix = [
 *   [1, 3, 2],
 *   [4, 0, 6],
 *   [7, 5, 8]
 * ];
 * console.log(getColMin(matrix, 1)); // Output: 0
 *
 * @example
 * const matrix = [
 *   [1n, 3n, 2n],
 *   [4n, 0n, 6n],
 *   [7n, 5n, 8n]
 * ];
 * console.log(getColMin(matrix, 2)); // Output: 2n
 *
 * @example
 * const matrix = [
 *   ['b', 'd', 'c'],
 *   ['e', 'a', 'g'],
 *   ['h', 'f', 'i']
 * ];
 * console.log(getColMin(matrix, 0)); // Output: 'b'
 */
export function getColMin(
  matrix: Matrix<number>,
  col: number
): number | undefined;
export function getColMin(
  matrix: Matrix<bigint>,
  col: number
): bigint | undefined;
export function getColMin(
  matrix: Matrix<string>,
  col: number
): string | undefined;
export function getColMin<T extends number | bigint | string>(
  matrix: Matrix<T>,
  x: number
): T | undefined {
  const Y = matrix.length;
  if (Y <= 0 || x < 0 || x >= matrix[0].length) {
    return undefined;
  }

  let min = matrix[0][x];
  for (let y = 1; y < Y; ++y) {
    if (min > matrix[y][x]) {
      min = matrix[y][x];
    }
  }

  return min;
}

/**
 * Finds the maximum value in a given matrix.
 *
 * @param matrix - The matrix.
 *
 * @returns The maximum value, or `undefined` if the matrix is empty.
 *
 * @example
 * const matrix = [
 *   [1, 3, 2],
 *   [4, 0, 6],
 *   [7, 5, 8]
 * ];
 * console.log(getMax(matrix)); // Output: 8
 *
 * @example
 * const matrix = [
 *   [1n, 3n, 2n],
 *   [4n, 0n, 6n],
 *   [7n, 5n, 8n]
 * ];
 * console.log(getMax(matrix)); // Output: 8n
 *
 * @example
 * const matrix = [
 *   ['b', 'd', 'c'],
 *   ['e', 'a', 'g'],
 *   ['h', 'f', 'i']
 * ];
 * console.log(getMax(matrix)); // Output: 'i'
 */
export function getMax(matrix: Matrix<number>): number | undefined;
export function getMax(matrix: Matrix<bigint>): bigint | undefined;
export function getMax(matrix: Matrix<string>): string | undefined;
export function getMax<T extends number | bigint | string>(
  matrix: Matrix<T>
): T | undefined {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
  if (Y <= 0 || X <= 0) {
    return undefined;
  }

  let max = matrix[0][0];
  for (let y = 0; y < Y; ++y) {
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      if (max < row[x]) {
        max = row[x];
      }
    }
  }

  return max;
}

/**
 * Finds the minimum value in a given matrix.
 *
 * @param matrix - The matrix.
 *
 * @returns The minimum value, or `undefined` if the matrix is empty.
 *
 * @example
 * const matrix = [
 *   [1, 3, 2],
 *   [4, 0, 6],
 *   [7, 5, 8]
 * ];
 * console.log(getMin(matrix)); // Output: 0
 *
 * @example
 * const matrix = [
 *   [1n, 3n, 2n],
 *   [4n, 0n, 6n],
 *   [7n, 5n, 8n]
 * ];
 * console.log(getMin(matrix)); // Output: 0n
 *
 * @example
 * const matrix = [
 *   ['b', 'd', 'c'],
 *   ['e', 'a', 'g'],
 *   ['h', 'f', 'i']
 * ];
 * console.log(getMin(matrix)); // Output: 'a'
 */
export function getMin(matrix: Matrix<number>): number | undefined;
export function getMin(matrix: Matrix<bigint>): bigint | undefined;
export function getMin(matrix: Matrix<string>): string | undefined;
export function getMin<T extends number | bigint | string>(
  matrix: Matrix<T>
): T | undefined {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
  if (Y <= 0 || X <= 0) {
    return undefined;
  }

  let min = matrix[0][0];
  for (let y = 0; y < Y; ++y) {
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      if (min > row[x]) {
        min = row[x];
      }
    }
  }

  return min;
}

/**
 * Inverts the values in a given matrix by
 * subtracting each element from a given large value.
 *
 * @param matrix - The matrix to be inverted. Modified in place.
 * @param bigVal - (Optional) A large value used as the basis for inversion.
 * If not provided, uses the maximum value in the matrix.
 *
 * @example
 * const matrix = [
 *   [1, 2, 3],
 *   [4, 5, 6]
 * ];
 *
 * invert(matrix);
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
 * invert(matrix, 50);
 * // matrix is now:
 * // [
 * //   [40, 30],
 * //   [20, 10]
 * // ]
 */
export function invert(matrix: Matrix<number>, bigVal?: number): void;
export function invert(matrix: Matrix<bigint>, bigVal?: bigint): void;
export function invert<T extends number | bigint>(
  matrix: Matrix<T>,
  bigVal?: T
): void {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
  if (Y <= 0 || X <= 0) {
    return undefined;
  }

  bigVal = bigVal ?? (getMax(matrix as Matrix<number>)! as T);
  for (let y = 0; y < Y; ++y) {
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      row[x] = (bigVal - row[x]) as T;
    }
  }
}

/**
 * Checks if a given matrix is square. A square matrix has an equal number
 * of rows and columns.
 *
 * @param matrix - The matrix to check.
 *
 * @returns `true` if the matrix is square, `false` otherwise.
 *
 * @example
 * console.log(isSquare([
 *   [1, 2],
 *   [3, 4]
 * ])); // Output: true
 *
 * @example
 * console.log(isSquare([
 *    [1, 2, 3],
 *    [4, 5, 6]
 * ])); // Output: false
 */
export function isSquare<T>(matrix: Matrix<T>): boolean {
  return matrix.length == (matrix[0]?.length ?? 0);
}

/**
 * Calls a defined callback function on each element
 * of a matrix, and returns a new matrix of the results.
 *
 * @param matrix - The original matrix.
 * @param callbackfn - A function that accepts up to four arguments.
 * Will be called once per element in the matrix.
 *
 * @returns The result matrix.
 *
 * @example
 * const matrix = [
 *   [1, 3, 2],
 *   [4, 0, 6],
 *   [7, 5, 8]
 * ];
 * console.log(map(matrix, v =\> v * v));
 * // Output: [
 * //   [ 1,  9,  4],
 * //   [16,  0, 36],
 * //   [49, 25, 64]
 * // ]
 */
export function map<A, B>(
  matrix: Matrix<A>,
  callbackFn: (value: A, y: number, x: number, matrix: Matrix<A>) => B
): Matrix<B> {
  const Y = matrix.length;
  const out: Matrix<B> = new Array(Y);
  for (let y = 0; y < Y; ++y) {
    const from = matrix[y];
    const X = from.length;
    const to = new Array(X);
    for (let x = 0; x < X; ++x) {
      to[x] = callbackFn(from[x], y, x, matrix);
    }
    out[y] = to;
  }
  return out;
}

/**
 * Negates the values in a given matrix.
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
 * negate(matrix);
 * // matrix is now:
 * // [
 * //   [-1, -2, -3],
 * //   [-4,  5, -6],
 * //   [-7, -8, -9]
 * // ]
 */
export function negate(matrix: Matrix<number>): void;
export function negate(matrix: Matrix<bigint>): void;
export function negate(matrix: Matrix<number | bigint>): void;
export function negate<T extends number | bigint>(matrix: Matrix<T>): void {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
  for (let y = 0; y < Y; ++y) {
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      row[x] = -row[x] as T;
    }
  }
}

/**
 * Pads a matrix to a specified size with a given fill value.
 *
 * The padding is applied from the ends (right) of each row and
 * the ends (bottom) of each column. If a dimension is already
 * at or above the desired value, no change is made to it.
 *
 * @param matrix - The matrix to pad. Modified in place.
 * @param height - The desired number of rows in the matrix.
 * @param width - The desired number of columns in the matrix.
 * @param fillValue - The value used for padding.
 */
export function pad<T>(
  matrix: Matrix<T>,
  height: number,
  width: number,
  fillValue: T
): void {
  padHeight(matrix, height, fillValue);
  padWidth(matrix, width, fillValue);
}

/**
 * Pads the height (number of rows) of a matrix with a given fill value.
 *
 * Rows are added to the end (bottom) of the matrix until its height reaches
 * `height`, with each new row filled with `fillValue`. If the matrix is
 * already at or above `height`, no change is made.
 *
 * @param matrix - The matrix to pad. Modified in place.
 * @param height - The desired number of rows in the matrix.
 * @param fillValue - The value to use for filling new rows.
 */
export function padHeight<T>(
  matrix: Matrix<T>,
  height: number,
  fillValue: T
): void {
  const Y = matrix.length;
  if (Y >= height) {
    return;
  }

  matrix.length = height;
  const X = matrix[0]?.length ?? 0;
  for (let y = Y; y < height; ++y) {
    matrix[y] = new Array<T>(X).fill(fillValue);
  }
}

/**
 * Pads the width (number of columns) of a matrix with a given fill value.
 *
 * Columns are added to the right of the matrix until its width reaches
 * `width`, with each new column filled with `fillValue`. If the matrix is
 * already at or above `width`, no change is made.
 *
 * @param matrix - The matrix to pad. Modified in place.
 * @param width - The desired number of columns in the matrix.
 * @param fillValue - The value to use for filling new columns.
 */
export function padWidth<T>(
  matrix: Matrix<T>,
  width: number,
  fillValue: T
): void {
  const X = matrix[0]?.length ?? 0;
  if (X >= width) {
    return;
  }

  const Y = matrix.length;
  for (let y = 0; y < Y; ++y) {
    matrix[y].length = width;
    matrix[y].fill(fillValue, X, width);
  }
}

/**
 * Performs column-wise reduction on a given matrix.
 *
 * Each column of the matrix is reduced by subtracting the minimum value
 * in the column from every value in the column.
 *
 * @param matrix - The matrix. Modified in place.
 *
 * @example
 * const matrix = [
 *   [4, 1, 3],
 *   [2, 0, 5],
 *   [3, 2, 2]
 * ];
 *
 * reduceCols(matrix);
 * // matrix now:
 * // [
 * //   [2, 1, 1],
 * //   [0, 0, 3],
 * //   [1, 2, 0]
 * // ]
 */
export function reduceCols(matrix: Matrix<number>): void;
export function reduceCols(matrix: Matrix<bigint>): void;
export function reduceCols(matrix: Matrix<number> | Matrix<bigint>): void;
export function reduceCols<T extends number | bigint>(matrix: Matrix<T>): void {
  // If matrix is empty
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
  if (X <= 0) {
    return;
  }

  // For each column
  for (let x = 0; x < X; ++x) {
    // Find the min
    const min = getColMin(matrix as Matrix<number>, x)! as T;

    // Subtract the min
    if (isBigInt(min) || isFinite(min)) {
      for (let y = 0; y < Y; ++y) {
        matrix[y][x] = (matrix[y][x] - min) as T;
      }
    } else {
      for (let y = 0; y < Y; ++y) {
        matrix[y][x] = (matrix[y][x] == min ? 0 : Infinity) as T;
      }
    }
  }
}

/**
 * Performs row-wise reduction on a given matrix.
 *
 * Each row of the matrix is reduced by subtracting the minimum value
 * in the row from every value in the row.
 *
 * @param matrix - The matrix. Modified in place.
 *
 * @example
 * const matrix = [
 *   [4, 1, 3],
 *   [2, 0, 5],
 *   [3, 2, 2]
 * ];
 *
 * reduceRows(matrix);
 * // matrix is now:
 * // [
 * //   [3, 0, 2],
 * //   [2, 0, 5],
 * //   [1, 0, 0]
 * // ]
 */
export function reduceRows(matrix: Matrix<number>): void;
export function reduceRows(matrix: Matrix<bigint>): void;
export function reduceRows(matrix: Matrix<number> | Matrix<bigint>): void;
export function reduceRows<T extends number | bigint>(matrix: Matrix<T>): void {
  // For each row
  const Y = matrix.length;
  for (let y = 0; y < Y; ++y) {
    // Find the min
    const row = matrix[y];
    const min = getRowMin(row);

    // If row is empty
    if (min == null) {
      continue;
    }

    // Subtract the min
    const X = row.length;
    if (isBigInt(min) || isFinite(min)) {
      for (let x = 0; x < X; ++x) {
        row[x] = (row[x] - min) as T;
      }
    } else {
      for (let x = 0; x < X; ++x) {
        row[x] = (row[x] == min ? 0 : Infinity) as T;
      }
    }
  }
}

/**
 * Rotates a matrix by 90 degrees clockwise.
 *
 * @param matrix - The matrix to be rotated. Modified in place.
 *
 * @example
 * const matrix = [
 *   [1, 2],
 *   [3, 4]
 * ];
 *
 * rot90(matrix);
 * // matrix is now:
 * // [
 * //   [3, 1],
 * //   [4, 2]
 * // ]
 *
 * @example
 * const matrix = [
 *   [1, 2, 3],
 *   [4, 5, 6]
 * ];
 *
 * rot90(matrix);
 * // matrix is now:
 * // [
 * //   [4, 1],
 * //   [5, 2],
 * //   [6, 3]
 * // ]
 */
export function rot90<T>(matrix: Matrix<T>): void {
  flipV(matrix);
  transpose(matrix);
}

/**
 * Rotates a matrix by 90 degrees counterclockwise.
 *
 * @param matrix - The matrix to be rotated. Modified in place.
 *
 * @example
 * const matrix = [
 *   [1, 2],
 *   [3, 4]
 * ];
 *
 * rot90(matrix);
 * // matrix is now:
 * // [
 * //   [2, 4],
 * //   [1, 3]
 * // ]
 *
 * @example
 * const matrix = [
 *   [1, 2, 3],
 *   [4, 5, 6]
 * ];
 *
 * rot90(matrix);
 * // matrix is now:
 * // [
 * //   [3, 6],
 * //   [2, 5],
 * //   [1, 4]
 * // ]
 */
export function rotNeg90<T>(matrix: Matrix<T>): void {
  transpose(matrix);
  flipV(matrix);
}
/**
 * Generates a string representation of a matrix.
 *
 * @param mat - The matrix.
 * @param callbackFn - (Optional) A callback function to convert each element
 * to a string. Defaults to using each elements `toString` method.
 *
 * @returns A string representation of the matrix.
 */
export function toString<T>(
  mat: Matrix<T>,
  callbackFn: MatrixMapFn<T, string> = v => `${v}`
): string {
  const strs: Matrix<string> = map(mat, callbackFn);
  const Y = strs.length;
  const X = strs[0]?.length ?? 0;

  // For each column
  for (let x = 0; x < X; ++x) {
    // Get width
    let width = 0;
    for (let y = 0; y < Y; ++y) {
      width = Math.max(width, strs[y][x].length);
    }

    // Adjust width
    for (let y = 0; y < Y; ++y) {
      strs[y][x] = strs[y][x].padStart(width, " ");
    }
  }

  // Create output
  const buf: string[] = new Array(Y);
  for (let y = 0; y < Y; ++y) {
    buf[y] = `[${strs[y].join(", ")}]`;
  }

  // Return output
  return buf.join(",\n");
}

/**
 * Transpose a given matrix, switching its rows and columns.
 *
 * In the transposed matrix, the value originally at position [y][x]
 * moves to [x][y], effectively turning rows of the original matrix into
 * columns in the output matrix, and vice versa.
 *
 * @param matrix - The matrix to transpose. Modified in place.
 *
 * @example
 * // Transpose a 2x3 matrix to a 3x2 matrix
 * const original = [
 *   [1, 2, 3],
 *   [4, 5, 6]
 * ];
 *
 * transpose(original);
 * // transposed is now:
 * // [
 * //   [1, 4],
 * //   [2, 5],
 * //   [3, 6]
 * // ]
 */
export function transpose<T>(matrix: Matrix<T>): void {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;

  // Transpose shared square
  const N = Math.min(Y, X);
  for (let y = 1; y < N; ++y) {
    for (let x = 0; x < y; ++x) {
      const temp = matrix[y][x];
      matrix[y][x] = matrix[x][y];
      matrix[x][y] = temp;
    }
  }

  // Add columns
  if (Y > X) {
    for (let y = 0; y < X; ++y) {
      matrix[y].length = Y;
      for (let x = X; x < Y; ++x) {
        matrix[y][x] = matrix[x][y];
      }
    }
    matrix.length = X;
  }

  // Add rows
  if (Y < X) {
    matrix.length = X;
    for (let y = Y; y < X; ++y) {
      matrix[y] = new Array(Y);
      for (let x = 0; x < Y; ++x) {
        matrix[y][x] = matrix[x][y];
      }
    }
    for (let y = 0; y < Y; ++y) {
      matrix[y].length = Y;
    }
  }
}
