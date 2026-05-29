// Routing-observability tests for the dispatcher in `./munkres.ts`.
//
// The dispatcher picks one of three type-specialized cores:
//   - bigint matrix              → bigExec        (monomorphic over bigint)
//   - finite number matrix       → numFiniteExec  (monomorphic over number)
//   - Infinity-bearing number    → numExec        (Infinity-saturating path)
//
// These produce numerically equivalent results on overlapping inputs, so a
// regression that silently re-routed (e.g. finite numbers back to numExec)
// would pass every output-based test while erasing the type-specialization
// that PR #131 introduced to keep the bigint hot path fast. The only way to
// catch that is to assert *which* core was invoked — which is what this file
// does, by mocking the three cores and inspecting the call spies.
//
// `inspectNumeric` and `isBigInt` are intentionally NOT mocked: they must run
// for real so the dispatcher's branch decisions reflect the actual input.

import { beforeEach, describe, expect, test, vi } from "vitest";

import { exec as bigExec } from "./bigMunkres.ts";
import { exec as numFiniteExec } from "./numFiniteMunkres.ts";
import { exec as numExec } from "./numMunkres.ts";
import { exec } from "./munkres.ts";

// Each factory is fully inlined: `vi.mock` calls are hoisted above all
// imports and module-scope declarations, so the factory cannot reference
// any outer binding. Each core's `exec` becomes a spy returning an empty
// matching (the dispatcher passes the result straight through, so the
// exact shape is immaterial — only the call records matter here).
vi.mock("./bigMunkres.ts", () => ({
  exec: vi.fn(() => ({
    dualX: [],
    dualY: [],
    matrix: [],
    starsX: [],
    starsY: [],
  })),
}));
vi.mock("./numFiniteMunkres.ts", () => ({
  exec: vi.fn(() => ({
    dualX: [],
    dualY: [],
    matrix: [],
    starsX: [],
    starsY: [],
  })),
}));
vi.mock("./numMunkres.ts", () => ({
  exec: vi.fn(() => ({
    dualX: [],
    dualY: [],
    matrix: [],
    starsX: [],
    starsY: [],
  })),
}));

describe("munkres dispatcher routing", () => {
  beforeEach(() => {
    vi.mocked(bigExec).mockClear();
    vi.mocked(numFiniteExec).mockClear();
    vi.mocked(numExec).mockClear();
  });

  test("finite number matrix routes to numFiniteExec", () => {
    exec([
      [1, 2],
      [3, 4],
    ]);
    expect(numFiniteExec).toHaveBeenCalledTimes(1);
    expect(bigExec).not.toHaveBeenCalled();
    expect(numExec).not.toHaveBeenCalled();
  });

  test("bigint matrix routes to bigExec", () => {
    exec([
      [1n, 2n],
      [3n, 4n],
    ]);
    expect(bigExec).toHaveBeenCalledTimes(1);
    expect(numFiniteExec).not.toHaveBeenCalled();
    expect(numExec).not.toHaveBeenCalled();
  });

  test("Infinity-bearing number matrix routes to numExec", () => {
    exec([
      [1, Infinity],
      [3, 4],
    ]);
    expect(numExec).toHaveBeenCalledTimes(1);
    expect(bigExec).not.toHaveBeenCalled();
    expect(numFiniteExec).not.toHaveBeenCalled();
  });

  test("-Infinity-bearing number matrix routes to numExec", () => {
    exec([
      [1, -Infinity],
      [3, 4],
    ]);
    expect(numExec).toHaveBeenCalledTimes(1);
    expect(bigExec).not.toHaveBeenCalled();
    expect(numFiniteExec).not.toHaveBeenCalled();
  });

  test("{ finite: true } routes to numFiniteExec without inspecting", () => {
    // finite:true is the caller's promise; even a NaN cell must not divert
    // to numExec or throw — it short-circuits straight to numFiniteExec.
    exec(
      [
        [1, NaN],
        [3, 4],
      ],
      { finite: true },
    );
    expect(numFiniteExec).toHaveBeenCalledTimes(1);
    expect(numExec).not.toHaveBeenCalled();
    expect(bigExec).not.toHaveBeenCalled();
  });

  test("NaN in a number matrix throws before any core is invoked", () => {
    expect(() =>
      exec([
        [1, 2],
        [NaN, 4],
      ]),
    ).toThrow(TypeError);
    expect(bigExec).not.toHaveBeenCalled();
    expect(numFiniteExec).not.toHaveBeenCalled();
    expect(numExec).not.toHaveBeenCalled();
  });

  test("over-range finite matrix throws RangeError before any core is invoked", () => {
    const m = Number.MAX_VALUE / 2; // range = MAX_VALUE > MAX_VALUE / 2
    expect(() =>
      exec([
        [-m, m],
        [m, -m],
      ]),
    ).toThrow(RangeError);
    expect(bigExec).not.toHaveBeenCalled();
    expect(numFiniteExec).not.toHaveBeenCalled();
    expect(numExec).not.toHaveBeenCalled();
  });
});
