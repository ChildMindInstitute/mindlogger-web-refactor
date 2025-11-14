# E2E test structure (Playwright POM)

This folder contains a Page Object Model (POM) and API client structure to keep specs small and readable.

## Quick Start

### Environment Setup

The global setup requires admin credentials. Set them using one of these methods:

**Option 1: Environment variables (recommended for CI)**
```bash
export PLAYWRIGHT_ADMIN_EMAIL="your-admin@example.com"
export PLAYWRIGHT_ADMIN_PASSWORD="your-password"
export PLAYWRIGHT_BASE_URL="https://web-uat.cmiml.net"
```

**Option 2: Use the existing setup project (UI-based)**
If env vars aren't available, use the existing UI-based setup instead of global setup:
- Comment out `globalSetup` in `playwright.config.ts`
- Use the "setup" project which reads from `process.env.uat.*` namespace

**Option 3: Create env file**
Create `.env` in project root:
```
PLAYWRIGHT_ADMIN_EMAIL=your-admin@example.com
PLAYWRIGHT_ADMIN_PASSWORD=your-password
PLAYWRIGHT_BASE_URL=https://web-uat.cmiml.net
```

Structure:

- pages/: UI page objects. One class per page. No assertions in POs.
- api/:   Thin typed clients around Playwright APIRequestContext (throw on !ok).
- fixtures/: Playwright `test.extend` to inject pages and API clients.
- setup/: Global setup to create a reusable `storageState` (admin.json).
- specs/: Your actual tests. Import from `../fixtures/test`.
- .auth/: Storage state artifacts (admin.json).

Key files:

- pages/base.page.ts: shared helpers and `goto(baseURL)`.
- pages/login.page.ts: example page with `login(email, pwd)`.
- api/client.ts: `newApiContext(token?)` builds APIRequestContext with baseURL.
- api/users.api.ts: example UsersApi (`login`, `createUser`) with types.
- fixtures/test.ts: exposes `loginPage`, `usersApi`, and `baseURL` fixtures.
- setup/global.setup.ts: logs in via API and writes `tests/.auth/admin.json`.

Usage in specs:

```ts
// tests/e2e/specs/auth/login.spec.ts
import { test, expect } from '../../fixtures/test';

test('login navigates to protected area', async ({ loginPage, baseURL, page }) => {
  await loginPage.goto(baseURL);
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL(/protected/);
});

// API fixtures example
test('create user via API', async ({ usersApi }) => {
  const user = await usersApi.createUser({
    email: `user${Date.now()}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    password: process.env.PLAYWRIGHT_GENERAL_PASSWORD ?? 'DefaultPassword123!',
  });
  expect(user.result.id).toBeTruthy();
});
```

Config sketch (playwright.config.ts):

```ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'https://web-uat.cmiml.net',
    trace: 'retain-on-failure',
  },
  globalSetup: 'tests/e2e/setup/global.setup.ts',
  projects: [
    { name: 'logged-out' },
    { name: 'logged-in', use: { storageState: 'tests/.auth/admin.json' } },
  ],
});
```

Notes:
- Prefer role/testId locators; keep CSS selectors inside POs.
- Avoid `expect` inside POs; assert in specs.
- Reuse `newApiContext()` for API calls, set base URL via `API_BASE_URL` env.
- If your app changes how it reads auth, adapt `global.setup.ts` once and reuse.
