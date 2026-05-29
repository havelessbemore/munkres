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
