# AI Tester Blueprint 5x

A hands-on blueprint for AI-assisted software testing — from skills and prompt
engineering to AI agents that plan tests, create Jira tickets, and triage bugs.

The repo is organized as a sequence of chapters. Each chapter is self-contained and
builds on the previous one.

## Chapters

| Chapter | Focus |
|---|---|
| `Chapter_00_SKILL_Basics` | Reusable agent skills (basic + advanced) for test plans, test cases, and API response validation. |
| `Chapter_01_LLM_Basics` | Reserved for LLM fundamentals (placeholder). |
| `Chapter_02_Prompt_Engineering` | Prompt frameworks (RICEPOT, hallucination vs. no-hallucination) plus generated Playwright and Selenium frameworks. |
| `Chapter_03_Prompt_Engineering_QA` | QA prompt templates (CLEAR, CRISP, STAR) for requirements, manual testing, automation, bugs, and API. |
| `Chapter_04_AI_Agents_Basics` | "Vibe coded" web AI agents (test planning, test strategy, test case creation) built with RICEPOT prompts. |
| `Chapter_05_AIAgents_n8n` | n8n chat AI agents wired to Groq + Jira: read, create, and triage Jira tickets. |
| `output/` | Generated artifacts (test plans, test cases, bug reports in `.md` / `.docx` / `.xlsx` / `.html` / `.pdf`). |

## Chapter details

### Chapter 00 — Skill Basics
Agent skills described by a `SKILL.md` file:
- `00_basics_skills/` — `testplan_creator-skill`, `testcase_creator-skill`, `apitestcase-response-validator-skill`
- `01_advance_skills/` — `testplan-creator-skill_a` with `references/`, `scripts/`, and `misc/`

### Chapter 02 — Prompt Engineering
- `REAL_RICE_POT.md`, `REAL_RICE_POT_PW.md`, `Template_with_hallucination.md`, `Template_without_hallucination.md`
- `Template_RICE_POT/` — the RICEPOT template
- `PlaywrightFramework/` — TypeScript Playwright framework (pages, fixtures, tests, config)
- `SeleniumFramework/` — Java + Maven Selenium framework with TestNG and Allure reporting

### Chapter 03 — Prompt Engineering for QA
Reusable prompt templates per QA activity, plus frameworks:
- Frameworks: `CLEAR.md`, `CRISP.md`, `STAR.md`, `template.md`
- `01_reuse_templates-requirements/`, `02_reuse_templates-manual-testing/`,
  `03_reuse_templates-automation/`, `04_reuse_templates-bugs/`, `05_reuse_templates-api/`

### Chapter 04 — AI Agents Basics
Web-based AI agents under `VIBE_CODING/`, each with `00_Design/`, `01_Plan/`, and
`02_Implementation/`:
- `01_Intelligent_Test_Planning_AIAgent`
- `02_Test_Strategy_Builder_AIAgent`
- `03_TestCase_Creation_AIAgent`

### Chapter 05 — n8n AI Agents
Importable n8n workflow JSON. Each agent follows the pattern
`Chat Trigger -> AI Agent (system message) -> Groq LLM -> Jira tool(s)`:
- `00_HelloWorld.json` — minimal starting workflow
- `01_JIRA_AIAgent.json` — reads Jira issues
- `02_JIRATestGenAIAgent.json` — generates test cases from a Jira issue
- `03_CreateJIRA_AIAgent/` — creates a Jira Bug (`03_CreateJIRABugAIAgent.json`),
  a Jira ticket (`03_CreateJIRATicket_AIAgent.json`), and a parser (`05_Jira_Ticket_Parser.json`)
- `04_BugTraige_AIAgent/` — fetches, updates, and comments on Jira tickets:
  - `04_BugTraigeAIAgent.json` — draft then confirm before applying changes
  - `06_BugTraigeAIAgentComment.json`, `07_BugTraigeScheduleJIRA_AIAgentComment.json`,
    `08_BugTraigeMultipleJIRA_AIAgentComment.json`
- `05_RCA_AIAgent/` — placeholder for a root-cause analysis agent

Each agent folder includes a `plan.md` with the build steps and the exact prompt text
(RICEPOT layers, SAFe rules, guardrails, anti-hallucination rules) to paste into n8n.

## Getting Started

### Prerequisites
- Node.js 18+ (Playwright framework)
- Java 11+ and Maven (Selenium framework)
- An [n8n](https://n8n.io/) instance (for Chapter 05 agents)
- API keys as needed: a Groq key, and Atlassian (Jira) credentials

### Installation

```bash
git clone <repository-url>
cd AITesterBlueprint5x
```

Playwright framework:

```bash
cd Chapter_02_Prompt_Engineering/PlaywrightFramework
npm install
npx playwright install
```

Selenium framework:

```bash
cd Chapter_02_Prompt_Engineering/SeleniumFramework
mvn test
```

### Configuration

Create a `.env` file at the repo root (it is gitignored):

```bash
# LLM
GROQ_API_KEY=your-groq-api-key

# Jira (Atlassian Cloud)
JIRA_BASE_URL=https://your-site.atlassian.net
JIRA_EMAILID=you@example.com
JIRA_TOKEN=your-atlassian-api-token
```

For the n8n agents, add the equivalent credentials in the n8n UI
(Groq Chat Model and Jira Software Cloud) — no secrets go into the workflow JSON.

### Using the n8n agents

1. Open n8n and choose **Import Workflow**.
2. Import a JSON from `Chapter_05_AIAgents_n8n/`.
3. Reconnect the Groq and Jira credentials if they are not auto-mapped.
4. Open the **Chat Trigger** node's chat URL and share it with your QA person.

## Project Structure

```
AITesterBlueprint5x/
├── Chapter_00_SKILL_Basics/
├── Chapter_01_LLM_Basics/
├── Chapter_02_Prompt_Engineering/
│   ├── PlaywrightFramework/
│   ├── SeleniumFramework/
│   └── Template_RICE_POT/
├── Chapter_03_Prompt_Engineering_QA/
├── Chapter_04_AI_Agents_Basics/
│   └── VIBE_CODING/
├── Chapter_05_AIAgents_n8n/
├── output/
├── .env                 # local secrets (gitignored)
└── README.md
```

## Contributing

1. Create a feature branch.
2. Keep changes focused and add tests or sample outputs for new behavior.
3. Run the relevant checks (`npm test` / `mvn test`) before opening a pull request.
4. Describe the motivation and approach in the PR.

## License

Not yet specified.
