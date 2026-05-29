import { describe, test, expect } from "vitest";

import { entries } from "./arrayLike.ts";

describe(`${entries.name}()`, () => {
  test("should return an empty array for an empty input array", () => {
    expect(entries([])).toEqual([]);
  });

  test("should handle a single element array", () => {
    expect(entries(["foo"])).toEqual([[0, "foo"]]);
  });

  test("should correctly transform an array of strings to index-value pairs", () => {
    const input = ["a", "b", "c"];
    const expectedResult = [
      [0, "a"],
      [1, "b"],
      [2, "c"],
    ];
    expect(entries(input)).toEqual(expectedResult);
  });

  test("should correctly transform an array of numbers to index-value pairs", () => {
    const input = [10, 20, 30];
    const expectedResult = [
      [0, 10],
      [1, 20],
      [2, 30],
    ];
    expect(entries(input)).toEqual(expectedResult);
  });

  test("should handle arrays with mixed types", () => {
    const input = [1, "two", true];
    const expectedResult = [
      [0, 1],
      [1, "two"],
      [2, true],
    ];
    expect(entries(input)).toEqual(expectedResult);
  });
});
