import { test, expect } from '@playwright/test';
import { Navigation } from './pageObjects/navigation';
import { Categories } from './pageObjects/categories';
import { SubCategories } from './pageObjects/subCategories';

// These tests verify actual app behavior, not just checkbox state: selecting
// a tree node must trigger a real request for that group's POI map tiles
// (https://api.targomo.com/pointofinterest/{z}/{x}/{y}.mvt?...&group=<id>).
test.describe('POI data requests triggered by tree selection', () => {
  let navigation: Navigation;
  let categories: Categories;
  let subCategories: SubCategories;

  test.beforeEach(async ({ page }) => {
    navigation = new Navigation(page);
    categories = new Categories(page);
    subCategories = new SubCategories(page);
    await navigation.navigate();
  });

  test('should request gastronomy POI tiles when the Gastronomy category is selected', async ({ page }) => {
    // A bit more headroom than the default actionTimeout for a third-party
    // tile request over real network. The actual CI failure here turned out
    // to be an undismissed cookie-consent dialog blocking the map (fixed in
    // Navigation.navigate()), not this timeout - kept as a modest buffer.
    const requestPromise = page.waitForRequest(
      (req) => req.url().includes('/pointofinterest/') && req.url().includes('.mvt'),
      { timeout: 15000 }
    );
    await categories.getGastronomy().click();
    const request = await requestPromise;
    expect(request.url()).toContain('group=g_eat-out');
  });

  test('should request restaurant POI tiles when the Restaurant subcategory is selected', async ({ page }) => {
    // A bit more headroom than the default actionTimeout for a third-party
    // tile request over real network. The actual CI failure here turned out
    // to be an undismissed cookie-consent dialog blocking the map (fixed in
    // Navigation.navigate()), not this timeout - kept as a modest buffer.
    const requestPromise = page.waitForRequest(
      (req) => req.url().includes('/pointofinterest/') && req.url().includes('.mvt'),
      { timeout: 15000 }
    );
    await subCategories.getGastronomyExpandButton().click();
    await subCategories.getRestaurant().click();
    const request = await requestPromise;
    expect(request.url()).toContain('group=restaurant');
  });
});
