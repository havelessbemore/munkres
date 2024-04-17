import { UintArray } from "./uintArray";

/**
 * Represents a union of array types useful for indexing operations.
 *
 * @example
 * ```typescript
 * const indices: IndexArray = [2, 0, 3];
 * const values: number[] = [10, 20, 30, 40];
 *
 * const selected = 0;
 * console.log(values[indices[selected]]);
 * // Output: 30
 * ```
 */
export type IndexArray = number[] | UintArray;
