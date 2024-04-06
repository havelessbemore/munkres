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
export type Matrix<T> = T[][];

/**
 * Defines a function type for mapping operations over a matrix.
 *
 * This function is called for each element of the matrix, allowing each
 * element to be transformed based on its value and position within the
 * matrix. The transformation can depend on the element's current value,
 * its row and column indices, and/or the full matrix.
 *
 * @param value - The current element from the matrix being transformed.
 * @param row - The zero-based row index of the current element.
 * @param col - The zero-based column index of the current element.
 * @param matrix - The entire matrix to which the current element belongs.
 *
 * @returns The transformed value of the current element.
 */
export type MatrixMapFn<T, R> = (
  value: T,
  row: number,
  col: number,
  matrix: Matrix<T>
) => R;
