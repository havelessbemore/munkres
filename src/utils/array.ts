/**
 * Find the index of the minimum value in a given array.
 *
 * @param array - An array.
 *
 * @returns The zero-based index of the minimum value,
 * or `undefined` if the array is empty.
 *
 * @example
 * const array = [3, 1, 2];
 * console.log(findMin(array)); // Output: 1
 *
 * @example
 * const array = [3n, 1n, 2n];
 * console.log(findMin(array)); // Output: 1
 *
 * @example
 * const array = ['d', 'b', 'c'];
 * console.log(findMin(array)); // Output: 1
 */
export function findMin(array: number[]): number | undefined;
export function findMin(array: bigint[]): number | undefined;
export function findMin(array: string[]): number | undefined;
export function findMin<T extends number | bigint | string>(
  array: T[]
): number | undefined;
export function findMin<T extends number | bigint | string>(
  array: T[]
): number | undefined {
  const N = array.length;
  if (N <= 0) {
    return undefined;
  }

  let minI = 0;
  let min = array[0];
  for (let i = 1; i < N; ++i) {
    if (min > array[i]) {
      min = array[i];
      minI = i;
    }
  }

  return minI;
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
export function getMin(array: number[]): number | undefined;
export function getMin(array: bigint[]): bigint | undefined;
export function getMin(array: string[]): string | undefined;
export function getMin<T extends number | bigint | string>(
  array: T[]
): T | undefined;
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
