import {BasePage} from "./base.page";
import {Locator, Page} from "@playwright/test";

export class LoginPage extends BasePage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  public constructor(page: Page) {
    super(page);
    this.email = page.locator('input[name="email"]');
    this.password = page.locator('input[name="password"]');
    this.submit = page.locator('button[type="submit"]');
  }

  get urlPath(): string { return "/login"; }


  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }



}
