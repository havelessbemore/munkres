import { munkresAsync } from "./munkres";

import { Options, runSuiteAsync } from "../tests/munkres";
import { toMatrixLike } from "../tests/utils";
import { MatrixLike } from "./types/matrixLike";

let opts: Options = {};
runSuiteAsync("square", munkresAsync, opts);
runSuiteAsync("long", munkresAsync, opts);
runSuiteAsync("wide", munkresAsync, opts);
// runSuiteAsync("infinity", munkresAsync, opts);

opts = { isBigInt: true };
runSuiteAsync("square", munkresAsync, opts);
runSuiteAsync("long", munkresAsync, opts);
runSuiteAsync("wide", munkresAsync, opts);

opts = { matrixTransform: (matrix) => toMatrixLike(matrix) };
runSuiteAsync("square", munkresAsync, opts);
runSuiteAsync("long", munkresAsync, opts);
runSuiteAsync("wide", munkresAsync, opts);
//runSuiteAsync("infinity", munkresAsync, opts);

opts = {
  matrixTransform: (matrix: MatrixLike<unknown>): MatrixLike<unknown> => {
    const dupe: ArrayLike<unknown>[] = [];
    for (let y = 0; y < matrix.length; ++y) {
      const row = matrix[y];
      const typed = new Float64Array(row.length);
      for (let x = 0; x < row.length; ++x) {
        typed[x] = row[x] as number;
      }
      dupe[y] = typed;
    }
    return dupe;
  },
};
runSuiteAsync("square", munkresAsync, opts);
runSuiteAsync("long", munkresAsync, opts);
runSuiteAsync("wide", munkresAsync, opts);
//runSuiteAsync("infinity", munkresAsync, opts);
