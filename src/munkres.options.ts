/**
 * Options for {@link munkres}.
 *
 * @see {@link munkres}
 */
export interface MunkresOptions {
  /**
   * Promise that the matrix contains only finite values (no `Infinity`,
   * `-Infinity`, or `NaN`) and that its range is in-bounds for the
   * algorithm's arithmetic.
   *
   * When `true`, the algorithm skips the O(Y*X) entry scan and
   * dispatches straight to the faster all-finite code path. This also
   * **bypasses the {@link RangeError} thrown when `max(c) - min(c)`
   * exceeds `Number.MAX_VALUE / 2`** — the caller becomes responsible
   * for that invariant. If the input violates either promise (a
   * non-finite cell, a `NaN`, or a too-wide range), the result is
   * undefined: the algorithm may produce a wrong assignment, return
   * cells containing `Infinity` / `NaN`, or throw a deep arithmetic
   * error. It never throws a clean `RangeError` / `TypeError` from
   * this option's path.
   *
   * Has no effect for bigint matrices (bigint cannot be non-finite and
   * has no overflow bound).
   *
   * @default false
   */
  finite?: boolean;
}
