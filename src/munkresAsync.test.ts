import { munkresAsync } from "./munkres";

import { Options, runSuiteAsync } from "../tests/munkres";
import { toMatrixLike } from "../tests/utils";

let opts: Options;

opts = {};
runSuiteAsync("square", munkresAsync, opts);
runSuiteAsync("long", munkresAsync, opts);
runSuiteAsync("wide", munkresAsync, opts);

opts = { isBigInt: true };
runSuiteAsync("square", munkresAsync, opts);
runSuiteAsync("long", munkresAsync, opts);
runSuiteAsync("wide", munkresAsync, opts);

opts = { matrixTransform: (matrix) => toMatrixLike(matrix) };
runSuiteAsync("square", munkresAsync, opts);
runSuiteAsync("long", munkresAsync, opts);
runSuiteAsync("wide", munkresAsync, opts);

opts = { isBigInt: true, matrixTransform: (matrix) => toMatrixLike(matrix) };
runSuiteAsync("square", munkresAsync, opts);
runSuiteAsync("long", munkresAsync, opts);
runSuiteAsync("wide", munkresAsync, opts);
