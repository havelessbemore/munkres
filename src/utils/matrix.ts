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
