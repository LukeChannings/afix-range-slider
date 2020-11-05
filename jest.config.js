/* eslint-disable no-undef */
const runEndToEndTests = process.env.TEST_E2E === "1";

module.exports = {
  preset: runEndToEndTests ? "jest-playwright-jsdom" : "",
  testPathIgnorePatterns: ["/node_modules/"],
  testMatch: runEndToEndTests
    ? ["**/e2e/**/*.spec.ts"]
    : ["**/src/**/*.spec.ts"],
  collectCoverage: !runEndToEndTests,
  coverageDirectory: "coverage",
  coverageReporters: ["html", "lcov"],
};
