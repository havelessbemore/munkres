import { describe, expect, test } from "vitest";

import { munkres } from "./munkres";
import { CostMatrix } from "./types/costMatrix";

function oneOf<T>(actual: T, expecteds: Iterable<T>): void {
  let error: Error | undefined = undefined;
  for (const expected of expecteds) {
    try {
      expect(actual).toEqual(expected);
      error = undefined;
      break;
    } catch (e) {
      error = e;
    }
  }

  if (error != null) {
    throw error;
  }
}

describe(`${munkres.name}()`, () => {
  test("test 0", () => {
    const costs: CostMatrix = [
      [8, 4, 7],
      [5, 2, 3],
      [9, 4, 8],
    ];
    const res = munkres(costs);
    expect(res).toEqual([
      [0, 0],
      [1, 2],
      [2, 1],
    ]);
  });

  test("test 1", () => {
    const costs: CostMatrix = [
      [1, 2, 3],
      [2, 4, 6],
      [3, 6, 9],
    ];
    const res = munkres(costs);
    expect(res).toEqual([
      [0, 2],
      [1, 1],
      [2, 0],
    ]);
  });

  test("test 2", () => {
    const costs: CostMatrix = [
      [2, 25, 18],
      [9, 4, 17],
      [11, 26, 1],
    ];
    const res = munkres(costs);
    expect(res).toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
    ]);
  });

  test("test 3", () => {
    const costs: CostMatrix = [
      [2, 25, 10],
      [9, 4, 17],
      [11, 1, 10],
    ];
    const res = munkres(costs);
    expect(res).toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
    ]);
  });

  test("test 4", () => {
    const costs: CostMatrix = [
      [40, 60, 15],
      [25, 30, 45],
      [55, 30, 25],
    ];
    const res = munkres(costs);
    expect(res).toEqual([
      [0, 2],
      [1, 0],
      [2, 1],
    ]);
  });

  test("test 5", () => {
    const costs: CostMatrix = [
      [16, 2, 3, 7],
      [5, 13, 7, 5],
      [8, 6, 5, 9],
      [3, 4, 5, 11],
    ];
    const res = munkres(costs);
    expect(res).toEqual([
      [0, 1],
      [1, 3],
      [2, 2],
      [3, 0],
    ]);
  });

  test("test 6", () => {
    const costs: CostMatrix = [
      [10, 15, 9],
      [9, 18, 5],
      [6, 14, 3],
    ];
    const res = munkres(costs);
    expect(res).toEqual([
      [0, 1],
      [1, 2],
      [2, 0],
    ]);
  });

  test("test 7", () => {
    const costs: CostMatrix = [
      [38, 53, 61, 36, 66],
      [100, 60, 9, 79, 34],
      [30, 37, 36, 72, 24],
      [61, 95, 21, 14, 64],
      [89, 90, 4, 5, 79],
    ];

    const res = munkres(costs);
    const sol = [
      [0, 0],
      [1, 4],
      [2, 1],
      [3, 3],
      [4, 2],
    ];
    expect(res).toEqual(sol);
  });

  test("test 8", () => {
    const costs: CostMatrix = [
      [4, 2, 5, 7],
      [8, 3, 10, 8],
      [12, 5, 4, 5],
      [6, 3, 7, 14],
    ];
    const sols = [
      [
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 3],
        [3, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 3],
        [3, 0],
      ],
    ];
    const res = munkres(costs);
    oneOf(res, sols);
  });

  test("test 9", () => {
    const costs: CostMatrix = [
      [22, 26, 18, 0],
      [1, 20, 18, 0],
      [15, 9, 12, 0],
      [27, 5, 13, 0],
    ];
    const res = munkres(costs);
    const sol = [
      [0, 3],
      [1, 0],
      [2, 2],
      [3, 1],
    ];
    expect(res).toEqual(sol);
  });
});
