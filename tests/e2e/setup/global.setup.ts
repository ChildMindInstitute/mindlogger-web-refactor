import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { newApiContext } from '../api/client';
import { UsersApi } from '../api/users.api';

// Load .env from project root as fallback if playwright.config didn't load it
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Generates a storage state file with an admin token in localStorage
// Note: Relies on env vars loaded by playwright.config.ts or .env file
export default async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const apiCtx = await newApiContext();
  const usersApi = new UsersApi(apiCtx);

  // Try both flat and nested env var access patterns
  const email = process.env.PLAYWRIGHT_ADMIN_EMAIL 
    ?? (process.env as any).uat?.PLAYWRIGHT_ADMIN_EMAIL 
    ?? '';
  const password = process.env.PLAYWRIGHT_ADMIN_PASSWORD 
    ?? (process.env as any).uat?.PLAYWRIGHT_ADMIN_PASSWORD 
    ?? '';
  
  if (!email || !password) {
    console.error('\n❌ Missing admin credentials for global setup!');
    console.error('\nTried:');
    console.error('  - process.env.PLAYWRIGHT_ADMIN_EMAIL');
    console.error('  - process.env.uat.PLAYWRIGHT_ADMIN_EMAIL');
    console.error('\nTo fix, create a .env file in project root with:');
    console.error('  PLAYWRIGHT_ADMIN_EMAIL=your-email@example.com');
    console.error('  PLAYWRIGHT_ADMIN_PASSWORD=your-password');
    console.error('\nOr export them as environment variables.');
    console.error('\nSee tests/e2e/.env.example for a template.\n');
    throw new Error('Missing admin credentials in environment');
  }

  console.log(`[global.setup] Logging in as: ${email}`);
  const login = await usersApi.login(email, password);
  const token = login?.result?.token?.accessToken;
  if (!token) throw new Error('Failed to get accessToken from login response');

  const base = process.env.PLAYWRIGHT_BASE_URL ?? 'https://web-uat.cmiml.net';
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.evaluate((t) => localStorage.setItem('Bearer', t), token);

  await context.storageState({ path: 'tests/.auth/admin.json' });
  console.log('[global.setup] ✅ Storage state saved to tests/.auth/admin.json');

  await apiCtx.dispose();
  await browser.close();
}
