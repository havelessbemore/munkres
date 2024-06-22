import { describe } from "@jest/globals";

import { munkres } from "./munkres";

import { Options } from "../tests/types/options";
import { runSuite } from "../tests/utils/runSuite";
import { toMatrixLike } from "../tests/utils/toMatrixLike";

describe(`${munkres.name}`, () => {
  let opts: Options;

  // number[][]
  opts = {};
  runSuite("square", munkres, opts);
  runSuite("long", munkres, opts);
  runSuite("wide", munkres, opts);
  runSuite("infinity", munkres, opts);

  // bigint[][]
  opts = { isBigInt: true };
  runSuite("square", munkres, opts);
  runSuite("long", munkres, opts);
  runSuite("wide", munkres, opts);

  // MatrixLike<number>
  opts = { matrixTransform: (matrix) => toMatrixLike(matrix) };
  runSuite("square", munkres, opts);
  runSuite("long", munkres, opts);
  runSuite("wide", munkres, opts);
  runSuite("infinity", munkres, opts);

  // MatrixLike<bigint>
  opts = { isBigInt: true, matrixTransform: (matrix) => toMatrixLike(matrix) };
  runSuite("square", munkres, opts);
  runSuite("long", munkres, opts);
  runSuite("wide", munkres, opts);
});
