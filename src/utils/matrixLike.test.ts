import { describe, it, expect } from "@jest/globals";

import { getMax, getMin } from "./matrixLike.ts";

describe(`${getMax.name}()`, () => {
  it("returns undefined for an empty matrix", () => {
    expect(getMax([])).toBeUndefined();
  });

  it("returns undefined for a matrix with empty rows", () => {
    const mat = [[], []];
    expect(getMax(mat)).toBeUndefined();
  });

  it("handles a matrix with a single element", () => {
    const mat = [[42]];
    expect(getMax(mat)).toBe(42);
  });

  it("handles matrix with a single row correctly", () => {
    const matrix = [[2, 9, 4]];
    expect(getMax(matrix)).toBe(9);
  });

  it("handles a matrix with a single row", () => {
    const mat = [[1, 2, 5, 3, 4]];
    expect(getMax(mat)).toBe(5);
  });

  it("finds the maximum value in a matrix with a single column", () => {
    const mat = [[1], [5], [2], [3], [4]];
    expect(getMax(mat)).toBe(5);
  });

  it("finds the maximum value in a matrix of positive numbers", () => {
    const matrix = [
      [1, 3, 2],
      [4, 0, 6],
      [7, 5, 8],
    ];
    expect(getMax(matrix)).toBe(8);
  });

  it("finds the maximum value in a matrix with negative numbers", () => {
    const mat = [
      [-1, -2, -3],
      [-4, -5, -6],
      [-7, -8, -9],
    ];
    expect(getMax(mat)).toBe(-1);
  });

  it("finds the maximum value in a matrix of positive and negative numbers", () => {
    const mat = [
      [-11, 22],
      [33, -44],
    ];
    expect(getMax(mat)).toBe(33);
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
    expect(getMin([])).toBeUndefined();
  });

  it("returns undefined for a matrix with empty rows", () => {
    const mat = [[], []];
    expect(getMin(mat)).toBeUndefined();
  });

  it("handles a matrix with a single element", () => {
    const mat = [[42]];
    expect(getMin(mat)).toBe(42);
  });

  it("handles a matrix with a single row", () => {
    const mat = [[3, 2, 1, 4, 5]];
    expect(getMin(mat)).toBe(1);
  });

  it("handles a matrix with a single column", () => {
    const mat = [[2], [3], [1], [4], [5]];
    expect(getMin(mat)).toBe(1);
  });

  it("handles a matrix of positive numbers", () => {
    const mat = [
      [5, 2, 3],
      [4, 1, 6],
      [7, 8, 9],
    ];
    expect(getMin(mat)).toBe(1);
  });

  it("handles a matrix with negative numbers", () => {
    const mat = [
      [-1, -2, -3],
      [-4, -5, -6],
      [-7, -8, -9],
    ];
    expect(getMin(mat)).toBe(-9);
  });

  it("handles a matrix of positive and negative numbers", () => {
    const mat = [
      [-11, 22],
      [33, -44],
    ];
    expect(getMin(mat)).toBe(-44);
  });

  it("handles a matrix of bigints", () => {
    const matrix = [
      [1n, 3n, 2n],
      [4n, 0n, 6n],
      [7n, 5n, 8n],
    ];
    expect(getMin(matrix)).toBe(0n);
  });

  it("handles a matrix of strings", () => {
    const matrix = [
      ["b", "d", "c"],
      ["e", "a", "g"],
      ["h", "f", "i"],
    ];
    expect(getMin(matrix)).toBe("a");
  });
});
