# Concepts

The three concepts I found most challenging while building this portfolio.

## Concept - 01

- **Name:** Row-Level Security (RLS) with a browser-only app
- **Purpose:** This site has no server of its own, so the browser talks straight to Supabase. RLS rules on the `messages` table decide what each request may do: anyone can send a message, but only the signed-in admin can read or delete messages.
- **Why it was challenging:** I had to change how I think about security. The Supabase key is public, because it ships in the browser code, so hiding the key or the login page protects nothing. The rules in the database are what protect the data. RLS also fails quietly. When it blocks a delete, Supabase returns no error and simply removes nothing, so the code looked like it worked even when it didn't. I fixed that by asking Supabase which rows it deleted and treating an empty answer as a failure.
- **Where:**
  - `src/pages/BackOffice.jsx`, lines 65–72: the delete, and the check that a row was really removed
  - `src/lib/supabaseClient.js`, lines 10–12: the client that uses the public key
  - `ai/ai-spec.md`, section 6: the table and its policies

## Concept - 02

- **Name:** Protected routes with an asynchronous session
- **Purpose:** The Back Office should only appear for a signed-in admin. Anyone else gets redirected to the Login page, and logging out sends the admin back there too.
- **Why it was challenging:** Supabase takes a moment to tell the app whether a session exists, so when the page first loads the answer is unknown. If the app decides too early, it either redirects a real admin to Login or shows the private page to a visitor for a split second. I had to use three states instead of a simple yes or no: checking, allowed, and denied. I also had to listen for the session ending while the page is open, which is how logout works. That is why the logout code doesn't redirect anywhere itself.
- **Where:**
  - `src/components/ProtectedRoute.jsx`, line 9: the three states
  - `src/components/ProtectedRoute.jsx`, lines 15–24: the first session check
  - `src/components/ProtectedRoute.jsx`, lines 27–29: listening for the session to end
  - `src/components/ProtectedRoute.jsx`, lines 37–38: the redirect, and showing nothing while checking
  - `src/App.jsx`, lines 22–29: wrapping the Back Office route
  - `src/pages/BackOffice.jsx`, lines 86–96: logout

## Concept - 03

- **Name:** Automated deployment with GitHub Actions and build-time environment variables
- **Purpose:** Every push to `main` builds the site and publishes it to GitHub Pages automatically, with the Supabase values supplied by GitHub secrets instead of being committed to the repository.
- **Why it was challenging:** The workflow has several parts that all have to line up: the trigger, the permissions, the build job, and the deploy job. The part that took the most understanding was environment variables. My `.env` file is never committed, so GitHub doesn't have it. Vite also copies these values into the code during the build, so they have to be passed to the build step itself, not added afterward. GitHub Pages only serves real files too, so refreshing a page like `/portfolio` would return a 404. Using `HashRouter` keeps the route after the `#`, so the server only ever sees the root page.
- **Where:**
  - `.github/workflows/deploy.yml`, lines 3–6: the trigger
  - `.github/workflows/deploy.yml`, lines 34–38: passing the secrets to the build
  - `.github/workflows/deploy.yml`, lines 48–57: the deploy job
  - `src/lib/supabaseClient.js`, lines 3–8: reading the values, and handling them being missing
  - `src/main.jsx`, lines 9–11: `HashRouter` around the app
  - `vite.config.js`, line 7: the base path
