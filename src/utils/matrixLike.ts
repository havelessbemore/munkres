import { MatrixLike } from "../types/matrixLike";

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
export function getMax(matrix: MatrixLike<number>): number | undefined;
export function getMax(matrix: MatrixLike<bigint>): bigint | undefined;
export function getMax(matrix: MatrixLike<string>): string | undefined;
export function getMax<T extends number | bigint | string>(
  matrix: MatrixLike<T>,
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
export function getMin(matrix: MatrixLike<number>): number | undefined;
export function getMin(matrix: MatrixLike<bigint>): bigint | undefined;
export function getMin(matrix: MatrixLike<string>): string | undefined;
export function getMin<T extends number | bigint | string>(
  matrix: MatrixLike<T>,
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
