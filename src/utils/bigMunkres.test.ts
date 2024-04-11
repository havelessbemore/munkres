import { describe, it, expect } from "vitest";

import { step4 } from "./bigMunkres";

describe(`${step4.name}()`, () => {
  it("handles an empty matrix without error", () => {
    expect(step4([])).toEqual([]);
  });

  it("throws an error if M > N in an MxN matrix", () => {
    expect(() =>
      step4([
        [1n, 2n],
        [3n, 4n],
        [5n, 6n],
      ])
    ).toThrow(RangeError);
  });
});
