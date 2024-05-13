import { describe } from "@jest/globals";

import { munkres } from "./munkres";

import { Options, runSuite } from "../tests/munkres";
import { toMatrixLike } from "../tests/utils";
import {
  testFlipH,
  testFlipV,
  testInfinity,
  testLong,
  testSquare,
  testTranspose,
  testWide,
} from "../tests/meta";

describe(`${munkres.name}`, () => {
  let opts: Options;

  // number[][]
  opts = {};
  runSuite("square", munkres, opts);
  runSuite("long", munkres, opts);
  runSuite("wide", munkres, opts);
  runSuite("infinity", munkres, opts);
  testSquare(munkres, opts);
  testLong(munkres, opts);
  testWide(munkres, opts);
  testInfinity(munkres, opts);
  testFlipH(munkres, opts);
  testFlipV(munkres, opts);
  testTranspose(munkres, opts);

  // bigint[][]
  opts = { isBigInt: true };
  runSuite("square", munkres, opts);
  runSuite("long", munkres, opts);
  runSuite("wide", munkres, opts);
  testSquare(munkres, opts);
  testLong(munkres, opts);
  testWide(munkres, opts);
  testFlipH(munkres, opts);
  testFlipV(munkres, opts);
  testTranspose(munkres, opts);

  // MatrixLike<number>
  opts = { matrixTransform: (matrix) => toMatrixLike(matrix) };
  runSuite("square", munkres, opts);
  runSuite("long", munkres, opts);
  runSuite("wide", munkres, opts);
  runSuite("infinity", munkres, opts);
  testSquare(munkres, opts);
  testLong(munkres, opts);
  testWide(munkres, opts);
  testInfinity(munkres, opts);
  testFlipH(munkres, opts);
  testFlipV(munkres, opts);
  testTranspose(munkres, opts);

  // MatrixLike<bigint>
  opts = { isBigInt: true, matrixTransform: (matrix) => toMatrixLike(matrix) };
  runSuite("square", munkres, opts);
  runSuite("long", munkres, opts);
  runSuite("wide", munkres, opts);
  testSquare(munkres, opts);
  testLong(munkres, opts);
  testWide(munkres, opts);
  testFlipH(munkres, opts);
  testFlipV(munkres, opts);
  testTranspose(munkres, opts);
});
