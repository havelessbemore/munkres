/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "<rootDir>/coverage/",
  coveragePathIgnorePatterns: [
    "<rootDir>/benchmarks/",
    "<rootDir>/src/index.ts",
    "<rootDir>/tests/",
  ],
  modulePathIgnorePatterns: ["<rootDir>/src/.private/"],
};
