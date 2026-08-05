import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // The target is a single externally hosted live site, not a scalable
  // test server - Playwright's default parallelism just made it flaky
  // under concurrent load. Cypress ran this suite sequentially too.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'html',

  // The app under test is hosted externally - there is nothing to build
  // or serve locally, tests just point straight at the live site.
  use: {
    baseURL: 'https://poi.targomo.com',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    // Mirrors Cypress's pageLoadTimeout default (60s), not its
    // defaultCommandTimeout (10s) - this app pulls in a fair amount of
    // map/font/tile assets on first load.
    navigationTimeout: 30000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  expect: {
    timeout: 10000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
