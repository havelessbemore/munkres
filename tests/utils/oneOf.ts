import { expect } from "@jest/globals";

export function oneOf<T>(actual: T, expecteds: Iterable<T>): void {
  let error: Error | undefined = undefined;
  for (const expected of expecteds) {
    try {
      expect(actual).toEqual(expected);
      error = undefined;
      break;
    } catch (e) {
      error = e as Error;
    }
  }

  if (error != null) {
    throw error;
  }
}
