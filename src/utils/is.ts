/**
 * Checks if the given value is of type `bigint`.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is of type `bigint`, `false` otherwise.
 *
 * @example
 * console.log(isBigInt(10n)); // true
 *
 * @example
 * console.log(isBigInt(10)); // false
 */
export function isBigInt(value: unknown): value is bigint {
  return typeof value === "bigint";
}
