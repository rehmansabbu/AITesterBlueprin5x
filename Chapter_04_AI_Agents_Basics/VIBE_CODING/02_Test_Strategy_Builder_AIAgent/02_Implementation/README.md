# AI-Powered Jira Test Strategy Generator

Enter a Jira issue ID → the backend retrieves the issue from Jira → an LLM generates a test
strategy using `../01_Plan/TestStrategy_Template.md` → it is displayed with the Jira source link.

**Live:** https://ai5x-teststrategy.vercel.app

## Prerequisites

- Node.js 18+ (uses the built-in `fetch`).
- A Jira Cloud site and a Groq API key.

## Configuration

Credentials can come from two places:

1. **Server environment** — a `.env` found by walking up the directory tree from `src/`
   (locally this is the repo-root `.env`), or Vercel project environment variables.
2. **The Settings page** — paste your `.env` contents into the **Environment (.env)** box
   and click **Apply .env**. These are sent to the backend in an `x-env-config` header
   (base64) and used for that request only. Nothing is persisted on the server or in the
   browser. This is the intended path on the deployed site, which has no server `.env`.

Accepted keys:

```dotenv
JIRA_BASE_URL=https://your-site.atlassian.net
JIRA_EMAILID=you@example.com          # or JIRA_EMAIL
JIRA_TOKEN=your_atlassian_api_token
GROQ_APIKEYs=your_groq_api_key        # or GROQ_APIKEY
GROQ_MODEL=openai/gpt-oss-120b        # optional
PORT=3001                             # optional
```

Secrets stay on the server — they are never sent to or stored in the browser.

## Run

```bash
cd 02_Implementation
npm install
npm start
```

Then open http://localhost:3001.

## Use

1. In **Settings**, paste your `.env` contents and click **Apply .env**
   (skip this if the server already has credentials).
2. Type a Jira issue ID (e.g. `AW-3`) in the **Main page** panel and click **Generate**.
3. The generated test strategy renders with a link to the source Jira issue.
4. **Settings → Test Connection** verifies the Jira credentials;
   **Test Local LLM or Test Groq.com** reports whether a Groq key was found.

## Structure

```
02_Implementation/
├── public/index.html   React (CDN, no build step) — Main page + Settings
├── src/index.js        Express: Jira retrieval + test strategy generation
├── package.json
├── vercel.json         (deployment config)
├── .gitignore / .vercelignore
└── README.md
```

## API

| Method | Path                 | Purpose                                           |
|--------|----------------------|---------------------------------------------------|
| GET    | `/api/config`        | Safe config summary (no secrets)                  |
| POST   | `/api/test-jira`     | Verify Jira credentials (`/myself`)               |
| POST   | `/api/test-strategy` | `{ issueId }` → retrieve issue + generate strategy |

## Deploy to Vercel

Deployed as project **`ai5x-teststrategy`** → https://ai5x-teststrategy.vercel.app

```bash
cd 02_Implementation
npx vercel login        # one-time
npx vercel --prod       # deploy (project is already linked)
```

No build step or output directory is needed — Vercel detects Express and runs `src/index.js`
as a single function, serving `public/` from its CDN. Credentials are supplied by pasting
your `.env` in the Settings page (or add them under **Project → Settings → Environment
Variables**).

> The originally requested `ai5x-teststrategyaiagent.vercel.app` was already taken by another
> Vercel account, so the project (and domain) use `ai5x-teststrategy`.

## Verification performed

- Backend starts and resolves the parent-folder `.env`; `/api/config` returns parsed config.
- Credential resolution: no header → server environment; `x-env-config` header → pasted
  `.env` (verified via `source: "pasted .env"`).
- Input validation (missing/invalid key → clear error).
- **Live Jira retrieval verified** via `POST /api/test-strategy` with a real issue key (`AW-3`),
  both locally and on the deployed site.
- LLM generation at `temperature: 0` follows the template's exact section names and order
  and emits "Insufficient information to determine." for missing details.

## Known limitations

- Ollama LLM shown in the design is not implemented; Groq is the configured provider.
- Minor wording variation in generated strategies is still possible despite `temperature: 0`.
