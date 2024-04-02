import { describe, it, expect } from "vitest";

import {
  step1,
  step4,
  step5,
  step6,
  step6Inf,
  steps2To3,
  toString,
} from "./munkres";
import { copy, map, reduceCols, reduceRows } from "./matrix";
import { Matrix } from "../types/matrix";

describe(`${step1.name}()`, () => {
  it("handles an empty matrix without error", () => {
    const mat: Matrix<number> = [];
    step1(mat);
    expect(mat).toEqual([]);
  });

  it("performs row reduction on a 1x5 matrix", () => {
    const mat = [[1, 2, 3, 4, 5]];
    step1(mat);
    expect(mat).toEqual([[0, 1, 2, 3, 4]]);
  });

  it("performs column reduction on a 5x1 matrix", () => {
    const mat = [[1], [2], [3], [4], [5]];
    step1(mat);
    expect(mat).toEqual([[0], [1], [2], [3], [4]]);
  });

  it("performs column-wise reduction on a matrix where rows > columns", () => {
    const mat = [
      [4, 1, 3],
      [2, 0, 5],
      [3, 2, 2],
      [10, 5, 6],
    ];
    const dupe = copy(mat);

    step1(mat);
    reduceCols(dupe);
    expect(mat).toEqual(dupe);
  });

  it("performs row-wise reduction on a matrix where rows < columns", () => {
    const mat = [
      [4, 1, 3, 7],
      [2, 0, 5, 8],
      [3, 2, 2, 6],
    ];
    const dupe = copy(mat);

    step1(mat);
    reduceRows(dupe);
    expect(mat).toEqual(dupe);
  });

  it("performs both row-wise and column-wise reduction on a square matrix", () => {
    const mat = [
      [4, 1, 3],
      [2, 0, 5],
      [3, 2, 2],
    ];
    const dupe = copy(mat);

    step1(mat);
    reduceRows(dupe);
    reduceCols(dupe);
    expect(mat).toEqual(dupe);
  });

  it("handles a matrix of bigints correctly", () => {
    const mat: Matrix<bigint> = [
      [4n, 1n, 3n, 7n],
      [2n, 0n, 5n, 8n],
      [3n, 2n, 2n, 6n],
    ];
    const dupe = copy(mat);

    step1(mat);
    reduceRows(dupe);
    expect(mat).toEqual(dupe);
  });
});

describe(`${steps2To3.name}()`, () => {
  it("handles an empty matrix", () => {
    const starsMade = steps2To3([], [], []);
    expect(starsMade).toBe(0);
  });

  it("handles a matrix with a single non-zero element", () => {
    const mat = [[1]];
    const starX = new Array(mat[0].length).fill(-1);
    const starY = new Array(mat.length).fill(-1);
    const starsMade = steps2To3(mat, starX, starY);
    expect(starsMade).toBe(0);
    expect(starX).toEqual([-1]);
    expect(starY).toEqual([-1]);
  });

  it("handles a matrix with a single zero element", () => {
    const mat = [[0]];
    const starX = new Array(mat[0].length).fill(-1);
    const starY = new Array(mat.length).fill(-1);
    const starsMade = steps2To3(mat, starX, starY);
    expect(starsMade).toBe(1);
    expect(starX).toEqual([0]);
    expect(starY).toEqual([0]);
  });

  it("does not star any element if there are no zeros", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const starX = new Array(mat[0].length).fill(-1);
    const starY = new Array(mat.length).fill(-1);

    const starsMade = steps2To3(mat, starX, starY);

    expect(starsMade).toBe(0);
    expect(starX.every(val => val === -1)).toBe(true);
    expect(starY.every(val => val === -1)).toBe(true);
  });

  it("correctly stars zeros in the matrix and returns the correct count", () => {
    const mat = [
      [0, 1, 2],
      [1, 0, 3],
      [2, 3, 0],
    ];
    const starX = new Array(mat[0].length).fill(-1);
    const starY = new Array(mat.length).fill(-1);

    const starsMade = steps2To3(mat, starX, starY);

    expect(starsMade).toBe(3);
    expect(starX).toEqual([0, 1, 2]);
    expect(starY).toEqual([0, 1, 2]);
  });

  it("ensures that each star is the only one in its row and column", () => {
    const mat = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const starX = new Array(mat[0].length).fill(-1);
    const starY = new Array(mat.length).fill(-1);

    const starsMade = steps2To3(mat, starX, starY);
    expect(starsMade).toBe(3);
    expect(starX.filter(x => x !== -1).length).toBe(starX.length);
    expect(starY.filter(y => y !== -1).length).toBe(starY.length);
  });

  it("prioritizes starring earlier zeros in rows", () => {
    const mat = [
      [0, 0],
      [0, 0],
    ];
    const starX = new Array(mat[0].length).fill(-1);
    const starY = new Array(mat.length).fill(-1);

    const starsMade = steps2To3(mat, starX, starY);
    expect(starsMade).toBe(2);
    expect(starX).toEqual([0, 1]);
    expect(starY).toEqual([0, 1]);
  });
});

describe(`${step4.name}()`, () => {
  it("handles an empty matrix without error", () => {
    expect(step4([])).toEqual([]);
  });

  it("throws an error if M > N in an MxN matrix", () => {
    expect(() =>
      step4([
        [1, 2],
        [3, 4],
        [5, 6],
      ])
    ).toThrow(RangeError);
  });
});

describe(`${step5.name}()`, () => {
  it("throws an error if the starting coordinates do not represent a prime", () => {
    const y = 0;
    const primeY = [-1, -1, -1]; // No primes
    const starX = [-1, -1, -1]; // No stars
    const starY = [-1, -1, -1];

    expect(() => step5(y, primeY, starX, starY)).toThrow();
  });

  it("handles a simple path", () => {
    const y = 0;
    const primeY = [0, -1, -1];
    const starX = [-1, 0, -1];
    const starY = [1, -1, -1];

    step5(y, primeY, starX, starY);
    expect(starX).toEqual([0, 0, -1]);
    expect(starY).toEqual([0, -1, -1]);
  });

  it("handles a longer path with multiple alterations", () => {
    const y = 0;
    const primeY = [0, 1, 2];
    const starX = [2, -1, 1];
    const starY = [-1, 2, 0];

    step5(y, primeY, starX, starY);
    expect(starX).toEqual([0, 1, 2]);
    expect(starY).toEqual([0, 1, 2]);
  });
});

describe(`${step6.name}()`, () => {
  it("handles an empty matrix", () => {
    const mat: Matrix<number> = [];
    step6(5, mat, [], []);
    expect(mat).toEqual([]);
  });

  it("handles when val is zero", () => {
    const val = 0;
    const mat = [
      [5, 6],
      [7, 8],
    ];
    const primeY = [0, -1]; // Prime at (0, 0)
    const starX = [1, -1]; // Star at (1, 0)
    const expectedMat = copy(mat);

    step6(val, mat, primeY, starX);
    expect(mat).toEqual(expectedMat);
  });

  it("correctly adjusts the matrix based on prime and star markings", () => {
    const val = 2;
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const primeY = [-1, 0, -1]; // Prime at (1, 0)
    const starX = [-1, -1, 1]; // Star at (2, 1)
    const expectedMat = map(mat, (v, y, x) => {
      if (starX[x] < 0 || primeY[starX[x]] >= 0) {
        v -= val;
      }
      if (primeY[y] >= 0) {
        v += val;
      }
      return v;
    });

    step6(val, mat, primeY, starX);
    expect(mat).toEqual(expectedMat);
  });

  it("does not adjust elements where a row has a prime and column has a star", () => {
    const val = 1;
    const mat = [
      [0, 1],
      [2, 3],
    ];
    const primeY = [1, -1]; // Prime at (0, 1)
    const starX = [-1, 0]; // Star at (1, 0)
    const expectedMat = map(mat, (v, y, x) => {
      if (starX[x] < 0 || primeY[starX[x]] >= 0) {
        v -= val;
      }
      if (primeY[y] >= 0) {
        v += val;
      }
      return v;
    });

    step6(val, mat, primeY, starX);
    expect(mat).toEqual(expectedMat);
  });
});

describe(`${step6Inf.name}()`, () => {
  it("applies Infinity correctly to marked columns and zeros to unmarked rows", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const primeY = [-1, 0, -1]; // Prime at (1, 0)
    const starX = [-1, 0, -1]; // Star at (0, 1) but no prime in star's row

    step6Inf(mat, primeY, starX);

    expect(mat).toEqual([
      [0, 2, 0],
      [4, Infinity, 6],
      [0, 8, 0],
    ]);
  });

  it("handles matrices with initial Infinity values", () => {
    const mat = [
      [Infinity, 2, Infinity],
      [4, Infinity, 6],
      [7, 8, 9],
    ];
    const primeY = [2, -1, -1]; // Prime at (0, 2)
    const starX = [-1, 1, -1]; // Star at (1, 1) and no prime in star's row

    step6Inf(mat, primeY, starX);

    expect(mat).toEqual([
      [Infinity, Infinity, Infinity],
      [0, Infinity, 0],
      [0, 8, 0],
    ]);
  });

  it("works when all values are initially Infinity", () => {
    const mat = [
      [Infinity, Infinity, Infinity],
      [Infinity, Infinity, Infinity],
      [Infinity, Infinity, Infinity],
    ];
    const primeY = [-1, -1, 0]; // Prime at (2, 0)
    const starX = [-1, 2, -1]; // Star at (2, 1) and prime in star's row

    step6Inf(mat, primeY, starX);

    expect(mat).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [Infinity, Infinity, Infinity],
    ]);
  });
});

describe(`${toString.name}()`, () => {
  it("handles an empty matrix", () => {
    const mat: Matrix<number> = [];
    const primeY: number[] = [];
    const starY: number[] = [];
    const expectedOutput = "";

    const result = toString(mat, starY, primeY);
    expect(result).toBe(expectedOutput);
  });

  it("correctly annotates a simple matrix with stars and primes", () => {
    const mat = [
      [1, 2],
      [3, 4],
    ];
    const primeY = [1, -1]; // Prime at (0, 1)
    const starY = [-1, 0]; // Star at (1, 0)
    const expectedOutput = '[ 1, "2],\n' + "[*3,  4]";

    const result = toString(mat, starY, primeY);
    expect(result).toBe(expectedOutput);
  });

  it("formats matrix entries to have uniform width", () => {
    const mat = [
      [1, 10],
      [100, 2],
    ];
    const primeY = [-1, -1]; // No primes
    const starY = [-1, 0]; // Star at (1, 0)
    const expectedOutput = "[   1,   10],\n" + "[*100,    2]";

    const result = toString(mat, starY, primeY);
    expect(result).toBe(expectedOutput);
  });

  it("correctly annotates matrix with multiple stars and primes", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const primeY = [2, -1, 0]; // Prime at (0, 2), (2, 0)
    const starY = [-1, 2, 1]; // Star at (2, 1), (1, 2)
    const expectedOutput =
      '[ 1,  2, "3],\n' + "[ 4,  5, *6],\n" + '["7, *8,  9]';

    const result = toString(mat, starY, primeY);
    expect(result).toBe(expectedOutput);
  });
});
