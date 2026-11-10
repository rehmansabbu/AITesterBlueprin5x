# VWO Login Dashboard — Test Cases (RICE‑POT, WITHOUT HALLUCINATION)

**Application under test:** https://app.vwo.com/#/login (resolves to `app.wingify.com` — a JS single-page app by Wingify/VWO)
**Method:** RICE‑POT prompt + Anti‑Hallucination rules ("WITHOUT HALLUCINATION" variant)
**Source template:** `Chapter_02_Prompt_Engineering/Template_without_hallucination.md`
**Companion artifact:** `output/TC_with_withouthallucination.xlsx`

> Note: the prompt you named "RISE PORT" is the RICE‑POT framework —
> **R**ole, **I**nstructions, **C**ontext, **E**xample, **P**arameters, **O**utput, **T**one.

---

## 1. The RICE‑POT prompt as executed (no‑hallucination variant)

### R — Role
You are a QA expert with 9+ years of experience in test design, test strategies, test execution and delivery.

### I — Instructions
1. Write test cases for the VWO application (URL: https://app.vwo.com/#/login). Cover the login page (valid, invalid, UI and security).
2. Produce the test cases in **JIRA format** (fields per the example).
3. Follow the PRD only.
4. Report **every missing gap** found while applying the anti-hallucination rules.
- Do **NOT** invent features, IDs, APIs, error codes, UI elements or behaviour.
- Do **NOT** assume default or "typical" behaviour.

### C — Context
- PRD: `https://docs.google.com/document/d/1GsT57ocl4HaUCxNhBGVmwvLYh7R24gjVB_RDteltkF4/edit` (⚠ not publicly readable — see Gap 1).
- The app is a client-rendered SPA; the served HTML is a "Loading" shell, so behaviour must be gathered by inspecting the live page (which the existing `PlaywrightFramework` already did).

### E — Example (JIRA format)
```
Test Case ID  TC_LOGIN_001
Summary       Verify login with valid credentials
Module        Login
Priority      High
Test Type     Functional
Automation    Yes
Browser       Chrome
Preconditions Registered active user
```

### P — Parameters / Anti‑hallucination rules applied
- Output must be deterministic (same input → same output).
- Every assertion must be traceable to a provided input.
- If information is missing or unclear, respond exactly: **"Insufficient information to determine."**
- If a detail is inferred, label it exactly: **"Inference (low confidence)".**
- Do not invent features, IDs, APIs, error codes, UI elements, or behaviour.
- Do not assume default or "typical" system behaviour.

### O — Output
Test cases (JIRA format) + gap report → `output/TC_with_withouthallucination.xlsx`.

### T — Tone
Technical, precise, output‑only. Distinguish **verified behaviour** from **assumptions**.

---

## 2. Evidence base (why each row is traceable)

Anti‑hallucination means nothing is asserted unless it is verifiable. The rows below are grounded in verified artifacts already in this repo:

| Evidence source | What it proves |
| --- | --- |
| Live login page `https://app.wingify.com/#/login` | Page renders login view; SPA shell is a "Loading" screen |
| `PlaywrightFramework/src/pages/LoginPage.ts` | Verified locators: `#login-username`, `#login-password`, `#checkbox-remember`, `#vow-login-logo`, `#js-login-form`, `#js-notification-box`, `#js-notification-box-msg`, `#forgot-password-username` |
| Same file (constants) | Verified error text: **"Your email, password, IP address or location did not match"**; login endpoint `POST /login`; **HTTP 401** rejected, **HTTP 429** rate-limited |
| `PlaywrightFramework/tests/login-valid.spec.ts` | Verified positive/UI behaviour; explicit skips for responsive, light/dark, loading state |
| `PlaywrightFramework/tests/login-invalid.spec.ts` | Verified negative behaviour and denial of dashboard access |
| `PlaywrightFramework/README.md` §7 | Documented verified limitations |

**Verified facts used:** login view present; HTTPS; title matches `/login/i`; email field `type=email`; password field `type=password`; password visibility toggle `password→text→password`; "Remember me" unchecked by default and toggles; Tab moves email→password; Forgot‑Password view at `#/forgot-password`; free‑trial link `href~free-trial`, `target=_blank`; **no** client‑side blur validation (`novalidate`); rejected login → HTTP 401 + verified message; rate limiting → HTTP 429; success path unverified.

---

## 3. Test cases (JIRA format)

Legend — **Status:** `Verified` = executed against the live app · `Gap` = cannot be asserted without the missing input.

| Test Case ID | Summary | Module | Priority | Test Type | Automation | Browser | Preconditions | Steps | Expected Result | Evidence (traceability) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC_LOGIN_001 | Verify login page loads over HTTPS at the VWO login URL | Login | High | Functional | Yes | Chrome/Firefox/WebKit | Network access to app.vwo.com | 1. Open https://app.vwo.com/#/login | URL contains `#/login` on `app.wingify.com`; protocol `https:`; title matches `/login/i`; email input and "Sign in" visible | login-valid.spec.ts | Verified |
| TC_LOGIN_002 | Verify all key login elements are visible | Login | High | UI | Yes | Chrome/Firefox/WebKit | On login page | 1. Inspect the login view | Brand logo, email, password, "Remember me" label, "Sign in", "Forgot Password?", free-trial link, "Sign in with Google", "Sign in using SSO" are all visible | login-valid.spec.ts | Verified |
| TC_LOGIN_003 | Verify email field accepts and clears input | Login | Medium | Functional | Yes | Chrome/Firefox/WebKit | On login page | 1. Type `someone@example.com` 2. Clear | Field `type=email`; value matches input; clears to empty | login-valid.spec.ts | Verified |
| TC_LOGIN_004 | Verify password field accepts input and masks the value | Login | High | Functional/Security | Yes | Chrome/Firefox/WebKit | On login page | 1. Type a password | Field `type=password`; value masked | login-valid.spec.ts, login-invalid.spec.ts | Verified |
| TC_LOGIN_005 | Verify password visibility toggle reveals then re-masks | Login | Medium | Functional | Yes | Chrome/Firefox/WebKit | On login page | 1. Enter password 2. Click toggle 3. Click toggle again | `type` changes `password → text → password` | login-valid.spec.ts | Verified |
| TC_LOGIN_006 | Verify "Remember me" default state and toggling | Login | Medium | Functional | Yes | Chrome/Firefox/WebKit | On login page | 1. Observe 2. Click label 3. Click label again | Unchecked by default; toggles to checked then unchecked | login-valid.spec.ts | Verified |
| TC_LOGIN_007 | Verify keyboard navigation from email to password | Login | Low | Accessibility | Yes | Chrome/Firefox/WebKit | On login page | 1. Focus email 2. Press Tab | Focus moves to the password field | login-valid.spec.ts | Verified |
| TC_LOGIN_008 | Verify "Forgot Password?" navigation and return to login | Login | Medium | Functional | Yes | Chrome/Firefox/WebKit | On login page | 1. Click "Forgot Password?" 2. Click "Back" | URL becomes `#/forgot-password` with the forgot-password email visible and login email hidden; Back returns to `#/login` | login-valid.spec.ts | Verified |
| TC_LOGIN_009 | Verify Free Trial link target | Login | Low | Functional | Yes | Chrome/Firefox/WebKit | On login page | 1. Inspect the free-trial link | `href` contains `free-trial`; `target="_blank"` | login-valid.spec.ts | Verified |
| TC_LOGIN_010 | Verify client-side validation on blur (expected: none) | Login | Low | Functional | Yes | Chrome/Firefox/WebKit | On login page | 1. Enter `plainaddress` 2. Move focus away | No validation/notification appears; entered value is retained (form is `novalidate`) | login-valid.spec.ts | Verified (behaviour = none) |
| TC_LOGIN_011 | Verify login rejected: invalid email + invalid password | Login | High | Negative/Security | Yes | Chrome/Firefox/WebKit | On login page | 1. Submit `invalid.user@example.com` / `Invalid@123` | HTTP 401; notification "Your email, password, IP address or location did not match"; stays on login | login-invalid.spec.ts | Verified |
| TC_LOGIN_012 | Verify login rejected: invalid email + empty password | Login | High | Negative/Security | Yes | Chrome/Firefox/WebKit | On login page | 1. Submit `invalid.user@example.com` with empty password | HTTP 401; authentication rejected | login-invalid.spec.ts | Verified |
| TC_LOGIN_013 | Verify login rejected: empty email + invalid password | Login | High | Negative/Security | Yes | Chrome/Firefox/WebKit | On login page | 1. Submit empty email with `Invalid@123` | HTTP 401; authentication rejected | login-invalid.spec.ts | Verified |
| TC_LOGIN_014 | Verify login rejected: both email and password empty | Login | High | Negative/Security | Yes | Chrome/Firefox/WebKit | On login page | 1. Submit with both fields empty | HTTP 401; authentication rejected | login-invalid.spec.ts | Verified |
| TC_LOGIN_015 | Verify malformed email `plainaddress` rejected | Login | Medium | Negative | Yes | Chrome/Firefox/WebKit | On login page | 1. Submit `plainaddress` with a password | HTTP 401; authentication rejected | login-invalid.spec.ts | Verified |
| TC_LOGIN_016 | Verify malformed email `missing@tld` rejected | Login | Medium | Negative | Yes | Chrome/Firefox/WebKit | On login page | 1. Submit `missing@tld` with a password | HTTP 401; authentication rejected | login-invalid.spec.ts | Verified |
| TC_LOGIN_017 | Verify malformed email `@no-local-part.com` rejected | Login | Medium | Negative | Yes | Chrome/Firefox/WebKit | On login page | 1. Submit `@no-local-part.com` with a password | HTTP 401; authentication rejected | login-invalid.spec.ts | Verified |
| TC_LOGIN_018 | Verify malformed email `user@` rejected | Login | Medium | Negative | Yes | Chrome/Firefox/WebKit | On login page | 1. Submit `user@` with a password | HTTP 401; authentication rejected | login-invalid.spec.ts | Verified |
| TC_LOGIN_019 | Verify authentication error message text for rejected credentials | Login | Medium | Negative | Yes | Chrome/Firefox/WebKit | On login page | 1. Submit invalid credentials | On HTTP 401, the notification is visible and contains the verified message | login-invalid.spec.ts | Verified (401 path) |
| TC_LOGIN_020 | Verify password value is stored but not exposed as text | Login | Medium | Security | Yes | Chrome/Firefox/WebKit | On login page | 1. Enter a password 2. Read field value/type | Value equals input; field `type=password` (never `text` unless toggled) | login-invalid.spec.ts | Verified |
| TC_LOGIN_021 | Verify unsuccessful authentication denies dashboard access | Login | High | Negative/Security | Yes | Chrome/Firefox/WebKit | On login page | 1. Submit invalid credentials | URL does not contain `dashboard`; login view remains visible | login-invalid.spec.ts | Verified |
| TC_LOGIN_022 | Verify rate limiting returns HTTP 429 after repeated failures | Login | Medium | Security | Yes | Chrome/Firefox/WebKit | On login page | 1. Submit invalid credentials repeatedly | Endpoint returns HTTP 429; authentication denied; credential error not rendered | login-invalid.spec.ts | Verified |
| TC_LOGIN_023 | Verify successful login and dashboard redirection | Login | High | Functional | Yes | Chrome/Firefox/WebKit | **Valid VWO credentials** (`VALID_EMAIL`/`VALID_PASSWORD`) | 1. Submit valid credentials with "Remember me" | Redirect away from `#/login`; login form hidden; dashboard loads | — | **Gap (blocked)** — credentials unavailable; success path unverified |
| TC_LOGIN_024 | Verify responsive / mobile login layout | Login | Low | UI/Compatibility | Partial | Chrome/Firefox/WebKit | Mobile viewport | 1. Open at a mobile viewport | Mobile-responsive layout | README §7 | **Gap** — app pins viewport to `width=1280`; not mobile-responsive |
| TC_LOGIN_025 | Verify Light/Dark mode options | Login | Low | UI | No | Chrome/Firefox/WebKit | On login page | 1. Look for a theme toggle | A theme switch changes the UI theme | README §7 | **Gap** — no theme toggle present |
| TC_LOGIN_026 | Verify loading state during authentication | Login | Low | UI | No | Chrome/Firefox/WebKit | On login page | 1. Submit and observe the button | Deterministic loading indicator / disabled button | README §7 | **Gap** — no deterministic loading indicator exposed |

**Totals:** 26 test cases → **22 Verified**, **4 Gap/blocked**.

---

## 4. Missing gaps found by the anti-hallucination rules

Each gap is information the rules refused to guess. The rule that fired is shown.

| # | Missing information / gap | Rule triggered | Impact |
| --- | --- | --- | --- |
| 1 | Full PRD text — the Google Doc requires sign-in; only a partial mirror is available locally | Every assertion must be traceable to a provided input | Cannot confirm requirement coverage |
| 2 | Valid test credentials (successful login) | Do not fabricate valid login credentials | TC_LOGIN_023 blocked; success path unverified |
| 3 | Rate-limit threshold (attempts / time window) | Do not assume default/typical behaviour | Cannot test the exact boundary |
| 4 | Session timeout value | Traceability | Timeout scenarios undefined |
| 5 | "Remember me" persistence policy / duration | Traceability | Persistence behaviour undefined |
| 6 | Password policy / complexity rules | Do not invent features | Cannot validate accepted vs rejected passwords |
| 7 | Account lockout behaviour | Do not assume default behaviour | Lockout scenarios undefined |
| 8 | Password-reset link lifetime & single-use rules | Traceability | Reset-flow assertions undefined |
| 9 | Forgot-password email delivery / confirmation content | Traceability | Recovery flow partially untestable |
| 10 | MFA methods and recovery flow | Do not invent features | MFA scenarios unavailable |
| 11 | SSO provider list, account-linking, social-login config | Traceability | SSO/social scenarios conditional |
| 12 | Expected error messages for non-401 paths (locked / unverified / session-expired) | Do not invent error codes | Only the 401 message is assertable |
| 13 | Supported browser/OS/device matrix & versions | Traceability | Compatibility scope undefined |
| 14 | QA / pre-production URLs & build identifiers | Traceability | No non-prod environment to run against |
| 15 | Performance method for the <2s target, concurrency profile, availability window/regions | Traceability | Performance targets not measurable |
| 16 | Accessibility evidence requirements (WCAG 2.1 AA specifics), high-contrast detail | Traceability | Accessibility pass/fail undefined |
| 17 | Analytics event definitions; registration/support destinations | Traceability | Integration checks undefined |
| 18 | Test-account provisioning / environment access | Traceability | Execution cannot start |
| 19 | Locale / language support | Do not assume default behaviour | i18n scope undefined |
| 20 | Post-login dashboard route / landing URL pattern | Do not invent UI elements or behaviour | Post-login assertion undefined |

**Total missing gaps found: 20.**
Text used by the rules where output was impossible: **"Insufficient information to determine."**

---

## 5. Verdict — was a better test case produced?

**Yes — the WITHOUT‑HALLUCINATION output is a better test artifact, even though it contains fewer "green" cases.**

**Why it is better**
- **Trustworthy:** 22 of 26 cases are traceable to verified live behaviour; the other 4 are honestly marked as gaps instead of being faked.
- **Safe for QA:** no invented error messages, IDs, dashboard routes, MFA flows, or "typical" behaviour that would create false confidence and wasted execution.
- **Actionable:** the 20 gaps are a ready-made list of requirements/test-data to obtain before execution.

**Where it looks "worse" (and why that is the point)**
- A **hallucinated** version would look more impressive — more cases, a made-up dashboard URL, invented error strings, invented MFA/SSO steps — but every added row would be unverifiable and potentially wrong.
- The no-hallucination output trades superficial volume for correctness, so it reads as "incomplete" only because it refuses to invent the missing inputs.

**Net:** for correctness, traceability and safety, yes — the anti-hallucination test cases are the better ones. To reach full executable coverage you still need to close the gaps — most critically **Gap 1 (readable PRD)** and **Gap 2 (valid credentials)**.
