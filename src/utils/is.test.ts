import { describe, test, expect } from "vitest";

import { isBigInt } from "./is.ts";

describe(`${isBigInt.name}()`, () => {
  test("returns true for bigint values", () => {
    expect(isBigInt(123n)).toBe(true);
    expect(isBigInt(-456n)).toBe(true);
    expect(isBigInt(BigInt(789))).toBe(true);
  });

  test("returns false for non-bigint numeric values", () => {
    expect(isBigInt(123)).toBe(false);
    expect(isBigInt(-456.789)).toBe(false);
    expect(isBigInt(Infinity)).toBe(false);
    expect(isBigInt(NaN)).toBe(false);
  });

  test("returns false for string values", () => {
    expect(isBigInt("123")).toBe(false);
    expect(isBigInt("123n")).toBe(false);
  });

  test("returns false for boolean values", () => {
    expect(isBigInt(true)).toBe(false);
    expect(isBigInt(false)).toBe(false);
  });

  test("returns false for null and undefined", () => {
    expect(isBigInt(null)).toBe(false);
    expect(isBigInt(undefined)).toBe(false);
  });

  test("returns false for object and array", () => {
    expect(isBigInt({})).toBe(false);
    expect(isBigInt([])).toBe(false);
    expect(isBigInt([123n])).toBe(false);
  });

  test("returns false for function and symbol", () => {
    expect(isBigInt(() => 0n)).toBe(false);
    expect(isBigInt(Symbol("bigint"))).toBe(false);
  });
});
