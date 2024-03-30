/**
 * Checks if the given value is of type `bigint`.
 *
 * @param value - The value to check.
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

/**
 * Checks if the given value is of type `number`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is of type `number`, `false` otherwise.
 *
 * @example
 * console.log(isNumber(10)); // true
 *
 * @example
 * console.log(isNumber(10n)); // false
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}
