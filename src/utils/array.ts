/**
 * Find the minimum value in a given array.
 *
 * @param array - An array of numbers.
 *
 * @returns The minimum value, or `undefined` if the array is empty.
 */
export function getMin(array: number[]): number | undefined;
export function getMin(array: bigint[]): bigint | undefined;
export function getMin(array: string[]): string | undefined;
export function getMin<T extends number | bigint | string>(
  array: T[]
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
