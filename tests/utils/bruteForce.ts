/**
 * O(min(Y,X)!) brute-force assignment-problem solver.
 * Used as a correctness oracle in property tests. Only valid for very small
 * matrices (min(Y,X) ≤ 7 in practice). Supports rectangular matrices.
 *
 * Returns the minimum sum-of-costs over all valid one-to-one assignments
 * between rows and columns. Forbidden assignments may be encoded as Infinity;
 * the oracle propagates Infinity through addition, so any assignment that
 * includes a forbidden cell has total cost Infinity (and loses to any finite
 * alternative).
 */
export function bruteForceMinCost(matrix: number[][]): number {
  const Y = matrix.length;
  if (Y === 0) return 0;
  const X = matrix[0].length;
  if (X === 0) return 0;

  const rows = Y <= X ? Y : X;
  const cols = Y <= X ? X : Y;
  const at =
    Y <= X
      ? (r: number, c: number) => matrix[r][c]
      : (r: number, c: number) => matrix[c][r];

  // Enumerate every injection from {0..rows-1} into {0..cols-1}.
  const used = new Array<boolean>(cols).fill(false);
  const pick = new Array<number>(rows);
  let best = Infinity;

  function recurse(row: number, costSoFar: number): void {
    if (row === rows) {
      if (costSoFar < best) best = costSoFar;
      return;
    }
    for (let c = 0; c < cols; ++c) {
      if (used[c]) continue;
      used[c] = true;
      pick[row] = c;
      recurse(row + 1, costSoFar + at(row, c));
      used[c] = false;
    }
  }

  recurse(0, 0);
  return best;
}
