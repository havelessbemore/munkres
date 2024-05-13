import { MatrixLike, Pair } from "../src";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MunkresFn = (costMatrix: MatrixLike<any>) => Pair<number>[];

export type MunkresFnAsync = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  costMatrix: MatrixLike<any>,
) => Promise<Pair<number>[]>;
