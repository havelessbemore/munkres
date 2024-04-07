import { describe, it, expect } from "vitest";

import { Matrix } from "../types/matrix";

import { step4 } from "./dualMunkres";

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

  it("handles an empty cost matrix", () => {
    const res = step4([]);
    expect(res).toEqual([]);
  });

  it("handles a 1x1 cost matrix", () => {
    const res = step4([[5]]);
    expect(res).toEqual([0]);
  });

  it("handles a 2x2 cost matrix", () => {
    const res = step4([
      [1, 2],
      [2, 4],
    ]);
    expect(res).toEqual([1, 0]);
  });

  it("handles a 3x3 cost matrix", () => {
    const costs: Matrix<number> = [
      [1, 2, 3],
      [2, 4, 6],
      [3, 6, 9],
    ];
    const res = step4(costs);
    expect(res).toEqual([2, 1, 0]);
  });

  it("handles a 4x4 cost matrix", () => {
    const costs: Matrix<number> = [
      [16, 2, 3, 7],
      [5, 13, 7, 5],
      [8, 6, 5, 9],
      [3, 4, 5, 11],
    ];
    const res = step4(costs);
    expect(res).toEqual([1, 3, 2, 0]);
  });

  it("handles a 5x5 cost matrix", () => {
    const costs: Matrix<number> = [
      [38, 53, 61, 36, 66],
      [100, 60, 9, 79, 34],
      [30, 37, 36, 72, 24],
      [61, 95, 21, 14, 64],
      [89, 90, 4, 5, 79],
    ];

    const res = step4(costs);
    expect(res).toEqual([0, 4, 1, 3, 2]);
  });

  it("handles a 5x1 matrix", () => {
    const costs: Matrix<number> = [[3, 2, 1, 4, 5]];
    const res = step4(costs);
    expect(res).toEqual([2]);
  });

  it("handles a 4x2 matrix", () => {
    const costs = [
      [4, 5, 6, 1],
      [7, 8, 9, 2],
    ];
    const res = step4(costs);
    expect(res).toEqual([0, 3]);
  });

  it("handles a 3x9 matrix", () => {
    const costs = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [2, 4, 6, 8, 10, 12, 14, 16, 18],
      [3, 6, 9, 12, 15, 18, 21, 24, 27],
    ];
    const res = step4(costs);
    expect(res).toEqual([2, 1, 0]);
  });

  it("handles example #2 in the README.md", () => {
    const costs: Matrix<number> = [
      [2, 25, 18],
      [9, 4, 17],
    ];
    const res = step4(costs);
    expect(res).toEqual([0, 1]);
  });

  it("test 1", () => {
    const costs: Matrix<number> = [
      [8, 4, 7],
      [5, 2, 3],
      [9, 4, 8],
    ];
    const res = step4(costs);
    expect(res).toEqual([0, 2, 1]);
  });

  it("test 2", () => {
    const costs: Matrix<number> = [
      [2, 25, 18],
      [9, 4, 17],
      [11, 26, 1],
    ];
    const res = step4(costs);
    expect(res).toEqual([0, 1, 2]);
  });

  it("test 3", () => {
    const costs: Matrix<number> = [
      [2, 25, 10],
      [9, 4, 17],
      [11, 1, 10],
    ];
    const res = step4(costs);
    expect(res).toEqual([0, 1, 2]);
  });

  it("test 4", () => {
    const costs: Matrix<number> = [
      [40, 60, 15],
      [25, 30, 45],
      [55, 30, 25],
    ];
    const res = step4(costs);
    expect(res).toEqual([2, 0, 1]);
  });

  it("test 5", () => {
    const costs: Matrix<number> = [
      [10, 15, 9],
      [9, 18, 5],
      [6, 14, 3],
    ];
    const res = step4(costs);
    expect(res).toEqual([1, 2, 0]);
  });

  /*
  it("test 6", () => {
    const costs: Matrix<number> = [
      [4, 2, 5, 7],
      [8, 3, 10, 8],
      [12, 5, 4, 5],
      [6, 3, 7, 14],
    ];
    const sols = [
      new Set([
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
      ]),
      new Set([
        [0, 0],
        [1, 1],
        [2, 3],
        [3, 2],
      ]),
      new Set([
        [0, 2],
        [1, 1],
        [2, 3],
        [3, 0],
      ]),
    ];
    const res = step4(costs);
    oneOf(new Set(res), sols);
  });
  */

  it("test 7", () => {
    const costs: Matrix<number> = [
      [22, 26, 18, 0],
      [1, 20, 18, 0],
      [15, 9, 12, 0],
      [27, 5, 13, 0],
    ];
    const res = step4(costs);
    expect(res).toEqual([3, 0, 2, 1]);
  });

  it("test 8", () => {
    const costs: Matrix<number> = [
      [400, 150, 400],
      [400, 450, 600],
      [300, 225, 300],
    ];
    const res = step4(costs);
    expect(res).toEqual([1, 0, 2]);
  });

  it("test 9", () => {
    const costs: Matrix<number> = [
      [0, 0, 0, 0],
      [0, 1, 2, 3],
      [0, 2, 4, 6],
      [0, 3, 6, 9],
    ];
    const res = step4(costs);
    expect(res).toEqual([3, 2, 1, 0]);
  });

  it("verify output properties for various matrix dimensions", () => {
    const XX = 33;
    const YY = 33;
    const minV = -1e9;
    const maxV = 1e9;
    const spanV = maxV - minV;

    for (let Y = 1; Y < YY; ++Y) {
      for (let X = Y; X <= XX; ++X) {
        // Create a Y by X cost matrix
        const costs: Matrix<number> = new Array(Y);
        for (let y = 0; y < Y; ++y) {
          const row = new Array(X);
          for (let x = 0; x < X; ++x) {
            const r = Math.random();
            if (r > 0.46 && r < 0.54) {
              row[x] = 0;
            } else {
              row[x] = minV + Math.trunc(spanV * Math.random());
            }
          }
          costs[y] = row;
        }

        // Find assignments
        const res = step4(costs);

        // Check x
        try {
          const seenX = new Set<number>();
          expect(res.length).toBe(Y);
          for (let y = 0; y < Y; ++y) {
            const x = res[y];
            expect(seenX.has(x)).toBe(false);
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThan(X);
            seenX.add(x);
          }
        } catch (e) {
          console.log(`${Y} by ${X}, res: ${res}, cost matrix:\n${costs}`);
          throw e;
        }
      }
    }
  });
});
