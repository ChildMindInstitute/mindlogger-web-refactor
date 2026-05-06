import { test, expect } from '../../../../fixtures/pages.fixture'
import { requirePlaywrightAuthCredentials } from '../../../../utils/credentials';

test.describe('Activity Completion', () => {
  test('User can complete an assessment and submit answers', async ({
    appletListPage,
    appletDetailsPage,
    loginPage,
    page,
    baseURL,
  }) => {
    const { email, password } = requirePlaywrightAuthCredentials();

    await loginPage.goto(baseURL);
    await loginPage.login(email, password);
    await page.waitForURL(/.*\/protected\/applets/, { timeout: 15000 });

    await page.goto('/protected/applets');
    await expect(page).toHaveURL(/.*\/protected\/applets/);

    const appletListExists = await page
      .waitForSelector('[data-testid="applet-list"]', { timeout: 10000 })
      .catch(() => null);

    if (!appletListExists) {
      const noAppletsVisible = await page
        .waitForSelector('text=/no applets/i', { timeout: 10000 })
        .catch(() => null);

      if (noAppletsVisible) {
        test.skip('No applets available in this environment to complete an assessment');
      }
    }

    // Give the applet list more time to load and become visible
    await expect(appletListPage.appletList).toBeVisible({ timeout: 10000 });

    // Click on the first applet (or specific applet by name)
    // TODO: Update to use index 0 to ensure we select the first applet regardless of name
    await appletListPage.clickAppletByName('Applets1 tests');

    // Verify we're on the applet details page with available activities
    await expect(appletDetailsPage.availableHeading).toBeVisible();

    // Start the activity
    await appletDetailsPage.startActivity();

    // Verify progress bar is visible
    await expect(appletDetailsPage.progressBar).toBeVisible();

    // Click start to navigate to first question
    await appletDetailsPage.startActivity();

    // Try clicking next without selecting an option (should trigger warning)
    await appletDetailsPage.clickNext();
    await expect(appletDetailsPage.warningBanner).toBeVisible();

    // Select an option and proceed
    await appletDetailsPage.selectOption();
    await appletDetailsPage.clickNext();

    // Submit the activity
    await expect(appletDetailsPage.popupPrimaryButton).toBeVisible();
    await appletDetailsPage.submitActivity();

    // Verify submission success
    await expect(appletDetailsPage.popupPrimaryButton).toBeHidden();
    await expect(appletDetailsPage.successBanner).toBeVisible();
    await expect(appletDetailsPage.successBanner).toContainText('Done');
  });
});
