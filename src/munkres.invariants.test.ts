import { describe } from "vitest";

import { munkres } from "./munkres";

import {
  testFlipH,
  testFlipV,
  testInfinity,
  testLong,
  testSquare,
  testTranspose,
  testWide,
} from "../tests/utils/invariants";
import { Options } from "../tests/types/options";

describe(`${munkres.name}`, () => {
  let opts: Options;

  // number[][]
  opts = {};
  testSquare(munkres, opts);
  testLong(munkres, opts);
  testWide(munkres, opts);
  testInfinity(munkres, opts);
  testFlipH(munkres, opts);
  testFlipV(munkres, opts);
  testTranspose(munkres, opts);

  // bigint[][]
  opts = { isBigInt: true };
  testSquare(munkres, opts);
  testLong(munkres, opts);
  testWide(munkres, opts);
  testFlipH(munkres, opts);
  testFlipV(munkres, opts);
  testTranspose(munkres, opts);
});
