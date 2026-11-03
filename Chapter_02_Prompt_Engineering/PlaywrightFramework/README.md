# VWO Login Dashboard — Playwright + TypeScript Automation Framework

Enterprise-grade UI automation framework for the **VWO Login Dashboard** login
functionality, built with **Playwright Test** and **TypeScript** using the
**Page Object Model**, fixtures, structured exception handling and **Allure**
reporting.

- **Application under test:** https://app.wingify.com/#/login

---

## 1. Architecture

```
PlaywrightFramework/
├── src/
│   ├── config/
│   │   └── env.ts                 # Typed, validated environment configuration (.env)
│   ├── data/
│   │   └── loginData.ts           # Negative-path test data (never real credentials)
│   ├── fixtures/
│   │   └── test.fixtures.ts       # loginPage fixture + failure screenshot/console diagnostics
│   ├── pages/
│   │   └── LoginPage.ts           # Page Object (locators + reusable actions)
│   └── utils/
│       ├── errors.ts              # LoginPageError (typed, contextual errors)
│       └── logger.ts              # Structured logging
├── tests/
│   ├── login-valid.spec.ts        # Positive & UI scenarios
│   └── login-invalid.spec.ts      # Negative scenarios
├── playwright.config.ts           # Chromium / Firefox / WebKit + Allure reporter
├── tsconfig.json
├── .env.example
└── .gitignore
```

### Design principles

- **Page Object Model** — all login locators and interactions are encapsulated in
  `LoginPage`; assertions live only in the spec files.
- **Playwright fixtures** — `loginPage` is injected into every test; an auto
  fixture captures a full-page screenshot and browser console log on failure and
  attaches them to Allure.
- **Web-first assertions & auto-waiting** — `expect(locator).toBeVisible()`,
  `toHaveValue()`, `toBeFocused()`, `waitFor({ state })`. No `waitForTimeout`,
  no `Thread.sleep`, no fixed waits.
- **Structured exception handling** — every page action is wrapped in a
  `try/catch` that rethrows a typed `LoginPageError` preserving the original
  cause.
- **Locator strategy** — `getByRole()` first, then `getByLabel()` /
  `getByPlaceholder()` / `getByTestId()`, and **XPath only as a fallback** where
  no stable accessible locator exists. No CSS selectors are used.
- **Configuration** — base URL, credentials and timeouts come from environment
  variables; nothing sensitive is hard-coded.

---

## 2. Prerequisites

- Node.js 18+ (verified on Node 24)
- npm 9+

---

## 3. Setup

```bash
# 1. Install dependencies
npm install

# 2. Install the Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install

# 3. Create your environment file from the template
#    (Windows: copy / macOS-Linux: cp)
copy .env.example .env
```

Then edit `.env`:

```ini
BASE_URL=https://app.wingify.com/#/login
VALID_EMAIL=              # only if you have a verified test account
VALID_PASSWORD=           # only if you have a verified test account
HEADLESS=false
```

> Credentials are **never invented**. If `VALID_EMAIL` / `VALID_PASSWORD` are
> empty, the successful-login scenario is reported as *skipped* rather than
> faked.

---

## 4. Execution commands

| Purpose | Command |
| --- | --- |
| Install dependencies | `npm install` |
| Install Playwright browsers | `npx playwright install` |
| Run all tests (all browsers) | `npx playwright test` |
| Run only **valid** login tests | `npm run test:valid` |
| Run only **invalid** login tests | `npm run test:invalid` |
| Run in **headed** mode | `npx playwright test --headed` |
| Run in **debug** mode | `npx playwright test --debug` |
| Run a single browser | `npx playwright test --project=chromium` |
| Generate **Allure results** | *(produced automatically during every run → `./allure-results`)* |
| Generate the **Allure HTML report** | `npm run allure:generate` |
| Open the **Allure report** | `npm run allure:open` |
| Serve Allure from raw results | `npm run allure:serve` |
| Playwright HTML report | `npm run report` |
| Type-check the framework | `npm run typecheck` |

`npm run allure:generate` writes the HTML report to `./allure-report`, and
`npm run allure:open` launches it in your browser (requires a JRE — the Allure
CLI is bundled via `allure-commandline`).

---

## 5. Reporting

Every run drives three reporters simultaneously:

1. **list** — live console output.
2. **html** — the Playwright report (`playwright-report/`).
3. **json** — machine-readable results (`test-results/results.json`).
4. **allure-playwright** — raw Allure results (`allure-results/`), including test
   names, descriptions, severity, status, failure details, **screenshots on
   failure**, console logs and the recorded Playwright trace/video.

---

## 6. Test coverage

### Positive & UI (`tests/login-valid.spec.ts`)
Navigation & HTTPS, key element visibility, email field, password field &
masking, password visibility toggle, Remember Me behaviour, keyboard navigation,
Forgot Password navigation (and back), Free Trial link, field validation on blur,
and the successful-login / dashboard redirection scenario.

### Negative (`tests/login-invalid.spec.ts`)
Invalid email / invalid password / both invalid / empty email / empty password /
both empty, malformed email formats, the authentication error message, password
masking, and denial of dashboard access.

---

## 7. Verified behaviour & limitations

This framework was built against the **live** VWO login page. All locators and
assertions were verified against the real application; unverifiable PRD features
are explicitly skipped with the observed reason instead of asserting invented
behaviour.

- **Login endpoint:** `POST https://app.wingify.com/login`. Rejected credentials
  return **HTTP 401** and the application renders the notification
  *"Your email, password, IP address or location did not match"*.
- **Rate limiting (verified):** after repeated failed attempts the endpoint
  returns **HTTP 429**. The negative tests therefore accept **401 or 429** as a
  valid "rejected" outcome and only assert the error message on 401 — the
  429 path is recorded as an Allure attachment. (This is also why the suite
  should not be hammered against production.)
- **Success login:** skipped unless verified credentials are supplied — no
  credentials are fabricated.
- **Responsive layout:** skipped — the app pins its viewport to `width=1280`.
- **Light/Dark mode:** skipped — no theme toggle exists on the login page.
- **Loading state:** skipped — no deterministic loading indicator is exposed.
- **Locator note:** the login page keeps several views in the DOM at once
  (login, forgot-password, SSO), so the shared placeholders/labels are
  ambiguous; those fields use stable XPath ids. The free-trial link's accessible
  name is populated asynchronously by the app's translation layer, so it is
  located by its stable target URL.

---

## 8. Anti-hallucination guarantees

- The PRD was treated as the requirements source; the live page was inspected
  before any locator was written.
- No CSS selectors, no `force: true` clicks, no `page.evaluate()` in tests, no
  fixed sleeps.
- No credentials, UI elements, error codes or behaviours were invented; every
  assertion is traceable to verified application behaviour.
