# Test Cases - <JIRA-KEY>: <JIRA Title>

> **Status:** DRAFT – Pending human review. Test cases are not approved until the QA owner signs off.

## 1. Test Case Details

| Field | Details |
|---|---|
| Test Case ID | TC_<MODULE>_001 |
| JIRA ID | <JIRA-KEY> |
| JIRA Title | <Title> |
| Module | <Module Name> |
| Test Scenario ID | TS-1 |
| Requirement / AC | <Acceptance Criteria Reference> |
| Priority | P0 / P1 / P2 / P3 |
| Test Type | Functional / UI / API / Integration / Regression |
| Test Category | Positive / Negative / Boundary |
| Execution Type | Manual / Automation |
| Automation Status | Not Automated / Automated / Candidate |
| Browser / Platform | Chrome / Firefox / Edge / Android / iOS |
| Test Environment | QA / UAT / Staging |

## 2. Preconditions

- User has a valid application URL.
- Required test data is available.
- User has the necessary permissions.
- Application is accessible and operational.
- Required APIs and dependent services are available.

## 3. Test Data

| Data Parameter | Test Data | Description |
|---|---|---|
| Username | <Test Username> | Valid / Invalid user |
| Password | <Test Password> | Valid / Invalid password |
| User Role | <Role> | Admin / User / Guest |
| API Payload | <Request Payload> | Valid / Invalid payload |
| Other Data | <Additional Data> | As per requirement |

## 4. Test Steps & Expected Results

| Step No. | Test Steps / Actions | Test Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| 1 | Navigate to application | Application URL | Application should load successfully | Pending | Not Run |
| 2 | Perform required action | Valid test data | System should process the action successfully | Pending | Not Run |
| 3 | Verify the result | N/A | Result should match the acceptance criteria | Pending | Not Run |

## 5. RICEPOT Coverage

| RICEPOT Parameter | Validation / Coverage |
|---|---|
| R – Requirements | Verify all functional and business requirements |
| I – Input | Validate valid, invalid, empty and special-character inputs |
| C – Conditions | Verify preconditions, business rules and dependencies |
| E – Exceptions | Verify error handling and negative scenarios |
| P – Permissions | Verify role-based access and authorization |
| O – Outputs | Verify UI messages, API responses and generated results |
| T – Transitions | Verify navigation, state changes and workflow transitions |

## 6. Expected Results & Validation

- Actual result matches expected result.
- Application behaves according to acceptance criteria.
- No unexpected errors or crashes.
- Data is correctly saved, updated or retrieved.
- Error messages are clear and appropriate.

## 7. Defect Details (If Applicable)

| Field | Details |
|---|---|
| Defect ID | <BUG-ID> |
| Defect Summary | <Issue Description> |
| Severity | Critical / High / Medium / Low |
| Priority | P0 / P1 / P2 / P3 |
| Evidence | Screenshot / Video / API Logs |
| Linked JIRA | <BUG-LINK> |

## 8. Execution Summary

| Field | Value |
|---|---|
| Execution Status | Pass / Fail / Blocked / Not Run |
| Executed By | <QA Name> |
| Execution Date | <DD-MM-YYYY> |
| Environment | <QA / UAT / Staging> |
| Automation Result | Pass / Fail / Not Automated |
| Comments | <Execution Notes> |

---

## HUMAN REVIEW GATE

- **Requirements covered:** <Yes / No / Partial>
- **Acceptance criteria mapped:** <Yes / No / Partial>
- **RICEPOT coverage reviewed:** <Yes / No>
- **Test data validated:** <Yes / No>
- **Missing scenarios:** <List gaps>
- **Open questions:** <List questions>
- **QA Owner Approval:** <Pending / Approved / Rejected>

> **Approval Rule:** Do not proceed with automation development until test cases have been reviewed and approved by the QA owner.