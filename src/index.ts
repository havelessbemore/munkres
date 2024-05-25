// Types
export type { Matrix } from "./types/matrix.ts";
export type { MatrixLike } from "./types/matrixLike.ts";
export type { Pair } from "./types/pair.ts";

// Cost Matrix Helpers
export {
  copyMatrix,
  createMatrix,
  genMatrix,
  getMatrixMax,
  getMatrixMin,
  invertMatrix,
  negateMatrix,
} from "./helpers.ts";

// Algorithm
export { munkres } from "./munkres.ts";

// Default
import { munkres } from "./munkres.ts";
export default munkres;
