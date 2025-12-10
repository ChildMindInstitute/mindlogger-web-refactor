import { test, expect } from '@playwright/test';

  // fixme: This test is currently broken due to changes in the .env file users.
  // It needs to be updated to use a valid test user, API object creation, and 5 item types.
  // Once updated, remove the 'fixme' annotation.
  test.fixme('Verify that a user can access an assessment on the web, completing it to submit the answers', async ({ page }) => {
    // Assuming the user is already logged in through the global setup
    // Navigate to the applets list page
    await page.goto('/protected/applets');
    // Verify that the URL is correct
    await expect(page).toHaveURL(/.*\/protected\/applets/);
    // TODO change this test step to use index 0 of the array of applets to ensure we select the first applet regardless of the name.
    // Wait for the applet list to load and click on the first applet
    await page.getByRole('heading', { name: 'Applets1 tests' }).click();
    //Wait for the applet details page to load and assert that there is an available activity
    await expect(page.getByRole('heading', { name: 'Available' })).toBeVisible();
    // Click the start button to start the applet activity
    await page.getByRole('button', { name: 'Start' }).click();
    // Wait for the first activity page to load and assert that the progress bar is visible
    const progressBar = page.getByRole('progressbar')
    await expect(progressBar).toBeVisible()
    // click the start button to navigate to the first activties question
    await page.getByRole('button', { name: 'Start' }).click();
    // click the next button without selecting an option to trigger the warning banner
    await page.getByRole('button', { name: 'Next' }).click();
    const warningBanner = page.getByTestId('warning-banner')
    await expect(warningBanner).toBeVisible();
    // select an option and click next to trigger the submit popup banner
    await page.getByTestId('select-box').click();
    await page.getByRole('button', { name: 'Next' }).click();
    // assert that the submit popup banner is visible and click the submit button
    const popupBannerSubmit = page.getByTestId('popup-primary-button')
    expect(popupBannerSubmit).toBeVisible()
    await popupBannerSubmit.click();
    // assert that the submit popup banner is hidden and the success banner is visible with the text 'Done'
    await expect(popupBannerSubmit).toBeHidden();
    const successBanner = page.getByTestId('success-banner')
    await expect(successBanner).toBeVisible()
    await expect(successBanner).toContainText('Done')
  });
