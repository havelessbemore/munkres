import { MutableArrayLike } from "../types/mutableArrayLike";

/**
 * Partitions an array of indices based on the minimum value of the indices in another array.
 *
 * @param indices - The array of indices to be partitioned. Modified in place.
 * @param values - The array from which index values are read.
 * @param min - The starting position in `indices` for partitioning (inclusive). Defaults to 0.
 * @param max - The ending position in `indices` for partitioning (exclusive). Defaults to `indices.length`.
 *
 * @returns The position one more than the partitioned portion of `indices`. Indices in the partition
 *          have values equal to the minimum value of the scanned indices.
 *
 * @example
 * ```javascript
 * const indices = [0, 1, 2, 3, 4];
 * const values = [5, 3, 2, 4, 1];
 * const mid = partitionByMin(indices, values);
 * console.log(indices.slice(0, mid));
 * // Outputs: [4]
 * // Explanation: 1 is the minimum in `values`, found only in index 4.
 * ```
 *
 * @example
 * ```javascript
 * const indices = [0, 5, 3, 2, 4, 1];
 * const values = [10, 20, 80, 50, 30, 50];
 * const mid = partitionByMin(indices, values, 1, 4);
 * console.log(indices.slice(1, mid));
 * // Outputs: [5, 3]
 * // Explanation: The function scans the `indices` subarray from positions [1, 4); [5, 3, 2].
 * // These indices map to values 50, 50 and 80 in the `values` array, respectively. The
 * // minimum value is 50, which both index 5 and 3 are equal to. Thus, indices 5 and 3 are
 * // partitioned into the beginning of the subarray, in the order they are encountered.
 * ```
 */
export function partitionByMin<T extends number | bigint | string>(
  indices: MutableArrayLike<number>,
  values: ArrayLike<T>,
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
