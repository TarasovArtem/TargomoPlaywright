import { Page } from '@playwright/test';

export class Navigation {
  constructor(private readonly page: Page) {}

  async navigate() {
    await this.page.goto('/');
  }
}
