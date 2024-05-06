import { munkres } from "./munkres";

import { Options, runSuite } from "../tests/munkres";
import { toMatrixLike } from "../tests/utils";
import { testInfinity, testLong, testSquare, testWide } from "../tests/meta";

let opts: Options;

opts = {};
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

opts = { isBigInt: true, matrixTransform: (matrix) => toMatrixLike(matrix) };
runSuite("square", munkres, opts);
runSuite("long", munkres, opts);
runSuite("wide", munkres, opts);

// Exhaustive / Meta
testSquare(munkres);
testLong(munkres);
testWide(munkres);
testInfinity(munkres);
