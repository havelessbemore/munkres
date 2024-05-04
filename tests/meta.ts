import { describe, test } from "@jest/globals";

import { gen, map } from "../src/utils/matrix";

import { checkOutputMeta } from "./utils";
import { MunkresFn } from "./types";

export function testLong(munkres: MunkresFn, isBigInt = false): void {
  describe(`${munkres.name}()`, () => {
    test("verify output properties for generated long matrices", () => {
      const YY = 32;
      const VAL_MIN = 1;
      const VAL_MAX = Number.MAX_SAFE_INTEGER;

      for (let Y = 2; Y <= YY; ++Y) {
        for (let X = 1; X < Y; ++X) {
          const costs = gen(Y, X, () => {
            const span = VAL_MAX - VAL_MIN;
            return VAL_MIN + Math.trunc(span * Math.random());
          });
          const input = isBigInt ? map(costs, (v) => BigInt(v)) : costs;
          checkOutputMeta(input, munkres(input));
        }
      }
    });
  });
}

export function testSquare(munkres: MunkresFn, isBigInt = false): void {
  describe(`${munkres.name}()`, () => {
    test("verify output properties for generated NxN matrices", () => {
      const NN = 64;
      const VAL_MIN = 1;
      const VAL_MAX = Number.MAX_SAFE_INTEGER;
      for (let N = 1; N <= NN; ++N) {
        const costs = gen(N, N, () => {
          const span = VAL_MAX - VAL_MIN;
          return VAL_MIN + Math.trunc(span * Math.random());
        });
        const input = isBigInt ? map(costs, (v) => BigInt(v)) : costs;
        checkOutputMeta(input, munkres(input));
      }
    });
  });
}

export function testWide(munkres: MunkresFn, isBigInt = false): void {
  describe(`${munkres.name}()`, () => {
    test("verify output properties for generated wide matrices", () => {
      const XX = 32;
      const VAL_MIN = 1;
      const VAL_MAX = Number.MAX_SAFE_INTEGER;

      for (let X = 2; X <= XX; ++X) {
        for (let Y = 1; Y < X; ++Y) {
          const costs = gen(Y, X, () => {
            const span = VAL_MAX - VAL_MIN;
            return VAL_MIN + Math.trunc(span * Math.random());
          });
          const input = isBigInt ? map(costs, (v) => BigInt(v)) : costs;
          checkOutputMeta(input, munkres(input));
        }
      }
    });
  });
}

export function testInfinity(munkres: MunkresFn): void {
  describe(`${munkres.name}()`, () => {
    test("verify output properties for generated NxN matrices", () => {
      const NN = 64;
      const VAL_MIN = 1;
      const VAL_MAX = Number.MAX_SAFE_INTEGER;
      for (let N = 1; N <= NN; ++N) {
        const costs = gen(N, N, () => {
          const r = Math.random();
          if (r <= 0.075) {
            return -Infinity;
          }
          if (r >= 0.925) {
            return Infinity;
          }
          const span = VAL_MAX - VAL_MIN;
          return VAL_MIN + Math.trunc(span * Math.random());
        });
        checkOutputMeta(costs, munkres(costs));
      }
    });
  });
}
