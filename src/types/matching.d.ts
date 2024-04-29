import { MatrixLike } from "./matrixLike";
import { MutableArrayLike } from "./mutableArrayLike";

/**
 * Defines the result of the Munkres algorithm.
 */
export interface Matching<T> {
  /**
   * An array of dual variables for the columns of the cost matrix.
   */
  dualX: MutableArrayLike<T>;

  /**
   * An array of dual variables for the rows of the cost matrix.
   */
  dualY: MutableArrayLike<T>;

  /**
   * The cost matrix this matching is for.
   */
  matrix: MatrixLike<T>;

  /**
   * An assignment mapping for the cost matrix, from column
   * index to row index. Unassigned columns are mapped to `-1`.
   */
  starsX: MutableArrayLike<number>;

  /**
   * An assignment mapping for the cost matrix, from row
   * index to column index. Unassigned rows are mapped to `-1`.
   */
  starsY: MutableArrayLike<number>;
}
