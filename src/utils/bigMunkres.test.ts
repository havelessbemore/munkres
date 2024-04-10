import { describe, it, expect } from "vitest";

import { bigStep4 } from "./bigMunkres";

describe(`${bigStep4.name}()`, () => {
  it("handles an empty matrix without error", () => {
    expect(bigStep4([])).toEqual([]);
  });

  it("throws an error if M > N in an MxN matrix", () => {
    expect(() =>
      bigStep4([
        [1n, 2n],
        [3n, 4n],
        [5n, 6n],
      ])
    ).toThrow(RangeError);
  });
});
