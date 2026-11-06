# Driss Elhail — Personal Portfolio

A personal portfolio website that presents my skills, education, experience, and projects. Visitors can send me a message through a contact form, and a hidden admin area lets me read and delete those messages.

- **Live site:** https://driss0624.github.io
- **Module:** CodeBoxx FSD-1616 Professional Development (Module 16)

## Tech Stack

| Area | Technology |
| --- | --- |
| Front end | React 19, Vite 8 (JavaScript) |
| Routing | React Router 7 with `HashRouter` |
| Icons | react-icons |
| Back end as a service | Supabase (Postgres database and email/password auth) |
| Linting | oxlint |
| Hosting | GitHub Pages, deployed by GitHub Actions |

There is no custom server. The browser talks to Supabase directly, and row-level security decides what each request may do.

## Project Structure

```
.
├── .github/workflows/deploy.yml   # Builds and deploys to GitHub Pages on push to main
├── ai/
│   ├── ai-spec.md                 # Project-wide AI specification
│   └── features/                  # One specification per feature
├── public/                        # Files served as-is (favicon, resume.pdf)
├── src/
│   ├── assets/images/             # AI-generated logo and images
│   ├── components/                # Page pieces, ProtectedRoute, message table and modal
│   │   └── layout/                # MainLayout, Header (with mobile nav), Footer
│   ├── data/                      # Static content as JSON (contact details, ...)
│   ├── lib/supabaseClient.js      # The only Supabase client
│   ├── pages/                     # One component per route
│   ├── styles/tokens.css          # Shared colors, spacing, and font
│   ├── App.jsx                    # Route table, wrapped in MainLayout
│   ├── main.jsx                   # Entry point; wraps the app in HashRouter
│   └── index.css                  # Base styles
├── docs/                          # Elevator pitch scripts and feedback
├── LeetCode-Challenges/           # Screenshots of the five solved challenges
├── .env.example                   # Names of the required environment variables
├── CONCEPTS.md                    # Three challenging concepts from this project
├── index.html
└── vite.config.js                 # base: '/' for the root GitHub Pages site
```

### Routes

| Route | Page | Access |
| --- | --- | --- |
| `#/` | Home | Public |
| `#/portfolio` | Portfolio | Public |
| `#/links` | Links | Public |
| `#/contact` | Contact | Public |
| `#/login` | Login | Hidden (typed URL or Ctrl+Shift+L) |
| `#/backoffice` | Back Office | Signed-in admin only |

Any other route redirects to Home. Because the app uses `HashRouter`, the browser path always stays at the domain root and refreshing any page never returns a 404.

## Installation / Setup Instructions

Requirements: Node.js (LTS) and npm.

```bash
git clone https://github.com/Driss0624/Driss0624.github.io.git
cd Driss0624.github.io
npm install
cp .env.example .env   # then fill in the two values (see Environment Variables)
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run lint` | Runs oxlint |
| `npm run build` | Builds the production site into `dist/` |
| `npm run preview` | Serves the built `dist/` locally |

### Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which runs `npm ci` and `npm run build`, then publishes `dist/` to GitHub Pages. In the repository settings, Pages must use **GitHub Actions** as its source, and the two environment variables below must exist as repository secrets.

### Supabase

The Supabase project needs:

- A `messages` table (`id`, `created_at`, `name`, `email`, `message`) with row-level security enabled.
- Policies: anyone may insert; only signed-in users may select and delete; nobody may update.
- Email/password auth with **new sign-ups disabled**, and a single admin user created in the dashboard.

The full definition is in [`ai/ai-spec.md`](ai/ai-spec.md) §6.

## Environment Variables

| Variable | Where to find it | Used for |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Supabase → Project Settings → Data API | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API Keys → Publishable key | Public (anon) key |

- Locally they live in `.env`, which is git-ignored and never committed.
- For deployment they are repository secrets (Settings → Secrets and variables → Actions), passed to the build step by the workflow.
- Only the publishable key is used. The secret / `service_role` key never goes in this project.
- If either variable is missing, the site still loads; features that need Supabase show an "unavailable" message instead.

## API Documentation

The site has no API of its own. It uses the Supabase client library against one table:

| Action | Who | Supabase call | Allowed by |
| --- | --- | --- | --- |
| Send a message | Any visitor | `insert` into `messages` | Insert policy for `anon` |
| Sign in | Admin | `auth.signInWithPassword` | Email/password auth |
| Read messages | Signed-in admin | `select` from `messages` | Select policy for `authenticated` |
| Delete a message | Signed-in admin | `delete` from `messages` | Delete policy for `authenticated` |

## Author

**Driss Elhail**

- GitHub: [Driss0624](https://github.com/Driss0624)
- Email: [drisselhail08@gmail.com](mailto:drisselhail08@gmail.com)
- LinkedIn: [drisselhail](https://www.linkedin.com/in/drisselhail/)

### LinkedIn Update

For Module 16, I updated my LinkedIn profile to present myself as a junior full-stack developer entering the job market:

- **Headline and About:** named my target role and main technologies, and rewrote the About section with examples from CodeBloggs and this portfolio.
- **Education and work:** corrected my CodeBoxx and Lennard High School entries, updated my Cook position at Tropical Smoothie Cafe, and removed an inaccurate entry and a duplicate one.
- **Projects and skills:** added CodeBloggs and this portfolio, added my GitHub and portfolio to Featured, and linked my skills to those projects.
- **Profile details:** added a custom banner, expanded my job preferences, and replaced the generated address with a custom URL.
