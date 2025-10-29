import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';

test.describe('Login flow', () => {
  // Use environment variables or defaults for local/dev testing
  const USERNAME = process.env.TEST_USER ?? 'user2@goquant.io';
  const PASSWORD = process.env.TEST_PASS ?? '60Re3G9KvvFl4Ihegxpi';
  const DASHBOARD_URL = 'https://test1.gotrade.goquant.io/gotrade';
  const LOGIN_URL = 'https://test1.gotrade.goquant.io/auth/login';

  test('Successful login', async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page);

    // Step 1: Navigate to login page (baseURL is set in config)
    await loginPage.goto();

    // Step 2: Perform login
    await loginPage.login(USERNAME, PASSWORD);

    // Step 3: Wait for dashboard
    await loginPage.waitForSuccessfulLogin();

    // Step 4: Verify URL
    await expect(page).toHaveURL(DASHBOARD_URL);
  });

  test('Login with invalid credentials shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Step 1: Navigate to login
    await loginPage.goto();

    // Step 2: Attempt invalid login
    await loginPage.login('invalid@example.com', 'wrongpassword');

    // Step 3: Verify error message is shown
    await expect(loginPage['errorMessage']).toBeVisible(); // Accessing locator directly for assertion
    const errorText = await loginPage.getErrorText();

    // Step 4: Assert text content
    expect(errorText).toContain('The format of the email address is invalid');
  });

  test('Logout from dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);

    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await loginPage.waitForSuccessfulLogin();

    // Step 2: Confirm login successful
    await expect(page).toHaveURL(DASHBOARD_URL);

    // Step 3: Navigate to Account section
    await accountPage.clickGetStarted();

    // Step 4: Open user menu and sign out
    await page.locator('(//span[@class="sr-only"])[4]').click();
    await page.locator(`//span[text()="${USERNAME}"]`).click();
    await page.locator('//*[text()="Sign out"]').click();

    // Step 5: Verify redirected to login
    await expect(page).toHaveURL(LOGIN_URL);
  });
});
