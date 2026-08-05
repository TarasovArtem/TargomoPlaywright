import { Page, Locator } from '@playwright/test';

export class SubCategories {
  constructor(private readonly page: Page) {}

  // Scoped to the tree node containing the "Gastronomy" label, so the
  // toggle button is found by its category rather than by a hardcoded
  // position among every toggle button on the page.
  getGastronomyExpandButton(): Locator {
    return this.page
      .locator('mat-tree-node')
      .filter({ hasText: 'Gastronomy' })
      .locator('button[mattreenodetoggle]');
  }

  getFastFood(): Locator {
    return this.page.locator('mat-checkbox').filter({ hasText: 'Fast food' });
  }

  getFoodCourt(): Locator {
    return this.page.locator('mat-checkbox').filter({ hasText: 'Food court' });
  }

  getRestaurant(): Locator {
    return this.page.locator('mat-checkbox').filter({ hasText: 'Restaurant' });
  }
}
