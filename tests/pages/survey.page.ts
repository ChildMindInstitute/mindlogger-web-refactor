import { Locator, Page } from '@playwright/test';

// Drives the assessment (PassSurvey) screens for the AF Resume test applet,
// where every activity is a single one-question single-select.
export class SurveyPage {
  readonly startButton: Locator;
  readonly nextButton: Locator;
  readonly backButton: Locator;
  readonly saveAndExitButton: Locator;
  readonly submitPopupButton: Locator;
  readonly firstOption: Locator;

  constructor(readonly page: Page) {
    this.startButton = page.getByRole('button', { name: 'Start' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.saveAndExitButton = page.getByRole('button', { name: 'Save & Exit' });
    this.submitPopupButton = page.getByTestId('popup-primary-button');
    this.firstOption = page.getByText('Option 1', { exact: true });
  }

  // From an activity's welcome screen: answers its one question and submits.
  async completeCurrentActivity(): Promise<void> {
    await this.startButton.click();
    await this.firstOption.click();
    await this.nextButton.click();
    await this.submitPopupButton.click();
  }

  // Completes the first `count` activities of the flow from its beginning.
  async completeFlowActivities(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.completeCurrentActivity();
    }
  }
}
