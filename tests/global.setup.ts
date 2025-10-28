// global.setup.ts
import { chromium } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const authFile = '.auth/session.json';

export default async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('/login');
  await page.fill('input[name="email"]', process.env.EMAIL || '');
  await page.fill('input[name="password"]', process.env.PASSWORD || '');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/protected/applets');

  // Optionally verify login
  const myTestElement = page.getByTestId('applet-list');
  await myTestElement.waitFor({ state: 'visible' });

  // Save storage state
  await context.storageState({ path: authFile });

  await browser.close();
};