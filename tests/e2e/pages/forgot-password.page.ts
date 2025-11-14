import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ForgotPasswordPage extends BasePage {
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.forgotPasswordLink = page.getByText('Forgot Password?');
  }

  get urlPath() { return '/forgot-password'; }

  async navigateFromLogin() {
    await this.page.goto('/login');
    await this.forgotPasswordLink.click();
  }

  async requestReset(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
