import { MatrixLike, Pair } from "../src";
import { Runner } from "../src/types/runner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MunkresFn = (costMatrix: MatrixLike<any>) => Pair<number>[];

export type MunkresAsyncFn = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  costMatrix: MatrixLike<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matcher: Runner<any>,
) => Promise<Pair<number>[]>;
