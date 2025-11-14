import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Override in subclasses to provide a path (e.g., '/login')
  get urlPath(): string | null { return null; }

  async goto(baseURL: string) {
    const path = this.urlPath;
    if (!path) throw new Error('Page has no urlPath defined.');
    const url = new URL(path, baseURL).toString();
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  locatorByTestId(id: string): Locator {
    return this.page.getByTestId(id);
  }

  async expectUrl(contains: RegExp | string) {
    await expect(this.page).toHaveURL(contains);
  }
}
