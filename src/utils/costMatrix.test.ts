import { describe, it, expect } from "vitest";

import {
  createCostMatrix,
  getMaxCost,
  getMinCost,
  invertCostMatrix,
  negateCostMatrix,
  reduceCols,
  reduceRows,
} from "./costMatrix";

describe(`${createCostMatrix.name}()`, () => {
  it("handles empty arrays of workers and jobs", () => {
    const workers: string[] = [];
    const jobs: string[] = [];
    const costFn = (worker: string, job: string) => worker.length + job.length;

    const expectedMatrix: number[][] = [];

    const matrix = createCostMatrix(workers, jobs, costFn);

    expect(matrix).toEqual(expectedMatrix);
  });

  it("correctly computes a cost matrix for workers and jobs", () => {
    const workers = ["Alice", "Bob"];
    const jobs = ["Job1", "Job2"];
    const costFn = (worker: string, job: string) => worker.length + job.length;

    const expectedMatrix = [
      [9, 9], // ['Alice' + 'Job1', 'Alice' + 'Job2']
      [7, 7], // [  'Bob' + 'Job1',   'Bob' + 'Job2']
    ];

    const matrix = createCostMatrix(workers, jobs, costFn);

    expect(matrix).toEqual(expectedMatrix);
  });

  it("computes correct costs with a more complex cost function", () => {
    const workers = ["Alice", "Bob"];
    const jobs = ["Job1", "Job2"];
    const costFn = (worker: string, job: string) =>
      Math.abs(worker.length - job.length);

    const expectedMatrix = [
      [1, 1], // [|'Alice' - 'Job1'|, |'Alice' - 'Job2'|]
      [1, 1], // [  |'Bob' - 'Job1'|,   |'Bob' - 'Job2'|]
    ];

    const matrix = createCostMatrix(workers, jobs, costFn);

    expect(matrix).toEqual(expectedMatrix);
  });

  it("creates a matrix with varying costs", () => {
    const workers = ["John", "Doe"];
    const jobs = ["Cleaning", "Coding"];
    const costFn = (worker: string, job: string) => worker.length * job.length;

    const expectedMatrix = [
      [32, 24], // ['John' * 'Cleaning', 'John' * 'Coding']
      [24, 18], // [ 'Doe' * 'Cleaning',  'Doe' * 'Coding']
    ];

    const matrix = createCostMatrix(workers, jobs, costFn);

    expect(matrix).toEqual(expectedMatrix);
  });
});

describe(`${getMaxCost.name}()`, () => {
  it("returns undefined for an empty matrix", () => {
    const mat = [];
    expect(getMaxCost(mat)).toBeUndefined();
  });

  it("returns undefined for a matrix with empty rows", () => {
    const mat = [[], []];
    expect(getMaxCost(mat)).toBeUndefined();
  });

  it("handles a matrix with a single element", () => {
    const mat = [[42]];
    expect(getMaxCost(mat)).toBe(42);
  });

  it("finds the maximum value in a matrix with a single row", () => {
    const mat = [[1, 2, 3, 4, 5]];
    expect(getMaxCost(mat)).toBe(5);
  });

  it("finds the maximum value in a matrix with a single column", () => {
    const mat = [[1], [2], [3], [4], [5]];
    expect(getMaxCost(mat)).toBe(5);
  });

  it("finds the maximum value in a matrix of positive numbers", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    expect(getMaxCost(mat)).toBe(9);
  });

  it("finds the maximum value in a matrix with negative numbers", () => {
    const mat = [
      [-1, -2, -3],
      [-4, -5, -6],
      [-7, -8, -9],
    ];
    expect(getMaxCost(mat)).toBe(-1);
  });

  it("finds the maximum value in a matrix containing both positive and negative numbers", () => {
    const mat = [
      [-11, 22],
      [33, -44],
    ];
    expect(getMaxCost(mat)).toBe(33);
  });
});

describe(`${getMinCost.name}()`, () => {
  it("returns undefined for an empty matrix", () => {
    const mat = [];
    expect(getMinCost(mat)).toBeUndefined();
  });

  it("returns undefined for a matrix with empty rows", () => {
    const mat = [[], []];
    expect(getMinCost(mat)).toBeUndefined();
  });

  it("handles a matrix with a single element", () => {
    const mat = [[42]];
    expect(getMinCost(mat)).toBe(42);
  });

  it("finds the minimum value in a matrix with a single row", () => {
    const mat = [[3, 2, 1, 4, 5]];
    expect(getMinCost(mat)).toBe(1);
  });

  it("finds the minimum value in a matrix with a single column", () => {
    const mat = [[2], [3], [1], [4], [5]];
    expect(getMinCost(mat)).toBe(1);
  });

  it("finds the minimum value in a matrix of positive numbers", () => {
    const mat = [
      [5, 2, 3],
      [4, 1, 6],
      [7, 8, 9],
    ];
    expect(getMinCost(mat)).toBe(1);
  });

  it("finds the minimum value in a matrix with negative numbers", () => {
    const mat = [
      [-1, -2, -3],
      [-4, -5, -6],
      [-7, -8, -9],
    ];
    expect(getMinCost(mat)).toBe(-9);
  });

  it("finds the minimum value in a matrix containing both positive and negative numbers", () => {
    const mat = [
      [-11, 22],
      [33, -44],
    ];
    expect(getMinCost(mat)).toBe(-44);
  });
});

describe(`${invertCostMatrix.name}()`, () => {
  it("handles an empty matrix", () => {
    const mat = [];
    invertCostMatrix(mat);
    expect(mat).toEqual([]);
  });

  it("handles a matrix with a single element", () => {
    const mat = [[42]];
    invertCostMatrix(mat);
    expect(mat).toEqual([[0]]);
  });

  it("handles a matrix with a single row", () => {
    const mat = [[3, 2, 1, 4, 5]];
    invertCostMatrix(mat);
    expect(mat).toEqual([[2, 3, 4, 1, 0]]);
  });

  it("handles a matrix with a single column", () => {
    const mat = [[2], [3], [1], [4], [5]];
    invertCostMatrix(mat);
    expect(mat).toEqual([[3], [2], [4], [1], [0]]);
  });

  it("inverts a matrix correctly using the maximum value in the matrix by default", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const maxVal = getMaxCost(mat)!;
    invertCostMatrix(mat);
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
    invertCostMatrix(mat, bigVal);
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
    const maxVal = getMaxCost(mat)!;
    invertCostMatrix(mat);
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
    invertCostMatrix(mat, bigVal);
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
    invertCostMatrix(mat, bigVal);
    expect(mat).toEqual([
      [3, 2, 1],
      [0, -1, -2],
    ]);
  });
});

describe(`${negateCostMatrix.name}()`, () => {
  it("does nothing to an empty matrix", () => {
    const mat: number[][] = [];
    const expected: number[][] = [];
    negateCostMatrix(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly negates a matrix with a single element", () => {
    const mat = [[1]];
    const expected = [[-1]];
    negateCostMatrix(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly negates a matrix with a single row", () => {
    const mat = [[1, -2, 3]];
    const expected = [[-1, 2, -3]];
    negateCostMatrix(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly negates a matrix with a single column", () => {
    const mat = [[1], [-2], [3]];
    const expected = [[-1], [2], [-3]];
    negateCostMatrix(mat);
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
    negateCostMatrix(mat);
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
    negateCostMatrix(mat);
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
    negateCostMatrix(mat);
    expect(mat).toEqual(expected);
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
});