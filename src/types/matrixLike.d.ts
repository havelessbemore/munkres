/**
 * Defines a two-dimensional, read-only matrix with elements of type `T`.
 *
 * Unlike {@link Matrix}, `MatrixLike` uses {@link ArrayLike} objects,
 * allowing for more flexible matrix-like data structures, such as those made
 * with typed arrays or other sequence-like objects.
 *
 * The outer array represents the rows of the matrix, and each inner array
 * represents the columns in a row. This type is generic and can be used to
 * create matrices of any given type.
 *
 * @example
 * ```typescript
 * const matrix: MatrixLike<number> = {
 *   length: 3,
 *   0: { length: 3, 0: 1, 1: 2, 2: 3 },
 *   1: { length: 3, 0: 4, 1: 5, 2: 6 },
 *   2: { length: 3, 0: 7, 1: 8, 2: 9 }
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Using MatrixLike with NodeList in DOM manipulation
 * const divMatrix: MatrixLike<HTMLElement> = document.querySelectorAll('.foo');
 * ```
 */
export type MatrixLike<T> = ArrayLike<ArrayLike<T>>;
