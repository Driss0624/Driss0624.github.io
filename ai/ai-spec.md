# Personal Portfolio Module 16 Project-Wide AI Specification

**This is the project-wide specification. Read it completely before any feature specification.**

- The rules in this document apply to **every feature** of the project, unless a feature specification explicitly states an exception.
- Feature specifications (`ai/features/*.feature.md`) describe requirements unique to a single feature. They must not repeat or contradict what is defined here.
- Any implementation must satisfy **both** this document and the relevant feature specification.
- If the two conflict, resolve the conflict explicitly by updating one of them. Never guess.

*Author: Driss Elhail · Module: FSD-1616 Professional Development · Last updated: 2026-11-02*

---

## 1. Project Identity

- **Project name:** Driss Elhail — Personal Portfolio (`Driss0624.github.io`)
- **Short description:** A personal portfolio website presenting my skills, education, experience, and projects, with a contact form that stores messages in Supabase and a hidden admin area for reading them.
- **Project type:** Static, client-side single-page application (React + Vite), deployed to GitHub Pages.
- **Primary users:**
  - **Visitors and employers:** browse the public pages, download the résumé, and send a message.
  - **Admin (me, the only one):** sign in through a hidden route to read and delete messages.
- **Client:** myself. There is no fictional company. Every design and content decision reflects my personal brand.

### Module 16 work tracks

1. The portfolio website (eight features below).
2. Job-market materials: finalized résumé, LinkedIn update, elevator pitch cycle.
3. Technical-interview evidence: `CONCEPTS.md`, five LeetCode challenges, and the required videos.

---

## 2. Sources of Truth

Use this order when requirements differ:

1. My current explicit instruction.
2. The Module 16 v2 business document (`Module_Vault_Import/Module-16/CodeBoxx-Slides/01-module-16-business-document-v2.pdf`).
3. The Module 16 Requirement Checklist (`Module_Vault_Import/Module-16/official-materials/M16-grading-checklist.md`).
4. `AGENTS.md` (workflow, approval, evidence, and Git rules).
5. This specification.
6. The active feature specification.
7. The Module 16 portal slides (`Module_Vault_Import/Module-16/CodeBoxx-Slides/`).

`Module_Vault_Import/` and `AGENTS.md` are local and git-ignored. They are not part of the deployed project.

### Source conflicts

| Topic | v2 business document | Requirement Checklist | Status |
| --- | --- | --- | --- |
| Routing / URL paths | Names a `/backoffice` route; routes must resolve from the domain root | URL always stays `https://username.github.io` (no `/home`, `/portfolio`) | **Decided:** HashRouter (see §4). The portal slide `username.github.io` recommends it. |
| Mobile navigation | Compact, accessible, does not obstruct content | At ≤768px, links become icons displayed at the bottom | **Decided:** fixed bottom icon bar at ≤768px, with content padded so it is never hidden. Satisfies both. |
| Repository visibility | Private | PUBLIC, named `username.github.io` | **Open.** Private for now. Must be public before the deployed site is needed (GitHub Pages on a free account serves public repositories only). Confirm with a coach. |
| LinkedIn update record | `RESEARCH.md` at the repository root | README.md, Author section | **Open.** Decide before the Job-Market work. |
| Admin credentials | Provisioned in the Supabase dashboard; not listed | Fixed values listed | **Decided:** use the checklist's account in the dashboard; never write the password in any tracked file. |
| Links-page AI images | At least one | First line says two; bullet says one | **Decided:** at least one. Flag in `link-page.feature.md`. |

---

## 3. Project Scope

### In scope

- Scaffolding from an empty folder with `npm create vite@latest username.github.io` (React, JavaScript).
- Automated build and deployment to GitHub Pages through GitHub Actions.
- Supabase: email/password authentication, the `messages` table, and row-level security (§6).
- A shared layout: sticky header, footer, AI-generated logo, responsive navigation.
- Public pages: Home, Portfolio, Links, Contact.
- Hidden admin area: Login and Back Office.
- The project's AI specifications and repository documentation.
- Job-market and interview files stored in the repository (§5, repository structure).

### Out of scope

- Any custom backend server, API, serverless function, or server-side rendering.
- A registration or sign-up flow, or more than one admin account.
- Any database table other than `messages`.
- Analytics, CMS, blog, comments, payments, or any feature not required by the sources.
- Extra miles (light/dark mode, languages) until every main requirement is complete and reviewed by a coach.

### Feature Index

Each specification is written immediately before its feature is built. Add a row only when the file exists.

| # | Feature | Specification | Status |
| --- | --- | --- | --- |
| 1 | Setup & Deploy | [`ai/features/setup-deploy.feature.md`](features/setup-deploy.feature.md) | Done |
| 2 | Project Layout | [`ai/features/header-footer.feature.md`](features/header-footer.feature.md) | Built (on `dev`) |
| 3 | Home Page | [`ai/features/home-page.feature.md`](features/home-page.feature.md) | Built |
| 4 | Portfolio Page | [`ai/features/portfolio-page.feature.md`](features/portfolio-page.feature.md) | Built (résumé PDF pending) |

Planned order: `setup-deploy` → `header-footer` → `home-page` → `portfolio-page` → `link-page` → `contact-page` → `login-page` → `back-office`. Extra miles: `light-dark-mode`, `languages`.

---

## 4. Architecture

### Architecture overview

```
Browser (React SPA, built by Vite, served by GitHub Pages)
   │
   ├── Static content: JSON files in src/data/, images in src/assets/, résumé PDF in public/
   │
   └── src/lib/supabaseClient.js  (publishable/anon key only)
          │
          ▼
       Supabase
         ├── Auth (email/password, one admin)
         └── Postgres table `messages`, protected by row-level security
```

There is no server of our own. The browser talks to Supabase directly; row-level security decides what each request may do.

### Routing

**Decision: React Router with `HashRouter`.**

- **Why:** GitHub Pages serves static files only. With `HashRouter`, every page loads `index.html` at the domain root and the route lives after `#`, so the path stays `https://username.github.io/` (checklist), refreshing any page never returns a 404 (business document: routes must resolve from the root), and the portal slide recommends it.

| Route | Page | In public navigation | Access |
| --- | --- | --- | --- |
| `#/` | Home (landing page) | Yes | Public |
| `#/portfolio` | Portfolio | Yes | Public |
| `#/links` | Links | Yes | Public |
| `#/contact` | Contact | Yes | Public |
| `#/login` | Login | **No** | Typed URL only |
| `#/backoffice` | Back Office | **No** | Authenticated admin only |
| any other | Redirect to Home | — | — |

### Repository / project structure

```
.
├── .github/workflows/deploy.yml   # build + deploy to GitHub Pages on push to main
├── ai/
│   ├── ai-spec.md                 # this file
│   └── features/*.feature.md      # one per feature
├── docs/
│   ├── script-1.md                # elevator pitch, first script
│   ├── pitch-feedback.md          # documented outside feedback
│   └── script-2.md                # elevator pitch, revised script
├── LeetCode-Challenges/<challenge-name>.png
├── public/
│   └── resume.pdf                 # finalized résumé, downloadable from Portfolio
├── src/
│   ├── main.jsx                   # entry point; mounts <HashRouter>
│   ├── App.jsx                    # route table
│   ├── assets/images/             # AI-generated logo and images
│   ├── components/
│   │   ├── layout/                # MainLayout, Header (Navbar), Footer
│   │   └── ...                    # shared UI (e.g. ProtectedRoute, MessageModal)
│   ├── data/*.json                # skills, education, work, projects, links
│   ├── lib/supabaseClient.js      # the only Supabase client
│   ├── pages/                     # Home, Portfolio, Links, Contact, Login, BackOffice
│   └── styles/                    # global CSS and design tokens
├── .env.example                   # variable names only, no values
├── CONCEPTS.md
├── README.md
├── index.html
├── package.json
└── vite.config.js                 # base: '/'
```

Not tracked: `.env`, `dist/`, `node_modules/`, `AGENTS.md`, `Module_Vault_Import/`, the Submission Summary.

### Component responsibilities

- **`MainLayout`** wraps every page between `Header` and `Footer`. Pages never render their own header or footer.
- **Pages** compose sections and read static content from `src/data/`.
- **`supabaseClient.js`** is the only file that creates a Supabase client. Every Supabase call imports it.
- **`ProtectedRoute`** (or equivalent) checks the session before rendering the Back Office.
- **Row-level security** is the real security boundary. Hiding a route is not security.

### Running the project

```bash
npm install
cp .env.example .env   # then fill in the two values
npm run dev            # local development
npm run lint
npm run build          # outputs dist/
```

---

## 5. Allowed Technologies & Constraints

### Required / allowed

| Technology | Use |
| --- | --- |
| React + Vite (JavaScript) | Application and build |
| `react-router-dom` (`HashRouter`) | Client-side routing |
| `@supabase/supabase-js` | Auth and the `messages` table |
| `react-icons` | Skill and navigation icons |
| Custom CSS (plain CSS files, CSS custom properties) | All styling |
| oxlint (Vite default config, `.oxlintrc.json`) | Linting |
| GitHub Actions + GitHub Pages | CI/CD and hosting |
| AI image tools | Logo and page images, each documented |

Any other dependency requires an approved feature specification that proves it is necessary.

### Prohibited

- Backend frameworks (Express, Next.js API routes, serverless functions) or server-side rendering.
- CSS or component frameworks that replace custom CSS (Tailwind, Bootstrap, MUI).
- The Supabase `service_role` or secret key anywhere in the project.
- Hard-coded credentials, keys, or URLs that belong in environment variables.

### Technical constraints

- Environment variables use the `VITE_` prefix: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- `.env` is never committed. `.env.example` lists the names with empty values.
- The deploy workflow injects both variables from repository secrets at build time.
- `vite.config.js` sets `base: '/'` (root-level `username.github.io` repository).
- The application must not crash when Supabase is unconfigured (§6).

---

## 6. Supabase Setup

Required work, configured once. Per the checklist, it is not its own feature specification; `setup-deploy.feature.md` references this section.

### Table `messages`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `bigint` identity (or `uuid`) | Primary key |
| `created_at` | `timestamptz` | Default `now()`, not null |
| `name` | `text` | Not null |
| `email` | `text` | Not null |
| `message` | `text` | Not null |

### Row-level security

RLS is **enabled** on `messages`, with exactly these policies:

| Operation | Role | Rule |
| --- | --- | --- |
| `INSERT` | `anon` (and `authenticated`) | Allowed |
| `SELECT` | `authenticated` | Allowed |
| `DELETE` | `authenticated` | Allowed |
| `SELECT` / `UPDATE` / `DELETE` | `anon` | **Denied** (no policy) |

### Authentication

- Email/password provider enabled.
- **"Allow new users to sign up" is disabled**, so nobody can create an `authenticated` account with the public key and read messages.
- The single admin user is created manually in Supabase Dashboard → Authentication → Users. Its password is never written in a tracked file.

### Client and graceful degradation

- `src/lib/supabaseClient.js` reads `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- If either is missing, it exports no client (and a flag such as `isSupabaseConfigured = false`) instead of throwing.
- Every feature that uses Supabase checks that flag and shows a clear "unavailable" message. The public pages always render.

---

## 7. Coding Standards & Conventions

### Naming

- Components and pages: `PascalCase.jsx` (`MainLayout.jsx`, `BackOffice.jsx`).
- Hooks: `useCamelCase.js`. Utilities and data: `camelCase.js` / `kebab-case.json`.
- CSS classes: `kebab-case`.
- Feature specifications: `kebab-case.feature.md`.

### File & folder

- One component per file. A component's CSS sits next to it or in `src/styles/`.
- Static content lives in `src/data/*.json`, not inline in JSX.
- Images live in `src/assets/images/`; the résumé PDF lives in `public/`.

### Code organization

- Supabase calls live in pages, hooks, or small helpers that import `supabaseClient.js`, never in layout components.
- Every async Supabase call handles loading, success, and error states.
- No commented-out code, debugging output, placeholders, or unused files in committed work.

### Accessibility & responsive design

- Every image has descriptive `alt` text.
- Every AI-generated image or logo has its generating tool documented in a code comment, `RESEARCH.md`, or its feature specification.
- Forms use real `<label>` elements or visible placeholders, correct input types, and keyboard-reachable controls.
- One breakpoint: desktop `>768px`, mobile `≤768px`. No horizontal scrolling, no overflowing content, sections stack on narrow screens.
- The current page is visibly indicated in navigation.

### Formatting

- Follow the Vite oxlint configuration (`.oxlintrc.json`); `npm run lint` passes with no errors.
- Consistent two-space indentation and semicolons, matching the scaffolded files.

---

## 8. Branch and Git Workflow

- `main`: production. Only branch graded. **Every push to `main` deploys the public site.**
- `dev`: integration branch. All work merges here first.
- `feature/module-16-<descriptive-work-name>`: one per feature, created from `dev`, merged back into `dev`.
- No direct commits to `main`. `dev` is merged into `main` only after verification.
- Commit history must show feature → dev → main.
- Git actions follow `AGENTS.md`: each commit, push, merge, or branch change needs explicit approval.

---

## 9. Verification and Evidence

Report each type separately; one never proves another:

1. Repository and static inspection.
2. `npm run lint` and `npm run build`.
3. Local browser behavior (desktop and ≤768px).
4. GitHub Actions deployment run.
5. Deployed-site behavior at `https://username.github.io`.
6. Supabase data and row-level security (when touched).

Local verification comes before merging to `main`. Deployed-site checks are **deferred** while the repository is private.

---

## 10. Global Definition of Done

A feature is done only when **all** of these are true:

- [ ] Its feature specification exists, was approved before implementation, and is listed in the Feature Index.
- [ ] Every requirement and checklist line in the specification is implemented and its acceptance criteria pass.
- [ ] `npm run lint` and `npm run build` succeed with no errors.
- [ ] The feature works in a local browser at desktop width and at ≤768px, with no console errors.
- [ ] Loading, success, error, and empty states behave as specified (where applicable).
- [ ] The app still loads when Supabase is unconfigured.
- [ ] Every image has `alt` text; every AI image's tool is documented.
- [ ] No credential, key, or `.env` file is tracked; `git diff --check` is clean.
- [ ] The login route and `/backoffice` still appear in no public navigation.
- [ ] Work is merged feature → `dev`, and a completion report exists.
- [ ] After merging to `main`: the deployment run succeeds and the feature works on the live site (deferred while private).

---

## 11. Cross-Feature Rules

- Every page renders inside `MainLayout`.
- All Supabase access goes through `src/lib/supabaseClient.js`, using only the publishable (anon) key.
- Hidden routes (`#/login`, `#/backoffice`) are never linked from the header, footer, or mobile navigation.
- Visual style (colors, spacing, typography) comes from shared CSS custom properties, so every page looks like one site.
- User-facing feedback (validation, success, error) is visually distinct and never silent.
- Content is mine and truthful: no placeholder text, fake experience, or invented projects in the final site.
- Changing a shared component (layout, Supabase client, global styles) requires naming every consumer in the plan.
