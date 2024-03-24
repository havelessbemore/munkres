import { describe, test } from "vitest";

import { Munkres } from "./munkres";
import { CostMatrix } from "./types/costMatrix";

describe(Munkres.name, () => {
  describe("test()", () => {
    test("test", () => {
      const mat: CostMatrix = [
        [1, 2, 3],
        [2, 4, 6],
        [3, 6, 9],
      ];
      const a = new Munkres(mat);
      a.assign();
    });
  });
});
