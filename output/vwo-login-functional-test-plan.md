# VWO Login — Functional Test Plan

| Field | Value |
| --- | --- |
| **Test Plan ID** | TP-LOGIN-001 |
| **Title** | VWO Login — Functional Test Plan |
| **Version** | 1.0 (Draft for review) |
| **Application under test** | https://app.vwo.com/ (login page) |
| **Prepared by** | QA |
| **Date** | 15 November 2026 |
| **Basis** | STAR prompt — approved login requirements (see Section 1) |

> **Reading this plan.** It is generated strictly from the **five approved requirements** below. Anything the requirements do **not** state is marked **“Requires clarification”** and is never invented. Items whose value is proposed by QA (acceptable practice, but not yet approved) are labelled **(Recommendation)**. No password rules, error strings (other than the one supplied), dashboard routes, or session timeouts have been assumed.

---

## 1. Approved requirements (test basis)

| Ref | Requirement |
| --- | --- |
| **R1** | Registered users can log in with valid credentials. |
| **R2** | Invalid credentials must not grant access. |
| **R3** | Email and password are mandatory. |
| **R4** | Successful login opens the authenticated dashboard. |
| **R5** | Invalid login gives the error message: **“Your email, password, IP address or location did not match”**. |

No other behaviour (password rules, session timeout, validation-message wording for empty fields, dashboard URL/title, lockout, MFA, SSO) is specified. Any such behaviour is flagged **Requires clarification**.

---

## 2. Objective

Verify that the login page at https://app.vwo.com/ satisfies the five approved requirements: that a registered user with valid credentials can sign in, that invalid credentials never grant access (and show the specified error message), that email and password are mandatory, and that a successful login opens the authenticated dashboard.

---

## 3. Scope

### 3.1 In scope

- Login with valid credentials → authenticated dashboard (**R1**, **R4**).
- Login with invalid credentials → access denied + specified error message (**R2**, **R5**).
- Mandatory-field enforcement for email and password (**R3**).
- The dashboard being reachable *only after* a successful login (**R4**).

### 3.2 Out of scope

Not covered by the approved requirements; excluded from this plan:

- Registration / sign-up flows.
- Forgot-password / reset-password flows.
- SSO, social login, and multi-factor authentication.
- Password policy construction (length, complexity, expiry).
- Post-login dashboard functionality beyond “the dashboard opens”.
- Performance / load, and formal security penetration testing.
- Accessibility and cross-browser *certification* beyond basic smoke checks. **Requires clarification** whether these are in scope.

---

## 4. Test approach

| Aspect | Approach |
| --- | --- |
| **Method** | Manual, black-box, requirement-based functional testing. |
| **Design techniques** | Positive testing (happy path), negative testing (rejection), and boundary testing — applied **only where the requirements support it**. |
| **Traceability** | Every test case maps to at least one requirement R1–R5 (Section 5.3). |
| **Priority** | Cases tied to an explicit requirement are **High**; exploratory/boundary probes are **Medium/Low**. |
| **Data handling** | No production credentials are used; test accounts must be provisioned (see Section 6). |
| **Evidence** | Screenshot / screen recording per executed case; actual vs expected captured in the test log. |
| **Handling unknowns** | Any behaviour not stated in R1–R5 is reported as **Requires clarification**; it is not asserted as a pass/fail. |

### 4.1 Defect reporting procedure **(Recommendation)**

1. Raise a defect in the test-management tool with: Test Plan ID `TP-LOGIN-001`, case ID, requirement ref, environment, steps, expected vs actual, evidence, severity.
2. Severity: **Critical** = access granted to invalid credentials, or valid credentials blocked (**R1/R2**); **Major** = wrong/absent error message (**R5**), dashboard not opened after success (**R4**), mandatory-field check bypassed (**R3**); **Minor** = cosmetic.
3. Link each defect to the requirement it violates and to its test case.

### 4.2 Test schedule **(Recommendation)**

| Phase | Activity |
| --- | --- |
| Planning | Approve this plan; clarify open questions (Section 9). |
| Preparation | Provision test accounts and confirm environment. |
| Execution | Run Section 5 scenarios; log results. |
| Closure | Report results; close defects; sign-off. |

Exact dates depend on environment and test-account availability. **Requires clarification.**

### 4.3 Tools **(Recommendation)**

- Modern browser with developer tools (DevTools) for DOM/network inspection.
- Screenshot / screen-recording utility for evidence.
- A test-management tool or spreadsheet for the execution log.
- No automation tool has been selected; the plan is manual. **Requires clarification** whether automation is required.

---

## 5. Test scenarios

Only R1–R5 are asserted. Where a requirement is silent, the expected result is **“Requires clarification”**.

### 5.1 Requirement-backed scenarios

| ID | Scenario | Type | Req | Preconditions | Steps | Expected result | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LOGIN-TC-01 | Login with valid credentials | Positive | R1, R4 | A registered account with valid email/password; login page loaded | Enter valid email and valid password; click **Login** | Login succeeds and the authenticated dashboard opens | High |
| LOGIN-TC-02 | Invalid password is denied | Negative | R2, R5 | Registered email; wrong password | Enter registered email + wrong password; submit | Access denied; error message **“Your email, password, IP address or location did not match”** shown; no dashboard | High |
| LOGIN-TC-03 | Unregistered email is denied | Negative | R2, R5 | An email that is not registered | Enter unregistered email + any password; submit | Access denied; error message shown; no dashboard | High |
| LOGIN-TC-04 | Both email and password empty | Negative | R3 | Login page loaded | Submit with both fields empty | Login is blocked (mandatory fields); exact message/wording **Requires clarification** | High |
| LOGIN-TC-05 | Email empty, password filled | Negative | R3 | Login page loaded | Leave email empty; enter a password; submit | Login is blocked; exact message/wording **Requires clarification** | High |
| LOGIN-TC-06 | Password empty, email filled | Negative | R3 | Login page loaded | Enter a valid email; leave password empty; submit | Login is blocked; exact message/wording **Requires clarification** | High |
| LOGIN-TC-07 | Malformed email format | Negative | R2 | Login page loaded | Enter malformed email (e.g. `abc@`) + any password; submit | Access denied; block/no-block and message wording **Requires clarification** | Medium |
| LOGIN-TC-08 | Dashboard not reachable without logging in | Negative | R4 | No active session | Attempt to open the authenticated dashboard URL directly | Access is prevented / redirected to login; redirect behaviour **Requires clarification** | High |
| LOGIN-TC-09 | Dashboard reached only after success | Positive | R4 | Valid registered account | Complete LOGIN-TC-01; observe landing page | Authenticated dashboard is shown after success | High |

### 5.2 Boundary / exploratory probes

| ID | Probe | Type | Req | Expected result | Priority |
| --- | --- | --- | --- | --- | --- |
| LOGIN-TC-10 | Email case sensitivity (e.g. `User@x.com` vs `user@x.com`) | Boundary | R1 | **Requires clarification** whether email is case-insensitive | Medium |
| LOGIN-TC-11 | Leading/trailing spaces in email or password | Boundary | R1, R3 | **Requires clarification** whether values are trimmed | Low |
| LOGIN-TC-12 | Whitespace-only inputs treated as empty | Boundary | R3 | **Requires clarification** | Low |
| LOGIN-TC-13 | Maximum-length email / password | Boundary | R1, R3 | **Requires clarification** (no length rules supplied) | Low |
| LOGIN-TC-14 | Repeated failed attempts (lockout/rate-limit) | Negative | R2 | **Requires clarification** — no lockout/timeout policy supplied | Low |

### 5.3 Requirements traceability matrix

| Requirement | Test cases |
| --- | --- |
| R1 — Valid credentials log in | LOGIN-TC-01, LOGIN-TC-10, LOGIN-TC-11, LOGIN-TC-13 |
| R2 — Invalid credentials denied | LOGIN-TC-02, LOGIN-TC-03, LOGIN-TC-07, LOGIN-TC-14 |
| R3 — Email & password mandatory | LOGIN-TC-04, LOGIN-TC-05, LOGIN-TC-06, LOGIN-TC-12, LOGIN-TC-13 |
| R4 — Dashboard opens on success | LOGIN-TC-01, LOGIN-TC-08, LOGIN-TC-09 |
| R5 — Specified error message | LOGIN-TC-02, LOGIN-TC-03 |

---

## 6. Environment and test data

### 6.1 Environment

| Item | Value |
| --- | --- |
| **Application URL** | https://app.vwo.com/ |
| **Browser** | Latest Chrome, Firefox, Edge **(Recommendation)** |
| **OS** | Windows / macOS **(Recommendation)** |
| **Test type** | Manual functional |
| **Network** | Standard internet access |

Any required staging URL, browser matrix, or device coverage is **Requires clarification**.

### 6.2 Test data

| Data set | Description | Availability |
| --- | --- | --- |
| Valid credentials | Email + password for a **registered** account | **Requires clarification** — accounts must be provisioned by the product owner |
| Invalid password | Registered email + incorrect password | Derived from the valid account |
| Unregistered email | Syntactically valid but not registered | Derived / disposable |
| Empty inputs | Blank email and/or password | Available |
| Boundary inputs | Case variants, whitespace, over-length strings | Available |

> No real user data is used. Valid test credentials are not supplied with the requirements and must be provided before execution begins.

---

## 7. Entry and exit criteria

### 7.1 Entry criteria

- Approved requirements R1–R5 are frozen.
- Login page is deployed and reachable at https://app.vwo.com/.
- A valid registered test account is provisioned.
- This test plan is reviewed/approved.

### 7.2 Exit criteria **(Recommendation)**

- All **High**-priority cases (LOGIN-TC-01 to LOGIN-TC-09) executed.
- All High-priority cases pass, or failures are logged as defects with workarounds.
- No open **Critical** or **Major** defects.
- Traceability matrix complete; results reported and signed off.

---

## 8. Deliverables

| Deliverable | Format |
| --- | --- |
| This test plan (`TP-LOGIN-001`) | Markdown / Word |
| Test execution log (results per case) | Spreadsheet / tool export |
| Defect reports | Test-management tool |
| Requirements traceability matrix (Section 5.3) | In this plan |
| Test summary report | Markdown / Word |

---

## 9. Risks and open questions

### 9.1 Risks **(Recommendation)**

| # | Risk | Impact | Mitigation |
| --- | --- | --- | --- |
| 1 | No registered test account available | Blocks valid-login and dashboard cases | Product owner provisions credentials before execution |
| 2 | Unspecified validation/lockout behaviour | Testers may mis-judge pass/fail | Mark “Requires clarification”; don’t assert invented behaviour |
| 3 | Environment/browser changes | Inconsistent results | Freeze environment; note versions per run |
| 4 | Error message may vary by account/IP/location | False failures | Compare against **R5** text exactly; record actual text |

### 9.2 Open questions (all “Requires clarification”)

1. What are the exact messages/UX for empty mandatory fields (R3)? Is validation inline, on submit, or both?
2. Is email comparison case-insensitive, and are inputs trimmed of surrounding whitespace?
3. Are there password rules (length, complexity)? Where are they enforced?
4. What is the authenticated dashboard URL/title, and what confirms a successful landing?
5. Is there a lockout / rate-limit / session-timeout policy after failed attempts?
6. Is a valid registered test account available, and can it be safely reset between runs?
7. Is automation or accessibility/cross-browser coverage required for sign-off?

---

## 10. Approvals

| Role | Name | Signature | Date |
| --- | --- | --- | --- |
| QA Lead | | | |
| Product Owner | | | |
| Engineering Lead | | | |

---

## Appendix A — Mapping to `template.md` table of contents

| `template.md` section | Where covered here |
| --- | --- |
| Test Plan | Header table + Section 1 |
| Objective | Section 2 |
| Scope / Inclusions | Section 3 |
| Test Environments | Section 6.1 |
| Defect Reporting Procedure | Section 4.1 |
| Test Strategy | Section 4 |
| Test Schedule | Section 4.2 |
| Test Deliverables | Section 8 |
| Entry and Exit Criteria | Section 7 |
| Test Execution / Closure | Sections 4–7 |
| Tools | Section 4.3 |
| Risks and Mitigations | Section 9 |
| Approvals | Section 10 |
