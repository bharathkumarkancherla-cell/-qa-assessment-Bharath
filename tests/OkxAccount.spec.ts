import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { TradePage } from '../pages/TradePage';
import { getDummyString } from '../utils/dataUtils';

test('Add OKX Account, place multiple orders, and delete account', async ({ page }) => {
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

  // Step 3: Go to Trade page
  await tradePage.navigateToTrade();

  // Limit-Edge Orders
  const randomPriceValue = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;

  // Step 4: Place orders
  await tradePage.placeMarketEdgeOrder({
    side: 'BUY',
    quantity: '0.01',
    duration: '40',
    decayFactor: '1'
  });
  await tradePage.placeMarketEdgeOrder({
    side: 'SELL',
    quantity: '0.01',
    duration: '40',
    decayFactor: '1'
  });

  await tradePage.placeLimitEdgeOrder({
    side: 'BUY',
    quantity: '0.01',
    duration: '40',
    decayFactor: '1',
    price: randomPriceValue,
    threshold: '10'
  });

  await tradePage.placeLimitEdgeOrder({
    side: 'SELL',
    quantity: '0.01',
    duration: '40',
    decayFactor: '1',
    price: randomPriceValue,
    threshold: '10'
  });

  await tradePage.placeTwapEdgeOrder({
    side: 'BUY',
    quantity: '0.01',
    duration: '40',
    decayFactor: '1',
    interval: '10'
  });

  await tradePage.placeTwapEdgeOrder({
    side: 'SELL',
    quantity: '0.01',
    duration: '40',
    decayFactor: '1',
    interval: '10'
  });
  
  await accountPage.deleteAccount();
});
