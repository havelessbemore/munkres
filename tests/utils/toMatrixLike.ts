import { MatrixLike } from "../../src";

export function toMatrixLike<T>(matrix: MatrixLike<T>): MatrixLike<T> {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
  const obj: {
    length: number;
    [index: number]: { length: number; [index: number]: T };
  } = {
    length: Y,
  };
  for (let y = 0; y < Y; ++y) {
    const row: { length: number; [index: number]: T } = { length: X };
    for (let x = 0; x < X; ++x) {
      row[x] = matrix[y][x];
    }
    obj[y] = row;
  }
  return obj;
}
