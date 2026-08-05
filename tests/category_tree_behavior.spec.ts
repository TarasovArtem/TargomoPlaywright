import { test, expect } from '@playwright/test';
import { Navigation } from './pageObjects/navigation';
import { Categories } from './pageObjects/categories';
import { SubCategories } from './pageObjects/subCategories';

test.describe('Category tree behavior', () => {
  let navigation: Navigation;
  let categories: Categories;
  let subCategories: SubCategories;

  test.beforeEach(async ({ page }) => {
    navigation = new Navigation(page);
    categories = new Categories(page);
    subCategories = new SubCategories(page);
    await navigation.navigate();
  });

  test('should mark the parent category as indeterminate when only a subcategory is selected', async () => {
    await subCategories.getGastronomyExpandButton().click();
    await subCategories.getRestaurant().click();
    const gastronomy = categories.getGastronomy();
    await expect(gastronomy).toHaveClass(/mat-checkbox-indeterminate/);
    await expect(gastronomy).not.toHaveClass(/mat-checkbox-checked/);
  });

  test('should remove subcategories from the DOM after collapsing the parent category', async () => {
    const expandButton = subCategories.getGastronomyExpandButton();
    await expandButton.click();
    await expect(subCategories.getRestaurant()).toBeVisible();
    await expandButton.click();
    await expect(subCategories.getRestaurant()).toHaveCount(0);
  });

  test('should let two unrelated top-level categories be selected independently of each other', async () => {
    const gastronomy = categories.getGastronomy();
    const shopping = categories.getShopping();
    await gastronomy.click();
    await expect(gastronomy).toHaveClass(/mat-checkbox-checked/);
    await shopping.click();
    await expect(shopping).toHaveClass(/mat-checkbox-checked/);
    await expect(gastronomy).toHaveClass(/mat-checkbox-checked/);
  });
});
