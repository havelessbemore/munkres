/**
 * Options for {@link munkres}.
 *
 * @see {@link munkres}
 */
export interface MunkresOptions {
  /**
   * Promise that the matrix contains only finite values (no `Infinity`,
   * `-Infinity`, or `NaN`).
   *
   * When `true`, the algorithm skips the O(Y*X) finiteness scan at entry
   * and dispatches straight to the faster all-finite code path. If a
   * non-finite value is present anyway, the result is undefined (the
   * algorithm may produce a wrong assignment or throw a runtime
   * arithmetic error).
   *
   * Has no effect for bigint matrices (bigint cannot be non-finite).
   *
   * @default false
   */
  finite?: boolean;
}
