import type { MatrixLike } from "../types/matrixLike.ts";
import type { Pair } from "../types/pair.ts";

/**
 * Result of inspecting a numeric matrix. Mutually exclusive variants on
 * `nanAt` / `infinityAt`:
 *
 *  - all-finite, non-empty  → `{ rangeMin, rangeMax }`
 *  - all-finite, empty      → `{}`
 *  - contains NaN           → `{ nanAt: [y, x] }`
 *  - contains Infinity      → `{ infinityAt: [y, x] }`
 *
 * NaN takes precedence: if both NaN and Infinity are present, only
 * `nanAt` is returned (the caller is expected to throw on NaN, so
 * Infinity coordinates are moot).
 *
 * `rangeMin` / `rangeMax` are present only in the all-finite non-empty
 * variant. They let the dispatcher enforce the overflow-safety bound
 * `max - min <= Number.MAX_VALUE / 2` (see
 * `docs/proofs/dual-magnitude-bound.md`).
 */
export type NumericInspection =
  | {
      nanAt?: never;
      infinityAt?: Pair<number>;
      rangeMin?: number;
      rangeMax?: number;
    }
  | {
      nanAt: Pair<number>;
      infinityAt?: never;
      rangeMin?: never;
      rangeMax?: never;
    };

/**
 * Single-pass O(Y*X) scan of a numeric matrix. Returns the coordinates
 * of the first NaN encountered (in row-major order), or — if no NaN
 * exists — the first ±Infinity. For fully-finite non-empty matrices,
 * also reports the minimum and maximum finite values for downstream
 * range validation.
 */
export function inspectNumeric(matrix: MatrixLike<number>): NumericInspection {
  const Y = matrix.length;
  if (Y === 0) return {};
  const X = matrix[0]?.length ?? 0;
  if (X === 0) return {};

  let infinityAt: Pair<number> | undefined;
  let rangeMin = Infinity;
  let rangeMax = -Infinity;
  for (let y = 0; y < Y; ++y) {
    const row = matrix[y];
    for (let x = 0; x < X; ++x) {
      const v = row[x];
      if (v !== v) return { nanAt: [y, x] };
      if (v === Infinity || v === -Infinity) {
        if (!infinityAt) infinityAt = [y, x];
        continue;
      }
      if (v < rangeMin) rangeMin = v;
      if (v > rangeMax) rangeMax = v;
    }
  }
  
  return { infinityAt, rangeMin, rangeMax };
}
