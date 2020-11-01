module.exports = {
  browsers: ["chromium", "webkit", "firefox"],
  launchOptions: {
    headless: true,
  },
  serverOptions: {
    command: "hammer serve -p 8833 src docs",
    port: 8833,
  },
};
