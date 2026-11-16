
# Functional Test Case Generation — Reusable QA Prompt Templates

 **Framework variants:** RICE-POT · CLEAR · CRISP · STAR  
**Usage:**  Replace all placeholders (for example `<url>`, `<requirements>`, and `<environment>`) with authorized project values. If information is missing, label it `Unknown` instead of assuming it. Never represent generated output as executed or verified without evidence.



**Goal:** Create detailed, traceable test cases without hallucinated expected results.

### 2A. RICE-POT Template

```text

R — Role:
Act as a senior functional QA engineer.

I — Instructions:
1. Review <requirements> and <acceptance_criteria> for <module> at <url>.
2. Design <test_count> scenarios across happy path, invalid input, boundary, error,
and relevant accessibility/integration behavior.
3. Separate documented behavior from suggested exploratory tests.
4. Add preconditions, data, precise steps, and verifiable expected results.
5. Identify blocked cases and open questions.

C — Context:
Environment: <environment>; test data constraints: <test_data>;
source materials: <requirements> and <acceptance_criteria>.

E — Example (structure only):
TC-<id> | <requirement_id> | <scenario> | <preconditions> | <steps> | <expected_result>

P — Parameters:
No invented error text, statuses, redirects, numeric thresholds, or features.
If expected behavior is missing, say "Insufficient information to determine."
Priorities are proposed based on business impact, not claimed product rules.

O — Output:
Markdown table: ID | Requirement Reference | Scenario | Type | Preconditions |
Test Data | Steps | Expected Result | Priority | Readiness.
Also list coverage gaps and questions.

T — Tonality:
Concise, technical, executable, and traceable.
```

### 2B. CLEAR Template

```text
C — Concise:
Create <test_count> requirement-based tests for <module> at <url>.

L — Logical:
Map each requirement in <requirements> to scenarios, data, steps, and expected results.

E — Explicit:
Cover valid, invalid, boundary, and relevant integration paths. Output ID, source,precondition, data, steps, expected result, priority, readiness.

A — Adaptive:
If <acceptance_criteria> lacks an expected result, flag Blocked/Unknown and ask what is missing.

R — Reflective:
Check for duplicate tests, untraceable assertions, made-up messages, and omitted boundaries.

Do not invent system behavior or claim any test was executed.
```

### 2C. CRISP Template

```text
C — Context: Application <url>, module <module>, inputs <requirements>,
<acceptance_criteria>, <test_data>.

R — Role: You are a functional test designer.

I — Instruction: Generate <test_count> prioritized positive, negative, edge,
and boundary tests aligned to the provided requirements.

S — Specificity: Every expected result needs a source. If it cannot be determined, write "Insufficient information to determine" and add a clarification question.
Do not assume exact UI messages or backend responses.

P — Presentation: Output a test case table with ID, scenario, source, preconditions, steps, test data, expected result, priority, and Ready/Blocked status.

```

### 2D. STAR Template

```text
S — Situation:
The feature <module> on <url> requires test coverage based on <requirements>.

T — Task:
Prepare <test_count> functional test cases for review and eventual execution.

A — Action:
Break down acceptance criteria; cover successful and unsuccessful paths; add
boundary tests; map every assertion to a provided requirement; mark missing rules.

R — Result:
Deliver a traceable Markdown test suite and an unresolved-requirements list.
Do not claim tests pass or fabricate expected outcomes not in the sources.
```