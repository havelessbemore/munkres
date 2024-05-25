import { describe, it, expect } from "@jest/globals";

import { isBigInt, isNumber } from "./is.ts";

describe(`${isBigInt.name}()`, () => {
  it("returns true for bigint values", () => {
    expect(isBigInt(123n)).toBe(true);
    expect(isBigInt(-456n)).toBe(true);
    expect(isBigInt(BigInt(789))).toBe(true);
  });

  it("returns false for non-bigint numeric values", () => {
    expect(isBigInt(123)).toBe(false);
    expect(isBigInt(-456.789)).toBe(false);
    expect(isBigInt(Infinity)).toBe(false);
    expect(isBigInt(NaN)).toBe(false);
  });

  it("returns false for string values", () => {
    expect(isBigInt("123")).toBe(false);
    expect(isBigInt("123n")).toBe(false);
  });

  it("returns false for boolean values", () => {
    expect(isBigInt(true)).toBe(false);
    expect(isBigInt(false)).toBe(false);
  });

  it("returns false for null and undefined", () => {
    expect(isBigInt(null)).toBe(false);
    expect(isBigInt(undefined)).toBe(false);
  });

  it("returns false for object and array", () => {
    expect(isBigInt({})).toBe(false);
    expect(isBigInt([])).toBe(false);
    expect(isBigInt([123n])).toBe(false);
  });

  it("returns false for function and symbol", () => {
    expect(isBigInt(() => 0n)).toBe(false);
    expect(isBigInt(Symbol("bigint"))).toBe(false);
  });
});

describe(`${isNumber.name}()`, () => {
  it("returns true for integer numbers", () => {
    expect(isNumber(123)).toBe(true);
  });

  it("returns true for floating-point numbers", () => {
    expect(isNumber(-456.789)).toBe(true);
  });

  it("returns true for Number constants", () => {
    expect(isNumber(Infinity)).toBe(true);
    expect(isNumber(-Infinity)).toBe(true);
    expect(isNumber(NaN)).toBe(true);
  });

  it("returns false for bigint values", () => {
    expect(isNumber(123n)).toBe(false);
  });

  it("returns false for string values", () => {
    expect(isNumber("123")).toBe(false);
    expect(isNumber("NaN")).toBe(false);
  });

  it("returns false for boolean values", () => {
    expect(isNumber(true)).toBe(false);
    expect(isNumber(false)).toBe(false);
  });

  it("returns false for null and undefined", () => {
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
  });

  it("returns false for object and array", () => {
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber([123])).toBe(false);
  });

  it("returns false for function and symbol", () => {
    expect(isNumber(() => 0n)).toBe(false);
    expect(isNumber(Symbol("number"))).toBe(false);
  });
});
