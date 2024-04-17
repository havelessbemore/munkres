/**
 * Represents a union of all standard JavaScript
 * typed arrays for unsigned integers.
 *
 * These are useful when working with data that requires
 * non-negative integers with size constraints.
 */

export type UintArray = Uint8Array | Uint16Array | Uint32Array;
