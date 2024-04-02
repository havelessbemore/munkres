import { describe, it, expect } from "vitest";

import { bigStep4, bigStep6, bigSteps2To3 } from "./bigMunkres";
import { copy, map } from "./matrix";
import { Matrix } from "..";

describe(`${bigSteps2To3.name}()`, () => {
  it("handles an empty matrix", () => {
    const starsMade = bigSteps2To3([], [], []);
    expect(starsMade).toBe(0);
  });

  it("handles a matrix with a single non-zero element", () => {
    const mat = [[1n]];
    const starX = new Array(mat[0].length).fill(-1);
    const starY = new Array(mat.length).fill(-1);
    const starsMade = bigSteps2To3(mat, starX, starY);
    expect(starsMade).toBe(0);
    expect(starX).toEqual([-1]);
    expect(starY).toEqual([-1]);
  });

  it("handles a matrix with a single zero element", () => {
    const mat = [[0n]];
    const starX = new Array(mat[0].length).fill(-1);
    const starY = new Array(mat.length).fill(-1);
    const starsMade = bigSteps2To3(mat, starX, starY);
    expect(starsMade).toBe(1);
    expect(starX).toEqual([0]);
    expect(starY).toEqual([0]);
  });

  it("does not star any element if there are no zeros", () => {
    const mat = [
      [1n, 2n, 3n],
      [4n, 5n, 6n],
      [7n, 8n, 9n],
    ];
    const starX = new Array(mat[0].length).fill(-1);
    const starY = new Array(mat.length).fill(-1);

    const starsMade = bigSteps2To3(mat, starX, starY);

    expect(starsMade).toBe(0);
    expect(starX.every(val => val === -1)).toBe(true);
    expect(starY.every(val => val === -1)).toBe(true);
  });

  it("correctly stars zeros in the matrix and returns the correct count", () => {
    const mat = [
      [0n, 1n, 2n],
      [1n, 0n, 3n],
      [2n, 3n, 0n],
    ];
    const starX = new Array(mat[0].length).fill(-1);
    const starY = new Array(mat.length).fill(-1);

    const starsMade = bigSteps2To3(mat, starX, starY);

    expect(starsMade).toBe(3);
    expect(starX).toEqual([0, 1, 2]);
    expect(starY).toEqual([0, 1, 2]);
  });

  it("ensures that each star is the only one in its row and column", () => {
    const mat = [
      [0n, 0n, 0n],
      [0n, 0n, 0n],
      [0n, 0n, 0n],
    ];
    const starX = new Array(mat[0].length).fill(-1);
    const starY = new Array(mat.length).fill(-1);

    const starsMade = bigSteps2To3(mat, starX, starY);
    expect(starsMade).toBe(3);
    expect(starX.filter(x => x !== -1).length).toBe(starX.length);
    expect(starY.filter(y => y !== -1).length).toBe(starY.length);
  });

  it("prioritizes starring earlier zeros in rows", () => {
    const mat = [
      [0n, 0n],
      [0n, 0n],
    ];
    const starX = new Array(mat[0].length).fill(-1);
    const starY = new Array(mat.length).fill(-1);

    const starsMade = bigSteps2To3(mat, starX, starY);
    expect(starsMade).toBe(2);
    expect(starX).toEqual([0, 1]);
    expect(starY).toEqual([0, 1]);
  });
});

describe(`${bigStep4.name}()`, () => {
  it("handles an empty matrix without error", () => {
    expect(bigStep4([])).toEqual([]);
  });

  it("throws an error if M > N in an MxN matrix", () => {
    expect(() =>
      bigStep4([
        [1n, 2n],
        [3n, 4n],
        [5n, 6n],
      ])
    ).toThrow(RangeError);
  });
});

describe(`${bigStep6.name}()`, () => {
  it("handles an empty matrix", () => {
    const mat: Matrix<bigint> = [];
    bigStep6(5n, mat, [], []);
    expect(mat).toEqual([]);
  });

  it("handles when val is zero", () => {
    const val = 0n;
    const mat = [
      [5n, 6n],
      [7n, 8n],
    ];
    const primeY = [0, -1]; // Prime at (0, 0)
    const starX = [1, -1]; // Star at (1, 0)
    const expectedMat = copy(mat);

    bigStep6(val, mat, primeY, starX);
    expect(mat).toEqual(expectedMat);
  });

  it("correctly adjusts the matrix based on prime and star markings", () => {
    const val = 2n;
    const mat = [
      [1n, 2n, 3n],
      [4n, 5n, 6n],
      [7n, 8n, 9n],
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

    bigStep6(val, mat, primeY, starX);
    expect(mat).toEqual(expectedMat);
  });

  it("does not adjust elements where a row has a prime and column has a star", () => {
    const val = 1n;
    const mat = [
      [0n, 1n],
      [2n, 3n],
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

    bigStep6(val, mat, primeY, starX);
    expect(mat).toEqual(expectedMat);
  });
});
