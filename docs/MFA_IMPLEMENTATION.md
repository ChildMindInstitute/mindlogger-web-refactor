# MFA (Multi-Factor Authentication) Login Implementation

## Overview

This document describes the MFA login implementation for MindLogger Web application.

**Ticket Reference**: [M2-10000](https://mindlogger.atlassian.net/browse/M2-10000)

---

## Architecture Overview

### High-Level Flow

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  LoginPage  │────▶│  API: /auth/login │────▶│ MFA Required?   │
│  /login     │     └──────────────────┘     └─────────────────┘
└─────────────┘                                       │
                          ┌───────────────────────────┼───────────────────────────┐
                          │ No                        │ Yes                        │
                          ▼                           ▼                            │
                   ┌─────────────┐           ┌─────────────────┐                  │
                   │ Login Success│           │ Store session   │                  │
                   │ → Dashboard  │           │ in MFAContext   │                  │
                   └─────────────┘           └─────────────────┘                  │
                                                      │                            │
                                                      ▼                            │
                                              ┌─────────────────┐                  │
                                              │ Navigate to     │                  │
                                              │ /auth/verify-mfa│                  │
                                              └─────────────────┘                  │
                                                      │                            │
                                                      ▼                            │
                                              ┌─────────────────┐                  │
                                              │  MFAVerifyPage  │                  │
                                              │  (TOTP 6-digit) │                  │
                                              └─────────────────┘                  │
                                                      │                            │
                                     ┌────────────────┼────────────────┐           │
                                     ▼                ▼                ▼           │
                              ┌───────────┐   ┌─────────────┐  ┌──────────────┐   │
                              │  Success  │   │   Error     │  │ Can't Access │   │
                              │→ Dashboard│   │  (Retry)    │  │ Authenticator│   │
                              └───────────┘   └─────────────┘  └──────────────┘   │
                                                                       │           │
                                                                       ▼           │
                                                       ┌─────────────────────────┐ │
                                                       │ Navigate to             │ │
                                                       │ /auth/verify-recovery   │ │
                                                       └─────────────────────────┘ │
                                                                       │           │
                                                                       ▼           │
                                                              ┌─────────────────┐  │
                                                              │MFARecoveryPage  │  │
                                                              │(XXXXX-XXXXX)    │  │
                                                              └─────────────────┘  │
```

### Technology Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| State Management | MFAContext (useReducer) | Global context for MFA session - NOT persisted to localStorage |
| Routing | React Router | Separate routes for each MFA step |
| API Calls | React Query | `useBaseMutation` pattern |
| Forms | react-hook-form + Zod | `useCustomForm` pattern |
| UI | MUI + shared/ui | Figma-compliant card styling |
| i18n | i18next | keyPrefix pattern |

---

## Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/login` | LoginPage | Email/password login |
| `/auth/verify-mfa` | MFAVerifyPage | TOTP 6-digit verification |
| `/auth/verify-recovery` | MFARecoveryPage | Recovery code verification |

---

## User Flow

### Standard Login (No MFA)
1. User enters email/password → API returns tokens → Redirect to dashboard

### MFA Required Login
1. User enters email/password on `/login`
2. API returns `{ mfaRequired: true, mfaToken, mfaSessionId }`
3. LoginPage stores session in MFAContext and navigates to `/auth/verify-mfa`
4. MFAVerifyPage renders TOTP form

### TOTP Verification
- 6-digit code from authenticator app
- Auto-submits when 6 digits entered
- Max 5 attempts with warning after 3

### Recovery Code Verification
- XXXXX-XXXXX format with auto-formatting
- Fallback when authenticator unavailable
- Navigate via "I can't access my authenticator app" link

### Session Expiry
- **Backend-driven**: No local timers
- API returns "session expired" error → Shows error with "Back to Log In" option
- MFAContext cleared on expiry

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | Returns MFA challenge or tokens |
| `/auth/mfa/totp/verify` | POST | Verify TOTP code |
| `/auth/mfa/recovery-codes/verify` | POST | Verify recovery code |

---

## Security Requirements

1. **In-memory MFA state** - MFAContext with useReducer, NOT Redux/localStorage
2. **loginPassword retention** - Required for encryption key derivation
3. **Backend-driven session expiry** - No local timers, API determines expiry
4. **Rate limiting** - Max 5 attempts with progressive warnings
5. **Route guards** - MFA pages redirect to `/login` if no session

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Route-based navigation | Better separation of concerns, cleaner navigation, easier testing |
| MFAContext vs Redux | Security - avoid persisting mfaToken/password to localStorage |
| Backend-driven expiry | Single source of truth, no timer sync issues |
| Auto-submit TOTP | Better UX - no need to click submit |
| Separate pages | Each step has its own URL, supports browser back button |

---

## Implementation Summary

### Files

| File | Purpose |
|------|---------|
| `src/features/Login/lib/MFAContext.tsx` | Global context provider for MFA session state |
| `src/features/Login/model/mfa.types.ts` | MFA TypeScript type definitions and type guards |
| `src/features/Login/model/mfa.schema.ts` | Zod validation schemas for TOTP and recovery forms |
| `src/features/Login/lib/useMFAVerification.ts` | Core verification logic hook |
| `src/features/Login/ui/MFAForm.tsx` | TOTP 6-digit form with auto-submit |
| `src/features/Login/ui/RecoveryCodeForm.tsx` | Recovery code form with auto-format |
| `src/pages/MFAVerify/index.tsx` | TOTP verification page with route guard |
| `src/pages/MFARecovery/index.tsx` | Recovery code page with route guard |

---

## UI Specifications (Figma)

### Card Container
```css
display: flex;
width: 473px;
padding: 32px;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 32px;
border-radius: 16px;
border: 1px solid var(--color-surface-variant, #E3E2E1);
background: var(--color-surface, #FDFCFC);
```

### Typography
| Element | Variant | Size |
|---------|---------|------|
| Title | titleLargeBold | 22px |
| Description | bodyMedium | 14px |
| Button | title3 | 16px |

---

## Reference

Based on `mindlogger-admin` implementation with adaptations:
- Zod instead of Yup for validation
- React Query mutations instead of Redux thunks
- `useCustomForm` pattern
- shared/ui components
