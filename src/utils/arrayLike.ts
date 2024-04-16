/**
 * Transforms the given array into an array of key, value pairs
 * for every entry in the array.
 *
 * @param array - The array to transform into entries.
 *
 * @returns An array of key, value pairs for every entry in the array.
 *
 * @example
 * entries(['a', 'b', 'c']);
 * // Returns [[0, 'a'], [1, 'b'], [2, 'c']]
 */
export function entries<T>(array: ArrayLike<T>): [number, T][] {
  const N = array.length;
  const out = new Array(N);
  for (let i = 0; i < N; ++i) {
    out[i] = [i, array[i]];
  }
  return out;
}

/**
 * Find the minimum value in a given array.
 *
 * @param array - An array.
 *
 * @returns The minimum value, or `undefined` if the array is empty.
 *
 * @example
 * const array = [3, 1, 2];
 * console.log(getMin(array)); // Output: 1
 *
 * @example
 * const array = [3n, 1n, 2n];
 * console.log(getMin(array)); // Output: 1n
 *
 * @example
 * const array = ['d', 'b', 'c'];
 * console.log(getMin(array)); // Output: 'b'
 */
export function getMin(array: ArrayLike<number>): number | undefined;
export function getMin(array: ArrayLike<bigint>): bigint | undefined;
export function getMin(array: ArrayLike<string>): string | undefined;
export function getMin<T extends number | bigint | string>(
  array: ArrayLike<T>
): T | undefined {
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
