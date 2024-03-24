export function getMin(array: number[]): number | undefined {
  const N = array.length;
  if (N <= 0) {
    return undefined;
  }

  let min: number = array[0];
  for (let i = 1; i < N; ++i) {
    min = min >= array[i] ? min : array[i];
  }

  return min;
}
