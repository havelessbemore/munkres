import { CostMatrix } from "../types/costMatrix";

export function toString(
  mat: CostMatrix,
  starX: number[],
  primeY: number[]
): string {
  const buf: string[] = [""];
  const X = mat[0].length;
  const Y = mat.length;

  // Get cell width
  let cw = -Infinity;
  for (let y = 0; y < Y; ++y) {
    for (let x = 0; x < X; ++x) {
      cw = Math.max(cw, mat[y][x]);
    }
  }
  cw = `${cw}`.length + 1;

  // Print each value
  for (let y = 0; y < Y; ++y) {
    for (let x = 0; x < X; ++x) {
      let val = `${mat[y][x]}`;

      // Mark value as a star or prime
      if (starX[x] == y) {
        val += "*";
      } else if (primeY[y] == x) {
        val += '"';
      }

      buf.push(val.padEnd(cw, " "));
    }
    buf.push("\n");
  }

  return buf.join(" ");
}
