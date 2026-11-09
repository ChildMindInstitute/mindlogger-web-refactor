import { Locator, Page } from '@playwright/test';

// Entity cards on the applet details page (src ActivityCard widgets).
export class ActivityCardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  flowCard(name: string): Locator {
    return this.page.getByTestId('flow-card').filter({ hasText: name });
  }

  activityCard(name: string): Locator {
    return this.page.getByTestId('activity-card').filter({ hasText: name });
  }

  resumeButton(card: Locator): Locator {
    return card.getByRole('button', { name: 'Resume', exact: true });
  }

  restartButton(card: Locator): Locator {
    return card.getByRole('button', { name: /restart/i });
  }

  startButton(card: Locator): Locator {
    return card.getByRole('button', { name: 'Start' });
  }

  progressText(card: Locator, completed: number, total: number): Locator {
    return card.getByText(`${completed} of ${total} activities completed`);
  }
}
