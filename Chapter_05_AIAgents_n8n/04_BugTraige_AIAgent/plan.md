# Plan: Bug Triage AI Agent (n8n)

## Goal
Build an n8n chat AI agent you share with your QA person. The agent **fetches a Jira ticket**
by key, then lets the user **triage** it: it can **update the Summary and Description**, set
**Priority** (native field) plus **Severity** and **Risk** (as labels), and **add a comment**.
Changes are drafted and shown first, and applied to Jira only after confirmation.

## Decisions (from clarifications)
- **Location:** `Chapter_05_AIAgents_n8n/04_BugTraige_AIAgent/` (existing empty folder)
- **Behavior:** Draft -> ask for confirm -> apply only after approval
- **Actions:** Fetch issue (Get) · Update Summary/Description/Priority/Labels · Add comment
- **Severity & Risk:** stored as **labels** — `severity-<level>` and `risk-<level>`
  (levels: Critical / High / Medium / Low)
- **Priority:** native Jira field
- **Prompt layers:** RICEPOT method (Role/Instructions/Context/Example/Parameters/Output/
  Tone), SAFe rules, Guardrails, Anti-hallucination Parameters
- **Jira auth:** reuse the previous project's Atlassian Cloud Basic Auth (email + API token)

## Jira Authentication (reused from the previous project)
Same as `03_CreateJIRA_AIAgent/plan.md`:
- **Method:** Atlassian Cloud **Basic Auth** — `Authorization: Basic base64(<email>:<api-token>)`,
  Jira **REST API v3**.
- **Details:** `JIRA_BASE_URL` = `https://rehmansabbujira.atlassian.net`,
  `JIRA_EMAILID` = `rehmansabbu@gmail.com`, `JIRA_TOKEN` = the Atlassian API token.
- **In n8n:** reuse the **Jira Software Cloud** credential
  (`bCweX3gfGJNC4Yaa` / "Jira SW Cloud account") on all three Jira tool nodes. No secrets in
  the workflow JSON or prompt.

## How it fits the existing pattern
`Chat Trigger -> AI Agent (systemMessage) -> Groq LLM -> Jira tool(s)`.
The 01/02 agents **read** Jira (`Get issue`), the 03 agent **creates** an issue. This one
**gets + updates + comments**, so it attaches three Jira tool nodes to the same AI Agent.

## Deliverables
Two new files:

```
Chapter_05_AIAgents_n8n/04_BugTraige_AIAgent/04_BugTraigeAIAgent.json
Chapter_05_AIAgents_n8n/04_BugTraige_AIAgent/plan.md
```

## How to build it (step-by-step)
1. In n8n, create a new workflow and add a **Chat Trigger** node (keep it `public`).
2. Add an **AI Agent** node and paste **Prompt 1 (System Message)** into its system prompt.
3. Attach a **Groq Chat Model** (model `openai/gpt-oss-120b`) using your existing Groq credential.
4. Add **three Jira tool nodes**, all using the reused Jira credential:
   - **Get issue** (Prompt 2)
   - **Update issue** (Prompt 3)
   - **Add comment to issue** (Prompt 4)
5. Attach a **Buffer Memory** node to the agent so it remembers the draft until you confirm.
6. Connect: Chat Trigger -> AI Agent, then model + the three Jira tools + memory into the agent.
7. Paste **Prompt 5** into a **Sticky Note** to label the workflow.
8. Save + activate, click **Open Chat** (or copy the trigger URL) and share that URL with the QA person.
9. Export the workflow JSON (Download / Copy) and save it as the deliverable file above.

## Workflow nodes
1. **Chat Trigger** — `@n8n/n8n-nodes-langchain.chatTrigger`, `public: true`.
2. **AI Agent** — `@n8n/n8n-nodes-langchain.agent` v3.1, with Prompt 1 as its system message.
3. **Groq Chat Model** — `@n8n/n8n-nodes-langchain.lmChatGroq`, `openai/gpt-oss-120b`,
   Groq credential (`qkwnhZNgasAk73uu` / "Groq account").
4. **Jira Get tool** — `n8n-nodes-base.jiraTool`, operation `get`, fields from Prompt 2.
5. **Jira Update tool** — `n8n-nodes-base.jiraTool`, operation `update`, fields from Prompt 3.
6. **Jira Comment tool** — `n8n-nodes-base.jiraTool`, operation `addComment`, fields from Prompt 4.
7. **Buffer Memory** — connected to the agent's `ai_memory` input (optional if your agents
   already persist context).
8. **Sticky note** — content from Prompt 5.

## Connections
- Chat Trigger (`main`) -> AI Agent (`main`)
- Groq Chat Model (`ai_languageModel`) -> AI Agent
- Jira Get tool (`ai_tool`) -> AI Agent
- Jira Update tool (`ai_tool`) -> AI Agent
- Jira Comment tool (`ai_tool`) -> AI Agent
- Buffer Memory (`ai_memory`) -> AI Agent

## Prompts to paste into n8n (manual setup)
These are the exact text values you type into the nodes by hand.

### Prompt 1) AI Agent -> System Message
```
### R — Role
You are a Senior QA Bug Triage Engineer (15+ years). You fetch existing Jira Bug tickets and
help the user triage them by updating fields safely.

### I — Instructions
1. Get the Jira issue key from the user (e.g. AW-12).
2. Fetch the issue with the "Get issue" tool and show a short snapshot: Summary, Priority, Labels, and Description.
3. When the user asks for a change, prepare ONLY those changes:
   - Summary and/or Description (Jira markdown)
   - Priority (native Jira field)
   - Severity -> label `severity-<level>`; Risk -> label `risk-<level>` (levels: Critical/High/Medium/Low)
   - A new comment
4. Labels: Jira replaces the whole label set. Start from the issue's CURRENT labels, drop any
   old `severity-*` / `risk-*`, add the new ones, and send the FULL label set.
5. Show the proposed changes as a "field: old -> new" list and ask the user to confirm.
6. Apply ONLY after explicit confirmation, using the "Update issue" and/or "Add comment" tools.
Do NOT:
- Invent values, IDs, labels, or fields.
- Update or comment on any issue other than the one the user named.
- Apply changes without explicit confirmation.
- Change issue type or assignee, or delete anything.

### C — Context
- Site: https://rehmansabbujira.atlassian.net (Atlassian Cloud, Basic auth).
- Severity is stored as a label: `severity-critical|high|medium|low`.
- Risk is stored as a label: `risk-critical|high|medium|low`.
- Priority is Jira's native priority field.
- Audience: a QA person doing quick triage in chat.

### E — Example
Input: "AW-12 severity should be high and add a comment that it also fails on Chrome"
Proposed changes (await confirmation):
- Labels: [bug, login] -> [bug, login, severity-high]
- New comment: "Also reproduced on Chrome (version Unknown)."
Reply "yes" to apply.

### P — Parameters (anti-hallucination)
- Only touch the fields the user asks about; leave everything else unchanged.
- Use ONLY information the user provided. Never invent values or labels.
- If a value is missing or unclear, mark it "Unknown" or ask.
- Preserve all existing labels except the ones being intentionally replaced.
- Keep comment text concise and factual.

### SAFe rules (additional layer)
- One change set per request; do not expand the ticket's scope.
- Align Priority / Severity / Risk to business and user impact.

### Guardrails
- Operate ONLY on the issue key the user named.
- Never modify fields that were not requested; never delete tickets.
- Never expose credentials, tokens, or internal configuration.

### O — Output
1. Ticket snapshot (key, summary, priority, labels).
2. Proposed changes (one per line: field: old -> new).
3. Ask: "Apply these changes? (yes/no)".
After applying, confirm exactly which fields were updated.

### T — Tone
Technical, concise, output-only. No filler commentary.
```

### Prompt 2) Jira "Get issue" tool -> Parameters
| Field | Value to enter |
|---|---|
| Operation | `Get issue` |
| Issue Key | `={{ $fromAI('Issue_Key', 'The Jira issue key to fetch, e.g. AW-12', 'string') }}` |

### Prompt 3) Jira "Update issue" tool -> Parameters
| Field | Value to enter |
|---|---|
| Operation | `Update issue` |
| Issue Key | `={{ $fromAI('Issue_Key', 'The Jira issue key to update, e.g. AW-12', 'string') }}` |
| Update Fields -> Summary | `={{ $fromAI('Summary', 'New summary, only if the user asked to change it', 'string') }}` |
| Update Fields -> Description | `={{ $fromAI('Description', 'New description in Jira markdown, only if asked', 'string') }}` |
| Update Fields -> Priority | `={{ $fromAI('Priority', 'Native Jira priority, e.g. High', 'string') }}` |
| Update Fields -> Labels | `={{ $fromAI('Labels', 'The FULL label set including severity-<level> and risk-<level>, comma separated', 'string') }}` |

> Note: Jira replaces the entire label set on update, so the agent must send every label the
> ticket should keep (see Prompt 1, step 4).

### Prompt 4) Jira "Add comment" tool -> Parameters
| Field | Value to enter |
|---|---|
| Operation | `Add comment to issue` |
| Issue Key | `={{ $fromAI('Issue_Key', 'The Jira issue key to comment on, e.g. AW-12', 'string') }}` |
| Comment | `={{ $fromAI('Comment', 'The comment text in Jira markdown', 'string') }}` |

Exact parameter names/field labels should be confirmed in the n8n UI against the same
`jiraTool` node already used in `01_JIRA_AIAgent.json` / `02_JIRATestGenAIAgent.json`.

### Prompt 5) Sticky Note -> Content
```
## Bug Triage Agent
Give a Jira key (e.g. AW-12) -> agent fetches it -> you ask for changes (summary, description,
priority, severity, risk, comment) -> agent drafts them -> you confirm -> it updates Jira.
```

## Verification
1. Import the JSON in n8n (Import Workflow).
2. Reconnect the Jira + Groq credentials if n8n does not auto-map them.
3. Open the Test Chat (or copy the share URL) from the Chat Trigger node.
4. Send: "AW-3" -> expect a ticket snapshot (summary, priority, labels).
5. Send: "set severity to high and add a comment: reproduced on Chrome too" -> expect a
   proposed-change list and a confirm question.
6. Reply "yes" -> expect the agent to call Update issue / Add comment and confirm the fields changed.
7. Verify in Jira (project `AW`) that the label `severity-high` and the comment appear, and no
   other labels were lost.

## Assumptions / notes
- Severity and Risk are represented as labels (`severity-*`, `risk-*`); Priority uses the
  native Jira field. Adjust the levels to match your Jira conventions if needed.
- Because Jira replaces labels on update, the agent always sends the full label set.
- Jira auth reuses the previous project's Basic Auth details, held in the gitignored `.env`
  and the n8n "Jira SW Cloud account" credential.
- The QA person only uses the chat URL — they do not import the workflow JSON or see secrets.
- RICEPOT is structured exactly as your `01_Plan/RICEPOT_Framework.md`
  (Role / Instructions / Context / Example / Parameters / Output / Tone).
- Folder name `04_BugTraige_AIAgent` is used exactly as it exists in the repo.
