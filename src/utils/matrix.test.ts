import { describe, expect, test, vi } from "vitest";

import type { Matrix } from "../types/matrix.ts";
import type { Pair } from "../types/pair.ts";

import {
  create,
  flipH,
  flipV,
  from,
  gen,
  invert,
  map,
  negate,
  transpose,
} from "./matrix.ts";
import { getMax } from "./matrixLike.ts";

describe(`${create.name}()`, () => {
  test("handles empty rows and columns", () => {
    const rows: number[] = [];
    const cols: number[] = [];
    const callbackFn = vi.fn();
    const expectedMatrix: number[][] = [];

    expect(create(rows, cols, callbackFn)).toEqual(expectedMatrix);
    expect(callbackFn).not.toHaveBeenCalled();
  });

  test("handles empty rows", () => {
    const rows: string[] = [];
    const cols = ["a", "b", "c"];
    const callbackFn = vi.fn();
    const expectedMatrix: Matrix<string> = [];

    expect(create(rows, cols, callbackFn)).toEqual(expectedMatrix);
    expect(callbackFn).not.toHaveBeenCalled();
  });

  test("handles empty columns", () => {
    const rows = [1, 2];
    const cols: number[] = [];
    const callbackFn = vi.fn();
    const expectedMatrix: Matrix<number> = [[], []];

    expect(create(rows, cols, callbackFn)).toEqual(expectedMatrix);
    expect(callbackFn).not.toHaveBeenCalled();
  });

  test("creates a matrix with specified rows and columns", () => {
    const rows = [1, 2];
    const cols = ["a", "b", "c"];
    const callbackFn = (row: number, col: string) => `${row}${col}`;
    const expectedMatrix = [
      ["1a", "1b", "1c"],
      ["2a", "2b", "2c"],
    ];

    expect(create(rows, cols, callbackFn)).toEqual(expectedMatrix);
  });

  test("populates matrix based on callback logic", () => {
    const rows = [1, 2];
    const cols = [10, 20];
    const callbackFn = (row: number, col: number) => row * col;
    const expectedMatrix = [
      [10, 20],
      [20, 40],
    ];

    expect(create(rows, cols, callbackFn)).toEqual(expectedMatrix);
  });

  test("populates matrix based on callback logic 2", () => {
    const rows = ["Alice", "Bob"];
    const cols = ["Job1", "Job2"];
    const callbackFn = (row: string, col: string) => row.length + col.length;
    const expectedMatrix = [
      [9, 9],
      [7, 7],
    ];

    expect(create(rows, cols, callbackFn)).toEqual(expectedMatrix);
  });

  test("supports complex data types for rows and columns", () => {
    interface Obj {
      id: number;
    }
    const rows: Obj[] = [{ id: 1 }, { id: 2 }];
    const cols = ["status", "value"];
    const callbackFn = (row: Obj, col: string) => `${col}:${row.id}`;
    const expectedMatrix = [
      ["status:1", "value:1"],
      ["status:2", "value:2"],
    ];

    expect(create(rows, cols, callbackFn)).toEqual(expectedMatrix);
  });

  test("creates a matrix with boolean values", () => {
    const rows = [true, false];
    const cols = [1, 0];
    const callbackFn = (row: boolean, col: number) => row && col > 0;
    const expectedMatrix = [
      [true, false],
      [false, false],
    ];

    expect(create(rows, cols, callbackFn)).toEqual(expectedMatrix);
  });
});

describe(`${flipH.name}()`, () => {
  test("handles an empty matrix", () => {
    const mat: Matrix<number> = [];
    flipH(mat);
    expect(mat).toEqual([]);
  });

  test("handles a matrix with empty rows", () => {
    const mat = [[], [], []];
    flipH(mat);
    expect(mat).toEqual([[], [], []]);
  });

  test("flips a 1x1 matrix", () => {
    const matrix = [[2]];
    flipH(matrix);
    expect(matrix).toEqual([[2]]);
  });

  test("flips a matrix with a single row", () => {
    const singleRowMatrix = [[1, 2, 3, 4]];
    flipH(singleRowMatrix);
    expect(singleRowMatrix).toEqual([[4, 3, 2, 1]]);
  });

  test("flips a matrix with a single column", () => {
    const singleColumnMatrix = [[1], [2], [3]];
    flipH(singleColumnMatrix);
    expect(singleColumnMatrix).toEqual([[1], [2], [3]]);
  });

  test("flips a 2x2 matrix", () => {
    const matrix = [
      [1, 2],
      [3, 4],
    ];
    flipH(matrix);
    expect(matrix).toEqual([
      [2, 1],
      [4, 3],
    ]);
  });

  test("flips a 3x3 matrix", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    flipH(matrix);
    expect(matrix).toEqual([
      [3, 2, 1],
      [6, 5, 4],
      [9, 8, 7],
    ]);
  });
});

describe(`${flipV.name}()`, () => {
  test("handles an empty matrix", () => {
    const mat: Matrix<number> = [];
    flipV(mat);
    expect(mat).toEqual([]);
  });

  test("handles a matrix with empty rows", () => {
    const mat = [[], [], []];
    flipV(mat);
    expect(mat).toEqual([[], [], []]);
  });

  test("flips a 1x1 matrix", () => {
    const matrix = [[2]];
    flipV(matrix);
    expect(matrix).toEqual([[2]]);
  });

  test("flips a matrix with a single row", () => {
    const singleRowMatrix = [[1, 2, 3, 4]];
    flipV(singleRowMatrix);
    expect(singleRowMatrix).toEqual([[1, 2, 3, 4]]);
  });

  test("flips a matrix with a single column", () => {
    const singleColumnMatrix = [[1], [2], [3]];
    flipV(singleColumnMatrix);
    expect(singleColumnMatrix).toEqual([[3], [2], [1]]);
  });

  test("flips a 2x2 matrix", () => {
    const matrix = [
      [1, 2],
      [3, 4],
    ];
    flipV(matrix);
    expect(matrix).toEqual([
      [3, 4],
      [1, 2],
    ]);
  });

  test("flips a 3x3 matrix", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    flipV(matrix);
    expect(matrix).toEqual([
      [7, 8, 9],
      [4, 5, 6],
      [1, 2, 3],
    ]);
  });
});

describe(`${from.name}()`, () => {
  test("returns an empty matrix when copying an empty matrix", () => {
    const original: unknown[][] = [];
    const duplicate = from(original);

    // Duplicate equates to but is not the same as the original
    expect(duplicate).toEqual([]);
    expect(duplicate).not.toBe(original);
  });

  test("creates a copy of a matrix of numbers", () => {
    const original = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const duplicate = from(original);

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

  test("creates a copy of a matrix containing objects", () => {
    const original = [
      [{ value: 1 }, { value: 2 }],
      [{ value: 3 }, { value: 4 }],
    ];
    const duplicate = from(original);

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

  test("handles matrices with mixed data types", () => {
    const original = [
      [1, "a", true],
      [{}, [], null],
    ];
    const duplicate = from(original);

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

describe(`${gen.name}()`, () => {
  test("should generate an empty matrix when rows and columns are 0", () => {
    const result = gen(0, 0, () => 0);
    expect(result).toEqual([]);
  });

  test("should generate a matrix with the correct dimensions", () => {
    const rows = 2;
    const cols = 3;
    const result = gen(rows, cols, () => 0);
    expect(result.length).toBe(rows);
    result.forEach((row) => {
      expect(row.length).toBe(cols);
    });
  });

  test("should populate the matrix according to the callback function", () => {
    const rows = 2;
    const cols = 3;
    const callbackFn = (row: number, col: number) => `(${row},${col})`;
    const expectedMatrix = [
      ["(0,0)", "(0,1)", "(0,2)"],
      ["(1,0)", "(1,1)", "(1,2)"],
    ];
    const result = gen(rows, cols, callbackFn);
    expect(result).toEqual(expectedMatrix);
  });

  test("should handle generating a matrix with non-string types", () => {
    const rows = 3;
    const cols = 1;
    const callbackFn = (row: number, col: number) => row + col;
    const expectedMatrix = [[0], [1], [2]];
    const result = gen(rows, cols, callbackFn);
    expect(result).toEqual(expectedMatrix);
  });

  test("should correctly apply complex operations in the callback", () => {
    const rows = 2;
    const cols = 2;
    const callbackFn = (row: number, col: number) => row * col;
    const expectedMatrix = [
      [0, 0],
      [0, 1],
    ];
    const result = gen(rows, cols, callbackFn);
    expect(result).toEqual(expectedMatrix);
  });

  test("should support generating a matrix with custom objects", () => {
    const rows = 1;
    const cols = 2;
    const callbackFn = (row: number, col: number) => ({ row, col });
    const expectedMatrix = [
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ],
    ];
    const result = gen(rows, cols, callbackFn);
    expect(result).toEqual(expectedMatrix);
  });
});

describe(`${invert.name}()`, () => {
  test("handles an empty matrix", () => {
    const mat: Matrix<number> = [];
    invert(mat);
    expect(mat).toEqual([]);
  });

  test("handles a matrix with a single element", () => {
    const mat = [[42]];
    invert(mat);
    expect(mat).toEqual([[0]]);
  });

  test("handles a matrix with a single row", () => {
    const mat = [[3, 2, 1, 4, 5]];
    invert(mat);
    expect(mat).toEqual([[2, 3, 4, 1, 0]]);
  });

  test("handles a matrix with a single column", () => {
    const mat = [[2], [3], [1], [4], [5]];
    invert(mat);
    expect(mat).toEqual([[3], [2], [4], [1], [0]]);
  });

  test("inverts a matrix correctly using the maximum value in the matrix by default", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const maxVal = getMax(mat)!;
    invert(mat);
    expect(mat).toEqual([
      [maxVal - 1, maxVal - 2, maxVal - 3],
      [maxVal - 4, maxVal - 5, maxVal - 6],
    ]);
  });

  test("inverts a matrix correctly with a specified bigVal", () => {
    const mat = [
      [10, 20],
      [30, 40],
    ];
    const bigVal = 50;
    invert(mat, bigVal);
    expect(mat).toEqual([
      [40, 30],
      [20, 10],
    ]);
  });

  test("handles matrices with negative values, using the default maximum value for inversion", () => {
    const mat = [
      [-1, -2, -3],
      [-4, -5, -6],
    ];
    const maxVal = getMax(mat)!;
    invert(mat);
    expect(mat).toEqual([
      [maxVal + 1, maxVal + 2, maxVal + 3],
      [maxVal + 4, maxVal + 5, maxVal + 6],
    ]);
  });

  test("correctly inverts a matrix with all elements being the same value", () => {
    const mat = [
      [5, 5],
      [5, 5],
    ];
    const bigVal = 10;
    invert(mat, bigVal);
    expect(mat).toEqual([
      [5, 5],
      [5, 5],
    ]);
  });

  test("correctly inverts a matrix when bigVal is less than the maximum value in the matrix", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const bigVal = 4;
    invert(mat, bigVal);
    expect(mat).toEqual([
      [3, 2, 1],
      [0, -1, -2],
    ]);
  });
});

describe(`${map.name}()`, () => {
  test("handles an empty matrix", () => {
    const matrix: number[][] = [];
    const result = map(matrix, (value) => value * 2);
    const expected: number[][] = [];

    expect(result).toEqual(expected);
  });

  test("applies a function to every element of a numeric matrix", () => {
    const matrix = [
      [1, 2],
      [3, 4],
    ];
    const result = map(matrix, (value) => value * 2);
    const expected = [
      [2, 4],
      [6, 8],
    ];

    expect(result).toEqual(expected);
  });

  test("passes the correct coordinates to the callback function", () => {
    const matrix = [
      ["a", "b"],
      ["c", "d"],
    ];
    const coords: Pair<number>[] = [];
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

  test("correctly transforms a matrix of strings", () => {
    const matrix = [
      ["hello", "world"],
      ["foo", "bar"],
    ];
    const result = map(matrix, (value) => value.toUpperCase());
    const expected = [
      ["HELLO", "WORLD"],
      ["FOO", "BAR"],
    ];

    expect(result).toEqual(expected);
  });

  test("transforms a matrix with mixed data types", () => {
    const matrix: (number | string)[][] = [
      [1, "a"],
      ["b", 2],
    ];
    const result = map(matrix, (value) => {
      return typeof value === "number" ? value * 2 : value.toUpperCase();
    });
    const expected = [
      [2, "A"],
      ["B", 4],
    ];

    expect(result).toEqual(expected);
  });
});

describe(`${negate.name}()`, () => {
  test("does nothing to an empty matrix", () => {
    const mat: number[][] = [];
    const expected: number[][] = [];
    negate(mat);
    expect(mat).toEqual(expected);
  });

  test("correctly negates a matrix with a single element", () => {
    const mat = [[1]];
    const expected = [[-1]];
    negate(mat);
    expect(mat).toEqual(expected);
  });

  test("correctly negates a matrix with a single row", () => {
    const mat = [[1, -2, 3]];
    const expected = [[-1, 2, -3]];
    negate(mat);
    expect(mat).toEqual(expected);
  });

  test("correctly negates a matrix with a single column", () => {
    const mat = [[1], [-2], [3]];
    const expected = [[-1], [2], [-3]];
    negate(mat);
    expect(mat).toEqual(expected);
  });

  test("negates all elements in a matrix of positive numbers", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const expected = [
      [-1, -2, -3],
      [-4, -5, -6],
      [-7, -8, -9],
    ];
    negate(mat);
    expect(mat).toEqual(expected);
  });

  test("negates all elements in a matrix of negative numbers", () => {
    const mat = [
      [-1, -2, -3],
      [-4, -5, -6],
      [-7, -8, -9],
    ];
    const expected = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    negate(mat);
    expect(mat).toEqual(expected);
  });

  test("handles matrices with zero values correctly", () => {
    const mat = [
      [0, -2, 3],
      [-4, -0, 6],
      [7, -8, 0],
    ];
    const expected = [
      [-0, 2, -3],
      [4, 0, -6],
      [-7, 8, -0],
    ];
    negate(mat);
    expect(mat).toEqual(expected);
  });
});

describe(`${transpose.name}()`, () => {
  test("handles an empty matrix", () => {
    const original: Matrix<number> = [];
    const expected: Matrix<number> = [];
    transpose(original);
    expect(original).toEqual(expected);
  });

  test("handles a 1x1 matrix", () => {
    const original = [[2]];
    const expected = [[2]];
    transpose(original);
    expect(original).toEqual(expected);
  });

  test("handles a matrix with one row", () => {
    const original = [[1, 2, 3]];
    const expected = [[1], [2], [3]];
    transpose(original);
    expect(original).toEqual(expected);
  });

  test("handles a matrix with one column", () => {
    const original = [[1], [2], [3]];
    const expected = [[1, 2, 3]];
    transpose(original);
    expect(original).toEqual(expected);
  });

  test("transposes a 2x3 matrix", () => {
    const original = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const expected = [
      [1, 4],
      [2, 5],
      [3, 6],
    ];
    transpose(original);
    expect(original).toEqual(expected);
  });

  test("transposes a 3x2 matrix", () => {
    const original = [
      [1, 4],
      [2, 5],
      [3, 6],
    ];
    const expected = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    transpose(original);
    expect(original).toEqual(expected);
  });

  test("transposes a square matrix", () => {
    const original = [
      [1, 2],
      [3, 4],
    ];
    const expected = [
      [1, 3],
      [2, 4],
    ];
    transpose(original);
    expect(original).toEqual(expected);
  });
});
