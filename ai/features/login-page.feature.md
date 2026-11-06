# Feature Specification — Login Page

*Feature 7 of 8 · Branch: `feature/module-16-login-page` · Must be used with `ai/ai-spec.md` (§4 Routes, §6 Supabase) and `ai/features/header-footer.feature.md` · Last updated: 2026-11-04*

---

## 1. Feature Goal and Outcomes

Give the single admin a hidden way to sign in, so the Back Office can later show the messages sent through the Contact form.

When this feature is done:

- `#/login` shows a form with an email field, a password field, and a login button.
- No link to the page exists in the header, footer, or mobile navigation.
- The form signs in with Supabase Auth through the shared client.
- A successful sign-in goes to `#/backoffice`, and refreshing does not sign the admin out.
- An admin who is already signed in goes straight to `#/backoffice`.
- Wrong credentials show a red error message.

---

## 2. Feature Scope

### In scope

- Replacing the placeholder `Login.jsx` with a page header and the form.
- A `LoginForm` component holding the form state, the sign-in call, and the feedback.
- `src/data/login-page.json` holding the page and form text.

### Out of scope

- The Back Office page, the check that blocks signed-out visitors from it, and the logout button (`back-office.feature.md`).
- A sign-up, forgot-password, or "remember me" flow.
- Any change to Supabase: the admin user, Auth settings, the `messages` table, or its RLS policies.
- Any change to the navigation or the Contact form. The shared layout changes only to add the key press (LOGIN-FR-15).
- New dependencies.

---

## 3. Constraints

- Follow `ai/ai-spec.md` §5, §6, and §7: content in `src/data/*.json`, one component per file, tokens for every color and spacing value, the single 768px breakpoint, real `<label>` elements, correct input types, and feedback that is visually distinct and never silent.
- The sign-in uses the shared client from `src/lib/supabaseClient.js`. No second client, no keys in components.
- The admin email and password are never written in the code, this spec, or any tracked file, and the page does not display or pre-fill them.
- The route stays unlinked from public navigation. Hiding the route is not the security: RLS is (`ai-spec.md` §4).
- When `isSupabaseConfigured` is false, the page still renders and explains that sign-in is unavailable.
- One `<h1>` ("Admin login").

---

## 4. Decisions Already Taken

| Decision | Source |
| --- | --- |
| The route is `/login` (`#/login`), already registered in `App.jsx` as a hidden route inside `MainLayout` | `ai-spec.md` §4; Project Layout |
| The page is reached by typing the URL or by pressing Ctrl+Shift+L. The key press was added at Driss's request on 2026-11-04 and is not shown anywhere on the site | `ai-spec.md` §4; checklist "Secret Login Route" |
| The admin account already exists, and sign-ups are disabled | `ai-spec.md` §6; `setup-deploy.feature.md` |
| Sessions persist through the Supabase client's default browser storage; no custom session code | Checklist "Login Success / Failure"; Supabase client defaults |

---

## 5. Requirements Breakdown and User Flow

| ID | Requirement |
| --- | --- |
| LOGIN-FR-01 | The page renders at `#/login` inside `MainLayout`, with the `<h1>` "Admin login". No navigation link is active. |
| LOGIN-FR-02 | No header, footer, or mobile navigation link points to `#/login`. |
| LOGIN-FR-03 | The form has an `type="email"` input and a `type="password"` input, each with a visible `<label>`, and a submit button reading "Log in". |
| LOGIN-FR-04 | Both fields are required. On a failed submit, the page shows "Please enter your email and password.", focus moves to the first empty field, and nothing is sent. |
| LOGIN-FR-05 | On a complete submit, the form calls `supabase.auth.signInWithPassword({ email, password })` through the shared client. The email is trimmed; the password is sent exactly as typed. |
| LOGIN-FR-06 | While signing in, the fields and the button are disabled and the button reads "Logging in…", so the request cannot be sent twice. |
| LOGIN-FR-07 | On success, the app navigates to `#/backoffice`, replacing the login page in browser history. |
| LOGIN-FR-08 | The session is stored by the Supabase client, so refreshing `#/backoffice` or reopening the site does not sign the admin out. |
| LOGIN-FR-09 | On load, the page checks `supabase.auth.getSession()`. If a valid session exists, it redirects to `#/backoffice` without showing the form. |
| LOGIN-FR-10 | Wrong credentials show a red message with an X icon reading "Invalid login credentials". Any other failure (network, rate limit, server) shows "Something went wrong. Please try again." Both use `role="alert"`. |
| LOGIN-FR-11 | After a failure, the email is kept, the password is cleared, and focus moves to the password field. Typing again hides the message. |
| LOGIN-FR-12 | When Supabase is not configured, a notice replaces the form and the page does not crash. |
| LOGIN-FR-13 | The layout works from 320px up; at 768px or narrower the form takes the full width. |
| LOGIN-FR-14 | All visible text lives in `src/data/login-page.json`. |
| LOGIN-FR-15 | Pressing Ctrl+Shift+L on any page opens `#/login`, unless the cursor is in an `<input>` or `<textarea>`, so typing in a form is never interrupted. |

### User flow (admin)

1. Types `https://driss0624.github.io/#/login`: sees the title and the form.
2. Enters the email and password and selects "Log in": the button shows "Logging in…".
3. If they are correct: the Back Office opens. Refreshing keeps the admin signed in.
4. If they are wrong: a red message appears and the password field is cleared for another try.
5. Later visits to `#/login` while still signed in go straight to the Back Office.

---

## 6. Interfaces and Files Involved

| File | Change |
| --- | --- |
| `src/pages/Login.jsx` | Replace placeholder with header and `LoginForm` |
| `src/pages/Login.css` | New. Page header and layout |
| `src/components/LoginForm.jsx` | New. Fields, state, session check, sign-in, feedback |
| `src/components/LoginForm.css` | New. Field, button, and feedback styles |
| `src/data/login-page.json` | New. Page and form text |
| `src/components/layout/MainLayout.jsx` | Add the Ctrl+Shift+L listener. It renders nothing, and every page uses this layout |
| `ai/ai-spec.md` | Add the Login row to the Feature Index |

**Routes:** unchanged. `App.jsx` already registers `/login` and `/backoffice`.
**Supabase:** Auth sign-in and session read only; no schema, policy, or settings change.
**Shared components and tokens:** none changed. The existing `--color-danger` tokens are reused.

---

## 7. Data, Validations, and Expected Behavior

### Text (`login-page.json`)

| Key | Value (draft) |
| --- | --- |
| `title` | Admin login |
| `intro` | This area is for the site owner. |
| `labels` | Email · Password |
| `submit` / `submitting` | Log in / Logging in… |
| `required` | Please enter your email and password. |
| `invalid` | Invalid login credentials |
| `failure` | Something went wrong. Please try again. |
| `unavailable` | Sign-in is unavailable right now. |

### Fields

| Field | Element | Attributes | Rule |
| --- | --- | --- | --- |
| `email` | `<input type="email">` | `autocomplete="username"`, `maxLength=254` | Required after trimming |
| `password` | `<input type="password">` | `autocomplete="current-password"` | Required; not trimmed |

The form uses `noValidate`, so the message above replaces the browser's built-in bubbles. There is no email format check: a malformed address simply fails as wrong credentials, and only the admin uses this form.

### Sign-in

```js
const { error } = await supabase.auth.signInWithPassword({
  email: email.trim(),
  password,
})
```

- `error` is `null` → `navigate('/backoffice', { replace: true })`.
- `error.code === 'invalid_credentials'` → the `invalid` message.
- Any other `error`, or a thrown network error → the `failure` message.

### Session check

```js
const { data } = await supabase.auth.getSession()
if (data.session) navigate('/backoffice', { replace: true })
```

If the check itself fails, the form is shown as normal.

### States

| State | Look | Announced | Fields |
| --- | --- | --- | --- |
| `checking` | Page header only; no form, so a signed-in admin never sees it flash | — | Hidden |
| `idle` | Form | — | As typed |
| `incomplete` | Red message under the fields | `aria-live` region | Kept; focus on first empty field |
| `submitting` | Fields and button disabled, "Logging in…" | — | Locked |
| `invalid` / `failure` | Red box, `FaTimesCircle` | `role="alert"` | Email kept; password cleared; focus on password |

### Behavior by viewport

| Width | Layout |
| --- | --- |
| > 768px | Header above a form card about 420px wide |
| ≤ 768px | Header and form full width; button full width |

---

## 8. Task Breakdown

| ID | Task | Requirements |
| --- | --- | --- |
| LOGIN-TASK-01 | Create `login-page.json` | FR-14 |
| LOGIN-TASK-02 | Build `LoginForm.jsx`: fields, required check, session check, sign-in, feedback | FR-03 to FR-12 |
| LOGIN-TASK-03 | Build `Login.jsx`, `Login.css`, `LoginForm.css` | FR-01, FR-13 |
| LOGIN-TASK-04 | Confirm the route is unlinked; add the Feature Index row | FR-02 |
| LOGIN-TASK-05 | Verify empty submit, wrong credentials, forced failure, and widths; Driss verifies the real sign-in, refresh, and redirect; record evidence | All |
| LOGIN-TASK-06 | Add the Ctrl+Shift+L listener to `MainLayout.jsx` and verify it | FR-15 |

### Traceability (checklist → requirement → task)

| Checklist line | Requirement ID | Task ID | Planned file change | Verification method |
| --- | --- | --- | --- | --- |
| 🤖🛠️ AI Feature Specification — Login Page | — | — | This file | File exists; listed in Feature Index |
| 🛠️ Secret Login Route (not in header, footer, or mobile nav; typed URL or secret key press) | FR-01, FR-02, FR-15 | TASK-03, 04, 06 | `Login.jsx`, `MainLayout.jsx`; no navigation change | Search the rendered links on every page; type the URL; press Ctrl+Shift+L |
| 🛠️ Login Form Fields (email, password, submit) | FR-03 | TASK-02 | `LoginForm.jsx` | Inspect element types and labels |
| 🛠️ Supabase Authentication (`signInWithPassword`; shared client; pre-created admin) | FR-05, FR-06 | TASK-02 | `LoginForm.jsx` | Network tab shows `POST /auth/v1/token?grant_type=password`; no second client in the code |
| 🛠️ Login Success (Back Office; session persists; refresh; existing session redirects) | FR-07, FR-08, FR-09 | TASK-02, 05 | `LoginForm.jsx` | Driss signs in, refreshes, then revisits `#/login` |
| 🛠️ Login Failure (error shown; visually distinct) | FR-10, FR-11 | TASK-02, 03 | `LoginForm.jsx`, `LoginForm.css` | Submit wrong credentials; confirm the red message |

---

## 9. Acceptance Criteria and Verification

### Static inspection, lint, and build

- [x] Text lives in `login-page.json`.
- [x] The sign-in uses the shared client; no credentials appear in any tracked file.
- [x] `npm run lint` passes; `npm run build` succeeds; `git diff --check` is clean.

### Local browser — form and failure

- [x] `#/login` loads by typing the URL, with one `<h1>`.
- [x] No link to `#/login` exists on any page, at desktop or mobile width.
- [x] Ctrl+Shift+L opens the login route from a public page.
- [x] Ctrl+Shift+L does nothing while the cursor is in a form field.
- [x] Submitting the empty form shows the required message; no request is sent.
- [x] Made-up credentials return `400` from Supabase and show "Invalid login credentials" in red, with `role="alert"`.
- [x] After that failure, the email is kept, the password is cleared, and typing hides the message.
- [x] With Supabase unreachable (a separate test build pointed at `https://unreachable.invalid`), "Something went wrong. Please try again." appears.
- [x] The button is disabled and reads "Logging in…" during the request.

### Local browser — real sign-in (done by Driss)

- [x] Correct credentials open `#/backoffice`.
- [x] Refreshing `#/backoffice` keeps the session (Supabase's token is still in browser storage).
- [x] Revisiting `#/login` while signed in redirects to `#/backoffice` without showing the form.

### Local browser — layout (desktop, 768px, 375px, 320px)

- [x] `document.documentElement.scrollWidth` equals the viewport width; nothing is hidden behind the bottom bar.
- [x] No console errors at any width. *(The only browser console entry on this page is its own note of the `400` after a wrong password; the app logs nothing.)*

### Deployed

- [ ] After Driss merges `dev` into `main`, the admin can sign in on the live site and stay signed in after a refresh. *(Driss controls `main`; the agent does not push it.)*

---

## Needs review

- **Checklist coverage:**
  - Secret Login Route → FR-01, FR-02, FR-15
  - Login Form Fields → FR-03
  - Supabase Authentication → FR-05, FR-06
  - Login Success / Failure → FR-07, FR-08, FR-09, FR-10, FR-11
- **Assumptions:**
  - Until the Back Office is built, a successful sign-in lands on its placeholder page, and that page is not protected yet. It shows no data, and RLS still blocks anonymous reads.
  - There is no logout button until the Back Office is built. To test again after signing in, the session can be cleared from the browser's site data.
  - `LoginForm.css` has its own small set of field and button styles rather than changing the Contact form's classes, so Contact stays untouched.
  - The real sign-in is tested by Driss, because the agent does not type the admin password.
  - The page text is a draft; Driss may reword it.
- **Open questions:** none.
- **Source conflicts:** the admin credentials conflict in `AGENTS.md` does not change this page, because the form takes whatever is typed and the account already exists.
- **Spec gaps:** none.
- **Out-of-scope observations:** none.
- **Key press limits:** phones have no keyboard, so the typed URL stays the way in on mobile. The shortcut is visible in this public repository; RLS, not secrecy, protects the data.
