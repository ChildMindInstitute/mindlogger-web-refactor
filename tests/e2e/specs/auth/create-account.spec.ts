import { test, expect } from '../../fixtures/test';
import { generateUniqueEmail } from '../../data/users';

test.describe('Account Creation', () => {
  test('User can create an account through the web interface', async ({ signupPage, page, baseURL }) => {
    const email = generateUniqueEmail((process.env as any).uat?.EMAIL_ADDRESS);
    const password = (process.env as any).uat?.PLAYWRIGHT_GENERAL_PASSWORD || 'DefaultPassword123!';

    await signupPage.navigateFromLogin();
    await signupPage.createAccount(email, 'Automation', 'Tester', password);

    await page.getByTestId('success-banner').waitFor({ state: 'visible', timeout: 5000 });
    await expect(page.getByTestId('success-banner')).toContainText('Registration completed successfully');
    await page.waitForURL('/protected/applets', { timeout: 10_000 });
  });

  test('User receives form validation messages when fields are empty', async ({ signupPage, page }) => {
    await signupPage.navigateFromLogin();
    await expect(signupPage.heading).toBeVisible();

    // Clear all fields
    await signupPage.emailInput.fill('');
    await signupPage.firstNameInput.fill('');
    await signupPage.lastNameInput.fill('');
    await signupPage.passwordInput.fill('');
    await signupPage.confirmPasswordInput.fill('');
    await signupPage.termsCheckbox.check();
    await signupPage.submit();

    // Verify validation messages
    await expect(page.getByText('Email must be valid.')).toBeVisible();
    await expect(page.getByText('First name is required.')).toBeVisible();
    await expect(page.getByText('Last name is required.')).toBeVisible();
    await expect(page.getByText('Password must be at least 6').first()).toBeVisible();
    await expect(page.getByText('Password must be at least 6').nth(1)).toBeVisible();
  });
});
