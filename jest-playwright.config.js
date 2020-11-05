module.exports = {
  browsers: ["chromium", "webkit", "firefox"],
  launchOptions: {
    headless: true,
    // slowMo: 500,
  },
  serverOptions: {
    command: "hammer serve -p 8833 src e2e",
    port: 8833,
  },
};
