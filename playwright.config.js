const { defineConfig } = require('@playwright/test');
require('dotenv').config();

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
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  }
});
