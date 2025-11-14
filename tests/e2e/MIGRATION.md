# Test Migration Inventory & Status

## File Mapping: Old → New Structure

### ✅ Migrated Specs

| Old Location | New Location | Status |
|-------------|--------------|--------|
| `tests/logged-out/create-account.spec.ts` | `tests/e2e/specs/auth/create-account.spec.ts` | ✅ Migrated |
| `tests/logged-out/user-authentication.spec.ts` | `tests/e2e/specs/auth/user-authentication.spec.ts` | ✅ Migrated |
| `tests/logged-out/reset-password.spec.ts` | `tests/e2e/specs/auth/reset-password.spec.ts` | ✅ Migrated |
| `tests/logged-out/user-invite.spec.ts` | `tests/e2e/specs/invitations/user-invite.spec.ts` | ✅ Migrated (skeleton) |

### ⚠️ Needs Migration

| Old Location | Suggested New Location | Notes |
|-------------|----------------------|-------|
| `tests/logged-in/activities.spec.ts` | `tests/e2e/specs/activities/complete-assessment.spec.ts` | Needs AppletDetailsPage POM |
| `tests/test.setup.ts` | Remove or move to e2e/specs | Standalone test; can be removed after migration |

### ✅ Utilities & Helpers

| Old Location | New Location | Status |
|-------------|--------------|--------|
| `tests/utils/userApi.ts` | `tests/e2e/api/users.api.ts` | ✅ Migrated & improved |
| `tests/utils/appletAPI.ts` | `tests/e2e/api/applets.api.ts` | ✅ Migrated & improved |
| `tests/utils/loginPage.ts` (UIlogin) | `tests/e2e/pages/login.page.ts` | ✅ Migrated to POM |
| `tests/utils/loginPage.ts` (createAccountForm) | `tests/e2e/pages/signup.page.ts` | ✅ Migrated to POM |
| `tests/utils/appletfreshAPI.ts` | `tests/e2e/utils/api-helpers.ts` | ⚠️ Needs migration |
| `tests/fixtures/fixtures.ts` | `tests/e2e/fixtures/test.ts` | ✅ Migrated & expanded |

### ✅ Setup & Teardown

| Old Location | New Location | Status |
|-------------|--------------|--------|
| `tests/logged-in/global.setup.ts` | `tests/e2e/setup/ui.global.setup.ts` | ✅ Copied |
| `tests/logged-in/global.teardown.ts` | `tests/e2e/setup/global.teardown.ts` | ✅ Migrated & improved |
| `tests/auth.setup.ts` | `tests/e2e/setup/global.setup.ts` | ✅ Replaced with API-based |

## New Structure Components

### Page Objects (tests/e2e/pages/)
- ✅ `base.page.ts` - Base class with common helpers
- ✅ `login.page.ts` - Login form and actions
- ✅ `signup.page.ts` - Account creation form
- ✅ `settings.page.ts` - Password change form
- ✅ `forgot-password.page.ts` - Password reset request
- ⚠️ `applet-details.page.ts` - NEEDED for activities.spec.ts
- ⚠️ `applet-list.page.ts` - NEEDED for navigation tests

### API Clients (tests/e2e/api/)
- ✅ `client.ts` - APIRequestContext factory
- ✅ `users.api.ts` - User creation, login
- ✅ `applets.api.ts` - Invitations, applet operations

### Fixtures (tests/e2e/fixtures/)
- ✅ `test.ts` - Extended test with all fixtures

### Setup (tests/e2e/setup/)
- ✅ `global.setup.ts` - API-based auth & storageState
- ✅ `global.teardown.ts` - Cleanup storage files
- ✅ `ui.global.setup.ts` - Optional UI-based auth

### Data Helpers (tests/e2e/data/)
- ✅ `users.ts` - Random user generation

### Utils (tests/e2e/utils/)
- ⚠️ `api-helpers.ts` - NEEDED (migrate appletfreshAPI.ts)

## Action Items

### High Priority
1. ⚠️ Migrate `tests/logged-in/activities.spec.ts` - needs AppletDetailsPage POM
2. ⚠️ Create `tests/e2e/pages/applet-details.page.ts`
3. ⚠️ Create `tests/e2e/pages/applet-list.page.ts`
4. ⚠️ Migrate `tests/utils/appletfreshAPI.ts` to `tests/e2e/utils/api-helpers.ts`

### Medium Priority
5. 🔄 Add AppletDetailsPage and AppletListPage to fixtures
6. 🔄 Verify all migrated specs run successfully
7. 🔄 Update playwright.config.ts to use e2e specs by default

### Low Priority (Cleanup)
8. 🗑️ Remove old `tests/logged-out/` after validation
9. 🗑️ Remove old `tests/logged-in/` after validation
10. 🗑️ Remove old `tests/utils/` after validation
11. 🗑️ Remove old `tests/fixtures/fixtures.ts` after validation
12. 🗑️ Remove `tests/auth.setup.ts` (replaced by e2e/setup)
13. 🗑️ Remove or migrate `tests/test.setup.ts`

## Environment Variables Required

Migrated tests expect:
- `PLAYWRIGHT_BASE_URL` or fallback to https://web-uat.cmiml.net
- `PLAYWRIGHT_ADMIN_EMAIL`
- `PLAYWRIGHT_ADMIN_PASSWORD`
- `PLAYWRIGHT_GENERAL_PASSWORD`
- `(process.env as any).uat.EMAIL_ADDRESS` (for create-account)
- `(process.env as any).uat.PLAYWRIGHT_EMAIL` (for auth tests)
- `(process.env as any).uat.PLAYWRIGHT_PASSWORD` (for auth tests)

## Migration Benefits

### Before (Old Structure)
- ❌ Helpers scattered in `tests/utils/`
- ❌ Direct function calls (UIlogin, createAccountForm)
- ❌ API clients instantiated in each test
- ❌ Selectors duplicated across specs
- ❌ No consistent Page Object pattern

### After (New E2E Structure)
- ✅ Page Objects centralized in `tests/e2e/pages/`
- ✅ Fixtures inject dependencies automatically
- ✅ API clients reused via fixtures
- ✅ Selectors hidden in page objects
- ✅ Consistent POM pattern throughout
- ✅ Faster tests (API-based setup vs UI)
- ✅ Better type safety
- ✅ Easier to maintain and extend

## Next Steps

Run this command to see what's left:
```bash
# Count old specs still in use
find tests/logged-in tests/logged-out -name "*.spec.ts" | wc -l

# Count new e2e specs
find tests/e2e/specs -name "*.spec.ts" | wc -l
```
