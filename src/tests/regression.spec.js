const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test.describe('Login Regression Suite', () => {

  test('@regression Validate Login Page Elements', async ({ page }) => {

    // Navigate to login page
    await page.goto('/practice-test-login/');

    // Validate page title
    await expect(page).toHaveTitle(/Test Login/);

    // Validate username field is visible
    await expect(page.locator('#username')).toBeVisible();

    // Validate password field is visible
    await expect(page.locator('#password')).toBeVisible();

    // Validate login button is visible
    await expect(page.locator('#submit')).toBeVisible();

  });

  test('@regression Successful Login Message Validation', async ({ page }) => {

    await page.goto('/practice-test-login/');

    const login = new LoginPage(page);

    await login.login('student', 'Password123');

    // Validate URL
    await expect(page).toHaveURL(/logged-in-successfully/);

    // Validate success message
    await expect(page.locator('.post-title')).toContainText('Logged In Successfully');

  });

});