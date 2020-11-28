module.exports = {
  browsers: ['chromium', 'webkit', 'firefox'],
  // launchOptions: {
  //   slowMo: 200,
  //   headless: false,
  // },
  serverOptions: {
    command: 'npm start -- -p 4322',
    port: 4322,
  },
}
