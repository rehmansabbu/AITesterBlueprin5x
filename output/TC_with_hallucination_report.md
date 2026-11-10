# VWO Login Dashboard — Test Cases (RICE‑POT, WITH HALLUCINATION)

**Application under test:** https://app.vwo.com/#/login
**Method:** RICE‑POT prompt — **WITH HALLUCINATION** variant + Anti‑Hallucination audit
**Source template:** `Chapter_02_Prompt_Engineering/Template_with_hallucination.md`
**Companion artifact:** `output/TC_with_hallucination.xlsx`

> This file intentionally shows what the **with‑hallucination** run produces: a
> suite that *looks* complete because it fills every unknown with a plausible
> specific (error strings, IDs, timeouts, dashboard routes, policies). Every
> fabricated item is marked and then audited against the anti‑hallucination
> rules. **Do not execute or trust the fabricated values** — several are
> factually contradicted by the live application.

---

## 1. The RICE‑POT prompt as given (with‑hallucination variant)

### R — Role
You are a QA expert with 9+ years of experience in test design, test strategies, test execution and delivery.

### I — Instructions
1. Write test cases for the VWO application (URL: https://app.vwo.com/#/login) — valid and invalid cases for the login page.
2. Produce the test cases in **JIRA format**.
3. Follow **only** the PRD docs.
4. Report every missing gap found while applying the anti‑hallucination rules.

### C — Context
- PRD: `https://docs.google.com/document/d/1GsT57ocl4HaUCxNhBGVmwvLYh7R24gjVB_RDteltkF4/edit` (⚠ not publicly readable)
- App is a client‑rendered SPA (served HTML is a "Loading" shell).

### E — Example (JIRA format)
`TC_LOGIN_001` — fields: Test Case ID, Summary, Module, Priority, Test Type, Automation, Browser, Preconditions.

### P / Safy Rules, Gurarails, Anti‑Hallucination Rules
- Output must be deterministic (same input → same output).
- Every assertion must be traceable to a provided input.
- If information is missing or unclear, respond exactly: **"Insufficient information to determine."**
- If a detail is inferred, label it exactly: **"Inference (low confidence)".**
- Do not invent features, IDs, APIs, error codes, UI elements, or behaviour.
- Do not assume default or "typical" system behaviour.

### O — Output → `output/TC_with_hallucination.xlsx`
### T — Tone → Technical / output‑only.

---

## 2. The key tension in this template

The template is **titled "WITH HALLUCINATION"** yet it also **appends the anti‑hallucination rules** (lines 54–64). When the title/expectation pushes toward a "complete" deliverable, the model resolves the conflict by *filling the blanks with confident‑sounding specifics* instead of writing "Insufficient information to determine." That is exactly what a hallucinating run looks like — and it is why the audit below is necessary.

**Generated:** 30 test cases (vs 26 in the no‑hallucination run — it *looks* more thorough).

---

## 3. Test cases (JIRA format) — as produced by the "with hallucination" run

Legend — **Audit:** `Unverifiable` = invented, no evidence · `Contradicts live app` = the live app behaves differently · `OK` = matches verified behaviour.

| Test Case ID | Summary | Module | Priority | Test Type | Preconditions | Steps | Expected Result (as generated) | Fabricated / unverified detail | Audit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC_LOGIN_001 | Verify login page loads over HTTPS | Login | High | Functional | Network access | Open the URL | Title reads "Login \| VWO"; padlock shown; logo alt "VWO" | Title text and logo alt text | Unverifiable |
| TC_LOGIN_002 | Verify all login page elements | Login | High | UI | On login page | Inspect the form | Email `#email`, password `#password`, remember `#remember`, button `#login-button` | Element IDs `#email`/`#password`/`#remember`/`#login-button` | Contradicts live app (real IDs: `#login-username`, `#login-password`, `#checkbox-remember`) |
| TC_LOGIN_003 | Verify email inline validation | Login | Medium | Functional | On login page | Type `abc`, then blur | "Please enter a valid email address" appears on blur | Message text and blur timing | Contradicts live app (no blur validation; form is `novalidate`) |
| TC_LOGIN_004 | Verify password field constraints | Login | Medium | Functional | On login page | Enter short/long passwords | Field enforces 8–64 characters | 8–64 length rule | Unverifiable |
| TC_LOGIN_005 | Verify password strength meter | Login | Low | UI | On login page | Type passwords | Weak / Medium / Strong meter | Existence of a strength meter | Contradicts live app (no meter present) |
| TC_LOGIN_006 | Verify Remember Me persists the session | Login | Medium | Functional | On login page | Check Remember Me, log in, reopen | Session persists 30 days | 30‑day persistence | Unverifiable |
| TC_LOGIN_007 | Verify successful login redirects to the dashboard | Login | High | Functional | **Valid credentials** | Submit valid credentials | Redirects to `app.vwo.com/#/dashboard` within 2s | Dashboard route and 2s timing | Unverifiable (and success path has no verified creds) |
| TC_LOGIN_008 | Verify dashboard welcome banner | Login | Low | UI | Logged in | Observe dashboard | "Welcome back, <name>" banner | Banner text | Unverifiable |
| TC_LOGIN_009 | Verify session idle timeout | Login | High | Security | Logged in | Idle 30 minutes | Session expires after 30 min of inactivity | 30‑minute timeout value | Unverifiable |
| TC_LOGIN_010 | Verify logout clears the session | Login | High | Security | Logged in | Click Logout | Returns to login; auth token cleared | Token-clearing behaviour | Unverifiable |
| TC_LOGIN_011 | Verify dark/light theme toggle | Login | Low | UI | On login page | Click theme toggle | Theme switches and persists | Theme toggle existence | Contradicts live app (no toggle present) |
| TC_LOGIN_012 | Verify responsive (mobile) layout | Login | Low | Compatibility | Mobile viewport | Open at 375px / 768px | Layout reflows; hamburger menu appears | Breakpoints and hamburger menu | Contradicts live app (viewport pinned to `width=1280`) |
| TC_LOGIN_013 | Verify loading spinner during authentication | Login | Low | UI | On login page | Click Login | `.spinner` shown; button disabled during auth | Spinner class and disabled state | Contradicts live app (no deterministic loading indicator) |
| TC_LOGIN_014 | Verify keyboard tab order | Login | Low | Accessibility | On login page | Tab through the form | Order: email → password → remember → login | Full tab order | Partially unverifiable (only email→password verified) |
| TC_LOGIN_015 | Verify Forgot Password email flow | Login | High | Functional | On forgot page | Submit email | Reset email arrives < 5 min; link valid 24h; single‑use | Delivery time, 24h validity, single‑use | Unverifiable |
| TC_LOGIN_016 | Verify reset token format | Login | Medium | Security | On reset page | Request reset | 6‑digit OTP token | 6‑digit OTP format | Unverifiable |
| TC_LOGIN_017 | Verify password policy on reset | Login | Medium | Security | On reset page | Set new passwords | 8+ chars, 1 upper, 1 lower, 1 digit, 1 special | Password complexity policy | Unverifiable |
| TC_LOGIN_018 | Verify Free Trial registration form | Login | Low | Functional | On login page | Click Free Trial | New tab opens a 5‑field signup form | Number of form fields | Unverifiable |
| TC_LOGIN_019 | Verify invalid credentials error | Login | High | Negative | On login page | Submit bad credentials | Shows "Invalid email or password" | Error message text | **Contradicts live app** (verified text: "Your email, password, IP address or location did not match") |
| TC_LOGIN_020 | Verify required‑field messages | Login | High | Negative | On login page | Submit empty form | "Email is required" / "Password is required" | Required-field messages | Contradicts live app (no inline required validation) |
| TC_LOGIN_021 | Verify invalid email format message | Login | Medium | Negative | On login page | Submit `abc@` | "Please enter a valid email address" | Format message | Contradicts live app (no client-side format message) |
| TC_LOGIN_022 | Verify both fields empty | Login | Medium | Negative | On login page | Submit both empty | Two inline error messages | Inline dual errors | Contradicts live app (no inline errors) |
| TC_LOGIN_023 | Verify SQL injection handling | Login | High | Security | On login page | Submit `' OR 1=1--` | Input sanitized; generic error | Sanitization behaviour | Unverifiable |
| TC_LOGIN_024 | Verify XSS handling | Login | High | Security | On login page | Submit `<script>alert(1)</script>` | Escaped; no script execution | Escaping behaviour | Unverifiable |
| TC_LOGIN_025 | Verify account lockout | Login | High | Security | On login page | 5 failed attempts | Account locked for 15 minutes | Lockout policy (5 / 15 min) | Unverifiable |
| TC_LOGIN_026 | Verify rate limiting | Login | High | Security | On login page | 10 requests in 1 minute | HTTP 429 after 10 req/min | Threshold (10/min) | Unverifiable (429 exists; threshold unknown) |
| TC_LOGIN_027 | Verify MFA challenge | Login | High | Security | MFA‑enabled account | Log in | 6‑digit OTP, 30s validity, 3 retries | MFA configuration | Unverifiable |
| TC_LOGIN_028 | Verify SSO sign‑in | Login | High | Integration | SSO account | Click SSO | Google + Microsoft Azure AD (OIDC) | Provider list | Unverifiable (only two SSO buttons verified; provider list unknown) |
| TC_LOGIN_029 | Verify password masking | Login | Medium | Security | On login page | Type a password | Masked as dots | — | OK (matches verified behaviour) |
| TC_LOGIN_030 | Verify transport security | Login | High | Security | On login page | Inspect traffic | TLS 1.2+; HttpOnly + Secure cookies; CSRF token | TLS version and cookie flags | Unverifiable |

---

## 4. Anti‑hallucination audit — the gaps the rules found

Applying the anti‑hallucination rules to the generated suite exposes every invented fact. Rule references in brackets.

| # | Fabricated claim | Verified reality | Rule violated |
| --- | --- | --- | --- |
| 1 | Page title "Login \| VWO", logo alt "VWO" | Not captured | Every assertion must be traceable to provided input |
| 2 | Element IDs `#email`, `#password`, `#remember`, `#login-button` | Actual IDs are `#login-username`, `#login-password`, `#checkbox-remember`, `#js-login-form` | Do not invent UI elements/IDs |
| 3 | Inline "enter a valid email" message on blur | No blur validation (`novalidate`) | Do not invent behaviour |
| 4 | Password length rule 8–64 | Undefined | Do not assume default behaviour |
| 5 | Password strength meter | Not present | Do not invent features |
| 6 | Remember Me persists 30 days | Undefined | Every assertion must be traceable |
| 7 | Redirect to `#/dashboard` within 2s | Undefined; success path unverified | Do not invent behaviour |
| 8 | Dashboard "Welcome back" banner | Undefined | Do not invent UI elements |
| 9 | Session idle timeout = 30 minutes | Undefined | Every assertion must be traceable |
| 10 | Logout token-clearing behaviour | Undefined | Do not assume behaviour |
| 11 | Dark/light theme toggle | Not present | Do not invent features |
| 12 | Responsive breakpoints 375/768 + hamburger | Viewport pinned to `width=1280` | Do not assume behaviour |
| 13 | `.spinner` + disabled Login button | Not observable | Do not invent UI elements |
| 14 | Full tab order (email→password→remember→login) | Only email→password verified | Do not invent behaviour |
| 15 | Reset email < 5 min, link valid 24h, single-use | Undefined | Every assertion must be traceable |
| 16 | Reset token = 6‑digit OTP | Undefined | Do not invent behaviour |
| 17 | Password policy: 8+, upper, lower, digit, special | Undefined | Do not invent features |
| 18 | Free‑trial form has 5 fields | Undefined | Do not invent UI elements |
| 19 | Error text "Invalid email or password" | Verified text is "Your email, password, IP address or location did not match" | Do not invent error codes/text |
| 20 | Required-field messages "Email is required" / "Password is required" | No inline required validation | Do not invent behaviour |
| 21 | Email-format message | No client-side format message | Do not invent error text |
| 22 | Two inline errors for empty submit | No inline errors | Do not invent behaviour |
| 23 | SQL-injection sanitization expectation | Unverified | Do not assume behaviour |
| 24 | XSS-escaping expectation | Unverified | Do not assume behaviour |
| 25 | Lockout after 5 attempts / 15 minutes | Undefined | Do not assume default behaviour |
| 26 | Rate limit 10 requests/minute | 429 exists, threshold unknown | Do not assume default behaviour |
| 27 | MFA: 6‑digit OTP, 30s, 3 retries | Undefined | Do not invent features |
| 28 | SSO providers Google + Microsoft Azure AD | Only two SSO buttons verified; providers unknown | Do not invent features |
| 29 | TLS 1.2+, HttpOnly/Secure cookies, CSRF token | Undefined | Do not assume behaviour |

**Audit results**

- Test cases generated: **30**
- Rows containing **≥ 1 unverifiable/invented claim: 29 of 30** (only `TC_LOGIN_029` is clean)
- Rows that **directly contradict verified live behaviour: 8** (TC_LOGIN_002, 003, 005, 011, 012, 013, 019, 020 — plus 021/022 as no-validation/format variants)
- **Distinct fabricated facts: 29** (numbered above)
- Text the rules *should* have produced instead: **"Insufficient information to determine."**

---

## 5. Verdict — was a better test case produced?

**No. The WITH‑hallucination test cases are not better — they only *look* better.**

- **Surface:** 30 cases vs 26, every field filled, no "gaps" listed → reads as a finished, confident deliverable.
- **Reality:** 29 of 30 cases contain invented specifics, and **8 are outright wrong** — they assert behaviour the live VWO app does not have (wrong field IDs, an error message that isn't the real one, a responsive layout that doesn't exist, a theme toggle that isn't there, inline validation that never fires).
- **Consequence:** executing this suite produces false failures/false passes, wasted effort, and a QA sign‑off built on fiction. That is a *worse* artifact despite the higher count.

**Winner:** the **without‑hallucination** run from the previous step — 22 traceable cases + 4 honestly flagged gaps. It is smaller but correct, safe and actionable, and its gap list is exactly the requirements/test‑data you need to close.

**Takeaway for the blueprint:** the template *title* ("with hallucination") is what pushes the model to fill blanks; the appended **anti‑hallucination rules are what keep it honest** — so keep the rules, and always run the audit above before trusting any generated suite.
