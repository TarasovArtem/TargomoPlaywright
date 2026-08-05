import { Page, Locator } from '@playwright/test';

// Named MapPage (not Map) to avoid shadowing the built-in Map type.
export class MapPage {
  constructor(private readonly page: Page) {}

  getMap(): Locator {
    return this.page.locator('.map-container');
  }
}
