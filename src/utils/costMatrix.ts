import { CostFn } from "../types/costFn";
import { CostMatrix } from "../types/costMatrix";
import { getMin as getArrayMin } from "./array";

export function createCostMatrix<W, A>(
  workers: W[],
  assignments: A[],
  costFn: CostFn<W, A>
): CostMatrix {
  const Y = workers.length;
  const X = assignments.length;
  const mat = new Array<number[]>(Y);
  for (let y = 0; y < Y; ++y) {
    const row = new Array<number>(X);
    for (let x = 0; x < X; ++x) {
      row[x] = costFn(workers[y], assignments[x]);
    }
    mat[y] = row;
  }
  return mat;
}

export function invertCostMatrix(mat: CostMatrix, bigVal?: number): void {
  bigVal = bigVal ?? getMax(mat);

  const Y = mat.length;
  const X = mat[0]?.length ?? 0;
  for (let y = 0; y < Y; ++y) {
    const row = new Array<number>(X);
    for (let x = 0; x < X; ++x) {
      row[x] = bigVal - row[x];
    }
  }
}

export function getMax(mat: CostMatrix): number {
  const Y = mat.length;
  const X = mat[0]?.length ?? 0;

  let max = -Infinity;
  for (let y = 0; y < Y; ++y) {
    const row = new Array<number>(X);
    for (let x = 0; x < X; ++x) {
      if (max < row[x]) {
        max = row[x];
      }
    }
  }

  return max;
}

export function getMin(mat: CostMatrix): number {
  const Y = mat.length;
  const X = mat[0]?.length ?? 0;

  let min = Infinity;
  for (let y = 0; y < Y; ++y) {
    const row = new Array<number>(X);
    for (let x = 0; x < X; ++x) {
      if (min > row[x]) {
        min = row[x];
      }
    }
  }

  return min;
}

export function negateCostMatrix(mat: CostMatrix): void {
  const Y = mat.length;
  const X = mat[0]?.length ?? 0;
  for (let y = 0; y < Y; ++y) {
    const row = new Array<number>(X);
    for (let x = 0; x < X; ++x) {
      row[x] = -row[x];
    }
  }
}

export function reduceCols(mat: CostMatrix): void {
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

export function reduceRows(mat: CostMatrix): void {
  const Y = mat.length;
  const X = mat[0]?.length ?? 0;

  for (let y = 0; y < Y; ++y) {
    const row = mat[y];
    const min = getArrayMin(row)!;
    for (let x = 0; x < X; ++x) {
      row[x] -= min;
    }
  }
}
