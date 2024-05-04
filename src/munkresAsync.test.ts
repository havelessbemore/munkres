import { munkresAsync } from "./munkres";

import { Options, runSuiteAsync } from "../tests/munkres";
import { MatrixLike } from "./types/matrixLike";

let opts: Options;

/*
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
*/

opts = {
  matrixTransform: toFloatMatrix,
};
runSuiteAsync("square", munkresAsync, opts);
runSuiteAsync("long", munkresAsync, opts);
runSuiteAsync("wide", munkresAsync, opts);
//runSuiteAsync("infinity", munkresAsync, opts);

function toFloatMatrix(matrix: MatrixLike<number>): MatrixLike<number> {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
  const dupe = new Array<Float64Array>(Y);

  for (let y = 0; y < matrix.length; ++y) {
    const row = matrix[y];
    const typed = new Float64Array(X);
    for (let x = 0; x < X; ++x) {
      typed[x] = row[x];
    }
    dupe[y] = typed;
  }

  return dupe;
}
