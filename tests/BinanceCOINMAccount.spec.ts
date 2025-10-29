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
    apiKey: 'QB3ijSDOlLqIF1VoISuGlgEE1WnFM48TgzJWzXQ7Z03DQxFYrXEviMBj0Oi2felr',
    apiSecret: 'qy7vBwm4WcNKl2oM1yi3kD9nXvCUo7oYOxeUa4wv5f5nIfMNxHOCYsFW9NoNTU50',
    exchange: 'BINANCECOINM',
  });

  // Verify account creation
  await page.locator('//button[@data-testid="stay-here-button"]').click({ timeout: 50_000 });
  await expect(page.locator('//td[@data-testid="venues-table-cell-0-account_name"]//div')).toHaveText(randomAccountName);
  await page.locator('//button[@aria-label="Close toast"]').click();

  // Step 3: Navigate to GoTrade
  await tradePage.navigateToTrade();

  // Step 4: Place various order types
  await tradePage.placeMarketEdgeOrder({
    side: 'BUY',
    quantity: '10',
    duration: '40',
    decayFactor: '1',
  });

  await tradePage.placeMarketEdgeOrder({
    side: 'SELL',
    quantity: '10',
    duration: '40',
    decayFactor: '1',
  });

  // Limit-Edge Orders
  const randomPriceValue = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;

  await tradePage.placeLimitEdgeOrder({
    side: 'BUY',
    quantity: '10',
    duration: '40',
    price: randomPriceValue,
    threshold: '10',
    decayFactor: '1',
  });

  await tradePage.placeLimitEdgeOrder({
    side: 'SELL',
    quantity: '10',
    duration: '40',
    price: randomPriceValue,
    threshold: '10',
    decayFactor: '1',
  });

  // TWAP-Edge Orders
  await tradePage.placeTwapEdgeOrder({
    side: 'BUY',
    quantity: '10',
    duration: '40',
    interval: '10',
    decayFactor: '1',
  });

  await tradePage.placeTwapEdgeOrder({
    side: 'SELL',
    quantity: '10',
    duration: '40',
    interval: '10',
    decayFactor: '1',
  });

  // Step 5: Delete account
  await accountPage.deleteAccount();
});
