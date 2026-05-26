import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    passWithNoTests: true,
    include: [
      "src/**/*.test.ts",
      "tests/**/*.test.ts",
      "benchmarks/**/*.test.ts",
    ],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: ["src/index.ts", "**/node_modules/**"],
    },
  },
});
