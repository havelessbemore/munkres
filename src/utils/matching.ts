import type { Matching } from "../types/matching";
import type { Pair } from "../types/pair";

import { entries } from "./arrayLike";
import { flipH } from "./matrix";

/**
 * Converts a matching object into an array of matched indices.
 *
 * @param matching - The matching to convert.
 *
 * @returns An array of pairs where each pair
 * `[r, c]` indicates a match between row `r` and column `c`.
 *
 * @example
 * ```typescript
 * const matching = {
 *   // ...
 *   starsY: [2, 0],
 *   starsX: [2, -1, 0]
 * };
 *
 * const pairs = toPairs(matching);
 * // pairs: [[0, 2], [1, 0]]
 * ```
 */
export function toPairs<T>(matching: Matching<T>): Pair<number>[] {
  // If Y <= X
  if (matching.starsY.length <= matching.starsX.length) {
    return entries(matching.starsY);
  }

  // If Y > X
  const pairs = entries(matching.starsX);
  flipH(pairs);
  return pairs;
}
