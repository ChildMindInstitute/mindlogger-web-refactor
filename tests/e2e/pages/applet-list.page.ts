import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AppletListPage extends BasePage {
  readonly appletList: Locator;
  readonly appletCards: Locator;

  constructor(page: Page) {
    super(page);
    this.appletList = page.getByTestId('applet-list');
    this.appletCards = page.locator('[data-testid^="applet-card"]');
  }

  get urlPath() { return '/protected/applets'; }

  async clickAppletByName(name: string) {
    await this.page.getByRole('heading', { name }).click();
  }

  async clickFirstApplet() {
    await this.appletCards.first().click();
  }
}
