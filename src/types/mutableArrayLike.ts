/**
 * Represents a fixed-length, array-like object of mutable elements.
 *
 * This is similar to {@link ArrayLike},
 * but with support for updating elements.
 *
 * @example
 * ```typescript
 * const array: MutableArrayLike<number> = [1, 2, 3];
 * array[1] = 5; // Modifying the second element
 * console.log(array); // Output: [1, 5, 3]
 * ```
 */
export interface MutableArrayLike<T> {
  readonly length: number;
  [n: number]: T;
}
