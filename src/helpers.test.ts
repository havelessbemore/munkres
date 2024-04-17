import { describe, it, expect } from "vitest";

import {
  createMatrix,
  copyMatrix,
  genMatrix,
  getMatrixMax,
  getMatrixMin,
  invertMatrix,
  negateMatrix,
} from "./helpers";
import { Matrix } from ".";

describe(`${copyMatrix.name}()`, () => {
  it("returns an empty matrix when copying an empty matrix", () => {
    const original: unknown[][] = [];
    const duplicate = copyMatrix(original);

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
    const duplicate = copyMatrix(original);

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
    const duplicate = copyMatrix(original);

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
    const duplicate = copyMatrix(original);

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

describe(`${createMatrix.name}()`, () => {
  it("handles empty arrays of workers and jobs", () => {
    const workers: string[] = [];
    const jobs: string[] = [];
    const costFn = (worker: string, job: string) => worker.length + job.length;

    const expectedMatrix: number[][] = [];

    const matrix = createMatrix(workers, jobs, costFn);

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

    const matrix = createMatrix(workers, jobs, costFn);

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

    const matrix = createMatrix(workers, jobs, costFn);

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

    const matrix = createMatrix(workers, jobs, costFn);

    expect(matrix).toEqual(expectedMatrix);
  });
});

describe(`${genMatrix.name}()`, () => {
  it("handles empty arrays of workers and jobs", () => {
    const workers: string[] = [];
    const jobs: string[] = [];
    const costFn = (w: number, j: number) => workers[w].length + jobs[j].length;

    const expectedMatrix: number[][] = [];

    const matrix = genMatrix(workers.length, jobs.length, costFn);

    expect(matrix).toEqual(expectedMatrix);
  });

  it("correctly computes a cost matrix for workers and jobs", () => {
    const workers = ["Alice", "Bob"];
    const jobs = ["Job1", "Job2"];
    const costFn = (w: number, j: number) => workers[w].length + jobs[j].length;

    const expectedMatrix = [
      [9, 9], // ['Alice' + 'Job1', 'Alice' + 'Job2']
      [7, 7], // [  'Bob' + 'Job1',   'Bob' + 'Job2']
    ];

    const matrix = genMatrix(workers.length, jobs.length, costFn);

    expect(matrix).toEqual(expectedMatrix);
  });

  it("computes correct costs with a more complex cost function", () => {
    const workers = ["Alice", "Bob"];
    const jobs = ["Job1", "Job2"];
    const costFn = (w: number, j: number) =>
      Math.abs(workers[w].length - jobs[j].length);

    const expectedMatrix = [
      [1, 1], // [|'Alice' - 'Job1'|, |'Alice' - 'Job2'|]
      [1, 1], // [  |'Bob' - 'Job1'|,   |'Bob' - 'Job2'|]
    ];

    const matrix = genMatrix(workers.length, jobs.length, costFn);

    expect(matrix).toEqual(expectedMatrix);
  });

  it("creates a matrix with varying costs", () => {
    const workers = ["John", "Doe"];
    const jobs = ["Cleaning", "Coding"];
    const costFn = (w: number, j: number) => workers[w].length * jobs[j].length;

    const expectedMatrix = [
      [32, 24], // ['John' * 'Cleaning', 'John' * 'Coding']
      [24, 18], // [ 'Doe' * 'Cleaning',  'Doe' * 'Coding']
    ];

    const matrix = genMatrix(workers.length, jobs.length, costFn);

    expect(matrix).toEqual(expectedMatrix);
  });
});

describe(`${getMatrixMax.name}()`, () => {
  it("returns undefined for an empty matrix", () => {
    const mat: Matrix<number> = [];
    expect(getMatrixMax(mat)).toBeUndefined();
  });

  it("returns undefined for a matrix with empty rows", () => {
    const mat = [[], []];
    expect(getMatrixMax(mat)).toBeUndefined();
  });

  it("handles a matrix with a single element", () => {
    const mat = [[42]];
    expect(getMatrixMax(mat)).toBe(42);
  });

  it("finds the maximum value in a matrix with a single row", () => {
    const mat = [[1, 2, 3, 4, 5]];
    expect(getMatrixMax(mat)).toBe(5);
  });

  it("finds the maximum value in a matrix with a single column", () => {
    const mat = [[1], [2], [3], [4], [5]];
    expect(getMatrixMax(mat)).toBe(5);
  });

  it("finds the maximum value in a matrix of positive numbers", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    expect(getMatrixMax(mat)).toBe(9);
  });

  it("finds the maximum value in a matrix with negative numbers", () => {
    const mat = [
      [-1, -2, -3],
      [-4, -5, -6],
      [-7, -8, -9],
    ];
    expect(getMatrixMax(mat)).toBe(-1);
  });

  it("finds the maximum value in a matrix containing both positive and negative numbers", () => {
    const mat = [
      [-11, 22],
      [33, -44],
    ];
    expect(getMatrixMax(mat)).toBe(33);
  });
});

describe(`${getMatrixMin.name}()`, () => {
  it("returns undefined for an empty matrix", () => {
    const mat: Matrix<number> = [];
    expect(getMatrixMin(mat)).toBeUndefined();
  });

  it("returns undefined for a matrix with empty rows", () => {
    const mat = [[], []];
    expect(getMatrixMin(mat)).toBeUndefined();
  });

  it("handles a matrix with a single element", () => {
    const mat = [[42]];
    expect(getMatrixMin(mat)).toBe(42);
  });

  it("finds the minimum value in a matrix with a single row", () => {
    const mat = [[3, 2, 1, 4, 5]];
    expect(getMatrixMin(mat)).toBe(1);
  });

  it("finds the minimum value in a matrix with a single column", () => {
    const mat = [[2], [3], [1], [4], [5]];
    expect(getMatrixMin(mat)).toBe(1);
  });

  it("finds the minimum value in a matrix of positive numbers", () => {
    const mat = [
      [5, 2, 3],
      [4, 1, 6],
      [7, 8, 9],
    ];
    expect(getMatrixMin(mat)).toBe(1);
  });

  it("finds the minimum value in a matrix with negative numbers", () => {
    const mat = [
      [-1, -2, -3],
      [-4, -5, -6],
      [-7, -8, -9],
    ];
    expect(getMatrixMin(mat)).toBe(-9);
  });

  it("finds the minimum value in a matrix containing both positive and negative numbers", () => {
    const mat = [
      [-11, 22],
      [33, -44],
    ];
    expect(getMatrixMin(mat)).toBe(-44);
  });
});

describe(`${invertMatrix.name}()`, () => {
  it("handles an empty matrix", () => {
    const mat: Matrix<number> = [];
    invertMatrix(mat);
    expect(mat).toEqual([]);
  });

  it("handles a matrix with a single element", () => {
    const mat = [[42]];
    invertMatrix(mat);
    expect(mat).toEqual([[0]]);
  });

  it("handles a matrix with a single row", () => {
    const mat = [[3, 2, 1, 4, 5]];
    invertMatrix(mat);
    expect(mat).toEqual([[2, 3, 4, 1, 0]]);
  });

  it("handles a matrix with a single column", () => {
    const mat = [[2], [3], [1], [4], [5]];
    invertMatrix(mat);
    expect(mat).toEqual([[3], [2], [4], [1], [0]]);
  });

  it("inverts a matrix correctly using the maximum value in the matrix by default", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const maxVal = getMatrixMax(mat)!;
    invertMatrix(mat);
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
    invertMatrix(mat, bigVal);
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
    const maxVal = getMatrixMax(mat)!;
    invertMatrix(mat);
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
    invertMatrix(mat, bigVal);
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
    invertMatrix(mat, bigVal);
    expect(mat).toEqual([
      [3, 2, 1],
      [0, -1, -2],
    ]);
  });
});

describe(`${negateMatrix.name}()`, () => {
  it("does nothing to an empty matrix", () => {
    const mat: number[][] = [];
    const expected: number[][] = [];
    negateMatrix(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly negates a matrix with a single element", () => {
    const mat = [[1]];
    const expected = [[-1]];
    negateMatrix(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly negates a matrix with a single row", () => {
    const mat = [[1, -2, 3]];
    const expected = [[-1, 2, -3]];
    negateMatrix(mat);
    expect(mat).toEqual(expected);
  });

  it("correctly negates a matrix with a single column", () => {
    const mat = [[1], [-2], [3]];
    const expected = [[-1], [2], [-3]];
    negateMatrix(mat);
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
    negateMatrix(mat);
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
    negateMatrix(mat);
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
    negateMatrix(mat);
    expect(mat).toEqual(expected);
  });
});
