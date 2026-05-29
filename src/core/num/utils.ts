// Number-typed array helpers for the finite-number (`num`) and
// Infinity-handling (`inf`) solvers, which are both `number`-typed.
//
// These are split from the bigint copies in `../big/utils.ts` so each
// call site stays monomorphic in V8's type feedback. A single generic
// shared by the number and bigint solvers would see both element types
// at its comparison site and emit polymorphic code, measurably slowing
// the number path once the same process also solves bigint matrices.
// Same rationale as the solver split (see `../num/munkres.ts`).
//
// **Keep in sync with `../big/utils.ts`.** The bodies are identical;
// only the element type differs.
import type { MutableArrayLike } from "../../types/mutableArrayLike.ts";

/**
 * Find the minimum value in an array.
 *
 * @param array - An array.
 *
 * @returns The minimum value, or `undefined` if the array is empty.
 */
export function getMin(array: ArrayLike<number>): number | undefined {
  const N = array.length;
  if (N <= 0) {
    return undefined;
  }

  let min = array[0];
  for (let i = 1; i < N; ++i) {
    if (min > array[i]) {
      min = array[i];
    }
  }

  return min;
}

/**
 * Partitions an array of indices based on the minimum value of the
 * indices in another array.
 *
 * @param indices - The array of indices to be partitioned. Modified in place.
 * @param values - The array from which index values are read.
 * @param min - The starting position in `indices` (inclusive). Defaults to 0.
 * @param max - The ending position in `indices` (exclusive). Defaults to `indices.length`.
 *
 * @returns The position one more than the partitioned portion of `indices`.
 */
export function partitionByMin(
  indices: MutableArrayLike<number>,
  values: ArrayLike<number>,
  min = 0,
  max = indices.length,
): number {
  let mid = min + 1;
  let minIndex = indices[min];

  for (let pos = mid; pos < max; ++pos) {
    const index = indices[pos];
    if (values[index] > values[minIndex]) {
      continue;
    }
    if (values[index] < values[minIndex]) {
      minIndex = index;
      mid = min;
    }
    indices[pos] = indices[mid];
    indices[mid++] = index;
  }

  return mid;
}
