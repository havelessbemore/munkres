import { MatrixLike, Pair } from "../../src";

export type MunkresFnAsync = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  costMatrix: MatrixLike<any>,
) => Promise<Pair<number>[]>;
