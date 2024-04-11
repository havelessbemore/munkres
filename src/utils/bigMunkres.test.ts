import { describe, it, expect } from "vitest";

import { exec } from "./bigMunkres";

describe(`${exec.name}()`, () => {
  it("handles an empty matrix without error", () => {
    expect(exec([])).toEqual([]);
  });

  it("throws an error if M > N in an MxN matrix", () => {
    expect(() =>
      exec([
        [1n, 2n],
        [3n, 4n],
        [5n, 6n],
      ])
    ).toThrow(RangeError);
  });
});
