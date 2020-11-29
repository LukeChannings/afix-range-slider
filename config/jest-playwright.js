process.env.JEST_PLAYWRIGHT_CONFIG = __dirname + '/jest-playwright.config.js'

module.exports = {
  preset: 'jest-playwright-preset',
  testMatch: ['<rootDir>/e2e/**/*.spec.ts'],
  rootDir: '..',
  globals: {
    __TEST_SERVER__: 'http://localhost:4322',
  },
  setupFilesAfterEnv: ['<rootDir>/config/jest-playwright-setup.js'],
}
