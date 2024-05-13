import { MatrixLike } from "../../src";

export interface Options {
  isBigInt?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matrixTransform?: (matrix: MatrixLike<any>) => MatrixLike<any>;
}
