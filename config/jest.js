module.exports = {
  testMatch: ['<rootDir>/**/*.spec.ts'],
  rootDir: '../src',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov'],
}
