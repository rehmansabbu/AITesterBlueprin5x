# API Test Design and Validation — Reusable QA Prompt Templates

**Framework variants:** RICE-POT · CLEAR · CRISP · STAR  
**Usage:** Replace all placeholders (for example `<url>`, `<requirements>`, and `<environment>`) with authorized project values. If information is missing, label it `Unknown` instead of assuming it. Never represent generated output as executed or verified without evidence.

---

**Goal:** Design an API validation matrix and optional automation examples grounded in the supplied contract rather than assumed status codes.

### 5A. RICE-POT Template

```text
R — Role:
Act as an API testing engineer with expertise in contract and functional validation.

I — Instructions:
1. Read <api_spec> and the relevant endpoint contract.
2. Identify documented method, inputs, authentication, schema, and response rules.
3. Draft positive, negative, boundary, auth, and contract tests.
4. Add assertions for only documented status codes, fields, types, and headers.
5. List missing contract details and, if requested, propose <api_framework> examples.

C — Context:
API base URL: <url>; endpoint: <endpoint>; method: <http_method>;
environment: <environment>; spec: <api_spec>;
request schema: <request_schema>; response schema: <response_schema>;
auth: <auth_scheme>.

E — Example (format only):
API-TC-<id> | <method> | <path> | <test_condition> | <documented_expectation>

P — Parameters:
Do not guess status codes, response fields, tokens, rate limits, or server behavior.
Use synthetic/test data only. Never send live requests without authorization.
If a contract value is missing, mark it Unknown and ask a clarification question.

O — Output:
API test matrix: ID | Requirement | Method/Path | Setup | Request Variation |
Expected Status | Expected Body/Headers | Assertion | Priority | Readiness.
Then list information gaps and optional code outline for <api_framework>.

T — Tonality:
Clear, precise, and implementation-neutral unless a framework is supplied.
```

### 5B. CLEAR Template

```text
C — Concise:
Design API tests for <http_method> <endpoint> under <url> using <api_spec>.

L — Logical:
Extract contract rules, enumerate request partitions, and assign verifiable assertions.

E — Explicit:
Include success, invalid input, authentication/authorization, boundaries, and response schema checks where documented. Output IDs, request variations, expected results, priority.

A — Adaptive:
If status codes, error models, or auth scopes are not specified, mark Unknown instead of guessing and identify the exact missing contract field.

R — Reflective: Check test independence, schema coverage, absence of real secrets, and traceability.

Do not claim the endpoints were called or tests executed.
```

### 5C. CRISP Template

```text
C — Context: Base <url>; endpoint <endpoint>; method <http_method>;
contract <api_spec>; environment <environment>; auth <auth_scheme>.

R — Role: Act as an API QA analyst.

I — Instruction: Produce contract-based positive, negative, boundary, auth, and
response-validation tests and optional <api_framework> assertion examples.

S — Specificity: Derive expectations strictly from <api_spec>, <request_schema>, and <response_schema>. Never invent codes, fields, policies, or credentials.

P — Presentation: Markdown test matrix with request, expected result, assertion,
source reference, priority, readiness, and a separate list of contract gaps.
```

### 5D. STAR Template

```text
S — Situation:
The team is validating <http_method> <endpoint> on <url> using <api_spec>.

T — Task:
Prepare an API test plan that checks correctness, validation, security boundaries, and contract conformance.

A — Action:
Extract documented schemas and authentication rules; identify representative request variations; define source-backed assertions; flag missing status/error contracts.

R — Result:
Return a traceable test matrix and open-question list, with optional <api_framework> examples only if requested. No fabricated responses and no claim of test execution.
```