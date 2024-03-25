import { Matrix } from "../types/matrix";

/**
 * Creates a copy of a given matrix.
 *
 * @param mat - The matrix to be copied.
 *
 * @returns A copy of the input matrix.
 */
export function copy<T>(mat: Matrix<T>): Matrix<T> {
  const Y = mat.length;
  const dupe: Matrix<T> = new Array(Y);
  for (let y = 0; y < Y; ++y) {
    dupe[y] = Array.from(mat[y]);
  }
  return dupe;
}
