
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    headless: false,
    baseURL: process.env.BASE_URL || 'https://test1.gotrade.goquant.io/gotrade',
    viewport: { width: 1280, height: 800 },
    actionTimeout: 50_000,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
   projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    // { name: 'firefox',  use: { browserName: 'firefox' } },
    // { name: 'webkit',   use: { browserName: 'webkit' } },
  ],
});
