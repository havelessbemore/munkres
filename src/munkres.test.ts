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

/*
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
*/

describe(`${munkres.name}()`, () => {
  test("handles an empty cost matrix", () => {
    const res = munkres([]);
    expect(res).toEqual([]);
  });

  test("handles a 1x1 cost matrix", () => {
    const res = munkres([[5]]);
    expect(res).toEqual([[0, 0]]);
  });

  test("handles a 2x2 cost matrix", () => {
    const res = munkres([
      [1, 2],
      [2, 4],
    ]);
    expect(res).toEqual([
      [0, 1],
      [1, 0],
    ]);
  });

  test("handles a 3x3 cost matrix", () => {
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

  test("handles a 4x4 cost matrix", () => {
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

  test("handles a 5x5 cost matrix", () => {
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

  test("handles all +Infinity", () => {
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

  test("handles all -Infinity", () => {
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

  test("handles all +Infinity and -Infinity", () => {
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

  test("handles columns of +Infinity", () => {
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

  test("handles columns of -Infinity", () => {
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

  test("handles a mix of positives and infinite", () => {
    const costs: CostMatrix = [
      [5, Infinity, 3],
      [Infinity, -Infinity, -Infinity],
      [1, Infinity, Infinity],
      [Infinity, Infinity, 5],
    ];
    const res = munkres(costs);
    const sols = [
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
      [
        [2, 0],
        [1, 1],
        [0, 2],
      ],
    ];
    oneOf(res, sols);
  });

  test("handles a mix of finite and infinite", () => {
    const costs: CostMatrix = [
      [40766, Infinity, Infinity],
      [8506, Infinity, Infinity],
      [Infinity, 84591, -46968],
    ];
    const res = munkres(costs);
    const sols = [
      [
        [0, 1],
        [1, 0],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 0],
        [2, 1],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 2],
        [2, 1],
      ],
    ];
    oneOf(res, sols);
  });

  test("handles a 5x1 matrix", () => {
    const costs: CostMatrix = [[3, 2, 1, 4, 5]];
    const res = munkres(costs);
    const sol = [[0, 2]];
    expect(res).toEqual(sol);
  });

  test("handles a 1x5 matrix", () => {
    const costs: CostMatrix = [[3], [2], [1], [4], [5]];
    const res = munkres(costs);
    const sol = [[2, 0]];
    expect(res).toEqual(sol);
  });

  test("handles a 4x2 matrix", () => {
    const costs = [
      [4, 5, 6, 1],
      [7, 8, 9, 2],
    ];
    const res = munkres(costs);
    const sol = [
      [0, 0],
      [1, 3],
    ];
    expect(res).toEqual(sol);
  });

  test("handles a 2x4 matrix", () => {
    const costs = [
      [1, 2],
      [6, 9],
      [5, 8],
      [4, 7],
    ];
    const res = munkres(costs);
    const sols = [
      [
        [0, 1],
        [3, 0],
      ],
      [
        [3, 0],
        [0, 1],
      ],
    ];
    oneOf(res, sols);
  });

  test("handles a 3x9 matrix", () => {
    const costs = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [2, 4, 6, 8, 10, 12, 14, 16, 18],
      [3, 6, 9, 12, 15, 18, 21, 24, 27],
    ];
    const res = munkres(costs);
    const sol = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
    expect(res).toEqual(sol);
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

  test("test 6", () => {
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

  test("test 7", () => {
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

  test("test 8", () => {
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

  test("test 9", () => {
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

  test("test 10", () => {
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

  test("test 11", () => {
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

  test("test 12", () => {
    const costs: CostMatrix = [
      [-58784, Infinity, Infinity],
      [-25064, Infinity, Infinity],
      [22114, -6870, 73655],
    ];
    const res = munkres(costs);
    const sols = [
      [
        [0, 1],
        [1, 0],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 2],
        [2, 1],
      ],
    ];
    oneOf(res, sols);
  });

  test("verify output properties for various matrix dimensions", () => {
    const YY = 33;
    const XX = 33;
    const minV = -1e9;
    const maxV = 1e9;
    const spanV = maxV - minV;

    for (let Y = 1; Y < YY; ++Y) {
      for (let X = 1; X < XX; ++X) {
        // Create a Y by X cost matrix
        const costs: CostMatrix = new Array(Y);
        for (let y = 0; y < Y; ++y) {
          const row = new Array(X);
          for (let x = 0; x < X; ++x) {
            const r = Math.random();
            if (r < 0.08) {
              row[x] = -Infinity;
            } else if (r > 0.92) {
              row[x] = Infinity;
            } else if (r > 0.46 && r < 0.54) {
              row[x] = 0;
            } else {
              row[x] = minV + Math.trunc(spanV * Math.random());
            }
          }
          costs[y] = row;
        }

        // Find assignments
        const pairs = munkres(costs);

        // Check
        try {
          const P = Math.min(Y, X);
          const seenY = new Set<number>();
          const seenX = new Set<number>();
          expect(pairs.length).toBe(P);
          for (let p = 0; p < P; ++p) {
            const [y, x] = pairs[p];

            // Check y
            expect(seenY.has(y)).toBe(false);
            expect(y).toBeGreaterThanOrEqual(0);
            expect(y).toBeLessThan(Y);
            seenY.add(y);

            // Check x
            expect(seenX.has(x)).toBe(false);
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThan(X);
            seenX.add(x);
          }
        } catch (e) {
          console.log(`${Y} by ${X}, pairs: ${pairs}, cost matrix:\n${costs}`);
          throw e;
        }
      }
    }
  });
});
