import { Page, Locator } from '@playwright/test';

export class Categories {
  constructor(private readonly page: Page) {}

  // Matched by visible label instead of a generated id/index, which
  // shifts whenever a category is added/removed/reordered in the tree.
  getGastronomy(): Locator {
    return this.page.locator('mat-checkbox').filter({ hasText: 'Gastronomy' });
  }

  getShopping(): Locator {
    return this.page.locator('mat-checkbox').filter({ hasText: 'Shopping' });
  }
}
