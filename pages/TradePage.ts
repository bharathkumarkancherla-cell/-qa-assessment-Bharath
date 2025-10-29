import { Page, expect } from '@playwright/test';

interface MarketOrder {
  side: 'BUY' | 'SELL';
  quantity: string;
  duration: string;
  decayFactor: string;
}

interface LimitOrder extends MarketOrder {
  price: number;
  threshold: string;
}

interface TwapOrder extends MarketOrder {
  interval: string;
}

export class TradePage {
  constructor(private page: Page) {}

  async navigateToTrade() {
    await this.page.locator('//span[text()="Trading"]').hover();
    await this.page.locator('//span[text()="GoTrade"]').click();
    await expect(this.page).toHaveURL('https://test1.gotrade.goquant.io/gotrade');
  }

  async placeMarketEdgeOrder(order: MarketOrder) {
    const { side, quantity, duration, decayFactor } = order;
    await this.page.locator('//input[@data-testid="quantity"]').fill(quantity);
    await this.page.locator('//input[@data-testid="duration"]').fill(duration);
    await this.page.locator('//input[@placeholder="Enter decay factor"]').fill(decayFactor);

    if (side === 'SELL') {
      await this.page.locator('//button[@data-testid="short-button"]').click();
    }
    await this.page.locator('//button[@data-testid="trade-button"]').click();

    await expect(this.page.locator('//div[@data-title="Order Accepted"]')).toBeVisible({ timeout: 60000 });
    await this.page.locator('//div[@data-title="Order Accepted"]').waitFor({ state: 'hidden' });
  }

  async placeLimitEdgeOrder(order: LimitOrder) {
    const { side, quantity, duration, price, threshold } = order;
    await this.page.locator('//span[text()="Limit-Edge"]').click();
    await this.page.locator('//input[@data-testid="quantity"]').fill(quantity);
    await this.page.locator('//input[@data-testid="duration"]').fill(duration);
    await this.page.locator('//input[@data-testid="price"]').fill(price.toString());
    await this.page.locator('//input[@data-testid="threshold"]').fill(threshold);

    if (side === 'SELL') {
      await this.page.locator('//button[@data-testid="short-button"]').click();
    }
    await this.page.locator('//button[@data-testid="trade-button"]').click();

    await expect(this.page.locator('//div[@data-title="Order Accepted"]')).toBeVisible({ timeout: 60000 });
    await this.page.locator('//div[@data-title="Order Accepted"]').waitFor({ state: 'hidden' });
  }

  async placeTwapEdgeOrder(order: TwapOrder) {
    const { side, quantity, duration, interval, decayFactor } = order;
    await this.page.locator('//span[text()="GOTRADE_ORDERTYPE_TWAP_EDGE"]').click();
    await this.page.locator('//input[@data-testid="quantity"]').fill(quantity);
    await this.page.locator('//input[@data-testid="duration"]').fill(duration);
    await this.page.locator('//input[@name="interval"]').fill(interval);
    await this.page.locator('//input[@placeholder="Enter decay factor"]').fill(decayFactor);

    if (side === 'SELL') {
      await this.page.locator('//button[@data-testid="short-button"]').click();
    }
    await this.page.locator('//button[@data-testid="trade-button"]').click();

    await expect(this.page.locator('//div[@data-title="Order Accepted"]')).toBeVisible({ timeout: 60000 });
    await this.page.locator('//div[@data-title="Order Accepted"]').waitFor({ state: 'hidden' });
  }
}
