import { describe, it, expect } from "vitest";

import {
  copy,
  flipH,
  flipV,
  getColMin,
  getMax,
  getMin,
  isSquare,
  map,
  pad,
  padHeight,
  padWidth,
  reduceCols,
  reduceRows,
  rot90,
  rotNeg90,
  transpose,
} from "./matrix";

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

describe(`${flipH.name}()`, () => {
  it("handles an empty matrix", () => {
    const emptyMatrix = [];
    flipH(emptyMatrix);
    expect(emptyMatrix).toEqual([]);
  });

  it("handles a matrix with empty rows", () => {
    const matrixWithEmptyRows = [[], [], []];
    flipH(matrixWithEmptyRows);
    expect(matrixWithEmptyRows).toEqual([[], [], []]);
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
    const emptyMatrix = [];
    flipV(emptyMatrix);
    expect(emptyMatrix).toEqual([]);
  });

  it("handles a matrix with empty rows", () => {
    const matrixWithEmptyRows = [[], [], []];
    flipV(matrixWithEmptyRows);
    expect(matrixWithEmptyRows).toEqual([[], [], []]);
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

describe(`${isSquare.name}()`, () => {
  it("returns true for an empty matrix", () => {
    const emptyMatrix = [];
    expect(isSquare(emptyMatrix)).toBe(true);
  });

  it("returns true for a 1x1 matrix", () => {
    const squareMatrix = [[1]];
    expect(isSquare(squareMatrix)).toBe(true);
  });

  it("returns true for a 2x2 matrix", () => {
    const squareMatrix = [
      [1, 2],
      [3, 4],
    ];
    expect(isSquare(squareMatrix)).toBe(true);
  });

  it("returns true for a 3x3 matrix", () => {
    const squareMatrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    expect(isSquare(squareMatrix)).toBe(true);
  });

  it("returns false for a 2x3 matrix", () => {
    const rectangularMatrix = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    expect(isSquare(rectangularMatrix)).toBe(false);
  });

  it("returns false for a 3x2 matrix", () => {
    const rectangularMatrix = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    expect(isSquare(rectangularMatrix)).toBe(false);
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
    const matrix = [];
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
    const matrix = [];
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
    const matrix = [];
    padWidth(matrix, 2, "empty");
    const expectedMatrix = [];
    expect(matrix).toEqual(expectedMatrix);
  });
});

describe(`${reduceCols.name}()`, () => {
  it("handles an empty matrix", () => {
    const mat: number[][] = [];
    const expected: number[][] = [];
    reduceCols(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly reduces a single element matrix", () => {
    const mat = [[3]];
    const expected = [[0]];
    reduceCols(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly reduces columns of a matrix with a single row", () => {
    const mat = [[3, 1, 4]];
    const expected = [[0, 0, 0]];
    reduceCols(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly reduces columns of a matrix with a single column", () => {
    const mat = [[3], [1], [4]];
    const expected = [[2], [0], [3]];
    reduceCols(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly reduces columns of a non-empty matrix", () => {
    const mat = [
      [3, 1, 4],
      [1, 5, 9],
      [2, 6, 5],
    ];
    const expected = [
      [2, 0, 0],
      [0, 4, 5],
      [1, 5, 1],
    ];
    reduceCols(mat);
    expect(mat).toEqual(expected);
  });

  it("leaves a matrix of zeroes unchanged", () => {
    const mat = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const expected = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    reduceCols(mat);
    expect(mat).toEqual(expected);
  });

  it("handles a matrix with negative values", () => {
    const mat = [
      [-3, -1, -4],
      [-1, -5, -9],
      [-2, -6, -5],
    ];
    const expected = [
      [0, 5, 5],
      [2, 1, 0],
      [1, 0, 4],
    ];
    reduceCols(mat);
    expect(mat).toEqual(expected);
  });

  it("handles a matrix with all the same values", () => {
    const mat = [
      [2, 2, 2],
      [2, 2, 2],
      [2, 2, 2],
    ];
    const expected = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    reduceCols(mat);
    expect(mat).toEqual(expected);
  });

  it("handles a matrix with all Infinity", () => {
    const mat = [
      [Infinity, Infinity, Infinity],
      [Infinity, Infinity, Infinity],
      [Infinity, Infinity, Infinity],
    ];
    const expected = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    reduceCols(mat);
    expect(mat).toEqual(expected);
  });

  it("handles a matrix with all -Infinity", () => {
    const mat = [
      [-Infinity, -Infinity, -Infinity],
      [-Infinity, -Infinity, -Infinity],
      [-Infinity, -Infinity, -Infinity],
    ];
    const expected = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    reduceCols(mat);
    expect(mat).toEqual(expected);
  });

  it("handles a matrix with all Infinity and -Infinity", () => {
    const mat = [
      [Infinity, Infinity, -Infinity],
      [-Infinity, Infinity, -Infinity],
      [Infinity, Infinity, Infinity],
    ];
    const expected = [
      [Infinity, 0, 0],
      [0, 0, 0],
      [Infinity, 0, Infinity],
    ];
    reduceCols(mat);
    expect(mat).toEqual(expected);
  });

  it("handles columns with Infinity correctly", () => {
    const mat = [
      [Infinity, 1, 2],
      [Infinity, 3, 1],
      [Infinity, 2, Infinity],
    ];
    reduceCols(mat);
    expect(mat).toEqual([
      [0, 0, 1],
      [0, 2, 0],
      [0, 1, Infinity],
    ]);
  });

  it("handles columns with -Infinity correctly", () => {
    const mat = [
      [-Infinity, 1, Infinity],
      [0, 3, 1],
      [5, 2, -Infinity],
    ];
    reduceCols(mat);
    expect(mat).toEqual([
      [0, 0, Infinity],
      [Infinity, 2, Infinity],
      [Infinity, 1, 0],
    ]);
  });

  it("performs column-wise reduction on a bigint matrix", () => {
    const costMatrix: bigint[][] = [
      [4n, 1n, 3n],
      [2n, 0n, 5n],
      [3n, 2n, 2n],
    ];
    reduceCols(costMatrix);
    expect(costMatrix).toEqual([
      [2n, 1n, 1n],
      [0n, 0n, 3n],
      [1n, 2n, 0n],
    ]);
  });

  it("handles a column with equal values correctly", () => {
    const costMatrix: bigint[][] = [
      [1n, 2n],
      [1n, 3n],
      [1n, 4n],
    ];
    reduceCols(costMatrix);
    expect(costMatrix).toEqual([
      [0n, 0n],
      [0n, 1n],
      [0n, 2n],
    ]);
  });

  it("deals with a matrix having a single column", () => {
    const costMatrix: bigint[][] = [[5n], [3n], [4n]];
    reduceCols(costMatrix);
    expect(costMatrix).toEqual([[2n], [0n], [1n]]);
  });

  it("handles an empty matrix without error", () => {
    const costMatrix: bigint[][] = [];
    reduceCols(costMatrix);
    expect(costMatrix).toEqual([]);
  });

  it("processes a matrix with a single row", () => {
    const costMatrix: bigint[][] = [[3n, 1n, 4n]];
    reduceCols(costMatrix);
    expect(costMatrix).toEqual([[0n, 0n, 0n]]);
  });
});

describe(`${reduceRows.name}()`, () => {
  it("handles an empty matrix", () => {
    const mat: number[][] = [];
    const expected: number[][] = [];
    reduceRows(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly reduces a single element matrix", () => {
    const mat = [[3]];
    const expected = [[0]];
    reduceRows(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly reduces columns of a matrix with a single row", () => {
    const mat = [[3, 1, 4]];
    const expected = [[2, 0, 3]];
    reduceRows(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly reduces columns of a matrix with a single column", () => {
    const mat = [[3], [1], [4]];
    const expected = [[0], [0], [0]];
    reduceRows(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly reduces columns of a non-empty matrix", () => {
    const mat = [
      [3, 1, 4],
      [1, 5, 9],
      [2, 6, 5],
    ];
    const expected = [
      [2, 0, 3],
      [0, 4, 8],
      [0, 4, 3],
    ];
    reduceRows(mat);
    expect(mat).toEqual(expected);
  });

  it("leaves a matrix of zeroes unchanged", () => {
    const mat = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const expected = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    reduceRows(mat);
    expect(mat).toEqual(expected);
  });

  it("handles a matrix with negative values", () => {
    const mat = [
      [-3, -1, -4],
      [-1, -5, -9],
      [-2, -6, -5],
    ];
    const expected = [
      [1, 3, 0],
      [8, 4, 0],
      [4, 0, 1],
    ];
    reduceRows(mat);
    expect(mat).toEqual(expected);
  });

  it("handles a matrix with all the same values", () => {
    const mat = [
      [2, 2, 2],
      [2, 2, 2],
      [2, 2, 2],
    ];
    const expected = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    reduceRows(mat);
    expect(mat).toEqual(expected);
  });

  it("handles a matrix with all Infinity", () => {
    const mat = [
      [Infinity, Infinity, Infinity],
      [Infinity, Infinity, Infinity],
      [Infinity, Infinity, Infinity],
    ];
    const expected = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    reduceRows(mat);
    expect(mat).toEqual(expected);
  });

  it("handles a matrix with all -Infinity", () => {
    const mat = [
      [-Infinity, -Infinity, -Infinity],
      [-Infinity, -Infinity, -Infinity],
      [-Infinity, -Infinity, -Infinity],
    ];
    const expected = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    reduceRows(mat);
    expect(mat).toEqual(expected);
  });

  it("handles a matrix with all Infinity and -Infinity", () => {
    const mat = [
      [Infinity, Infinity, -Infinity],
      [-Infinity, Infinity, -Infinity],
      [Infinity, Infinity, Infinity],
    ];
    const expected = [
      [Infinity, Infinity, 0],
      [0, Infinity, 0],
      [0, 0, 0],
    ];
    reduceRows(mat);
    expect(mat).toEqual(expected);
  });

  it("handles rows with Infinity correctly", () => {
    const mat = [
      [1, 3, 2],
      [Infinity, Infinity, Infinity],
      [2, Infinity, 3],
    ];
    reduceRows(mat);
    expect(mat).toEqual([
      [0, 2, 1],
      [0, 0, 0],
      [0, Infinity, 1],
    ]);
  });

  it("handles rows with -Infinity correctly", () => {
    const mat = [
      [5, 0, -Infinity],
      [2, 3, 1],
      [-Infinity, 1, Infinity],
    ];
    reduceRows(mat);
    expect(mat).toEqual([
      [Infinity, Infinity, 0],
      [1, 2, 0],
      [0, Infinity, Infinity],
    ]);
  });

  it("performs row-wise reduction on a bigint matrix", () => {
    const costMatrix: bigint[][] = [
      [4n, 1n, 3n],
      [2n, 0n, 5n],
      [3n, 2n, 2n],
    ];
    reduceRows(costMatrix);
    expect(costMatrix).toEqual([
      [3n, 0n, 2n],
      [2n, 0n, 5n],
      [1n, 0n, 0n],
    ]);
  });

  it("handles a row with equal values correctly", () => {
    const costMatrix: bigint[][] = [
      [1n, 1n, 1n],
      [2n, 3n, 4n],
    ];
    reduceRows(costMatrix);
    expect(costMatrix).toEqual([
      [0n, 0n, 0n],
      [0n, 1n, 2n],
    ]);
  });

  it("deals with a matrix having a single row", () => {
    const costMatrix: bigint[][] = [[5n, 3n, 4n]];
    reduceRows(costMatrix);
    expect(costMatrix).toEqual([[2n, 0n, 1n]]);
  });

  it("handles an empty matrix without error", () => {
    const costMatrix: bigint[][] = [];
    reduceRows(costMatrix);
    expect(costMatrix).toEqual([]);
  });

  it("processes a matrix with a single column", () => {
    const costMatrix: bigint[][] = [[3n], [1n], [4n]];
    reduceRows(costMatrix);
    expect(costMatrix).toEqual([[0n], [0n], [0n]]);
  });
});

describe(`${rot90.name}()`, () => {
  it("handles an empty matrix", () => {
    const matrix = [];
    rot90(matrix);
    expect(matrix).toEqual([]);
  });

  it("handles a 1x1 matrix", () => {
    const matrix = [[2]];
    rot90(matrix);
    expect(matrix).toEqual([[2]]);
  });

  it("rotates a 2x2 matrix by 90 degrees clockwise", () => {
    const matrix = [
      [1, 2],
      [3, 4],
    ];
    rot90(matrix);
    expect(matrix).toEqual([
      [3, 1],
      [4, 2],
    ]);
  });

  it("rotates a 2x3 matrix by 90 degrees clockwise", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    rot90(matrix);
    expect(matrix).toEqual([
      [4, 1],
      [5, 2],
      [6, 3],
    ]);
  });

  it("rotates a 3x2 matrix by 90 degrees clockwise", () => {
    const matrix = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    rot90(matrix);
    expect(matrix).toEqual([
      [5, 3, 1],
      [6, 4, 2],
    ]);
  });

  it("rotates a 3x3 matrix by 90 degrees clockwise", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    rot90(matrix);
    expect(matrix).toEqual([
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3],
    ]);
  });

  it("correctly rotates a 4x1 matrix by 90 degrees clockwise", () => {
    const matrix = [[1], [2], [3], [4]];
    rot90(matrix);
    expect(matrix).toEqual([[4, 3, 2, 1]]);
  });

  it("correctly rotates a 1x4 matrix by 90 degrees clockwise", () => {
    const matrix = [[1, 2, 3, 4]];
    rot90(matrix);
    expect(matrix).toEqual([[1], [2], [3], [4]]);
  });
});

describe(`${rotNeg90.name}()`, () => {
  it("handles an empty matrix", () => {
    const matrix = [];
    rotNeg90(matrix);
    expect(matrix).toEqual([]);
  });

  it("handles a 1x1 matrix", () => {
    const matrix = [[2]];
    rotNeg90(matrix);
    expect(matrix).toEqual([[2]]);
  });

  it("rotates a 2x2 matrix by 90 degrees counterclockwise", () => {
    const matrix = [
      [1, 2],
      [3, 4],
    ];
    rotNeg90(matrix);
    expect(matrix).toEqual([
      [2, 4],
      [1, 3],
    ]);
  });

  it("rotates a 2x3 matrix by 90 degrees counterclockwise", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    rotNeg90(matrix);
    expect(matrix).toEqual([
      [3, 6],
      [2, 5],
      [1, 4],
    ]);
  });

  it("rotates a 3x2 matrix by 90 degrees counterclockwise", () => {
    const matrix = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    rotNeg90(matrix);
    expect(matrix).toEqual([
      [2, 4, 6],
      [1, 3, 5],
    ]);
  });

  it("rotates a 3x3 matrix by 90 degrees counterclockwise", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    rotNeg90(matrix);
    expect(matrix).toEqual([
      [3, 6, 9],
      [2, 5, 8],
      [1, 4, 7],
    ]);
  });

  it("rotates a 1x4 matrix by 90 degrees counterclockwise", () => {
    const matrix = [[1, 2, 3, 4]];
    rotNeg90(matrix);
    expect(matrix).toEqual([[4], [3], [2], [1]]);
  });

  it("rotates a 4x1 matrix by 90 degrees counterclockwise", () => {
    const matrix = [[1], [2], [3], [4]];
    rotNeg90(matrix);
    expect(matrix).toEqual([[1, 2, 3, 4]]);
  });
});

describe(`${transpose.name}()`, () => {
  it("handles an empty matrix", () => {
    const original = [];
    const expected = [];
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
