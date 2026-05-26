import { describe, expect, test } from "@jest/globals";
import { mulberry32 } from "./seededRandom";

describe("mulberry32", () => {
  test("is deterministic for a given seed", () => {
    const a = mulberry32(0xdeadbeef);
    const b = mulberry32(0xdeadbeef);
    for (let i = 0; i < 10; ++i) expect(a()).toBe(b());
  });

  test("produces values in [0, 1)", () => {
    const r = mulberry32(1);
    for (let i = 0; i < 1000; ++i) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  test("different seeds produce different sequences", () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(a()).not.toBe(b());
  });
});
