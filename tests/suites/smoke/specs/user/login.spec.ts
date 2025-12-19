import { test, expect } from '../../../../fixtures/pages.fixture'
import {AuthSelectors} from "../../../../utils/selectors/auth.selectors";


test('login page loads and allows submitting credentials', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');

  // Replace with a real post-login URL or visible element
  await expect(page).toHaveURL(AuthSelectors.loggedInPath);
});
