import { describe, expect, test } from "vitest";
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

function totalCostBigInt(
  matrix: bigint[][],
  pairs: [number, number][],
): bigint {
  let sum = 0n;
  for (const [y, x] of pairs) sum += matrix[y][x];
  return sum;
}

function permute<T>(arr: readonly T[], perm: readonly number[]): T[] {
  return perm.map((i) => arr[i]);
}

function permuteColumns<T>(
  matrix: readonly (readonly T[])[],
  perm: readonly number[],
): T[][] {
  return matrix.map((row) => perm.map((i) => row[i]));
}

describe("munkres property: valid assignment", () => {
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

describe("munkres property: optimality vs brute force", () => {
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

describe("munkres property: row-permutation invariance", () => {
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

describe("munkres property: column-permutation invariance", () => {
  // Mirrors the row-perm block above to exercise `step4B` / `num/munkresB.ts`
  // and the wide-matrix dispatch (`Y > X` vs `Y <= X` flips column-side).
  test("permuting columns does not change the optimal total cost", () => {
    fc.assert(
      fc.property(
        smallMatrix.chain((m) =>
          fc
            .tuple(
              fc.constant(m),
              fc.shuffledSubarray(
                Array.from({ length: m[0].length }, (_, i) => i),
                { minLength: m[0].length, maxLength: m[0].length },
              ),
            )
            .map(([matrix, perm]) => ({ matrix, perm })),
        ),
        ({ matrix, perm }) => {
          const original = totalCost(
            matrix,
            munkres(matrix) as [number, number][],
          );
          const shuffled = permuteColumns(matrix, perm);
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

describe("munkres property: optimality on bigint matrices", () => {
  // The bigint hot path (big/munkres.ts) is reached by `bigint` inputs.
  // Verify it returns the same optimal cost as brute force on the
  // equivalent number matrix.
  test("bigint result equals brute-force minimum (n ≤ 6, integer costs)", () => {
    fc.assert(
      fc.property(smallMatrix, (matrix) => {
        const bigMatrix = matrix.map((row) => row.map((v) => BigInt(v)));
        const result = munkres(bigMatrix) as [number, number][];
        const got = totalCostBigInt(bigMatrix, result);
        const expected = bruteForceMinCost(matrix);
        expect(Number(got)).toBe(expected);
      }),
      { numRuns: 200 },
    );
  });
});

describe("munkres property: optimality with Infinity forbidden cells", () => {
  // The Infinity routing path (inf/munkres.ts / inf/munkresB.ts) is only validated
  // by hand-written fixtures today. Inject sparse +Infinity to exercise
  // the dispatcher → numExec branch with property-level coverage.
  //
  // Generator: build a small matrix of finite integers, then mark a
  // bounded number of cells as Infinity. Cap the forbidden count so the
  // assignment problem stays feasible (so brute force yields a finite
  // minimum we can compare against).
  const infinityMatrix = fc
    .tuple(fc.integer({ min: 2, max: 5 }), fc.integer({ min: 2, max: 5 }))
    .chain(([Y, X]) =>
      fc.tuple(
        fc.array(
          fc.array(fc.integer({ min: -100, max: 100 }), {
            minLength: X,
            maxLength: X,
          }),
          { minLength: Y, maxLength: Y },
        ),
        // Inject at most floor(min(Y,X) / 2) Infinity cells (kept sparse
        // so a feasible finite assignment usually exists).
        fc.array(
          fc.tuple(
            fc.integer({ min: 0, max: Y - 1 }),
            fc.integer({ min: 0, max: X - 1 }),
          ),
          {
            minLength: 0,
            maxLength: Math.max(1, Math.floor(Math.min(Y, X) / 2)),
          },
        ),
      ),
    )
    .map(([base, infs]) => {
      const m = base.map((row) => row.slice());
      for (const [y, x] of infs) m[y][x] = Infinity;
      return m;
    });

  test("munkres with Infinity cells matches brute-force minimum (when feasible)", () => {
    fc.assert(
      fc.property(infinityMatrix, (matrix) => {
        const expected = bruteForceMinCost(matrix);
        // If brute force is Infinity, the problem is infeasible — skip
        // the comparison. munkres may return a "best effort" Infinity-
        // containing assignment in that case, which has no defined
        // optimum to validate against.
        fc.pre(Number.isFinite(expected));
        const result = munkres(matrix) as [number, number][];
        const got = totalCost(matrix, result);
        expect(got).toBe(expected);
      }),
      { numRuns: 200 },
    );
  });
});
