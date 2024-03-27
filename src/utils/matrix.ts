import { Matrix } from "../types/matrix";

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
    dupe[y] = Array.from(matrix[y]);
  }
  return dupe;
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
 * Calls a defined callback function on each element
 * of a matrix, and returns a new matrix of the results.
 *
 * @param matrix - The original matrix.
 * @param callbackfn — A function that accepts up to four arguments.
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
 * console.log(map(matrix, v => v * v));
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
