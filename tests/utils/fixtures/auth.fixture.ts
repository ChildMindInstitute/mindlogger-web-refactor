import { Page } from '@playwright/test';
import {AuthSelectors} from "../selectors/auth.selectors";

// Function to perform login
export const performLogin = async (page: Page, url: string, email: string, password: string) => {
  console.log(`Logging in to ${url}`);
  await page.goto(url);
  // Fill in login form
  await page.fill(AuthSelectors.fields.email, email);
  await page.fill(AuthSelectors.fields.password, password);
  // Submit the form
  await page.click(AuthSelectors.fields.submitButton);
};
