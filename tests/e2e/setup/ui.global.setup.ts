import { test as setup } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';
import { UIlogin } from '../../utils/loginPage';

// Optional UI-driven setup (kept for parity with prior flow).
// Prefer API-based auth in global.setup.ts for speed and stability.

dotenv.config({ path: path.resolve(__dirname, '.env.uat') });

const authFile = 'tests/.auth/session.json';

setup('authenticate (UI)', async ({ page }) => {
  const email = (process.env as any)?.uat?.PLAYWRIGHT_ADMIN_EMAIL || '';
  const password = (process.env as any)?.uat?.PLAYWRIGHT_ADMIN_PASSWORD || '';
  await UIlogin(page, '/login', email, password);
  await page.context().storageState({ path: authFile });
});
