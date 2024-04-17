// Types
export type { Matrix } from "./types/matrix";
export type { MatrixLike } from "./types/matrixLike";
export type { Pair } from "./types/pair";

// Cost Matrix Helpers
export {
  createMatrix,
  getMatrixMax,
  getMatrixMin,
  invertMatrix,
  negateMatrix,
} from "./helpers";

// Algorithm
export { munkres } from "./munkres";

// Default
import { munkres } from "./munkres";
export default munkres;
