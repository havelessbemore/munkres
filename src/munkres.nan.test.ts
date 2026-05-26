import { describe, expect, test } from "vitest";
import { munkres } from "./munkres";

describe("munkres NaN validation", () => {
  test("throws TypeError when input contains NaN", () => {
    const m = [
      [1, 2],
      [NaN, 4],
    ];
    expect(() => munkres(m)).toThrow(TypeError);
    expect(() => munkres(m)).toThrow(/NaN/);
  });

  test("includes the offending coordinates in the error message", () => {
    const m = [
      [1, 2, 3],
      [4, 5, 6],
      [7, NaN, 9],
    ];
    expect(() => munkres(m)).toThrow(/\[2\]\[1\]/);
  });

  test("does not throw on Infinity", () => {
    const m = [
      [Infinity, 1],
      [2, Infinity],
    ];
    expect(() => munkres(m)).not.toThrow();
  });

  test("does not affect bigint inputs (no NaN possible)", () => {
    const m = [
      [1n, 2n],
      [3n, 4n],
    ];
    expect(() => munkres(m)).not.toThrow();
  });
});
