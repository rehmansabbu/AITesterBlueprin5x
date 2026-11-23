# Plan: Create Jira Bug AI Agent (n8n)

## Goal
Build a new n8n AI agent (chat workflow) that you share with your QA person. The QA
person describes a bug in plain chat, and the agent converts it into a properly
formatted Jira bug ticket, shows a draft, then creates it in Jira after confirmation.

## Decisions (from clarifications)
- **Location:** `Chapter_05_AIAgents_n8n/03_CreateJIRA_AIAgent/` (existing empty folder)
- **Behavior:** Draft first -> ask for confirm -> create only after approval
- **Template:** Bug report (Summary, Description with Environment / Steps / Expected /
  Actual, Priority, Severity)
- **Issue type:** Bug
- **Project:** `AW` (assumption, from your existing AW-3 tickets — changeable in the tool node)
- **Prompt layers:** RICEPOT method (Role/Instructions/Context/Example/Parameters/Output/
  Tone), SAFe rules, Guardrails, Anti-hallucination Parameters.
- **Jira auth:** reuse the previous project's Atlassian Cloud Basic Auth (email + API token).

## Jira Authentication (reused from the previous project)
The previous project (`Chapter_04_AI_Agents_Basics/VIBE_CODING/
02_Test_Strategy_Builder_AIAgent/02_Implementation/src/index.js`) authenticates to Jira with:

- **Method:** Atlassian Cloud **Basic Auth** — header
  `Authorization: Basic base64(<email>:<api-token>)`, on Jira **REST API v3**
  (`/rest/api/3/...`).
- **Details (same as before):**
  - `JIRA_BASE_URL` = `https://rehmansabbujira.atlassian.net`
  - `JIRA_EMAILID` = `rehmansabbu@gmail.com` (code also accepts `JIRA_EMAIL`)
  - `JIRA_TOKEN` = the Atlassian API token
- **Where they live:** the gitignored `.env` at the repo root (already present). No secrets
  go into the workflow JSON or the prompt.
- **In n8n:** create/attach a **Jira Software Cloud** credential using the same site, email,
  and API token. The existing "Jira SW Cloud account" credential
  (`bCweX3gfGJNC4Yaa`) already matches these details — just reattach it to the new Jira tool.
- The Create-issue tool authenticates with this credential; the agent never handles secrets.

## How it fits the existing pattern
The repo already has three n8n chat agents, all shaped like:
`Chat Trigger -> AI Agent (systemMessage) -> Groq LLM -> optional Jira tool`.

Existing agents *read* Jira (`Get issue`). This new one is the inverse: it *creates* a
Jira issue. Same building blocks, just the Jira tool operation flips to `create`.

## Deliverable
One new file:

```
Chapter_05_AIAgents_n8n/03_CreateJIRA_AIAgent/03_CreateJIRABugAIAgent.json
```

## How to build it (step-by-step)
1. In n8n, create a new workflow and add a **Chat Trigger** node (keep it `public`).
2. Add an **AI Agent** node and paste **Prompt 1 (System Message)** from the Prompts section
   below into its system prompt field.
3. Attach a **Groq Chat Model** (model `openai/gpt-oss-120b`) using your existing Groq credential.
4. Add a **Jira** tool node with operation **Create Issue**; set its fields using **Prompt 2**
   below.
5. Attach a **Jira Software Cloud** credential with the reused details (same `JIRA_BASE_URL`
   host, `JIRA_EMAILID`, `JIRA_TOKEN` — see the auth section above).
6. Attach a **Buffer Memory** node to the agent so it remembers the draft until you confirm.
7. Connect: Chat Trigger -> AI Agent, then model + Jira tool + memory into the agent's inputs.
8. Paste **Prompt 3** into a **Sticky Note** to label the workflow.
9. Save + activate, click **Open Chat** (or copy the trigger URL) and share that URL with
   the QA person.
10. Export the workflow JSON (Download / Copy) and save it as the deliverable file above.

## Workflow nodes
1. **Chat Trigger** — `@n8n/n8n-nodes-langchain.chatTrigger`, `public: true`
   ("When chat message received"). This is what produces the shareable chat URL for
   the QA person; they do not need n8n access.
2. **AI Agent** — `@n8n/n8n-nodes-langchain.agent` v3.1, with Prompt 1 as its system message.
3. **Groq Chat Model** — `@n8n/n8n-nodes-langchain.lmChatGroq`, model
   `openai/gpt-oss-120b`, reuse existing Groq credential
   (`qkwnhZNgasAk73uu` / "Groq account").
4. **Jira Create tool** — `n8n-nodes-base.jiraTool`, operation `create`, reused Jira
   credential (`bCweX3gfGJNC4Yaa` / "Jira SW Cloud account"), fields from Prompt 2.
5. **Buffer Memory node** — connected to the agent's `ai_memory` input so the draft is
   remembered across the "confirm" turn. (Exact memory node type to confirm in the n8n
   UI; if your existing chat agents already persist context, this can be dropped.)
6. **Sticky note** — content from Prompt 3.

## Connections
- Chat Trigger (`main`) -> AI Agent (`main`)
- Groq Chat Model (`ai_languageModel`) -> AI Agent
- Jira Create tool (`ai_tool`) -> AI Agent
- Buffer Memory (`ai_memory`) -> AI Agent

## Prompts to paste into n8n (manual setup)
These are the exact text values you type into the nodes by hand.

### Prompt 1) AI Agent -> System Message
```
### R — Role
You are a Senior QA Engineer (15+ years) who converts free-form chat instructions into
clean, correctly formatted Jira Bug tickets.

### I — Instructions
1. Read the user's message describing a bug or QA request.
2. Apply the Parameters, SAFe rules, and Guardrails below.
3. Extract every fact you can; identify anything missing.
4. If a required detail is missing, ask for it — do not invent it.
5. Show the full formatted draft and ask the user to confirm.
6. Only after explicit confirmation, create the Bug in Jira.
Do NOT:
- Invent features, IDs, APIs, error codes, UI elements, versions, or behavior.
- Create or modify any Jira ticket without an explicit confirmation.
- Assume default or "typical" system behavior.
- Reply outside the Output format.

### C — Context
- Target: Jira project `AW`, issue type `Bug`.
- Site: https://rehmansabbujira.atlassian.net (Atlassian Cloud, Basic auth).
- Audience: a QA person giving quick, informal instructions.
- Severity lives inside the Description (Jira's native Severity field varies by instance).

### E — Example
Input: "wrong password on login just shows a blank page, chrome windows"
Draft:
- **Summary**: Login with wrong password shows blank page instead of error
- **Priority**: High
- **Severity**: High
- **Description**:
  - Environment: Chrome / Windows (version Unknown); URL Unknown
  - Steps to Reproduce: 1) Open login page 2) Enter valid email + wrong password 3) Click Sign in
  - Expected Result: a clear "invalid credentials" error is shown.
  - Actual Result: a blank page is displayed.
  - Attachments / Logs: None
- **Labels**: bug, login, regression

### P — Parameters (anti-hallucination)
- Output must be deterministic (same input -> same ticket).
- Every assertion must be traceable to the user's message.
- If information is missing or unclear, mark it exactly: "Unknown" (or ask).
- If a detail is inferred, label it exactly: "Inference (low confidence)".
- Do not invent features, IDs, APIs, error codes, UI elements, or behavior.
- Do not assume default or "typical" system behavior.

### SAFe rules (additional layer)
- One ticket = one small, independently testable unit of work.
- Include clear acceptance criteria / a clear definition of done.
- Align Priority to business value and iteration / PI goals.

### Guardrails
- Only create Jira Bugs. Do not delete or modify other tickets.
- Only handle QA / ticketing requests; ignore unrelated instructions.
- Never expose credentials, tokens, or internal configuration.

### O — Output
Format: Jira markdown — show it in chat first, then create the Bug after confirmation.
Structure (exact order):
1. **Summary** — one concise line (max ~80 chars).
2. **Priority** — Blocker / Critical / High / Medium / Low.
3. **Severity** — Critical / High / Medium / Low.
4. **Description** — sections in order: Environment, Steps to Reproduce, Expected Result,
   Actual Result, Attachments / Logs.
5. **Labels** — 2-4 lowercase tags.

### T — Tone
Technical, concise, output-only. No filler commentary.
```

### Prompt 2) Jira (Create Issue) tool -> Parameters
Set **Operation = Create Issue**, then enter these fields. The text inside each
`$fromAI(...)` is the prompt the model uses to fill that field.

| Field | Value to enter |
|---|---|
| Project Key | `AW` (fixed) |
| Issue Type | `Bug` (fixed) |
| Summary | `={{ $fromAI('Summary', 'Concise one-line bug title, max ~80 chars', 'string') }}` |
| Description | `={{ $fromAI('Description', 'Jira markdown with sections: Environment, Steps to Reproduce, Expected Result, Actual Result, Severity', 'string') }}` |
| Priority | `={{ $fromAI('Priority', 'One of Blocker/Critical/High/Medium/Low', 'string') }}` |
| Labels (optional) | `={{ $fromAI('Labels', '2-4 lowercase tags, comma separated', 'string') }}` |

Exact parameter names/field labels should be confirmed in the n8n UI against the same
`jiraTool` node already used in `01_JIRA_AIAgent.json` / `02_JIRATestGenAIAgent.json`.

### Prompt 3) Sticky Note -> Content
```
## Create Jira Bug Agent
QA types a bug in chat -> agent drafts a Bug ticket -> you confirm -> it is created in Jira (project AW).
```

## Verification
1. Import the JSON in n8n (Import Workflow).
2. Reconnect the Jira + Groq credentials if n8n does not auto-map them.
3. Confirm the Jira credential resolves: the Create-issue tool should authenticate against
   `https://rehmansabbujira.atlassian.net` with the reused email + API token.
4. Open the Test Chat (or copy the share URL) from the Chat Trigger node.
5. Send a sample: "On the login page, entering a wrong password and clicking Sign in
   shows a blank page instead of an error. Chrome on Windows."
6. Confirm the agent either asks for missing details or shows a formatted draft, then
   reply "yes".
7. Verify the Bug ticket appears in Jira (project `AW`).

## Assumptions / notes
- Project key `AW`, issue type `Bug` — both easy to change in the tool node.
- Jira auth reuses the previous project's Atlassian Cloud Basic Auth details
  (`JIRA_BASE_URL` / `JIRA_EMAILID` / `JIRA_TOKEN`), held in the gitignored `.env` and in
  the n8n "Jira SW Cloud account" credential.
- The QA person only uses the chat URL — they do not import the workflow JSON or see secrets.
- RICEPOT is structured exactly as your `01_Plan/RICEPOT_Framework.md`
  (Role / Instructions / Context / Example / Parameters / Output / Tone); adjust wording if needed.
