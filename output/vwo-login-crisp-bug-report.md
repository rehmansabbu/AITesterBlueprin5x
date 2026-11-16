# Bug Report — VWO Login

> **Hypothetical training example.** This is a hypothetical defect, not a confirmed issue in VWO. It is written for training and review only.

| Field | Value |
| --- | --- |
| **Report type** | Bug report (CRISP prompt output) |
| **Source prompt** | `Chapter_03_Prompt_Engineering_QA/CRISP.md` |
| **Application under test** | https://app.vwo.com/ (login page) |
| **Date** | 15 November 2026 |
| **Severity** | Provisional — High (to be confirmed by triage) |

---

## 1. Title

Login form submits with an empty password and shows no visible validation feedback.

## 2. Environment

| Item | Value |
| --- | --- |
| Application URL | https://app.vwo.com/ |
| Browser / version | Not supplied. |
| Operating system | Not supplied. |
| Build | Not supplied. |
| Execution time | Not supplied. |

## 3. Preconditions

- The user is logged out.
- A registered test account is available.

## 4. Test Data

| Field | Value |
| --- | --- |
| Email | `<registered_test_email>` |
| Password | (left empty) |

## 5. Steps to Reproduce

1. Open https://app.vwo.com/.
2. Confirm the user is logged out.
3. Enter the registered test email (`<registered_test_email>`) in the Email field.
4. Leave the Password field empty.
5. Submit the login form.

## 6. Expected Result

Login is blocked because the password is mandatory (requirement: "Email and password are mandatory."), and visible feedback tells the user the password is required. The exact validation message is not supplied and must not be assumed.

## 7. Actual Result

The form submits, but no visible validation feedback appears. This was observed on 3 of 3 attempts. The server-side outcome is unconfirmed: it is not known whether a request was sent or whether authentication was attempted. Any statement about server-side behaviour is an assumption, not an observation.

## 8. Reproducibility

3 out of 3 attempts (100%).

## 9. Suggested Severity and Rationale

**Provisional — High.**

Rationale: the login form accepts submission with a blank mandatory field and shows no validation feedback, which violates the stated mandatory-password requirement and weakens client-side input validation. Severity is provisional because the impact is bounded by whether the server also rejects the blank-password login, which is unverified. Final severity is to be assigned by the triage owner.

## 10. Attachments

Not provided. (Screenshots, video, and logs: Not supplied.)

---

## Notes — observed vs. assumed

| Kind | Detail |
| --- | --- |
| **Observed** | The form submits and no visible validation feedback appears. |
| **Assumed / unknown** | Whether a network request is sent, whether authentication is attempted, and any server-side error. Not supplied. |
