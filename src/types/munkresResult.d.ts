/**
 * Defines the result of the Munkres algorithm.
 */
export interface MunkresResult<T> {
  /**
   * An array of dual variables associated with the columns of the given
   * cost matrix. Each value represents the minimized cost or adjustment
   * for each column.
   */
  dualX: T[];

  /**
   * An array of dual variables associated with the rows of the given
   * cost matrix. Each value represents the minimized cost or adjustment
   * for each row.
   */
  dualY: T[];

  /**
   * An array that maps optimal assignments for the given cost matrix
   * from the column index to the row index. If a column does not
   * have an assignment, it is mapped to `-1`.
   */
  starsX: number[];

  /**
   * An array that maps optimal assignments for the given cost matrix
   * from the row index to the column index. If a row does not
   * have an assignment, it is mapped to `-1`.
   */
  starsY: number[];
}
