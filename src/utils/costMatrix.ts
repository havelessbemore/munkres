import { CostMatrix } from "../types/costMatrix";
import { getMin } from "./array";

export function colReduction(mat: CostMatrix): void {
  const Y = mat.length;
  const X = mat[0]?.length ?? 0;

  for (let x = 0; x < X; ++x) {
    let min = Infinity;
    for (let y = 0; y < Y; ++y) {
      if (min > mat[y][x]) {
        min = mat[y][x];
      }
    }
    for (let y = 0; y < Y; ++y) {
      mat[y][x] -= min;
    }
  }
}

export function rowReduction(mat: CostMatrix): void {
  const Y = mat.length;
  const X = mat[0]?.length ?? 0;

  for (let y = 0; y < Y; ++y) {
    const row = mat[y];
    const min = getMin(row)!;
    for (let x = 0; x < X; ++x) {
      row[x] -= min;
    }
  }
}
