import { describe, it, expect } from "vitest";

import { exec } from "./bigMunkres";

describe(`${exec.name}()`, () => {
  it("handles an empty matrix without error", () => {
    expect(() => exec([])).not.toThrow();
  });
});
