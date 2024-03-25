import { Matrix } from "../types/matrix";

export function copy<T>(mat: Matrix<T>): Matrix<T> {
  const Y = mat.length;
  const X = mat[0]?.length ?? 0;
  const out: Matrix<T> = new Array(Y);

  for (let y = 0; y < Y; ++y) {
    const from = mat[y];
    const to: T[] = new Array(X);
    for (let x = 0; x < X; ++x) {
      to[x] = from[x];
    }
    out[y] = to;
  }

  return out;
}
