import { describe, it, expect } from "vitest";

import { copy, getColMin, getMax, getMin, map } from "./matrix";

describe(`${copy.name}()`, () => {
  it("returns an empty matrix when copying an empty matrix", () => {
    const original: unknown[][] = [];
    const duplicate = copy(original);

    // Duplicate equates to but is not the same as the original
    expect(duplicate).toEqual([]);
    expect(duplicate).not.toBe(original);
  });

  it("creates a copy of a matrix of numbers", () => {
    const original = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const duplicate = copy(original);

    // Duplicate equates to but is not the same as the original
    expect(duplicate).toEqual(original);
    expect(duplicate).not.toBe(original);
    for (let y = 0; y < original.length; ++y) {
      expect(duplicate[y]).not.toBe(original[y]);
    }

    // Modifying the duplicate does not affect the original
    duplicate[0][0] = 99;
    expect(original[0][0]).toBe(1);
  });

  it("creates a copy of a matrix containing objects", () => {
    const original = [
      [{ value: 1 }, { value: 2 }],
      [{ value: 3 }, { value: 4 }],
    ];
    const duplicate = copy(original);

    // Duplicate equates to but is not the same as the original
    expect(duplicate).toEqual(original);
    expect(duplicate).not.toBe(original);
    for (let y = 0; y < original.length; ++y) {
      expect(duplicate[y]).not.toBe(original[y]);
    }

    // Modifying the duplicate does not affect the original
    duplicate[0][0] = { value: 99 };
    expect(original[0][0].value).toBe(1);

    // Matrix values will be the same
    expect(duplicate[1][1]).toBe(original[1][1]);
  });

  it("handles matrices with mixed data types", () => {
    const original = [
      [1, "a", true],
      [{}, [], null],
    ];
    const duplicate = copy(original);

    // Duplicate equates to but is not the same as the original
    expect(duplicate).toEqual(original);
    expect(duplicate).not.toBe(original);
    for (let y = 0; y < original.length; ++y) {
      expect(duplicate[y]).not.toBe(original[y]);
    }

    // Modifying the duplicate does not affect the original
    duplicate[1][2] = 99;
    expect(original[1][2]).toBeNull();
  });
});

describe(`${getColMin.name}()`, () => {
  it("returns undefined for an empty matrix", () => {
    const matrix: number[][] = [];
    expect(getColMin(matrix, 0)).toBeUndefined();
  });

  it("returns undefined for a column index out of bounds", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    expect(getColMin(matrix, -1)).toBeUndefined();
    expect(getColMin(matrix, 3)).toBeUndefined();
  });

  it("finds the minimum value in a column of a number matrix", () => {
    const matrix = [
      [2, 3, 5],
      [1, 4, 6],
      [3, 2, 1],
    ];
    expect(getColMin(matrix, 1)).toBe(2);
  });

  it("finds the minimum value in a column of a bigint matrix", () => {
    const matrix = [
      [2n, 3n, 5n],
      [1n, 4n, 6n],
      [3n, 2n, 1n],
    ];
    expect(getColMin(matrix, 2)).toBe(1n);
  });

  it("finds the minimum value in a column of a string matrix", () => {
    const matrix = [
      ["b", "d", "c"],
      ["e", "a", "g"],
      ["h", "f", "i"],
    ];
    expect(getColMin(matrix, 0)).toBe("b");
  });

  it("handles a column with equal values correctly", () => {
    const matrix = [
      [3, 1, 2],
      [3, 1, 2],
      [3, 1, 2],
    ];
    expect(getColMin(matrix, 0)).toBe(3);
  });
});

describe(`${getMax.name}()`, () => {
  it("returns undefined for an empty matrix", () => {
    const matrix = [];
    expect(getMax(matrix)).toBeUndefined();
  });

  it("handles matrix with a single row correctly", () => {
    const matrix = [[2, 9, 4]];
    expect(getMax(matrix)).toBe(9);
  });

  it("handles matrix with a single column correctly", () => {
    const matrix = [[2], [9], [4]];
    expect(getMax(matrix)).toBe(9);
  });

  it("handles matrix with a single element correctly", () => {
    const matrix = [[9]];
    expect(getMax(matrix)).toBe(9);
  });

  it("finds the maximum value in a matrix of numbers", () => {
    const matrix = [
      [1, 3, 2],
      [4, 0, 6],
      [7, 5, 8],
    ];
    expect(getMax(matrix)).toBe(8);
  });

  it("finds the maximum value in a matrix of bigints", () => {
    const matrix = [
      [1n, 3n, 2n],
      [4n, 0n, 6n],
      [7n, 5n, 8n],
    ];
    expect(getMax(matrix)).toBe(8n);
  });

  it("finds the maximum value in a matrix of strings", () => {
    const matrix = [
      ["b", "d", "c"],
      ["e", "a", "g"],
      ["h", "f", "i"],
    ];
    expect(getMax(matrix)).toBe("i");
  });
});

describe(`${getMin.name}()`, () => {
  it("returns undefined for an empty matrix", () => {
    const matrix = [];
    expect(getMin(matrix)).toBeUndefined();
  });

  it("handles matrix with a single row correctly", () => {
    const matrix = [[2, 9, 4]];
    expect(getMin(matrix)).toBe(2);
  });

  it("handles matrix with a single column correctly", () => {
    const matrix = [[2], [9], [4]];
    expect(getMin(matrix)).toBe(2);
  });

  it("handles matrix with a single element correctly", () => {
    const matrix = [[9]];
    expect(getMin(matrix)).toBe(9);
  });

  it("finds the minimum value in a matrix of numbers", () => {
    const matrix = [
      [1, 3, 2],
      [4, 0, 6],
      [7, 5, 8],
    ];
    expect(getMin(matrix)).toBe(0);
  });

  it("finds the minimum value in a matrix of bigints", () => {
    const matrix = [
      [1n, 3n, 2n],
      [4n, 0n, 6n],
      [7n, 5n, 8n],
    ];
    expect(getMin(matrix)).toBe(0n);
  });

  it("finds the minimum value in a matrix of strings", () => {
    const matrix = [
      ["b", "d", "c"],
      ["e", "a", "g"],
      ["h", "f", "i"],
    ];
    expect(getMin(matrix)).toBe("a");
  });
});

describe(`${map.name}()`, () => {
  it("handles an empty matrix", () => {
    const matrix: number[][] = [];
    const result = map(matrix, value => value * 2);
    const expected: number[][] = [];

    expect(result).toEqual(expected);
  });

  it("applies a function to every element of a numeric matrix", () => {
    const matrix = [
      [1, 2],
      [3, 4],
    ];
    const result = map(matrix, value => value * 2);
    const expected = [
      [2, 4],
      [6, 8],
    ];

    expect(result).toEqual(expected);
  });

  it("passes the correct coordinates to the callback function", () => {
    const matrix = [
      ["a", "b"],
      ["c", "d"],
    ];
    const coords: [number, number][] = [];
    map(matrix, (value, y, x) => {
      coords.push([y, x]);
      return value.toUpperCase();
    });

    const expectedCoords = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ];

    expect(coords).toEqual(expectedCoords);
  });

  it("correctly transforms a matrix of strings", () => {
    const matrix = [
      ["hello", "world"],
      ["foo", "bar"],
    ];
    const result = map(matrix, value => value.toUpperCase());
    const expected = [
      ["HELLO", "WORLD"],
      ["FOO", "BAR"],
    ];

    expect(result).toEqual(expected);
  });

  it("transforms a matrix with mixed data types", () => {
    const matrix: (number | string)[][] = [
      [1, "a"],
      ["b", 2],
    ];
    const result = map(matrix, value => {
      return typeof value === "number" ? value * 2 : value.toUpperCase();
    });
    const expected = [
      [2, "A"],
      ["B", 4],
    ];

    expect(result).toEqual(expected);
  });
});
