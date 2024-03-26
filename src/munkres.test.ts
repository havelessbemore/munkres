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

function maskToCostMatrix(
  num: number,
  base: number,
  Y: number,
  X: number,
  callbackFn: (bit: number) => number
): CostMatrix {
  const costs: CostMatrix = new Array(Y);
  for (let y = 0; y < Y; ++y) {
    const row = new Array<number>(X);
    for (let x = 0; x < X; ++x) {
      const mod = num % base;
      num = (num - mod) / base;
      row[x] = callbackFn(mod);
    }
    costs[y] = row;
  }
  return costs;
}

describe(`${munkres.name}()`, () => {
  test("test 0", () => {
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

  test("test 1", () => {
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

  test("test 10", () => {
    const costs: CostMatrix = [
      [400, 150, 400],
      [400, 450, 600],
      [300, 225, 300],
    ];
    const res = munkres(costs);
    const sol = [
      [0, 1],
      [1, 0],
      [2, 2],
    ];
    expect(res).toEqual(sol);
  });

  test("test 11", () => {
    const costs: CostMatrix = [
      [0, 0, 0, 0],
      [0, 1, 2, 3],
      [0, 2, 4, 6],
      [0, 3, 6, 9],
    ];
    const res = munkres(costs);
    const sol = [
      [0, 3],
      [1, 2],
      [2, 1],
      [3, 0],
    ];
    expect(res).toEqual(sol);
  });

  test("Does not throw error when given finite 2x2 cost matrix", () => {
    const B = 3;
    const Y = 2;
    const X = 2;
    const max = Number.MAX_SAFE_INTEGER;
    const min = Number.MIN_SAFE_INTEGER;
    function getVal(i: number): number {
      switch (i) {
        case 0:
          return 0;
        case 1:
          return Math.trunc(min * Math.random());
        case 2:
          return Math.trunc(max * Math.random());
        default:
          throw new Error("Invalid input");
      }
    }
    const M = B ** (Y * X);
    for (let mask = 0; mask < M; ++mask) {
      const costs = maskToCostMatrix(mask, B, Y, X, getVal);
      expect(() => munkres(costs)).not.toThrow();
    }
  });

  test("Does not throw error when given finite 3x3 cost matrix", () => {
    const B = 3;
    const Y = 3;
    const X = 3;
    const max = Number.MAX_SAFE_INTEGER;
    const min = Number.MIN_SAFE_INTEGER;
    function getVal(i: number): number {
      switch (i) {
        case 0:
          return 0;
        case 1:
          return Math.trunc(min * Math.random());
        case 2:
          return Math.trunc(max * Math.random());
        default:
          throw new Error("Invalid input");
      }
    }
    const M = B ** (Y * X);
    for (let mask = 0; mask < M; ++mask) {
      const costs = maskToCostMatrix(mask, B, Y, X, getVal);
      expect(() => munkres(costs)).not.toThrow();
    }
  });

  test("Does not throw error when given finite 4x4 cost matrix", () => {
    const B = 2;
    const Y = 4;
    const X = 4;
    const max = Number.MAX_SAFE_INTEGER;
    const min = Number.MIN_SAFE_INTEGER;
    function getVal(i: number): number {
      switch (i) {
        case 0:
          return Math.trunc(min * Math.random());
        case 1:
          return Math.trunc(max * Math.random());
        default:
          throw new Error("Invalid input");
      }
    }
    const M = B ** (Y * X);
    for (let mask = 0; mask < M; ++mask) {
      const costs = maskToCostMatrix(mask, B, Y, X, getVal);
      expect(() => munkres(costs)).not.toThrow();
    }
  });

  test("test 12", () => {
    const costs: CostMatrix = [
      [Infinity, Infinity, Infinity],
      [Infinity, Infinity, Infinity],
      [Infinity, Infinity, Infinity],
    ];
    const res = munkres(costs);
    const sol = [
      [0, 0],
      [1, 1],
      [2, 2],
    ];
    expect(res).toEqual(sol);
  });

  test("test 13", () => {
    const costs: CostMatrix = [
      [5, Infinity, Infinity],
      [6, Infinity, Infinity],
      [Infinity, Infinity, 10],
    ];
    const res = munkres(costs);
    const sol = [
      [0, 0],
      [1, 1],
      [2, 2],
    ];
    expect(res).toEqual(sol);
  });

  test("test 14", () => {
    const costs: CostMatrix = [
      [5, Infinity, Infinity],
      [6, Infinity, Infinity],
      [4, Infinity, Infinity],
    ];
    const res = munkres(costs);
    const sol = [
      [0, 0],
      [1, 1],
      [2, 2],
    ];
    expect(res).toEqual(sol);
  });

  test("test 15", () => {
    const costs: CostMatrix = [
      [-Infinity, -Infinity, -Infinity],
      [-Infinity, -Infinity, -Infinity],
      [-Infinity, -Infinity, -Infinity],
    ];
    const res = munkres(costs);
    const sol = [
      [0, 0],
      [1, 1],
      [2, 2],
    ];
    expect(res).toEqual(sol);
  });

  test("test 16", () => {
    const costs: CostMatrix = [
      [5, -Infinity, -Infinity],
      [6, -Infinity, -Infinity],
      [-Infinity, -Infinity, 10],
    ];
    const res = munkres(costs);
    const sols = [
      [
        [0, 1],
        [1, 2],
        [2, 0],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];
    oneOf(res, sols);
  });

  test("test 17", () => {
    const costs: CostMatrix = [
      [5, -Infinity, -Infinity],
      [6, -Infinity, -Infinity],
      [4, -Infinity, -Infinity],
    ];
    const res = munkres(costs);
    const sol = [
      [0, 0],
      [1, 1],
      [2, 2],
    ];
    expect(res).toEqual(sol);
  });

  test("test 18", () => {
    const costs: CostMatrix = [
      [Infinity, Infinity, Infinity],
      [Infinity, Infinity, -Infinity],
      [Infinity, -Infinity, -Infinity],
    ];
    const res = munkres(costs);
    const sol = [
      [0, 0],
      [1, 2],
      [2, 1],
    ];
    expect(res).toEqual(sol);
  });

  test("test 19", () => {
    const costs: CostMatrix = [
      [5, Infinity, 3],
      [Infinity, -Infinity, -Infinity],
      [1, Infinity, Infinity],
      [Infinity, Infinity, 5],
    ];
    const res = munkres(costs);
    const sol = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(res).toEqual(sol);
  });

  /*
  test("test 20", () => {
    const costs: CostMatrix = [
      [-58784, Infinity, Infinity],
      [-25064, Infinity, Infinity],
      [22114, -6870, 73655],
    ];
    const res = munkres(costs, true);
    const sol = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(res).toEqual(sol);
  });
  */

  /*
  test("test 21", () => {
    const costs: CostMatrix = [
      [40766, Infinity, Infinity],
      [8506, Infinity, Infinity],
      [Infinity, 84591, -46968],
    ];
    const res = munkres(costs, true);
    const sol = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(res).toEqual(sol);
  });

  test("test 22", () => {
    const costs: CostMatrix = [
      [20400, 34762, -58553],
      [Infinity, Infinity, -92035],
      [Infinity, Infinity, 94940],
    ];
    const res = munkres(costs, true);
    const sol = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(res).toEqual(sol);
  });

  test("test 23", () => {
    const costs: CostMatrix = [
      [19557, 43389, Infinity],
      [Infinity, Infinity, -48624],
      [Infinity, Infinity, -82059],
    ];
    const res = munkres(costs, true);
    const sol = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(res).toEqual(sol);
  });

  test("test 24", () => {
    const costs: CostMatrix = [
      [Infinity, Infinity, Infinity],
      [Infinity, Infinity, -86069],
      [Infinity, Infinity, -86897],
    ];
    const res = munkres(costs, true);
    const sol = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(res).toEqual(sol);
  });

  test("test 25", () => {
    const costs: CostMatrix = [
      [14524, -68494, -49680],
      [Infinity, -89915, Infinity],
      [Infinity, 32539, Infinity],
    ];
    const res = munkres(costs, true);
    const sol = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(res).toEqual(sol);
  });

  test("test 26", () => {
    const costs: CostMatrix = [
      [-76100, Infinity, 74064],
      [Infinity, -46570, Infinity],
      [Infinity, 74020, Infinity],
    ];
    const res = munkres(costs, true);
    const sol = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(res).toEqual(sol);
  });

  test("test 27", () => {
    const costs: CostMatrix = [
      [Infinity, Infinity, Infinity],
      [Infinity, 34530, Infinity],
      [Infinity, -16840, Infinity],
    ];
    const res = munkres(costs, true);
    const sol = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(res).toEqual(sol);
  });

  test("test 28", () => {
    const costs: CostMatrix = [
      [17337, Infinity, Infinity],
      [42663, 70375, 62482],
      [34558, Infinity, Infinity],
    ];
    const res = munkres(costs, true);
    const sol = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(res).toEqual(sol);
  });

  test("test 29", () => {
    const costs: CostMatrix = [
      [88835, Infinity, Infinity],
      [Infinity, 96172, 32745],
      [7026, Infinity, Infinity],
    ];
    const res = munkres(costs, true);
    const sol = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(res).toEqual(sol);
  });

  test("test 30", () => {
    const costs: CostMatrix = [
      [-33399, Infinity, Infinity],
      [Infinity, Infinity, Infinity],
      [-58860, Infinity, Infinity],
    ];
    const res = munkres(costs, true);
    const sol = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(res).toEqual(sol);
  });
  test("test 31", () => {
    const costs: CostMatrix = [
      [-33088, Infinity, Infinity],
      [-93526, Infinity, Infinity],
      [Infinity, Infinity, Infinity],
    ];
    const res = munkres(costs, true);
    const sol = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(res).toEqual(sol);
  });

  test("test 32", () => {
    const costs: CostMatrix = [
      [Infinity, Infinity, Infinity],
      [-13228, Infinity, Infinity],
      [-7014, Infinity, Infinity],
    ];
    const res = munkres(costs, true);
    const sol = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(res).toEqual(sol);
  });

  test("test 33", () => {
    const B = 2;
    const Y = 3;
    const X = 3;
    const max = 100000;
    const min = -100000;
    function getVal(i: number): number {
      switch (i) {
        case 0:
          return -Infinity;
        case 1:
          return min + (max - min) * Math.random();
        case 2:
          return Infinity;
        default:
          throw new Error("Invalid input");
      }
    }
    const M = B ** (Y * X);
    for (let mask = 0; mask < M; ++mask) {
      const costs = maskToCostMatrix(mask, B, Y, X, getVal);
      try {
        expect(() => munkres(costs)).not.toThrow();
      } catch (e) {
        console.log(mask);
        console.log(toString(costs, []));
      }
    }
  });
  */
});
