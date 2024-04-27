/**
 * The maximum length of an array.
 *
 * According to the ECMAScript specification, the length property of an array
 * is an unsigned 32-bit integer, so its range is 0 to 2**32 - 1, inclusive.
 * Beyond this, operations that modify the array length (e.g., `push`, `pop`,
 * `unshift`, `shift`) may fail or behave unexpectedly.
 *
 * For more details, see the
 * {@link https://262.ecma-international.org/14.0/#sec-arraycreate | ECMAScript Specification},
 * section "10.4.2.2 ArrayCreate".
 */
export const ARRAY_MAX_LENGTH = 4294967295; // 2**32 - 1
