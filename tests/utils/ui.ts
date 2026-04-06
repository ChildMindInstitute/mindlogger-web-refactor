import {Page} from "@playwright/test";
import {AuthSelectors} from "./selectors/auth.selectors";

/**
 * Complete the standard UI login flow.
 *
 * @param page - The Playwright page instance.
 * @param url - The login URL to navigate to.
 * @param email - The user email to enter.
 * @param password - The user password to enter.
 */
export const performUiLogin = async (page: Page, url: string, email: string, password: string) => {
  console.log(`Logging in to ${url}`);
  await page.goto(url);
  // Fill in login form
  await page.fill(AuthSelectors.fields.email, email);
  await page.fill(AuthSelectors.fields.password, password);
  // Submit the form
  await page.click(AuthSelectors.fields.submitButton);
};
