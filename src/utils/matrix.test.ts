import { describe, it, expect, vi } from "vitest";

import { Matrix } from "../types/matrix";
import { Tuple } from "../types/tuple";

import {
  create,
  flipH,
  flipV,
  from,
  gen,
  invert,
  map,
  negate,
  pad,
  padHeight,
  padWidth,
  rot90,
  rotNeg90,
  toString,
  transpose,
} from "./matrix";
import { getMax } from "./matrixLike";

describe(`${create.name}()`, () => {
  it("handles empty rows and columns", () => {
    const rows: number[] = [];
    const cols: number[] = [];
    const callbackFn = vi.fn();
    const expectedMatrix: number[][] = [];

    expect(create(rows, cols, callbackFn)).toEqual(expectedMatrix);
    expect(callbackFn).not.toHaveBeenCalled();
  });

  it("handles empty rows", () => {
    const rows: string[] = [];
    const cols = ["a", "b", "c"];
    const callbackFn = vi.fn();
    const expectedMatrix: Matrix<string> = [];

    expect(create(rows, cols, callbackFn)).toEqual(expectedMatrix);
    expect(callbackFn).not.toHaveBeenCalled();
  });

  it("handles empty columns", () => {
    const rows = [1, 2];
    const cols: number[] = [];
    const callbackFn = vi.fn();
    const expectedMatrix: Matrix<number> = [[], []];

    expect(create(rows, cols, callbackFn)).toEqual(expectedMatrix);
    expect(callbackFn).not.toHaveBeenCalled();
  });

  it("creates a matrix with specified rows and columns", () => {
    const rows = [1, 2];
    const cols = ["a", "b", "c"];
    const callbackFn = (row: number, col: string) => `${row}${col}`;
    const expectedMatrix = [
      ["1a", "1b", "1c"],
      ["2a", "2b", "2c"],
    ];

    expect(create(rows, cols, callbackFn)).toEqual(expectedMatrix);
  });

  it("populates matrix based on callback logic", () => {
    const rows = [1, 2];
    const cols = [10, 20];
    const callbackFn = (row: number, col: number) => row * col;
    const expectedMatrix = [
      [10, 20],
      [20, 40],
    ];

    expect(create(rows, cols, callbackFn)).toEqual(expectedMatrix);
  });

  it("populates matrix based on callback logic 2", () => {
    const rows = ["Alice", "Bob"];
    const cols = ["Job1", "Job2"];
    const callbackFn = (row: string, col: string) => row.length + col.length;
    const expectedMatrix = [
      [9, 9],
      [7, 7],
    ];

    expect(create(rows, cols, callbackFn)).toEqual(expectedMatrix);
  });

  it("supports complex data types for rows and columns", () => {
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

  it("creates a matrix with boolean values", () => {
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
  it("handles an empty matrix", () => {
    const mat: Matrix<number> = [];
    flipH(mat);
    expect(mat).toEqual([]);
  });

  it("handles a matrix with empty rows", () => {
    const mat = [[], [], []];
    flipH(mat);
    expect(mat).toEqual([[], [], []]);
  });

  it("flips a 1x1 matrix", () => {
    const matrix = [[2]];
    flipH(matrix);
    expect(matrix).toEqual([[2]]);
  });

  it("flips a matrix with a single row", () => {
    const singleRowMatrix = [[1, 2, 3, 4]];
    flipH(singleRowMatrix);
    expect(singleRowMatrix).toEqual([[4, 3, 2, 1]]);
  });

  it("flips a matrix with a single column", () => {
    const singleColumnMatrix = [[1], [2], [3]];
    flipH(singleColumnMatrix);
    expect(singleColumnMatrix).toEqual([[1], [2], [3]]);
  });

  it("flips a 2x2 matrix", () => {
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

  it("flips a 3x3 matrix", () => {
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
  it("handles an empty matrix", () => {
    const mat: Matrix<number> = [];
    flipV(mat);
    expect(mat).toEqual([]);
  });

  it("handles a matrix with empty rows", () => {
    const mat = [[], [], []];
    flipV(mat);
    expect(mat).toEqual([[], [], []]);
  });

  it("flips a 1x1 matrix", () => {
    const matrix = [[2]];
    flipV(matrix);
    expect(matrix).toEqual([[2]]);
  });

  it("flips a matrix with a single row", () => {
    const singleRowMatrix = [[1, 2, 3, 4]];
    flipV(singleRowMatrix);
    expect(singleRowMatrix).toEqual([[1, 2, 3, 4]]);
  });

  it("flips a matrix with a single column", () => {
    const singleColumnMatrix = [[1], [2], [3]];
    flipV(singleColumnMatrix);
    expect(singleColumnMatrix).toEqual([[3], [2], [1]]);
  });

  it("flips a 2x2 matrix", () => {
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

  it("flips a 3x3 matrix", () => {
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
  it("returns an empty matrix when copying an empty matrix", () => {
    const original: unknown[][] = [];
    const duplicate = from(original);

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

  it("creates a copy of a matrix containing objects", () => {
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

  it("handles matrices with mixed data types", () => {
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
  it("should generate an empty matrix when rows and columns are 0", () => {
    const result = gen(0, 0, () => 0);
    expect(result).toEqual([]);
  });

  it("should generate a matrix with the correct dimensions", () => {
    const rows = 2;
    const cols = 3;
    const result = gen(rows, cols, () => 0);
    expect(result.length).toBe(rows);
    result.forEach(row => {
      expect(row.length).toBe(cols);
    });
  });

  it("should populate the matrix according to the callback function", () => {
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

  it("should handle generating a matrix with non-string types", () => {
    const rows = 3;
    const cols = 1;
    const callbackFn = (row: number, col: number) => row + col;
    const expectedMatrix = [[0], [1], [2]];
    const result = gen(rows, cols, callbackFn);
    expect(result).toEqual(expectedMatrix);
  });

  it("should correctly apply complex operations in the callback", () => {
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

  it("should support generating a matrix with custom objects", () => {
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
  it("handles an empty matrix", () => {
    const mat: Matrix<number> = [];
    invert(mat);
    expect(mat).toEqual([]);
  });

  it("handles a matrix with a single element", () => {
    const mat = [[42]];
    invert(mat);
    expect(mat).toEqual([[0]]);
  });

  it("handles a matrix with a single row", () => {
    const mat = [[3, 2, 1, 4, 5]];
    invert(mat);
    expect(mat).toEqual([[2, 3, 4, 1, 0]]);
  });

  it("handles a matrix with a single column", () => {
    const mat = [[2], [3], [1], [4], [5]];
    invert(mat);
    expect(mat).toEqual([[3], [2], [4], [1], [0]]);
  });

  it("inverts a matrix correctly using the maximum value in the matrix by default", () => {
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

  it("inverts a matrix correctly with a specified bigVal", () => {
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

  it("handles matrices with negative values, using the default maximum value for inversion", () => {
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

  it("correctly inverts a matrix with all elements being the same value", () => {
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

  it("correctly inverts a matrix when bigVal is less than the maximum value in the matrix", () => {
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
    const coords: Tuple<number>[] = [];
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

describe(`${negate.name}()`, () => {
  it("does nothing to an empty matrix", () => {
    const mat: number[][] = [];
    const expected: number[][] = [];
    negate(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly negates a matrix with a single element", () => {
    const mat = [[1]];
    const expected = [[-1]];
    negate(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly negates a matrix with a single row", () => {
    const mat = [[1, -2, 3]];
    const expected = [[-1, 2, -3]];
    negate(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly negates a matrix with a single column", () => {
    const mat = [[1], [-2], [3]];
    const expected = [[-1], [2], [-3]];
    negate(mat);
    expect(mat).toEqual(expected);
  });

  it("negates all elements in a matrix of positive numbers", () => {
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

  it("negates all elements in a matrix of negative numbers", () => {
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

  it("handles matrices with zero values correctly", () => {
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

describe(`${pad.name}()`, () => {
  it("correctly pads a matrix to the specified width and height", () => {
    const matrix = [
      [1, 2],
      [3, 4],
    ];
    pad(matrix, 3, 4, 0);
    const expectedMatrix = [
      [1, 2, 0, 0],
      [3, 4, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(matrix).toEqual(expectedMatrix);
  });

  it("pads width only when height already meets the specified value", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    pad(matrix, 2, 5, 0);
    const expectedMatrix = [
      [1, 2, 3, 0, 0],
      [4, 5, 6, 0, 0],
    ];
    expect(matrix).toEqual(expectedMatrix);
  });

  it("pads height only when width already meets the specified value", () => {
    const matrix = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
    ];
    pad(matrix, 4, 4, 0);
    const expectedMatrix = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(matrix).toEqual(expectedMatrix);
  });

  it("does not modify the matrix if it already meets the specified dimensions", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    pad(matrix, 3, 3, 0);
    const expectedMatrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    expect(matrix).toEqual(expectedMatrix);
  });

  it("handles an empty matrix by padding it to the specified dimensions", () => {
    const matrix: Matrix<string> = [];
    pad(matrix, 2, 3, "c"); // Pad an empty matrix to 2x3 with 'c'
    const expectedMatrix = [
      ["c", "c", "c"],
      ["c", "c", "c"],
    ];
    expect(matrix).toEqual(expectedMatrix);
  });
});

describe(`${padHeight.name}()`, () => {
  it("adds rows to meet the specified height with fill value", () => {
    const matrix = [
      [1, 2],
      [3, 4],
    ];
    padHeight(matrix, 4, 0);
    const expectedMatrix = [
      [1, 2],
      [3, 4],
      [0, 0],
      [0, 0],
    ];
    expect(matrix).toEqual(expectedMatrix);
  });

  it("does not modify matrix if it already meets the specified height", () => {
    const originalMatrix = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    padHeight(originalMatrix, 3, 0);
    expect(originalMatrix).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it("does not modify matrix if it already exceeds the specified height", () => {
    const originalMatrix = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    padHeight(originalMatrix, 1, 0);
    expect(originalMatrix).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it("handles empty matrix by filling up to the specified height", () => {
    const matrix: Matrix<string> = [];
    padHeight(matrix, 2, "empty");
    const expectedMatrix = [[], []];
    expect(matrix).toEqual(expectedMatrix);
  });
});

describe(`${padWidth.name}()`, () => {
  it("adds columns to meet the specified width with fill value", () => {
    const matrix = [
      [1, 2],
      [3, 4],
    ];
    padWidth(matrix, 4, 0);
    const expectedMatrix = [
      [1, 2, 0, 0],
      [3, 4, 0, 0],
    ];
    expect(matrix).toEqual(expectedMatrix);
  });

  it("does not modify matrix if it already meets the specified width", () => {
    const originalMatrix = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    padWidth(originalMatrix, 3, 0);
    expect(originalMatrix).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });

  it("does not modify matrix if it already exceeds the specified width", () => {
    const originalMatrix = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    padWidth(originalMatrix, 1, 0);
    expect(originalMatrix).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });

  it("does not modify an empty matrix", () => {
    const matrix: Matrix<string> = [];
    padWidth(matrix, 2, "empty");
    const expectedMatrix: Matrix<string> = [];
    expect(matrix).toEqual(expectedMatrix);
  });
});

describe(`${rot90.name}()`, () => {
  it("handles an empty matrix", () => {
    const mat: Matrix<number> = [];
    rot90(mat);
    expect(mat).toEqual([]);
  });

  it("handles a 1x1 matrix", () => {
    const mat = [[2]];
    rot90(mat);
    expect(mat).toEqual([[2]]);
  });

  it("rotates a 2x2 matrix by 90 degrees clockwise", () => {
    const mat = [
      [1, 2],
      [3, 4],
    ];
    rot90(mat);
    expect(mat).toEqual([
      [3, 1],
      [4, 2],
    ]);
  });

  it("rotates a 2x3 matrix by 90 degrees clockwise", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    rot90(mat);
    expect(mat).toEqual([
      [4, 1],
      [5, 2],
      [6, 3],
    ]);
  });

  it("rotates a 3x2 matrix by 90 degrees clockwise", () => {
    const mat = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    rot90(mat);
    expect(mat).toEqual([
      [5, 3, 1],
      [6, 4, 2],
    ]);
  });

  it("rotates a 3x3 matrix by 90 degrees clockwise", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    rot90(mat);
    expect(mat).toEqual([
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3],
    ]);
  });

  it("correctly rotates a 4x1 matrix by 90 degrees clockwise", () => {
    const mat = [[1], [2], [3], [4]];
    rot90(mat);
    expect(mat).toEqual([[4, 3, 2, 1]]);
  });

  it("correctly rotates a 1x4 matrix by 90 degrees clockwise", () => {
    const mat = [[1, 2, 3, 4]];
    rot90(mat);
    expect(mat).toEqual([[1], [2], [3], [4]]);
  });
});

describe(`${rotNeg90.name}()`, () => {
  it("handles an empty matrix", () => {
    const mat: Matrix<number> = [];
    rotNeg90(mat);
    expect(mat).toEqual([]);
  });

  it("handles a 1x1 matrix", () => {
    const mat = [[2]];
    rotNeg90(mat);
    expect(mat).toEqual([[2]]);
  });

  it("rotates a 2x2 matrix by 90 degrees counterclockwise", () => {
    const mat = [
      [1, 2],
      [3, 4],
    ];
    rotNeg90(mat);
    expect(mat).toEqual([
      [2, 4],
      [1, 3],
    ]);
  });

  it("rotates a 2x3 matrix by 90 degrees counterclockwise", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    rotNeg90(mat);
    expect(mat).toEqual([
      [3, 6],
      [2, 5],
      [1, 4],
    ]);
  });

  it("rotates a 3x2 matrix by 90 degrees counterclockwise", () => {
    const mat = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    rotNeg90(mat);
    expect(mat).toEqual([
      [2, 4, 6],
      [1, 3, 5],
    ]);
  });

  it("rotates a 3x3 matrix by 90 degrees counterclockwise", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    rotNeg90(mat);
    expect(mat).toEqual([
      [3, 6, 9],
      [2, 5, 8],
      [1, 4, 7],
    ]);
  });

  it("rotates a 1x4 matrix by 90 degrees counterclockwise", () => {
    const mat = [[1, 2, 3, 4]];
    rotNeg90(mat);
    expect(mat).toEqual([[4], [3], [2], [1]]);
  });

  it("rotates a 4x1 matrix by 90 degrees counterclockwise", () => {
    const mat = [[1], [2], [3], [4]];
    rotNeg90(mat);
    expect(mat).toEqual([[1, 2, 3, 4]]);
  });
});

describe(`${toString.name}()`, () => {
  it("handles an empty matrix", () => {
    const mat: Matrix<number> = [];
    const expectedString = "";
    expect(toString(mat)).toEqual(expectedString);
  });

  it("handles a 1x1 matrix", () => {
    const mat = [[2]];
    const expectedString = "[2]";
    expect(toString(mat)).toEqual(expectedString);
  });

  it("processes a single row matrix", () => {
    const mat = [[1, 2, 3]];
    const expectedString = "[1, 2, 3]";
    expect(toString(mat)).toEqual(expectedString);
  });

  it("processes a single column matrix", () => {
    const mat = [[1], [2], [3]];
    const expectedString = "[1],\n" + "[2],\n" + "[3]";
    expect(toString(mat)).toEqual(expectedString);
  });

  it("converts a numeric matrix to a string representation", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const expectedString = "[1, 2, 3],\n[4, 5, 6]";
    expect(toString(mat)).toEqual(expectedString);
  });

  it("converts a matrix with mixed types to a string representation", () => {
    const mat = [
      ["a", 2, true],
      [null, undefined, 5],
    ];
    const expectedString =
      "[   a,         2, true],\n" + "[null, undefined,    5]";
    expect(toString(mat)).toEqual(expectedString);
  });

  it("aligns values properly in columns when converting to string", () => {
    const mat = [
      [1, 100, 1000],
      [20, 200, 20000],
      [300, 3000, 300],
    ];
    const expectedString =
      "[  1,  100,  1000],\n" + "[ 20,  200, 20000],\n" + "[300, 3000,   300]";
    expect(toString(mat)).toEqual(expectedString);
  });
});

describe(`${transpose.name}()`, () => {
  it("handles an empty matrix", () => {
    const original: Matrix<number> = [];
    const expected: Matrix<number> = [];
    transpose(original);
    expect(original).toEqual(expected);
  });

  it("handles a 1x1 matrix", () => {
    const original = [[2]];
    const expected = [[2]];
    transpose(original);
    expect(original).toEqual(expected);
  });

  it("handles a matrix with one row", () => {
    const original = [[1, 2, 3]];
    const expected = [[1], [2], [3]];
    transpose(original);
    expect(original).toEqual(expected);
  });

  it("handles a matrix with one column", () => {
    const original = [[1], [2], [3]];
    const expected = [[1, 2, 3]];
    transpose(original);
    expect(original).toEqual(expected);
  });

  it("transposes a 2x3 matrix", () => {
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

  it("transposes a 3x2 matrix", () => {
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

  it("transposes a square matrix", () => {
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
