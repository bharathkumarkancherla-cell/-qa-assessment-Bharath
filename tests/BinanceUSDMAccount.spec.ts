import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { TradePage } from '../pages/TradePage';
import { getDummyString } from '../utils/dataUtils';

test('Add Binance-USDM Account and place multiple orders', async ({ page }) => {
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

    // Step 2: Connect Binance USDM account
    await accountPage.clickGetStarted();
    await accountPage.connectAccount({
        name: randomAccountName,
        apiKey: 'x1L3zihFyBkhwYb8dCyfXGL8VVMPwSSYtxeB9OER1MoB3S3UbV5DJ1V0svvMlkiM',
        apiSecret: 'yvdXv0jOZ4G8YX1hU0jG1Ktfz3USG24YxOefN6UbuvLRzQJ3XYyO5KIfZ6JpFQvU',
        exchange: 'BINANCEUSDM',
    });

    await page.locator('//button[@data-testid="stay-here-button"]').click({ timeout: 50_000 });
    await expect(page.locator('//td[@data-testid="venues-table-cell-0-account_name"]//div'))
        .toHaveText(randomAccountName);
    await page.locator('//button[@aria-label="Close toast"]').click();

    // Step 3: Navigate to GoTrade
    await tradePage.navigateToTrade();

    // Limit-Edge Orders
    const randomPriceValue = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;

    // Step 4: Place multiple orders with details
    await tradePage.placeMarketEdgeOrder({
        side: 'BUY',
        quantity: '0.01',
        duration: '40',
        decayFactor: '1',
    });

    await tradePage.placeMarketEdgeOrder({
        side: 'SELL',
        quantity: '0.01',
        duration: '40',
        decayFactor: '1',
    });

    // Limit-Edge Buy
    await tradePage.placeLimitEdgeOrder({
        side: 'BUY',
        quantity: '0.01',
        duration: '40',
        price: randomPriceValue,
        threshold: '10',
        decayFactor: '1',
    });

    // Limit-Edge Sell
    await tradePage.placeLimitEdgeOrder({
        side: 'SELL',
        quantity: '0.01',
        duration: '40',
        price: randomPriceValue,
        threshold: '10',
        decayFactor: '1',
    });

    await tradePage.placeTwapEdgeOrder({
        side: 'BUY',
        quantity: '0.01',
        duration: '40',
        interval: '10',
        decayFactor: '1',
    });

    await tradePage.placeTwapEdgeOrder({
        side: 'SELL',
        quantity: '0.01',
        duration: '40',
        interval: '10',
        decayFactor: '1',
    });

    // Step 5: Delete account
    await accountPage.deleteAccount();
});
