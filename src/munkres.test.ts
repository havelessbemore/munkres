import {
  testInfinity,
  testLong,
  testMatrixLike,
  testSquare,
  testWide,
} from "../tests/munkres";

import { munkres } from "./munkres";

testSquare(munkres);
testSquare(munkres, true);
testWide(munkres);
testWide(munkres, true);
testLong(munkres);
testLong(munkres, true);
testInfinity(munkres);
testMatrixLike(munkres);
