// LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;

  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Locators
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('//div[text()="The format of the email address is invalid"]');
  }

  /**
   * Navigate to the login page and wait for email input to appear.
   */
  async goto(): Promise<void> {
    await this.page.goto('https://test1.gotrade.goquant.io/');
    await expect(this.emailInput).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Performs login by filling credentials and optionally submitting.
   * @param username - Email or username string.
   * @param password - Password string.
   * @param options - Optional settings (e.g., skip submit).
   */
  async login(
    username: string,
    password: string,
    options: { submit?: boolean } = { submit: true }
  ): Promise<void> {
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);

    if (options.submit) {
      await this.loginButton.click();
    }
  }

  /**
   * Gets the error message text if login fails.
   */
  async getErrorText(): Promise<string | null> {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * Waits for successful login navigation to dashboard page.
   */
  async waitForSuccessfulLogin(): Promise<void> {
    await this.page.waitForURL('https://test1.gotrade.goquant.io/gotrade', { timeout: 50_000 });
  }

  /**
   * Utility: Checks if login button is enabled.
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  /**
   * Utility: Logs out (if required in future tests).
   */
  async logout(): Promise<void> {
    const profileMenu = this.page.locator('//button[contains(@data-testid,"profile-menu")]');
    const logoutButton = this.page.locator('//span[text()="Logout"]');

    if (await profileMenu.isVisible()) {
      await profileMenu.click();
      await logoutButton.click();
      await expect(this.loginButton).toBeVisible({ timeout: 15_000 });
    }
  }
}
