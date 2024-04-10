import { expect } from "vitest";
import { Matrix } from "../../src/types/matrix";

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
  matrix: Matrix<unknown>,
  pairs: [number, number][]
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
