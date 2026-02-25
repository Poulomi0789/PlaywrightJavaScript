// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './src/tests',
  timeout: 60000,
  retries: 1,
  workers: 2,

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['allure-playwright']
  ],

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry'
  }
});
