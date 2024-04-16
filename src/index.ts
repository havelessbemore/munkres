// Types
export type { Matrix } from "./types/matrix";
export type { MatrixLike } from "./types/matrixLike";
export type { Tuple } from "./types/tuple";

// Cost Matrix Helpers
export {
  createCostMatrix,
  getMaxCost,
  getMinCost,
  invertCostMatrix,
  negateCostMatrix,
} from "./utils/costMatrix";

// Algorithm
export { munkres } from "./munkres";

// Default
import { munkres } from "./munkres";
export default munkres;
