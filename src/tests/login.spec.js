const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test.describe('Login Suite', () => {

  test('@smoke Valid Login', async ({ page }) => {

    await page.goto('/practice-test-login/');

    const login = new LoginPage(page);
    await login.login('student', 'Password123');

    await expect(page).toHaveURL(/logged-in-successfully/);
  });

});