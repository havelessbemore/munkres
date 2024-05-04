import { munkres } from "./munkres";

import { Options, runSuite } from "../tests/munkres";
import { toMatrixLike } from "../tests/utils";
import { MatrixLike } from "./types/matrixLike";

let opts: Options = {};
runSuite("square", munkres, opts);
runSuite("long", munkres, opts);
runSuite("wide", munkres, opts);
runSuite("infinity", munkres, opts);

opts = { isBigInt: true };
runSuite("square", munkres, opts);
runSuite("long", munkres, opts);
runSuite("wide", munkres, opts);

opts = { matrixTransform: (matrix) => toMatrixLike(matrix) };
runSuite("square", munkres, opts);
runSuite("long", munkres, opts);
runSuite("wide", munkres, opts);
runSuite("infinity", munkres, opts);

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
runSuite("square", munkres, opts);
runSuite("long", munkres, opts);
runSuite("wide", munkres, opts);
runSuite("infinity", munkres, opts);
