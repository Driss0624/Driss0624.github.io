# Feature Specification — Setup & Deploy

*Feature 1 of 8 · Branch: `feature/module-16-project-setup` · Must be used with `ai/ai-spec.md` · Last updated: 2026-11-02*

---

## 1. Feature Goal and Outcomes

Turn the empty repository into a React + Vite application that builds cleanly and deploys to GitHub Pages automatically on every push to `main`, with Supabase wired in safely.

When this feature is done:

- The app runs locally with `npm run dev` and builds with `npm run build`.
- `HashRouter` serves every route from the domain root.
- A push to `main` builds the app in GitHub Actions and publishes `dist/` to GitHub Pages.
- Supabase credentials reach the build only through repository secrets.
- The app loads normally whether or not Supabase is configured.

---

## 2. Feature Scope

### In scope

- Scaffolding the Vite React (JavaScript) project in the existing repository root.
- Installing the approved dependencies: `react-router-dom`, `@supabase/supabase-js`, `react-icons`.
- `vite.config.js` with `base: '/'`.
- `HashRouter` in `src/main.jsx` and the route table in `src/App.jsx`, using minimal placeholder pages.
- `.github/workflows/deploy.yml`.
- GitHub Pages source and repository secrets (configured in GitHub settings).
- `.env.example`.
- `src/lib/supabaseClient.js` with graceful degradation.
- Supabase project setup, as defined in `ai/ai-spec.md` §6 (referenced, not repeated).

### Out of scope

- The shared layout, header, footer, and navigation (`header-footer.feature.md`).
- Real page content, styling, and images (each page's own feature).
- Any Supabase query: contact INSERT, login, and Back Office reads belong to their features.
- Custom domains, analytics, or any other deployment target.

---

## 3. Constraints

- Follow every constraint in `ai/ai-spec.md` §5. In particular: static site only, no backend, `VITE_` prefix, `.env` never committed, no `service_role` key.
- The scaffold must not delete or overwrite `AGENTS.md`, `Module_Vault_Import/`, `.gitignore`, or `ai/`.
- No dependency beyond those listed in §2.
- Placeholder pages contain only a heading with the page name. They exist so routing can be verified and are replaced by later features.
- While the repository is private, GitHub Pages cannot publish on a free account. Deployed-site checks are **deferred**, not skipped.

---

## 4. Decisions Already Taken

| Decision | Source |
| --- | --- |
| React + Vite, **JavaScript** variant | Business doc v2; `ai-spec.md` §5 |
| `HashRouter` with routes `#/`, `#/portfolio`, `#/links`, `#/contact`, `#/login`, `#/backoffice` | `ai-spec.md` §4; checklist "Vite Base Path"; portal slide `username.github.io` |
| `base: '/'` in `vite.config.js` | Checklist; portal slide |
| Deploy with GitHub Actions on push to `main` | Business doc v2; checklist |
| Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Portal slide `username.github.io`; `ai-spec.md` §5 |
| Supabase table, RLS, and auth defined in `ai-spec.md` §6 | Checklist ("not included in feature specification") |
| Scaffold in place with `npm create vite@latest .`; choose **"Ignore files and continue"** | Repository already contains tracked and ignored files |

The checklist's command is `npm create vite@latest username.github.io`. Running it with `.` creates the same project in the repository root, which is already named `Driss0624.github.io`.

---

## 5. Requirements Breakdown and User Flow

| ID | Requirement |
| --- | --- |
| SETUP-FR-01 | The project is a Vite React (JavaScript) app created with `npm create vite@latest`. |
| SETUP-FR-02 | `npm run dev`, `npm run lint`, and `npm run build` succeed; the build outputs `dist/`. |
| SETUP-FR-03 | `vite.config.js` sets `base: '/'`. |
| SETUP-FR-04 | The app uses `HashRouter`. Every route in `ai-spec.md` §4 renders its placeholder page, unknown routes redirect to Home, and the browser path stays `/`. |
| SETUP-FR-05 | Refreshing any route (local preview or deployed) loads the same page, never a 404. |
| SETUP-FR-06 | `.github/workflows/deploy.yml` triggers on push to `main`, runs `npm ci` and `npm run build`, and deploys `dist/` to GitHub Pages. |
| SETUP-FR-07 | The workflow passes `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from repository secrets to the build step via `env:`. |
| SETUP-FR-08 | GitHub Pages is configured to serve from GitHub Actions. |
| SETUP-FR-09 | `.env` is git-ignored; `.env.example` lists both variable names with empty values. |
| SETUP-FR-10 | `src/lib/supabaseClient.js` is the only Supabase client, created from the two `VITE_` variables with the publishable (anon) key. |
| SETUP-FR-11 | When either variable is missing, the client module does not throw; it exports `supabase = null` and `isSupabaseConfigured = false`, and the app renders normally. |
| SETUP-FR-12 | The Supabase project matches `ai-spec.md` §6: `messages` table, RLS policies, email/password auth, sign-ups disabled, admin user created in the dashboard. |

### User flow (developer)

1. Clone → `npm install` → copy `.env.example` to `.env` and fill it in → `npm run dev`.
2. Work on a feature branch → merge into `dev` → merge `dev` into `main`.
3. The push to `main` starts the workflow → the site updates at `https://driss0624.github.io`.

---

## 6. Interfaces and Files Involved

| File / setting | Change |
| --- | --- |
| `package.json`, `package-lock.json` | Created by the scaffold; dependencies added by `npm install` |
| `index.html`, `.oxlintrc.json`, `public/`, `src/` | Created by the scaffold (current Vite uses oxlint, not ESLint) |
| `vite.config.js` | Created by the scaffold; add `base: '/'` |
| `src/main.jsx` | Wrap `<App />` in `<HashRouter>` |
| `src/App.jsx` | Route table from `ai-spec.md` §4 |
| `src/pages/Home.jsx`, `Portfolio.jsx`, `Links.jsx`, `Contact.jsx`, `Login.jsx`, `BackOffice.jsx` | Placeholder pages (heading only) |
| `src/lib/supabaseClient.js` | New; client plus `isSupabaseConfigured` flag |
| `.env.example` | New; two variable names, empty values |
| `.github/workflows/deploy.yml` | New; build-and-deploy workflow |
| GitHub → Settings → Pages | Source: GitHub Actions |
| GitHub → Settings → Secrets and variables → Actions | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| Supabase dashboard | Setup per `ai-spec.md` §6 |
| Scaffold leftovers (`src/App.css`, demo assets, counter code) | Remove if unused |

---

## 7. Data, Validations, and Expected Behavior

### Environment variables

| Variable | Where it is set | Value |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Local `.env`; GitHub secret | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Local `.env`; GitHub secret | Supabase publishable (anon) key |

### `supabaseClient.js` behavior

| Situation | Exports | App behavior |
| --- | --- | --- |
| Both variables present | `supabase` client, `isSupabaseConfigured = true` | Normal |
| Either variable missing | `supabase = null`, `isSupabaseConfigured = false` | Pages render; one `console.warn` in development only |

### Workflow outline

- Triggers: `push` to `main`, plus `workflow_dispatch` for manual reruns.
- Permissions: `contents: read`, `pages: write`, `id-token: write`.
- Concurrency group `pages`, so overlapping deployments do not collide.
- Build job: checkout → set up Node (LTS, npm cache) → `npm ci` → `npm run build` with both secrets in `env:` → upload `dist/` as the Pages artifact.
- Deploy job: depends on build → deploy the artifact to the `github-pages` environment.

---

## 8. Task Breakdown

| ID | Task | Requirements |
| --- | --- | --- |
| SETUP-TASK-01 | Run `npm create vite@latest .` (React, JavaScript), ignoring existing files; confirm `AGENTS.md`, the vault, `.gitignore`, and `ai/` are untouched | FR-01 |
| SETUP-TASK-02 | `npm install`, then `npm install react-router-dom @supabase/supabase-js react-icons` | FR-01, FR-04, FR-10 |
| SETUP-TASK-03 | Set `base: '/'` in `vite.config.js` | FR-03 |
| SETUP-TASK-04 | Add `HashRouter`, the route table, the fallback redirect, and the six placeholder pages; remove scaffold demo code | FR-04, FR-05 |
| SETUP-TASK-05 | Create `.env.example`; confirm `.env` is ignored | FR-09 |
| SETUP-TASK-06 | Create `src/lib/supabaseClient.js` with the flag and graceful fallback | FR-10, FR-11 |
| SETUP-TASK-07 | Create `.github/workflows/deploy.yml` | FR-06, FR-07 |
| SETUP-TASK-08 | Set up Supabase per `ai-spec.md` §6 (done by Driss in the dashboard) | FR-12 |
| SETUP-TASK-09 | Add the two repository secrets and set Pages to GitHub Actions (done by Driss, or by the agent with approval) | FR-07, FR-08 |
| SETUP-TASK-10 | Verify locally with and without `.env`; record evidence | FR-02, FR-05, FR-11 |
| SETUP-TASK-11 | After an approved merge to `main` and a public repository: confirm the workflow run and the live site | FR-05, FR-06, FR-08 |

### Traceability (checklist → requirement → task)

| Checklist line | Business doc v2 | Requirement | Task | Planned change | Verification |
| --- | --- | --- | --- | --- | --- |
| 🤖 AI Feature Specification — Setup & Deploy | Specifying Before You Build | — | — | This file | File exists; listed in Feature Index |
| 🛠️ React using Vite | Scaffolding and Deployment ¶1 | FR-01, FR-02 | TASK-01, 02 | Scaffold files, `package.json` | `npm run dev`, `npm run build` |
| 🛠️ GitHub Actions workflow | Scaffolding and Deployment ¶2 | FR-06, FR-07, FR-08 | TASK-07, 09, 11 | `.github/workflows/deploy.yml`; repo settings | Workflow file review; Actions run (deferred) |
| 🛠️ Vite Base Path | Scaffolding and Deployment ¶3 | FR-03, FR-04, FR-05 | TASK-03, 04 | `vite.config.js`, `main.jsx`, `App.jsx` | `npm run preview`; path stays `/`; refresh test |
| 🛠️ Supabase Setup (not in a feature spec) | Scaffolding and Deployment ¶4; Constraints | FR-09, FR-10, FR-11, FR-12 | TASK-05, 06, 08 | `.env.example`, `supabaseClient.js`; dashboard | Run with and without `.env`; dashboard review |

---

## 9. Acceptance Criteria and Verification

### Local (required before merging into `dev`)

- [ ] `AGENTS.md`, `Module_Vault_Import/`, `.gitignore`, and `ai/` are unchanged after the scaffold.
- [ ] `npm run lint` passes with no errors.
- [ ] `npm run build` succeeds and creates `dist/`.
- [ ] `npm run preview`: each of `#/`, `#/portfolio`, `#/links`, `#/contact`, `#/login`, `#/backoffice` shows its placeholder; `#/unknown` redirects to Home.
- [ ] The browser path stays `/` on every route, and refreshing any route reloads the same page.
- [ ] With a filled `.env`, `isSupabaseConfigured` is `true`.
- [ ] With no `.env`, the app still renders every route with no uncaught error.
- [ ] `git status` shows no `.env`, `dist/`, or `node_modules/`; no credential appears in any tracked file.
- [ ] `.github/workflows/deploy.yml` matches §7 (trigger, `npm ci`, build, both secrets via `env:`, `dist/` artifact, deploy job).
- [ ] The Supabase project matches `ai-spec.md` §6, including sign-ups disabled.

### Deployed (deferred while the repository is private)

- [ ] Pages source is GitHub Actions and both secrets exist.
- [ ] A push to `main` starts the workflow, and both jobs succeed.
- [ ] `https://driss0624.github.io` loads the app; every route works and survives a refresh.

### Evidence categories

Static inspection · lint and build · local browser · GitHub Actions run · deployed site · Supabase dashboard. Each is reported separately.

---

## Needs review

- **Checklist coverage:** all five setup lines are covered (see the traceability table). The Supabase line is covered by reference to `ai-spec.md` §6, as the checklist requires.
- **Assumptions:**
  - Scaffolding with `.` in the existing repository instead of creating a new `username.github.io` folder. The result is identical and keeps the private files in place.
  - Node LTS in the workflow; local development uses Node 24.
  - `workflow_dispatch` is added so a failed deployment can be rerun without a new commit.
  - The scaffold was generated in a temporary folder and copied in without overwriting existing files. The output is identical to `npm create vite@latest .` and avoids the non-empty-folder prompt.
- **Open questions:**
  - Who sets the repository secrets and the Pages source: you in GitHub settings, or the agent through the GitHub CLI with your approval? *Recommended: the agent, after you approve; you paste the values only into your local `.env`.*
  - Do you already have a Supabase account and project? *Needed for SETUP-TASK-08.*
- **Source conflicts:** repository visibility is still open (`ai-spec.md` §2). It blocks only the deployed checks.
- **Spec gaps:** none.
- **Out-of-scope observations:** a favicon and page `<title>` would help the portfolio's polish; they belong to `header-footer.feature.md`.
