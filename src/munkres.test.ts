import { describe, expect, test } from "vitest";

import { munkres } from "./munkres";
import { Matrix } from "./types/matrix";
import { gen } from "./utils/matrix";

function oneOf<T>(actual: T, expecteds: Iterable<T>): void {
  let error: Error | undefined = undefined;
  for (const expected of expecteds) {
    try {
      expect(actual).toEqual(expected);
      error = undefined;
      break;
    } catch (e) {
      error = e as Error;
    }
  }

  if (error != null) {
    throw error;
  }
}

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
    expect(new Map(res)).toEqual(
      new Map([
        [0, 1],
        [1, 0],
      ])
    );
  });

  test("handles a 3x3 cost matrix", () => {
    const costs: Matrix<number> = [
      [1, 2, 3],
      [2, 4, 6],
      [3, 6, 9],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 2],
        [1, 1],
        [2, 0],
      ])
    );
  });

  test("handles a 4x4 cost matrix", () => {
    const costs: Matrix<number> = [
      [16, 2, 3, 7],
      [5, 13, 7, 5],
      [8, 6, 5, 9],
      [3, 4, 5, 11],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 1],
        [1, 3],
        [2, 2],
        [3, 0],
      ])
    );
  });

  test("handles a 5x5 cost matrix", () => {
    const costs: Matrix<number> = [
      [38, 53, 61, 36, 66],
      [100, 60, 9, 79, 34],
      [30, 37, 36, 72, 24],
      [61, 95, 21, 14, 64],
      [89, 90, 4, 5, 79],
    ];

    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 0],
        [1, 4],
        [2, 1],
        [3, 3],
        [4, 2],
      ])
    );
  });

  test("handles a 5x1 matrix", () => {
    const costs: Matrix<number> = [[3, 2, 1, 4, 5]];
    const res = munkres(costs);
    expect(res).toEqual([[0, 2]]);
  });

  test("handles a 1x5 matrix", () => {
    const costs: Matrix<number> = [[3], [2], [1], [4], [5]];
    const res = munkres(costs);
    expect(res).toEqual([[2, 0]]);
  });

  test("handles a 4x2 matrix", () => {
    const costs = [
      [4, 5, 6, 1],
      [7, 8, 9, 2],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 0],
        [1, 3],
      ])
    );
  });

  test("handles a 2x4 matrix", () => {
    const costs = [
      [1, 2],
      [6, 9],
      [5, 8],
      [4, 7],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 1],
        [3, 0],
      ])
    );
  });

  test("handles a 3x9 matrix", () => {
    const costs = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [2, 4, 6, 8, 10, 12, 14, 16, 18],
      [3, 6, 9, 12, 15, 18, 21, 24, 27],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 2],
        [1, 1],
        [2, 0],
      ])
    );
  });

  test("handles all +Infinity", () => {
    const costs: Matrix<number> = [
      [Infinity, Infinity, Infinity],
      [Infinity, Infinity, Infinity],
      [Infinity, Infinity, Infinity],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 0],
        [1, 1],
        [2, 2],
      ])
    );
  });

  test("handles all -Infinity", () => {
    const costs: Matrix<number> = [
      [-Infinity, -Infinity, -Infinity],
      [-Infinity, -Infinity, -Infinity],
      [-Infinity, -Infinity, -Infinity],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 0],
        [1, 1],
        [2, 2],
      ])
    );
  });

  test("handles all +Infinity and -Infinity", () => {
    const costs: Matrix<number> = [
      [Infinity, Infinity, Infinity],
      [Infinity, Infinity, -Infinity],
      [Infinity, -Infinity, -Infinity],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 0],
        [1, 2],
        [2, 1],
      ])
    );
  });

  test("handles columns of +Infinity", () => {
    const costs: Matrix<number> = [
      [5, Infinity, Infinity],
      [6, Infinity, Infinity],
      [4, Infinity, Infinity],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 0],
        [1, 1],
        [2, 2],
      ])
    );
  });

  test("handles columns of -Infinity", () => {
    const costs: Matrix<number> = [
      [5, -Infinity, -Infinity],
      [6, -Infinity, -Infinity],
      [4, -Infinity, -Infinity],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 0],
        [1, 1],
        [2, 2],
      ])
    );
  });

  test("handles a mix of positives and infinite", () => {
    const costs: Matrix<number> = [
      [5, Infinity, 3],
      [Infinity, -Infinity, -Infinity],
      [1, Infinity, Infinity],
      [Infinity, Infinity, 5],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 2],
        [1, 1],
        [2, 0],
      ])
    );
  });

  test("handles a mix of finite and infinite", () => {
    const costs: Matrix<number> = [
      [40766, Infinity, Infinity],
      [8506, Infinity, Infinity],
      [Infinity, 84591, -46968],
    ];
    const res = munkres(costs);
    const sols = [
      new Map([
        [0, 1],
        [1, 0],
        [2, 2],
      ]),
      new Map([
        [0, 2],
        [1, 0],
        [2, 1],
      ]),
      new Map([
        [0, 0],
        [1, 1],
        [2, 2],
      ]),
      new Map([
        [0, 0],
        [1, 2],
        [2, 1],
      ]),
    ];
    oneOf(new Map(res), sols);
  });

  test("handles example #2 in the README.md", () => {
    const costs: Matrix<number> = [
      [2, 25, 18],
      [9, 4, 17],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 0],
        [1, 1],
      ])
    );
  });

  test("test 1", () => {
    const costs: Matrix<number> = [
      [8, 4, 7],
      [5, 2, 3],
      [9, 4, 8],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 0],
        [1, 2],
        [2, 1],
      ])
    );
  });

  test("test 2", () => {
    const costs: Matrix<number> = [
      [2, 25, 18],
      [9, 4, 17],
      [11, 26, 1],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 0],
        [1, 1],
        [2, 2],
      ])
    );
  });

  test("test 3", () => {
    const costs: Matrix<number> = [
      [2, 25, 10],
      [9, 4, 17],
      [11, 1, 10],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 0],
        [1, 1],
        [2, 2],
      ])
    );
  });

  test("test 4", () => {
    const costs: Matrix<number> = [
      [40, 60, 15],
      [25, 30, 45],
      [55, 30, 25],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 2],
        [1, 0],
        [2, 1],
      ])
    );
  });

  test("test 5", () => {
    const costs: Matrix<number> = [
      [10, 15, 9],
      [9, 18, 5],
      [6, 14, 3],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 1],
        [1, 2],
        [2, 0],
      ])
    );
  });

  test("test 6", () => {
    const costs: Matrix<number> = [
      [4, 2, 5, 7],
      [8, 3, 10, 8],
      [12, 5, 4, 5],
      [6, 3, 7, 14],
    ];
    const sols = [
      new Map([
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
      ]),
      new Map([
        [0, 0],
        [1, 1],
        [2, 3],
        [3, 2],
      ]),
      new Map([
        [0, 2],
        [1, 1],
        [2, 3],
        [3, 0],
      ]),
    ];
    const res = munkres(costs);
    oneOf(new Map(res), sols);
  });

  test("test 7", () => {
    const costs: Matrix<number> = [
      [22, 26, 18, 0],
      [1, 20, 18, 0],
      [15, 9, 12, 0],
      [27, 5, 13, 0],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 3],
        [1, 0],
        [2, 2],
        [3, 1],
      ])
    );
  });

  test("test 8", () => {
    const costs: Matrix<number> = [
      [400, 150, 400],
      [400, 450, 600],
      [300, 225, 300],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 1],
        [1, 0],
        [2, 2],
      ])
    );
  });

  test("test 9", () => {
    const costs: Matrix<number> = [
      [0, 0, 0, 0],
      [0, 1, 2, 3],
      [0, 2, 4, 6],
      [0, 3, 6, 9],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 3],
        [1, 2],
        [2, 1],
        [3, 0],
      ])
    );
  });

  test("test 10", () => {
    const costs: Matrix<number> = [
      [5, Infinity, Infinity],
      [6, Infinity, Infinity],
      [Infinity, Infinity, 10],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 0],
        [1, 1],
        [2, 2],
      ])
    );
  });

  test("test 11", () => {
    const costs: Matrix<number> = [
      [5, -Infinity, -Infinity],
      [6, -Infinity, -Infinity],
      [-Infinity, -Infinity, 10],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 1],
        [1, 2],
        [2, 0],
      ])
    );
  });

  test("test 12", () => {
    const costs: Matrix<number> = [
      [-58784, Infinity, Infinity],
      [-25064, Infinity, Infinity],
      [22114, -6870, 73655],
    ];
    const res = munkres(costs);
    const sols = [
      new Map([
        [0, 1],
        [1, 0],
        [2, 2],
      ]),
      new Map([
        [0, 0],
        [1, 1],
        [2, 2],
      ]),
      new Map([
        [0, 0],
        [1, 2],
        [2, 1],
      ]),
    ];
    oneOf(new Map(res), sols);
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
        const costs: Matrix<number> = new Array(Y);
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

  test("handles a 1x1 bigint cost matrix", () => {
    const res = munkres([[5n]]);
    expect(res).toEqual([[0, 0]]);
  });

  test("handles a 2x2 bigint cost matrix", () => {
    const res = munkres([
      [1, 2],
      [2, 4],
    ]);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 1],
        [1, 0],
      ])
    );
  });

  test("handles a 3x3 bigint cost matrix", () => {
    const costs: Matrix<number> = [
      [1, 2, 3],
      [2, 4, 6],
      [3, 6, 9],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 2],
        [1, 1],
        [2, 0],
      ])
    );
  });

  test("handles a 4x4 bigint cost matrix", () => {
    const costs: Matrix<bigint> = [
      [16n, 2n, 3n, 7n],
      [5n, 13n, 7n, 5n],
      [8n, 6n, 5n, 9n],
      [3n, 4n, 5n, 11n],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 1],
        [1, 3],
        [2, 2],
        [3, 0],
      ])
    );
  });

  test("handles a 5x5 bigint cost matrix", () => {
    const costs: Matrix<bigint> = [
      [38n, 53n, 61n, 36n, 66n],
      [100n, 60n, 9n, 79n, 34n],
      [30n, 37n, 36n, 72n, 24n],
      [61n, 95n, 21n, 14n, 64n],
      [89n, 90n, 4n, 5n, 79n],
    ];

    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 0],
        [1, 4],
        [2, 1],
        [3, 3],
        [4, 2],
      ])
    );
  });

  test("handles a 5x1 bigint matrix", () => {
    const costs: Matrix<bigint> = [[3n, 2n, 1n, 4n, 5n]];
    const res = munkres(costs);
    expect(res).toEqual([[0, 2]]);
  });

  test("handles a 1x5 bigint matrix", () => {
    const costs: Matrix<bigint> = [[3n], [2n], [1n], [4n], [5n]];
    const res = munkres(costs);
    expect(res).toEqual([[2, 0]]);
  });

  test("handles a 4x2 bigint matrix", () => {
    const costs = [
      [4n, 5n, 6n, 1n],
      [7n, 8n, 9n, 2n],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 0],
        [1, 3],
      ])
    );
  });

  test("handles a 2x4 bigint matrix", () => {
    const costs = [
      [1n, 2n],
      [6n, 9n],
      [5n, 8n],
      [4n, 7n],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 1],
        [3, 0],
      ])
    );
  });

  test("handles a 3x9 bigint matrix", () => {
    const costs = [
      [1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n],
      [2n, 4n, 6n, 8n, 10n, 12n, 14n, 16n, 18n],
      [3n, 6n, 9n, 12n, 15n, 18n, 21n, 24n, 27n],
    ];
    const res = munkres(costs);
    expect(new Map(res)).toEqual(
      new Map([
        [0, 2],
        [1, 1],
        [2, 0],
      ])
    );
  });

  test("verify output properties for various bigint matrix dimensions", () => {
    const YY = 33;
    const XX = 33;
    const VAL_MIN = -1e9;
    const VAL_MAX = 1e9;

    for (let Y = 1; Y < YY; ++Y) {
      for (let X = 1; X < XX; ++X) {
        const costs = gen(Y, X, () => {
          const span = VAL_MAX - VAL_MIN;
          return VAL_MIN + Math.trunc(span * Math.random());
        });

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
