// Types
export type { Matrix } from "./types/matrix";
export type { MatrixLike } from "./types/matrixLike";
export type { Pair } from "./types/pair";

// Cost Matrix Helpers
export {
  copyMatrix,
  createMatrix,
  genMatrix,
  getMatrixMax,
  getMatrixMin,
  invertMatrix,
  negateMatrix,
} from "./helpers";

// Main
export { munkres, munkresAsync } from "./munkres";

// Matchers
export { matchAsync } from "./core/munkresAsync";

// Default
import { munkres } from "./munkres";
export default munkres;
