import { MatrixLike } from "./matrixLike";

/**
 * Defines the result of the Munkres algorithm.
 */
export interface Matching<T> {
  /**
   * An array of dual variables for the columns of the cost matrix.
   */
  dualX: T[];

  /**
   * An array of dual variables for the rows of the cost matrix.
   */
  dualY: T[];

  /**
   * The cost matrix this matching is for.
   */
  matrix: MatrixLike<T>;

  /**
   * An assignment mapping for the cost matrix, from column
   * index to row index. Unassigned columns are mapped to `-1`.
   */
  starsX: number[];

  /**
   * An assignment mapping for the cost matrix, from row
   * index to column index. Unassigned rows are mapped to `-1`.
   */
  starsY: number[];
}
