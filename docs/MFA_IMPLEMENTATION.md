# MFA (Multi-Factor Authentication) Login Implementation

## Overview

This document describes the MFA login implementation for MindLogger Web application, adapted from `mindlogger-admin` to follow `mindlogger-web-refactor` architectural patterns.

**Ticket Reference**: [M2-10000](https://mindlogger.atlassian.net/browse/M2-10000)

---

## Architecture Overview

### High-Level Flow

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  LoginForm  │────▶│  API: /auth/login │────▶│ MFA Required?   │
└─────────────┘     └──────────────────┘     └─────────────────┘
                                                      │
                           ┌──────────────────────────┼──────────────────────────┐
                           │ No                       │ Yes                       │
                           ▼                          ▼                           │
                    ┌─────────────┐          ┌─────────────────┐                 │
                    │ Login Success│          │  AuthFlow       │                 │
                    │ → Dashboard  │          │  (State Machine)│                 │
                    └─────────────┘          └─────────────────┘                 │
                                                      │                           │
                                                      ▼                           │
                                              ┌─────────────────┐                 │
                                              │   MFAForm       │                 │
                                              │ (TOTP 6-digit)  │                 │
                                              └─────────────────┘                 │
                                                      │                           │
                                     ┌────────────────┼────────────────┐          │
                                     ▼                ▼                ▼          │
                              ┌───────────┐   ┌─────────────┐  ┌──────────────┐  │
                              │  Success  │   │   Error     │  │ Can't Access │  │
                              │→ Dashboard│   │  (Retry)    │  │ Authenticator│  │
                              └───────────┘   └─────────────┘  └──────────────┘  │
                                                                       │          │
                                                                       ▼          │
                                                              ┌─────────────────┐ │
                                                              │RecoveryCodeForm │ │
                                                              │(XXXXX-XXXXX)    │ │
                                                              └─────────────────┘ │
```

### Technology Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| State Management | useReducer (in-memory) | MFA session NOT persisted to Redux/localStorage for security |
| API Calls | React Query | `useBaseMutation` pattern |
| Forms | react-hook-form + Zod | `useCustomForm` pattern |
| UI | MUI + shared/ui | Existing component library |
| i18n | i18next | keyPrefix pattern |

---

## User Flow

### Standard Login (No MFA)
1. User enters email/password → API returns tokens → Redirect to dashboard

### MFA Required Login
1. User enters email/password
2. API returns `{ mfaRequired: true, mfaToken, mfaSessionId }`
3. AuthFlow stores MFA session in-memory
4. UI transitions to MFAForm

### TOTP Verification
- 6-digit code from authenticator app
- Auto-submits when 6 digits entered
- Max 5 attempts with warning after 3

### Recovery Code Verification
- XXXXX-XXXXX format with auto-formatting
- Fallback when authenticator unavailable

### Session Expiry
- 5-minute timeout
- Shows "Session expired" error with "Back to Log In" option

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | Returns MFA challenge or tokens |
| `/auth/mfa/totp/verify` | POST | Verify TOTP code |
| `/auth/mfa/recovery-codes/verify` | POST | Verify recovery code |

---

## Security Requirements

1. **In-memory MFA state** - useReducer only, NOT Redux/localStorage
2. **loginPassword retention** - Required for encryption key derivation
3. **Session expiry** - 5 minute timeout, cleared on expiry
4. **Rate limiting** - Max 5 attempts with progressive warnings

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| useReducer vs Redux | Security - avoid persisting mfaToken/password |
| AuthFlow orchestrator | Clean state machine for flow transitions |
| Auto-submit TOTP | Better UX - no need to click submit |
| In-memory password | Required for `generateUserPrivateKey` after MFA success |

---

## Implementation Summary

### Files Created

| File | Purpose |
|------|---------|
| `src/features/Login/model/mfa.types.ts` | MFA TypeScript type definitions and type guards |
| `src/features/Login/model/mfa.schema.ts` | Zod validation schemas for TOTP and recovery forms |
| `src/features/Login/lib/useMFASessionExpiry.ts` | Timer-based session expiry detection hook |
| `src/features/Login/lib/useMFAVerification.ts` | Core verification logic hook |
| `src/features/Login/ui/AuthFlow.tsx` | State machine orchestrator with in-memory MFA state |
| `src/features/Login/ui/MFAForm.tsx` | TOTP 6-digit form with auto-submit |
| `src/features/Login/ui/RecoveryCodeForm.tsx` | Recovery code form with auto-format |
| `src/entities/user/api/useMFAVerifyMutation.ts` | TOTP verification mutation hook |
| `src/entities/user/api/useMFARecoveryMutation.ts` | Recovery code verification mutation hook |

### Files Modified

| File | Changes |
|------|---------|
| `src/shared/api/types/authorization.ts` | Added MFA API types (LoginResult union) |
| `src/shared/api/services/authorization.service.ts` | Added MFA verification endpoints |
| `src/shared/utils/dictionary.map.ts` | Added MFA validation keys |
| `src/i18n/en/translation.json` | Added MFA translations |
| `src/features/Login/ui/LoginForm.tsx` | Added onMFARequired callback |
| `src/features/Login/ui/index.ts` | Export new MFA components |
| `src/entities/user/api/index.ts` | Export new MFA mutation hooks |
| `src/features/Signup/ui/SignupForm.tsx` | Handle LoginResult union type |
| `src/pages/Login/index.tsx` | Render AuthFlow instead of LoginForm |

---

## Reference

Based on `mindlogger-admin` implementation with adaptations:
- Zod instead of Yup for validation
- React Query mutations instead of Redux thunks
- `useCustomForm` pattern
- shared/ui components

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2024-12-22 | 1.0.0 | Initial MFA implementation |
