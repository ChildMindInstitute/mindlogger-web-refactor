import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    super(page);
    this.email = page.locator('input[name="email"]');
    this.password = page.locator('input[name="password"]');
    this.submit = page.locator('button[type="submit"]');
  }

  get urlPath() { return '/login'; }

  async login(email: string, pwd: string) {
    await this.email.fill(email);
    await this.password.fill(pwd);
    await this.submit.click();
  }
}
