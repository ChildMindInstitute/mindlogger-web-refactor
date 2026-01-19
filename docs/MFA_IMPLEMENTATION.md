# MFA (Multi-Factor Authentication) Implementation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MFA LOGIN FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

  Login Page                                        MFA Verify Page
┌────────────────────────────┐                    ┌────────────────────────────┐
│ 1. User enters credentials │                    │ 1. Read session from Redux │
│ 2. API returns MFA required│                    │ 2. User enters TOTP code   │
│    { mfaToken, userId... } │                    │ 3. API verify succeeds     │
│ 3. Derive private key      │───────────────────▶│ 4. Store tokens            │
│    (password discarded!)   │                    │ 5. Call onLoginSuccess     │
│ 4. Dispatch MFA session    │                    │ 6. Navigate to dashboard   │
│ 5. Navigate to MFA page    │                    │                            │
└────────────────────────────┘                    └────────────────────────────┘
                                                            │
                                                            ▼
                                                  ┌────────────────────────────┐
                                                  │    MFA Recovery Page       │
                                                  │ (fallback if no TOTP app)  │
                                                  │ Format: XXXXX-XXXXX        │
                                                  └────────────────────────────┘
```

## Security Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Password ──▶ Derive private key ──▶ Discarded immediately                  │
│  MFA Session ──▶ Redux mfa slice ──▶ Blacklisted from persistence           │
│  Private Key ──▶ secureUserPrivateKeyStorage ──▶ Stored before MFA verify   │
│  Session Expiry ──▶ Backend-driven (no local timers)                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Routes

```
/login ─────────────────────▶ LoginPage ─────────────▶ Email/password entry
/auth/verify-mfa ───────────▶ MFAVerifyPage ─────────▶ TOTP 6-digit verification
/auth/verify-recovery ──────▶ MFARecoveryPage ───────▶ Recovery code (XXXXX-XXXXX)
```

## Key Files

```
features/Login/
├── model/
│   ├── mfa.slice.ts ──────────────▶ Redux slice for MFA session (blacklisted)
│   └── mfa.types.ts ──────────────▶ Type definitions and guards
├── lib/
│   └── useMFAVerification.ts ─────▶ Verification logic hook
└── ui/
    ├── MFAForm.tsx ───────────────▶ TOTP form (auto-submit at 6 digits)
    └── RecoveryCodeForm.tsx ──────▶ Recovery form (auto-format)

pages/
├── MFAVerify/index.tsx ───────────▶ TOTP page with route guard
└── MFARecovery/index.tsx ─────────▶ Recovery page with route guard

entities/user/model/hooks/
└── useOnLogin.ts ─────────────────▶ Login completion hook
```

## API Endpoints

```
POST /auth/login ─────────────────────────▶ Returns MFA challenge or tokens
POST /auth/mfa/totp/verify ───────────────▶ Verify TOTP code
POST /auth/mfa/recovery-codes/verify ─────▶ Verify recovery code
```

## MFA Required Response

```typescript
interface MFARequiredResponse {
  mfaRequired: true;
  mfaToken: string;
  mfaSessionId: string;
  userId: string;     // Enables immediate key derivation
  userEmail: string;  // Enables immediate key derivation
}
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Login Page                                                               │
│    API returns MFA required ──▶ derive private key ──▶ dispatch to Redux    │
│                                                                             │
│ 2. MFA Page                                                                 │
│    Read from Redux ──▶ verify code ──▶ store auth tokens ──▶ navigate       │
│                                                                             │
│ 3. Token Storage                                                            │
│    Tokens stored in useMFAVerification BEFORE callback                      │
│    (ensures tokens exist before navigation triggers route guards)           │
└─────────────────────────────────────────────────────────────────────────────┘
```

## User Experience

```
TOTP Verification                     Recovery Code
┌─────────────────────────┐           ┌─────────────────────────┐
│ • 6-digit code          │           │ • Format: XXXXX-XXXXX   │
│ • Auto-submit at 6      │           │ • Auto-formatted input  │
│ • Warning after 3 tries │           │ • Fallback option       │
└─────────────────────────┘           └─────────────────────────┘

Session Expiry
┌─────────────────────────────────────────────────────────────────┐
│ Backend error ──▶ "Back to Log In" ──▶ Redux state cleared      │
└─────────────────────────────────────────────────────────────────┘
```
