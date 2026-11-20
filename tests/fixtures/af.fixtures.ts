import { mergeTests } from '@playwright/test';

import { ActivityCardPage } from '../pages/activity-card.page';
import { SurveyPage } from '../pages/survey.page';
import { test as afAppletTest } from './af-applet.fixture';
import { test as flagsTest } from './flags.fixture';
import { test as pagesTest } from './pages.fixture';

// One file that pulls together everything an af-resume spec needs.

type AfPagesFixtures = {
  cards: ActivityCardPage;
  survey: SurveyPage;
};

export const test = mergeTests(pagesTest, flagsTest, afAppletTest).extend<AfPagesFixtures>({
  cards: async ({ page }, use) => {
    await use(new ActivityCardPage(page));
  },

  survey: async ({ page }, use) => {
    await use(new SurveyPage(page));
  },
});

export { expect } from '@playwright/test';
