import { describe, it, expect } from "vitest";

import { Matrix } from "../types/matrix";

import { exec, toString } from "./numMunkres";

describe(`${exec.name}()`, () => {
  it("handles an empty matrix without error", () => {
    expect(() => exec([])).not.toThrow();
  });
});

describe(`${toString.name}()`, () => {
  it("handles an empty matrix", () => {
    const mat: Matrix<number> = [];
    const coveredX: number[] = [];
    const starY: number[] = [];
    const expectedOutput = "";

    const result = toString(mat, starY, coveredX);
    expect(result).toBe(expectedOutput);
  });

  it("correctly annotates a simple matrix with stars and primes", () => {
    const mat = [
      [1, 2],
      [3, 4],
    ];
    const coveredX = [-1, 0]; // Prime at (0, 1)
    const starY = [-1, 0]; // Star at (1, 0)
    const expectedOutput = '[ 1, "2],\n' + "[*3,  4]";

    const result = toString(mat, starY, coveredX);
    expect(result).toBe(expectedOutput);
  });

  it("formats matrix columns to have uniform width", () => {
    const mat = [
      [1, 10],
      [100, 2],
    ];
    const coveredX = [-1, -1]; // No primes
    const starY = [-1, 0]; // Star at (1, 0)
    const expectedOutput = "[   1, 10],\n" + "[*100,  2]";

    const result = toString(mat, starY, coveredX);
    expect(result).toBe(expectedOutput);
  });

  it("correctly annotates matrix with multiple stars and primes", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const coveredX = [2, -1, 0]; // Prime at (0, 2), (2, 0)
    const starY = [-1, 2, 1]; // Star at (2, 1), (1, 2)
    const expectedOutput =
      '[ 1,  2, "3],\n' + "[ 4,  5, *6],\n" + '["7, *8,  9]';

    const result = toString(mat, starY, coveredX);
    expect(result).toBe(expectedOutput);
  });
});
