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
 */
export function getColMin(
  matrix: Matrix<number>,
  col: number
): number | undefined;
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
 *   [1n, 3n, 2n],
 *   [4n, 0n, 6n],
 *   [7n, 5n, 8n]
 * ];
 * console.log(getColMin(matrix, 2)); // Output: 2n
 */
export function getColMin(
  matrix: Matrix<bigint>,
  col: number
): bigint | undefined;
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
 *   ['b', 'd', 'c'],
 *   ['e', 'a', 'g'],
 *   ['h', 'f', 'i']
 * ];
 * console.log(getColMin(matrix, 0)); // Output: 'b'
 */
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
 * Calls a defined callback function on each element
 * of a matrix, and returns a new matrix of the results.
 *
 * @param matrix - The original matrix.
 * @param callbackfn — A function that accepts up to four arguments.
 * Will be called once per element in the matrix.
 *
 * @returns The result matrix.
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
