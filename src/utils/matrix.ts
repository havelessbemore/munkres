import { Matrix } from "../types/matrix";

export function copy<T>(mat: Matrix<T>): Matrix<T> {
  const Y = mat.length;
  const out: Matrix<T> = new Array(Y);

  for (let y = 0; y < Y; ++y) {
    out[y] = Array.from(mat[y]);
  }

  return out;
}
