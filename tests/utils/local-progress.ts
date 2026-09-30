import { Page } from '@playwright/test';

// Helpers over the app's redux-persist state in localStorage ('persist:root').
// Group progress keys are `${entityId}/${eventId}` (src/abstract/lib/getProgressId.ts).

export const getGroupProgress = async (page: Page): Promise<Record<string, any>> =>
  await page.evaluate(() => {
    const raw = localStorage.getItem('persist:root');
    if (!raw) return {};
    const applets = JSON.parse(JSON.parse(raw).applets ?? '{}');
    return applets.groupProgress ?? {};
  });

export const getEntityProgress = async (
  page: Page,
  entityId: string,
  eventId: string,
): Promise<any | undefined> => (await getGroupProgress(page))[`${entityId}/${eventId}`];

const writeApplets = async (page: Page, mutate: string, arg: unknown): Promise<void> => {
  await page.evaluate(
    ([mutateKey, value]) => {
      const raw = localStorage.getItem('persist:root');
      if (!raw) return;
      const root = JSON.parse(raw);
      const applets = JSON.parse(root.applets ?? '{}');
      applets.groupProgress = applets.groupProgress ?? {};

      if (mutateKey === 'clear') {
        applets.groupProgress = {};
        applets.progress = {};
      } else if (mutateKey === 'set') {
        const { key, progress } = value as { key: string; progress: unknown };
        applets.groupProgress[key] = progress;
      } else if (mutateKey === 'delete') {
        delete applets.groupProgress[value as string];
      }

      root.applets = JSON.stringify(applets);
      localStorage.setItem('persist:root', JSON.stringify(root));
    },
    [mutate, arg] as const,
  );
};

// Wipes all local assessment progress; takes effect after the page reloads.
export const clearAllLocalProgress = async (page: Page): Promise<void> =>
  await writeApplets(page, 'clear', null);

// Overwrites one entity's saved progress (e.g. to fake old/stale data).
export const setEntityProgress = async (
  page: Page,
  entityId: string,
  eventId: string,
  progress: unknown,
): Promise<void> =>
  await writeApplets(page, 'set', { key: `${entityId}/${eventId}`, progress });

export const deleteEntityProgress = async (
  page: Page,
  entityId: string,
  eventId: string,
): Promise<void> => await writeApplets(page, 'delete', `${entityId}/${eventId}`);
