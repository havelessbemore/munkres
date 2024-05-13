import { expect, test } from "@jest/globals";

import { flipH, flipV, gen, transpose } from "../src/utils/matrix";

import { checkOutputMeta } from "./utils/checkOutputMeta";
import { applyOptions } from "./utils/applyOptions";
import { initOptions } from "./utils/initOptions";
import { MunkresFn } from "./types/munkresFn";
import { MunkresFnAsync } from "./types/munkresFnAsync";
import { MatrixLike, copyMatrix, genMatrix } from "../src";
import { Options } from "./types/options";

const VAL_MIN = 1;
const VAL_MAX = 1e9;
function genInt(): number {
  return Math.trunc(VAL_MIN + (VAL_MAX - VAL_MIN) * Math.random());
}

export function testLong(
  munkres: MunkresFn | MunkresFnAsync,
  options?: Options,
): void {
  options = initOptions(options);
  test("verify output properties for generated long matrices", async () => {
    const YY = 30;
    for (let Y = 2; Y <= YY; ++Y) {
      for (let X = 1; X < Y; ++X) {
        const costs = gen(Y, X, genInt);
        const input = applyOptions(costs, options);
        checkOutputMeta(input, await munkres(input));
      }
    }
  });
}

export function testSquare(
  munkres: MunkresFn | MunkresFnAsync,
  options?: Options,
): void {
  options = initOptions(options);
  test("verify output properties for generated NxN matrices", async () => {
    const NN = 64;
    for (let N = 1; N <= NN; ++N) {
      const costs = gen(N, N, () => {
        const span = VAL_MAX - VAL_MIN;
        return Math.trunc(VAL_MIN + span * Math.random());
      });
      const input = applyOptions(costs, options);
      checkOutputMeta(input, await munkres(input));
    }
  });
}

export function testWide(
  munkres: MunkresFn | MunkresFnAsync,
  options?: Options,
): void {
  options = initOptions(options);
  test("verify output properties for generated wide matrices", async () => {
    const XX = 30;
    for (let X = 2; X <= XX; ++X) {
      for (let Y = 1; Y < X; ++Y) {
        const costs = gen(Y, X, genInt);
        const input = applyOptions(costs, options);
        checkOutputMeta(input, await munkres(input));
      }
    }
  });
}

export function testInfinity(
  munkres: MunkresFn | MunkresFnAsync,
  options?: Options,
): void {
  options = initOptions(options);
  test("verify output properties for generated NxN matrices", async () => {
    const NN = 64;
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
        return Math.trunc(VAL_MIN + span * Math.random());
      });
      const input = applyOptions(costs, options);
      checkOutputMeta(costs, await munkres(input));
    }
  });
}

export function testFlipH(
  munkres: MunkresFn | MunkresFnAsync,
  options?: Options,
): void {
  options = initOptions(options);
  test("Results should be the same if matrix is flipped horizontally", async () => {
    const N = 30;
    for (let Y = 1; Y <= N; ++Y) {
      for (let X = 1; X <= N; ++X) {
        // Get results A
        const costs = genMatrix(Y, X, genInt);
        const inputA = applyOptions(costs, options);
        const resA = await munkres(inputA);

        // Get results B
        const inputB = copyMatrix(inputA as MatrixLike<number>);
        flipH(inputB);
        const resB = await munkres(inputB);
        resB.map((pair) => (pair[1] = X - pair[1] - 1));

        // Compare pairs
        try {
          expect(new Map(resA)).toEqual(resB);
          continue;
        } catch (_) {
          // Do nothing
        }

        // Compare minimum
        const zero = options.isBigInt ? 0n : 0;
        const sumA = resA.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (sum, [y, x]) => (sum as any) + inputA[y][x],
          zero,
        );
        const sumB = resB.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (sum, [y, x]) => (sum as any) + inputB[y][X - x - 1],
          zero,
        );
        expect(sumB).toBe(sumA);
      }
    }
  });
}

export function testFlipV(
  munkres: MunkresFn | MunkresFnAsync,
  options?: Options,
): void {
  options = initOptions(options);
  test("Results should be the same if matrix is flipped vertically", async () => {
    const N = 30;
    for (let Y = 1; Y <= N; ++Y) {
      for (let X = 1; X <= N; ++X) {
        // Get results A
        const costs = genMatrix(Y, X, genInt);
        const inputA = applyOptions(costs, options);
        const resA = await munkres(inputA);

        // Get results B
        const inputB = copyMatrix(inputA as MatrixLike<number>);
        flipV(inputB);
        const resB = await munkres(inputB);
        resB.map((pair) => (pair[0] = Y - pair[0] - 1));

        // Compare pairs
        try {
          expect(new Map(resA)).toEqual(resB);
          continue;
        } catch (_) {
          // Do nothing
        }

        // Compare minimum
        const zero = options.isBigInt ? 0n : 0;
        const sumA = resA.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (sum, [y, x]) => (sum as any) + inputA[y][x],
          zero,
        );
        const sumB = resB.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (sum, [y, x]) => (sum as any) + inputB[Y - y - 1][x],
          zero,
        );
        expect(sumB).toBe(sumA);
      }
    }
  });
}

export function testTranspose(
  munkres: MunkresFn | MunkresFnAsync,
  options?: Options,
): void {
  options = initOptions(options);
  test("Results should be the same if matrix transposed", async () => {
    const N = 30;
    for (let Y = 1; Y <= N; ++Y) {
      for (let X = 1; X <= N; ++X) {
        // Get results A
        const costs = genMatrix(Y, X, genInt);
        const inputA = applyOptions(costs, options);
        const resA = await munkres(inputA);

        // Get results B
        const inputB = copyMatrix(inputA as MatrixLike<number>);
        transpose(inputB);
        const resB = await munkres(inputB);
        flipH(resB);

        // Compare pairs
        try {
          expect(new Map(resA)).toEqual(resB);
          continue;
        } catch (_) {
          // Do nothing
        }

        // Compare minimum
        const zero = options.isBigInt ? 0n : 0;
        const sumA = resA.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (sum, [y, x]) => (sum as any) + inputA[y][x],
          zero,
        );
        const sumB = resB.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (sum, [x, y]) => (sum as any) + inputB[y][x],
          zero,
        );
        expect(sumB).toBe(sumA);
      }
    }
  });
}
