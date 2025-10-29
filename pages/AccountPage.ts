// AccountPage.ts
import { expect, Page, Locator } from '@playwright/test';

interface AccountCredentials {
  name: string;
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  exchange?: string;
}

export class AccountPage {
  private readonly page: Page;

  private readonly getStartedButton: Locator;
  private readonly connectAccountButton: Locator;
  private readonly accountNameInput: Locator;
  private readonly apiKeyInput: Locator;
  private readonly apiSecretInput: Locator;
  private readonly passphraseInput: Locator;
  private readonly testButton: Locator;
  private readonly addAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Locators
    this.getStartedButton = page.locator('//span[text()="Get Started"]');
    this.connectAccountButton = page.locator('//button[text()="Connect Account"]');
    this.accountNameInput = page.locator('//input[@name="accountName"]');
    this.apiKeyInput = page.locator('//input[@name="apiKey"]');
    this.apiSecretInput = page.locator('//input[@name="apiSecret"]');
    this.passphraseInput = page.locator('//input[@name="passphrase"]');
    this.testButton = page.locator('//button[@data-testid="test-mode-switch"]');
    this.addAccountButton = page.locator('//button[@data-testid="button-submit-account"]');
  }

  /**
   * Clicks on "Get Started" or directly "Connect Account"
   * based on element visibility.
   */
  async clickGetStarted() {
        const isGetStartedVisible = await this.getStartedButton.isVisible({ timeout: 5000 }).catch(() => false);

        if (isGetStartedVisible) {
            await this.connectAccountButton.click();
        } else {
            await this.getStartedButton.click();
            await this.connectAccountButton.click();
        }
    }

  /**
   * Fills and submits account connection form.
   */
  async connectAccount({
    name,
    apiKey,
    apiSecret,
    passphrase,
    exchange,
  }: AccountCredentials): Promise<void> {
    if (exchange) {
      await this.page.locator('//button[@data-testid="dropdown-trigger:exchange-selector"]').click();
      await this.page.locator(`//div[@data-testid="exchange-option-${exchange}"]`).click();
    }

    await this.accountNameInput.fill(name);
    await this.apiKeyInput.fill(apiKey);
    await this.apiSecretInput.fill(apiSecret);

    if (passphrase) {
      await this.passphraseInput.fill(passphrase);
    }

    await this.testButton.click();
    await this.addAccountButton.click();
  }

  /**
   * Deletes an existing account.
   * Waits for success toast confirmation.
   */
  async deleteAccount(): Promise<void> {
    await this.page.locator('//span[text()="Accounts"]').hover();
    await this.page.locator('//span[text()="Admin"]').click();
    await this.page.locator('//button[text()="Delete"]').click();

    const confirmationInput = this.page.locator(
      '//input[@data-testid="delete-account-dialog-delete-confirmation"]'
    );
    const deleteButton = this.page.locator(
      '//button[@data-testid="delete-account-dialog-delete"]'
    );

    await confirmationInput.fill('DELETE');
    await deleteButton.click();

    const successToast = this.page.locator(
      '//div[@data-title and normalize-space(text())="Account removed successfully"]'
    );

    await expect(successToast).toBeVisible({ timeout: 60_000 });
  }
}
