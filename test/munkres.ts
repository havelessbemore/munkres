import { describe, expect, test } from "vitest";

import { Matrix } from "../src/types/matrix";
import { gen, map } from "../src/utils/matrix";

import { checkOutputMeta, oneOf } from "./utils/oneOf";
import { Tuple } from "../src/types/tuple";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MunkresFn = (costMatrix: Matrix<any>) => Tuple<number>[];

export function testSquare(munkres: MunkresFn, isBigInt = false): void {
  describe(`${munkres.name}()`, () => {
    test("handles an empty cost matrix", () => {
      const res = munkres([]);
      expect(res).toEqual([]);
    });

    test("handles a 1x1 cost matrix", () => {
      const costs: Matrix<number> = [[5]];
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
      expect(res).toEqual([[0, 0]]);
    });

    test("handles a 2x2 cost matrix", () => {
      const costs: Matrix<number> = [
        [1, 2],
        [2, 4],
      ];
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
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
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
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
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
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
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
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

    test("test 1", () => {
      const costs: Matrix<number> = [
        [8, 4, 7],
        [5, 2, 3],
        [9, 4, 8],
      ];
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
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
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
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
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
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
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
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
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
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
          [1, 3],
          [2, 2],
          [3, 1],
        ]),
        new Map([
          [0, 2],
          [1, 1],
          [2, 3],
          [3, 0],
        ]),
      ];
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
      oneOf(new Map(res), sols);
    });

    test("test 7", () => {
      const costs: Matrix<number> = [
        [22, 26, 18, 0],
        [1, 20, 18, 0],
        [15, 9, 12, 0],
        [27, 5, 13, 0],
      ];
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
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
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
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
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
      expect(new Map(res)).toEqual(
        new Map([
          [0, 3],
          [1, 2],
          [2, 1],
          [3, 0],
        ])
      );
    });

    test("verify output properties for generated NxN matrices", () => {
      const NN = 100;
      const VAL_MIN = -1e9;
      const VAL_MAX = 1e9;
      for (let N = 1; N < NN; ++N) {
        const costs = gen(N, N, () => {
          const span = VAL_MAX - VAL_MIN;
          return VAL_MIN + Math.trunc(span * Math.random());
        });
        const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
        checkOutputMeta(input, munkres(input));
      }
    });
  });
}

export function testWide(munkres: MunkresFn, isBigInt = false): void {
  describe(`${munkres.name}()`, () => {
    test("handles a 5x1 matrix", () => {
      const costs: Matrix<number> = [[3, 2, 1, 4, 5]];
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
      expect(res).toEqual([[0, 2]]);
    });

    test("handles a 3x2 matrix", () => {
      const costs: Matrix<number> = [
        [2, 25, 18],
        [9, 4, 17],
      ];
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
      expect(new Map(res)).toEqual(
        new Map([
          [0, 0],
          [1, 1],
        ])
      );
    });

    test("handles a 4x2 matrix", () => {
      const costs = [
        [4, 5, 6, 1],
        [7, 8, 9, 2],
      ];
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
      expect(new Map(res)).toEqual(
        new Map([
          [0, 0],
          [1, 3],
        ])
      );
    });

    test("handles a 3x9 matrix", () => {
      const costs = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [2, 4, 6, 8, 10, 12, 14, 16, 18],
        [3, 6, 9, 12, 15, 18, 21, 24, 27],
      ];
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
      expect(new Map(res)).toEqual(
        new Map([
          [0, 2],
          [1, 1],
          [2, 0],
        ])
      );
    });

    test("verify output properties for generated wide matrices", () => {
      const XX = 33;
      const VAL_MIN = -1e9;
      const VAL_MAX = 1e9;

      for (let X = 2; X < XX; ++X) {
        for (let Y = 1; Y < X; ++Y) {
          const costs = gen(Y, X, () => {
            const span = VAL_MAX - VAL_MIN;
            return VAL_MIN + Math.trunc(span * Math.random());
          });
          const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
          checkOutputMeta(input, munkres(input));
        }
      }
    });
  });
}

export function testLong(munkres: MunkresFn, isBigInt = false): void {
  describe(`${munkres.name}()`, () => {
    test("handles a 1x5 matrix", () => {
      const costs: Matrix<number> = [[3], [2], [1], [4], [5]];
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
      expect(res).toEqual([[2, 0]]);
    });

    test("handles a 2x3 matrix", () => {
      const costs: Matrix<number> = [
        [2, 9],
        [25, 4],
        [18, 17],
      ];
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
      expect(new Map(res)).toEqual(
        new Map([
          [0, 0],
          [1, 1],
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
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
      expect(new Map(res)).toEqual(
        new Map([
          [0, 1],
          [3, 0],
        ])
      );
    });

    test("handles a 9x3 matrix", () => {
      const costs = [
        [1, 2, 3],
        [2, 4, 6],
        [3, 6, 9],
        [4, 8, 12],
        [5, 10, 15],
        [6, 12, 18],
        [7, 14, 21],
        [8, 16, 24],
        [9, 18, 27],
      ];
      const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
      const res = munkres(input);
      expect(new Map(res)).toEqual(
        new Map([
          [0, 2],
          [1, 1],
          [2, 0],
        ])
      );
    });

    test("verify output properties for generated long matrices", () => {
      const YY = 33;
      const VAL_MIN = -1e9;
      const VAL_MAX = 1e9;

      for (let Y = 2; Y < YY; ++Y) {
        for (let X = 1; X < Y; ++X) {
          const costs = gen(Y, X, () => {
            const span = VAL_MAX - VAL_MIN;
            return VAL_MIN + Math.trunc(span * Math.random());
          });
          const input = isBigInt ? map(costs, v => BigInt(v)) : costs;
          checkOutputMeta(input, munkres(input));
        }
      }
    });
  });
}

export function testInfinity(munkres: MunkresFn): void {
  describe(`${munkres.name}()`, () => {
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
      oneOf(new Map(res), [
        new Map([
          [0, 0],
          [1, 1],
          [2, 2],
        ]),
        new Map([
          [0, 2],
          [1, 1],
          [2, 0],
        ]),
        new Map([
          [0, 1],
          [1, 2],
          [2, 0],
        ]),
      ]);
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
  });
}

/*
    test("verify output properties for various matrix dimensions", () => {
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

                checkOutputMeta(costs, munkres(costs));
            }
        }
    });
    */
