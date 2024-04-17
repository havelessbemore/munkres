/**
 * Represents a pair of elements.
 *
 * The first element is of type `A` and the second element is of type `B`.
 * If not specified, `B` defaults to `A`, signifying a pair of the same
 * type.
 *
 * This is useful for scenarios such as key-value pairs, coordinates, and
 * other dual-element structures.
 *
 * @example
 * ```typescript
 * // A pair of numbers
 * const coordinate: Pair<number> = [15, 20];
 * ```
 *
 * @example
 * ```typescript
 * // A pair of a string and a number
 * const keyValue: Pair<string, number> = ['age', 30];
 * ```
 */
export type Pair<A, B = A> = [A, B];
