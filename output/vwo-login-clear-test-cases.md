# VWO Login — Functional Test Cases (CLEAR prompt output)

| Field | Value |
| --- | --- |
| **Prompt** | CLEAR (Context · Limits · Examples · Action · Review) |
| **Source prompt** | `Chapter_03_Prompt_Engineering_QA/CLEAR.md` |
| **Application under test** | https://app.vwo.com/ (login page) |
| **Date** | 15 November 2026 |
| **Test basis** | The four approved requirements supplied in the prompt (R1–R4) |
| **Total test cases** | 10 |
| **Execution status** | All cases: **Not Run** |

> **Reading this document.** It is generated strictly from the four approved requirements R1–R4 below. Anything the requirements do **not** state (exact validation wording, password policy, redirect behaviour, session handling) is marked **"Requires clarification"** and is never invented. Credentials are shown as **placeholders**; no real passwords appear anywhere.

---

## 1. The CLEAR prompt as executed

| Element | Content (as applied) |
| --- | --- |
| **C — Context** | Functional test cases are needed for https://app.vwo.com/. Approved requirements: valid registered credentials allow login; invalid credentials are rejected; email and password are mandatory; successful login opens the authenticated dashboard. |
| **L — Limits** | Exactly 10 test cases; only the supplied requirements; placeholders for credentials (no real passwords); no invented validation messages or password policies; status = "Not Run"; anything dependent on missing requirements = "Requires clarification". |
| **E — Examples** | Output follows the supplied example's field order (Test Case ID, Summary, Preconditions, Test Data, Steps, Expected Result, Priority, Test Type, Status), plus a **Requirement** column, presented as a Jira-style table. |
| **A — Action** | 10 distinct cases covering valid login, incorrect password, unregistered email, empty fields, and access control before and after login, with numbered steps and observable expected results. |
| **R — Review** | Every case traces to a requirement; cases are distinct; expected results are observable; no case is marked Passed/Failed without execution; unknown behaviour is clearly identified. |

---

## 2. Approved requirements (test basis)

| Ref | Requirement |
| --- | --- |
| **R1** | Valid registered credentials allow login. |
| **R2** | Invalid credentials are rejected. |
| **R3** | Email and password are mandatory. |
| **R4** | Successful login opens the authenticated dashboard. |

No other behaviour (exact validation-message wording, password policy, unauthenticated redirect behaviour, session/lockout handling) is specified. Any such behaviour is flagged **Requires clarification**.

---

## 3. Test cases

**Legend** — *Priority:* High/Medium · *Test Type:* Positive/Negative · *Status:* Not Run (nothing has been executed). Steps are numbered; `<br>` separates steps inside a cell.

| Test Case ID | Requirement | Summary | Preconditions | Test Data | Steps | Expected Result | Priority | Test Type | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| VWO-LOGIN-TC-001 | R1, R4 | Verify login with valid registered credentials opens the authenticated dashboard | An active registered test account exists; the user is logged out | `<registered_email>`, `<valid_password>` | 1. Open https://app.vwo.com/<br>2. Enter the registered email<br>3. Enter the valid password<br>4. Submit the login form | Login succeeds and the authenticated dashboard opens | High | Positive | Not Run |
| VWO-LOGIN-TC-002 | R2 | Verify login is rejected with a registered email and an incorrect password | An active registered test account exists; the user is logged out | `<registered_email>`, `<incorrect_password>` | 1. Open https://app.vwo.com/<br>2. Enter the registered email<br>3. Enter an incorrect password<br>4. Submit the login form | Login is rejected, no access is granted, and the authenticated dashboard does not open. Exact error-message wording: **Requires clarification** | High | Negative | Not Run |
| VWO-LOGIN-TC-003 | R2 | Verify login is rejected for an unregistered email | The user is logged out | `<unregistered_email>`, `<any_password>` | 1. Open https://app.vwo.com/<br>2. Enter an email that is not registered<br>3. Enter any password<br>4. Submit the login form | Login is rejected and no access is granted. Exact error-message wording: **Requires clarification** | High | Negative | Not Run |
| VWO-LOGIN-TC-004 | R3 | Verify login is blocked when both email and password are empty | The user is logged out | Both fields left empty | 1. Open https://app.vwo.com/<br>2. Leave the email field empty<br>3. Leave the password field empty<br>4. Submit the login form | Login is blocked because email and password are mandatory; no access is granted. Exact validation-message wording: **Requires clarification** | High | Negative | Not Run |
| VWO-LOGIN-TC-005 | R3 | Verify login is blocked when email is empty and password is filled | The user is logged out | Email empty, `<valid_password>` | 1. Open https://app.vwo.com/<br>2. Leave the email field empty<br>3. Enter a password<br>4. Submit the login form | Login is blocked because email is mandatory; no access is granted. Exact validation-message wording: **Requires clarification** | High | Negative | Not Run |
| VWO-LOGIN-TC-006 | R3 | Verify login is blocked when password is empty and email is filled | The user is logged out | `<registered_email>`, password empty | 1. Open https://app.vwo.com/<br>2. Enter the registered email<br>3. Leave the password field empty<br>4. Submit the login form | Login is blocked because password is mandatory; no access is granted. Exact validation-message wording: **Requires clarification** | High | Negative | Not Run |
| VWO-LOGIN-TC-007 | R4 | Verify the authenticated dashboard is not accessible before login | The user is logged out | None | 1. Confirm the user is logged out<br>2. Attempt to open the authenticated dashboard directly | The authenticated dashboard is not accessible before login. Behaviour on unauthenticated access (redirect, block, message): **Requires clarification** | High | Negative | Not Run |
| VWO-LOGIN-TC-008 | R4 | Verify the authenticated dashboard is accessible after a successful login | An active registered test account exists; the user is logged out | `<registered_email>`, `<valid_password>` | 1. Open https://app.vwo.com/<br>2. Log in with valid credentials<br>3. Observe the landing view<br>4. Open the authenticated dashboard | After a successful login the authenticated dashboard is reachable | High | Positive | Not Run |
| VWO-LOGIN-TC-009 | R2, R4 | Verify login is rejected when both email and password are invalid | The user is logged out | `<unregistered_email>`, `<incorrect_password>` | 1. Open https://app.vwo.com/<br>2. Enter an unregistered email<br>3. Enter an incorrect password<br>4. Submit the login form | Login is rejected, no access is granted, and the authenticated dashboard does not open. Exact error-message wording: **Requires clarification** | High | Negative | Not Run |
| VWO-LOGIN-TC-010 | R2, R4 | Verify a failed login attempt does not grant dashboard access | The user is logged out | `<registered_email>`, `<incorrect_password>` | 1. Open https://app.vwo.com/<br>2. Enter the registered email<br>3. Enter an incorrect password<br>4. Submit the login form<br>5. Attempt to open the authenticated dashboard | After the failed attempt the user is not authenticated and the authenticated dashboard is not accessible | High | Negative | Not Run |

**Totals:** 10 test cases — 2 Positive, 8 Negative. None executed (Status = Not Run).

---

## 4. Requirements traceability matrix

| Requirement | Test cases |
| --- | --- |
| **R1** — Valid registered credentials allow login | VWO-LOGIN-TC-001 |
| **R2** — Invalid credentials are rejected | VWO-LOGIN-TC-002, VWO-LOGIN-TC-003, VWO-LOGIN-TC-009, VWO-LOGIN-TC-010 |
| **R3** — Email and password are mandatory | VWO-LOGIN-TC-004, VWO-LOGIN-TC-005, VWO-LOGIN-TC-006 |
| **R4** — Successful login opens the authenticated dashboard | VWO-LOGIN-TC-001, VWO-LOGIN-TC-007, VWO-LOGIN-TC-008, VWO-LOGIN-TC-009, VWO-LOGIN-TC-010 |

---

## 5. Review checklist (CLEAR — R)

| Check | Result |
| --- | --- |
| Every test case traces to a supplied requirement | Yes — see Section 4 |
| Test cases are distinct | Yes — each uses different data/steps and asserts a different behaviour |
| Expected results describe observable behaviour | Yes — login accepted/rejected, dashboard opens/does not open |
| No test marked Passed or Failed without execution | Yes — every case is "Not Run" |
| Unknown behaviour clearly identified | Yes — marked "Requires clarification" |
| Credentials use placeholders only (no real passwords) | Yes — `<registered_email>`, `<valid_password>`, `<incorrect_password>`, `<unregistered_email>`, `<any_password>` |
| No invented validation messages or password policies | Yes |

---

## 6. Open items (all "Requires clarification")

1. Exact wording/UX for missing mandatory fields (R3) — inline, on submit, or both.
2. Exact error message for rejected credentials (R2) — wording not supplied.
3. Behaviour when opening the authenticated dashboard without a session (R4) — redirect, block, or message.
4. Whether a valid registered test account can be provisioned and safely reset between runs.

---

> **Jira import note.** This is a Jira-style table. Exact import compatibility depends on the Jira project and test-management app's field mapping.
