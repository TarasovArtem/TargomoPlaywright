import { Page } from '@playwright/test';

export class Navigation {
  constructor(private readonly page: Page) {}

  async navigate() {
    await this.page.goto('/');
    await this.dismissCookieBanner();
  }

  // Playwright gives every test a fresh browser context (unlike Cypress,
  // which could carry cookies across it() blocks within one spec run), so
  // this consent dialog genuinely appears on every single test here. Left
  // undismissed it can sit on top of the map and delay/block tile loading -
  // observed causing poi_data_requests.spec.ts to time out on Firefox in CI.
  private async dismissCookieBanner() {
    const acceptButton = this.page.getByRole('button', { name: 'Accept' });
    try {
      await acceptButton.waitFor({ state: 'visible', timeout: 5000 });
      await acceptButton.click();
    } catch {
      // Banner didn't appear this time (e.g. consent already remembered) -
      // nothing to dismiss.
    }
  }
}
