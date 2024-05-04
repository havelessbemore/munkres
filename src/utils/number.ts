export function randomInt(min: number, max: number): number {
  return Math.trunc(min + (max - min) * Math.random());
}
