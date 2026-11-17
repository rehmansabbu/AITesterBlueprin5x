# AI-Powered Jira Test Plan Generator

Enter a Jira issue ID → the backend retrieves the issue from Jira → an LLM generates a
test plan using the supplied template → the plan is displayed with its Jira source link.

**Live:** https://testplanaiagent.vercel.app

## Prerequisites

- Node.js 18+ (uses the built-in `fetch`; tested on Node 24).
- Access to a Jira Cloud site and a Groq API key.

## Configuration

Credentials can come from two places:

1. **Server environment** — a `.env` file found by walking up the directory tree from
   `src/` (locally this is the repo-root `.env`), or Vercel project environment variables.
2. **The Settings page** — paste your `.env` contents into the **Environment (.env)** box
   and click **Apply .env**. These are sent to the backend in an `x-env-config` header
   (base64) and used for that request only. Nothing is persisted on the server or in the
   browser.

Accepted keys (either spelling for the email/key names):

```dotenv
JIRA_BASE_URL=https://your-site.atlassian.net
JIRA_EMAIL=you@example.com          # or JIRA_EMAILID
JIRA_TOKEN=your_atlassian_api_token
GROQ_APIKEY=your_groq_api_key        # or GROQ_APIKEYs
# optional:
GROQ_MODEL=openai/gpt-oss-120b
PORT=3000
```

Use the account's exact login email for the Jira email value.

## Install & Run (local)

```bash
cd 02_Implementation
npm install
npm start
```

Then open http://localhost:3000.

## How to use

1. In the **Settings** panel, paste your `.env` contents and click **Apply .env**
   (skip this if the server already has credentials).
2. In the **Main page** panel, type a Jira issue ID (e.g. `AW-3`) and click **Generate**.
3. The generated test plan renders with a link to the source Jira issue.

**Test Connection** verifies the Jira credentials; **Test Groq** reports whether a Groq
key was found. Secrets are never echoed back to the browser.

## Structure

```
02_Implementation/
├── public/index.html   React (CDN, no build step) — Main page + Settings
├── src/index.js        Express app: Jira retrieval + test plan generation
├── package.json
├── vercel.json         (deployment config, if present)
├── .gitignore / .vercelignore
└── README.md
```

> Vercel requires static files in `public/**` (it ignores `express.static`) and the
> Express entry point at `src/index.js` (a recognized location).

## API

| Method | Path             | Purpose                                              |
|--------|------------------|------------------------------------------------------|
| GET    | `/api/config`    | Safe config summary (no secrets)                     |
| POST   | `/api/test-jira` | Verify Jira credentials (`/myself`)                  |
| POST   | `/api/test-plan` | `{ issueId }` → retrieve issue + generate plan       |

All three accept an optional `x-env-config` header (base64 `.env` text) that overrides the
server environment for that request.

## Deploy to Vercel

Already deployed as project **`testplanaiagent`**:

- Production: https://testplanaiagent.vercel.app
- Dashboard: https://vercel.com/rehmansabbu/testplanaiagent

To redeploy:

```bash
cd 02_Implementation
npx vercel login        # one-time
npx vercel --prod       # deploy (project is already linked)
```

No build step or output directory is needed — Vercel detects Express and runs the app as a
single function, serving `public/` from its CDN. To configure credentials at deploy time
instead of pasting them in the UI, add `JIRA_BASE_URL`, `JIRA_EMAILID`, `JIRA_TOKEN` and
`GROQ_APIKEYs` under **Project → Settings → Environment Variables**.

## Verification performed

- Frontend renders and both panels load (`/api/config` returns the parsed config).
- Backend starts, serves `public/`, and resolves the `.env`.
- Credential resolution: no header → server environment; `x-env-config` header → pasted
  `.env` (verified via `source: "pasted .env"`).
- Jira input validation (missing/invalid key → clear error).
- **Live Jira retrieval verified**: `POST /api/test-plan` with `AW-3` returned the issue
  ("Product Requirements Document: VWO Login Dashboard") and generated a plan.
- LLM generation (`openai/gpt-oss-120b`): output follows the template's exact section
  names and order and emits "Insufficient information to determine." for missing details.

> Note: Jira auth requires the account's **exact login email**. An email alias such as
> `user+jira@gmail.com` is rejected with HTTP 401 even with a valid token.

## Known limitations

- Ollama LLM configuration is shown in the design but is not implemented (disabled);
  Groq is the configured provider.
- Pasted credentials live only in React state, so they are cleared on page reload.
- Test plans are generated at `temperature: 0`; minor wording variation is still possible.
