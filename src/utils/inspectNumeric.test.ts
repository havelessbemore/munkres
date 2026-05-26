import { describe, expect, test } from "vitest";
import { inspectNumeric } from "./inspectNumeric";

describe("inspectNumeric", () => {
  test("returns {} for an empty outer array", () => {
    expect(inspectNumeric([])).toEqual({});
  });

  test("returns {} for an empty inner array", () => {
    expect(inspectNumeric([[]])).toEqual({});
  });

  test("returns rangeMin/rangeMax for an all-finite non-empty matrix", () => {
    expect(
      inspectNumeric([
        [1, 2, 3],
        [-4, 0, 1e9],
      ]),
    ).toEqual({ rangeMin: -4, rangeMax: 1e9 });
  });

  test("range tracks min and max precisely across rows", () => {
    expect(
      inspectNumeric([
        [5, 5, 5],
        [5, -2.5, 5],
        [5, 5, 7.5],
      ]),
    ).toEqual({ rangeMin: -2.5, rangeMax: 7.5 });
  });

  test("range for a constant matrix is rangeMin === rangeMax", () => {
    expect(
      inspectNumeric([
        [3, 3],
        [3, 3],
      ]),
    ).toEqual({ rangeMin: 3, rangeMax: 3 });
  });

  test("does NOT include rangeMin/rangeMax when NaN present", () => {
    const result = inspectNumeric([
      [1, 2],
      [NaN, 4],
    ]);
    expect(result).toEqual({ nanAt: [1, 0] });
    expect(result).not.toHaveProperty("rangeMin");
    expect(result).not.toHaveProperty("rangeMax");
  });

  test("DOES include rangeMin/rangeMax of finite cells when Infinity present", () => {
    const result = inspectNumeric([
      [1, Infinity],
      [3, 4],
    ]);
    expect(result).toEqual({ infinityAt: [0, 1], rangeMin: 1, rangeMax: 4 });
  });

  test("all-Infinity matrix yields default-sentinel rangeMin/Max", () => {
    // When every cell is ±Infinity, no finite values were seen, so the
    // tracker keeps its initial sentinels (Infinity / -Infinity). The
    // dispatcher routes infinityAt-bearing matrices to numExec and never
    // reads rangeMin/Max, so the sentinels are harmless.
    expect(
      inspectNumeric([
        [Infinity, Infinity],
        [Infinity, -Infinity],
      ]),
    ).toEqual({ infinityAt: [0, 0], rangeMin: Infinity, rangeMax: -Infinity });
  });

  test("returns nanAt for a single NaN", () => {
    const m = [
      [1, 2],
      [NaN, 4],
    ];
    expect(inspectNumeric(m)).toEqual({ nanAt: [1, 0] });
  });

  test("returns the FIRST NaN coordinate (row-major scan)", () => {
    const m = [
      [1, NaN, 3],
      [NaN, NaN, NaN],
    ];
    expect(inspectNumeric(m)).toEqual({ nanAt: [0, 1] });
  });

  test("returns infinityAt for a single +Infinity (plus range of finite cells)", () => {
    const m = [
      [1, 2],
      [Infinity, 4],
    ];
    expect(inspectNumeric(m)).toEqual({
      infinityAt: [1, 0],
      rangeMin: 1,
      rangeMax: 4,
    });
  });

  test("returns infinityAt for a single -Infinity (plus range of finite cells)", () => {
    const m = [
      [1, -Infinity],
      [3, 4],
    ];
    expect(inspectNumeric(m)).toEqual({
      infinityAt: [0, 1],
      rangeMin: 1,
      rangeMax: 4,
    });
  });

  test("returns the FIRST Infinity coordinate; range tracks finite cells only", () => {
    const m = [
      [1, Infinity, -Infinity],
      [Infinity, 5, 6],
    ];
    expect(inspectNumeric(m)).toEqual({
      infinityAt: [0, 1],
      rangeMin: 1,
      rangeMax: 6,
    });
  });

  test("returns only nanAt when both NaN and Infinity are present", () => {
    const m = [
      [Infinity, 2],
      [3, NaN],
    ];
    expect(inspectNumeric(m)).toEqual({ nanAt: [1, 1] });
  });

  test("returns only nanAt even when NaN comes after Infinity in scan", () => {
    const m = [
      [Infinity, 2, 3],
      [4, 5, 6],
      [7, 8, NaN],
    ];
    const result = inspectNumeric(m);
    expect(result).toEqual({ nanAt: [2, 2] });
    expect(result).not.toHaveProperty("infinityAt");
  });
});
