import {
  testInfinity,
  testLong,
  testMatrixLike,
  testSquare,
  testWide,
} from "../tests/munkres.ts";

import { munkres } from "./munkres.ts";

testSquare(munkres);
testSquare(munkres, true);
testWide(munkres);
testWide(munkres, true);
testLong(munkres);
testLong(munkres, true);
testInfinity(munkres);
testMatrixLike(munkres);
