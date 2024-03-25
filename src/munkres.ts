import { CostMatrix } from "./types/costMatrix";
import { munkres } from "./utils/munkres";

export class Munkres {
  run(mat: CostMatrix): [number, number][] {
    return munkres(mat);
  }
}
