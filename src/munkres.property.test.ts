import { describe, expect, test } from "@jest/globals";
import fc from "fast-check";

import { munkres } from "./munkres";
import { bruteForceMinCost } from "../tests/utils/bruteForce";

const smallMatrix = fc
  .tuple(
    fc.integer({ min: 1, max: 6 }), // Y
    fc.integer({ min: 1, max: 6 }), // X
  )
  .chain(([Y, X]) =>
    fc.array(
      fc.array(fc.integer({ min: -1000, max: 1000 }), {
        minLength: X,
        maxLength: X,
      }),
      { minLength: Y, maxLength: Y },
    ),
  );

function totalCost(matrix: number[][], pairs: [number, number][]): number {
  let sum = 0;
  for (const [y, x] of pairs) sum += matrix[y][x];
  return sum;
}

function permute<T>(arr: readonly T[], perm: readonly number[]): T[] {
  return perm.map((i) => arr[i]);
}

describe("munkres — property: valid assignment", () => {
  test("result has correct length, unique rows, unique columns, in-bounds indices", () => {
    fc.assert(
      fc.property(smallMatrix, (matrix) => {
        const result = munkres(matrix);
        const Y = matrix.length;
        const X = matrix[0].length;
        const P = Math.min(Y, X);

        expect(result.length).toBe(P);

        const seenY = new Set<number>();
        const seenX = new Set<number>();
        for (const [y, x] of result) {
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThan(Y);
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThan(X);
          expect(seenY.has(y)).toBe(false);
          expect(seenX.has(x)).toBe(false);
          seenY.add(y);
          seenX.add(x);
        }
      }),
      { numRuns: 200 },
    );
  });
});

describe("munkres — property: optimality vs brute force", () => {
  test("total cost equals brute-force minimum (n ≤ 6, integer costs)", () => {
    fc.assert(
      fc.property(smallMatrix, (matrix) => {
        const result = munkres(matrix) as [number, number][];
        const got = totalCost(matrix, result);
        const expected = bruteForceMinCost(matrix);
        expect(got).toBe(expected);
      }),
      { numRuns: 200 },
    );
  });
});

describe("munkres — property: row-permutation invariance", () => {
  test("permuting rows does not change the optimal total cost", () => {
    fc.assert(
      fc.property(
        smallMatrix.chain((m) =>
          fc
            .tuple(
              fc.constant(m),
              fc.shuffledSubarray(
                Array.from({ length: m.length }, (_, i) => i),
                { minLength: m.length, maxLength: m.length },
              ),
            )
            .map(([matrix, perm]) => ({ matrix, perm })),
        ),
        ({ matrix, perm }) => {
          const original = totalCost(
            matrix,
            munkres(matrix) as [number, number][],
          );
          const shuffled = permute(matrix, perm);
          const permuted = totalCost(
            shuffled,
            munkres(shuffled) as [number, number][],
          );
          expect(permuted).toBe(original);
        },
      ),
      { numRuns: 100 },
    );
  });
});
