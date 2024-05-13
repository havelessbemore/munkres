import { MatrixLike } from "../../src";
import { Options } from "../types/options";
import { map } from "../../src/utils/matrix";

export function applyOptions(
  matrix: MatrixLike<unknown>,
  options: Options,
): MatrixLike<unknown> {
  if (options.isBigInt) {
    matrix = map(matrix, (v) => BigInt(v as number));
  }
  if (options.matrixTransform != null) {
    matrix = options.matrixTransform(matrix);
  }
  return matrix;
}
