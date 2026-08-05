import { test, expect } from '@playwright/test';
import { Navigation } from './pageObjects/navigation';
import { Categories } from './pageObjects/categories';
import { SubCategories } from './pageObjects/subCategories';
import { MapPage } from './pageObjects/map';

test.describe('Select any group of POIs from the tree component and then see them visualized on the map', () => {
  let navigation: Navigation;
  let categories: Categories;
  let subCategories: SubCategories;
  let map: MapPage;

  test.beforeEach(async ({ page }) => {
    navigation = new Navigation(page);
    categories = new Categories(page);
    subCategories = new SubCategories(page);
    map = new MapPage(page);
    await navigation.navigate();
  });

  test('should select Gastronomy group of POIs from the tree component', async ({}, testInfo) => {
    const gastronomy = categories.getGastronomy();
    await gastronomy.click();
    await expect(gastronomy).toHaveClass(/mat-checkbox-checked/);
    await expect(map.getMap()).toBeVisible();
    await map.getMap().screenshot({ path: testInfo.outputPath('map.png') });
  });

  test('should select sub categories Gastronomy group as restaurants of POIs from the tree component', async ({}, testInfo) => {
    await subCategories.getGastronomyExpandButton().click();
    const restaurant = subCategories.getRestaurant();
    await restaurant.click();
    await expect(restaurant).toHaveClass(/mat-checkbox-checked/);
    await expect(map.getMap()).toBeVisible();
    await map.getMap().screenshot({ path: testInfo.outputPath('map.png') });
  });

  test('should select sub category Fast food of POIs from the tree component', async ({}, testInfo) => {
    await subCategories.getGastronomyExpandButton().click();
    const fastFood = subCategories.getFastFood();
    await fastFood.click();
    await expect(fastFood).toHaveClass(/mat-checkbox-checked/);
    await expect(map.getMap()).toBeVisible();
    await map.getMap().screenshot({ path: testInfo.outputPath('map.png') });
  });

  test('should select sub category Food court of POIs from the tree component', async ({}, testInfo) => {
    await subCategories.getGastronomyExpandButton().click();
    const foodCourt = subCategories.getFoodCourt();
    await foodCourt.click();
    await expect(foodCourt).toHaveClass(/mat-checkbox-checked/);
    await expect(map.getMap()).toBeVisible();
    await map.getMap().screenshot({ path: testInfo.outputPath('map.png') });
  });

  test('should deselect Gastronomy group when its checkbox is clicked a second time', async () => {
    const gastronomy = categories.getGastronomy();
    await gastronomy.click();
    await expect(gastronomy).toHaveClass(/mat-checkbox-checked/);
    await gastronomy.click();
    await expect(gastronomy).not.toHaveClass(/mat-checkbox-checked/);
  });
});
