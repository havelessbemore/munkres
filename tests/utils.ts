import { expect } from "@jest/globals";

import { MatrixLike } from "../src";
import { Options } from "./munkres";
import { map } from "../src/utils/matrix";

export function initOptions(options?: Options): Options {
  options ??= {};
  options.isBigInt ??= false;
  return options;
}

export function applyOptions(
  matrix: MatrixLike<unknown>,
  options: Options,
): MatrixLike<unknown> {
  if (options.isBigInt) {
    matrix = map(matrix, (v) => BigInt(v as number));
  }
  if (options.matrixTransform != null) {
    matrix = options.matrixTransform(matrix);
  }
  return matrix;
}

export function oneOf<T>(actual: T, expecteds: Iterable<T>): void {
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

export function checkOutputMeta(
  matrix: MatrixLike<unknown>,
  pairs: [number, number][],
): void {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
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
    console.log(`${Y} by ${X}, pairs: ${pairs}, cost matrix:\n${matrix}`);
    throw e;
  }
}

export function toMatrixLike<T>(matrix: MatrixLike<T>): MatrixLike<T> {
  const Y = matrix.length;
  const X = matrix[0]?.length ?? 0;
  const obj: {
    length: number;
    [index: number]: { length: number; [index: number]: T };
  } = {
    length: Y,
  };
  for (let y = 0; y < Y; ++y) {
    const row: { length: number; [index: number]: T } = { length: X };
    for (let x = 0; x < X; ++x) {
      row[x] = matrix[y][x];
    }
    obj[y] = row;
  }
  return obj;
}
