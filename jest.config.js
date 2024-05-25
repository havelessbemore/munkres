/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  coverageDirectory: "<rootDir>/coverage/",
  coveragePathIgnorePatterns: [
    "<rootDir>/benchmarks/",
    "<rootDir>/src/index.ts",
    "<rootDir>/tests/",
  ],
  passWithNoTests: true,
  testEnvironment: "node",
};
