import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { TradePage } from '../pages/TradePage';
import { getDummyString } from '../utils/dataUtils';

test('Add OKX Account, and checking GoOps page finding account name', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);
    const tradePage = new TradePage(page);
    const randomAccountName = getDummyString(10);

    const USERNAME = process.env.TEST_USER || 'user2@goquant.io';
    const PASSWORD = process.env.TEST_PASS || '60Re3G9KvvFl4Ihegxpi';

    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await loginPage.waitForSuccessfulLogin();

    // Step 2: Connect OKX account
    await accountPage.clickGetStarted();
    await accountPage.connectAccount({
        name: randomAccountName,
        apiKey: 'd9f5a428-93d6-4839-91b2-f8a4636bb3b7',
        apiSecret: '0FABCC80760A78944C7BFF9133E74E65',
        passphrase: 'Test@123',
        exchange: 'OKX'
    });

    // Verify account creation
    await page.locator('//button[@data-testid="stay-here-button"]').click({ timeout: 50_000 });
    await expect(page.locator('//td[@data-testid="venues-table-cell-0-account_name"]//div')).toHaveText(randomAccountName);
    await page.locator('//button[@aria-label="Close toast"]').click();

    // Step 3: Go to Goops
    await page.locator('//span[text()="Accounts"]').hover();
    await page.locator('//span[text()="GoOps"]').click();
    await expect(page).toHaveURL('https://test1.gotrade.goquant.io/goops');

    // verify the opps in GOOPs Page

    await expect(page.locator(`//h3[text()='${randomAccountName}']`)).toBeVisible({ timeout: 60_000 });
    await page.locator('//button[@data-testid="goops-metrics-tab"]').click();
    await expect(page.locator('//button[@data-testid="exchange-selector-trigger"]//p')).toHaveText(`Binance COIN-M - ${randomAccountName}`);
    await page.locator('//button[@data-testid="goops-reconciliation-tab"]').click();
    await page.locator('(//div[contains(@class,"min-w-48")])[8]//button').click();
    await page.locator(`//span[text()='${randomAccountName}']`).click();
    await expect(page.locator('//td[text()="No Results"]')).toBeVisible();

    // Step 5: Delete account
    await accountPage.deleteAccount();




});