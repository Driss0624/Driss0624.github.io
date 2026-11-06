# Feature Specification — Back Office

*Feature 8 of 8 · Branch: `feature/module-16-back-office` · Must be used with `ai/ai-spec.md` (§4 Routes, §6 Supabase) and `ai/features/login-page.feature.md` · Last updated: 2026-11-04*

---

## 1. Feature Goal and Outcomes

Give the signed-in admin one private page to read and delete the messages sent through the Contact form, and to log out.

When this feature is done:

- `#/backoffice` shows nothing until the session has been checked.
- A signed-out visitor is sent to `#/login`.
- The admin sees every message in a table, newest first, with Name, Email, Date, and Actions columns.
- "View" opens a modal with the sender, the date and time, and the full message.
- "Delete" removes a message from the database and from the table without a reload.
- "Log out" ends the session and returns to `#/login`.

---

## 2. Feature Scope

### In scope

- A `ProtectedRoute` component and its use on the `/backoffice` route in `App.jsx`.
- Replacing the placeholder `BackOffice.jsx` with the page header, logout button, and message list.
- `MessageTable` and `MessageModal` components.
- `src/data/back-office.json` holding the page text.
- The Feature Index row in `ai/ai-spec.md`.

### Out of scope

- Any change to Supabase: the `messages` table, its RLS policies, the admin user, or Auth settings.
- Replying to, editing, searching, sorting, filtering, or paginating messages, and read/unread status.
- Any change to the navigation, the shared layout, the Login page, or the Contact form.
- New dependencies.

---

## 3. Constraints

- Follow `ai/ai-spec.md` §5, §6, and §7: content in `src/data/*.json`, one component per file, tokens for every color and spacing value, the single 768px breakpoint, and feedback that is visually distinct and never silent.
- All Supabase calls use the shared client from `src/lib/supabaseClient.js`.
- The authentication check finishes before any Back Office content renders (`AGENTS.md` §7).
- The route stays unlinked from public navigation. RLS, not the guard, is what protects the data (`ai-spec.md` §4).
- When `isSupabaseConfigured` is false, the route redirects to `#/login`, which already explains that sign-in is unavailable. Nothing crashes.
- Message content comes from the public, so it renders as plain text only, never as HTML.
- One `<h1>` ("Back Office").

---

## 4. Decisions Already Taken

| Decision | Source |
| --- | --- |
| The route is `/backoffice` (`#/backoffice`), already registered in `App.jsx` as a hidden route inside `MainLayout` | `ai-spec.md` §4 |
| A `ProtectedRoute` component checks the session; a `MessageModal` component shows one message | `ai-spec.md` §4 (Repository structure, Component responsibilities) |
| The authenticated admin may `SELECT` and `DELETE`; nobody may `UPDATE` | `ai-spec.md` §6 |
| `messages` holds `id`, `created_at`, `name`, `email`, `message` | `ai-spec.md` §6 |
| The modal uses the browser's native `<dialog>` element, which supplies Escape, focus containment, focus return, and a backdrop with no dependency | Smallest compliant option (`AGENTS.md` §7) |

---

## 5. Requirements Breakdown and User Flow

| ID | Requirement |
| --- | --- |
| BO-FR-01 | `ProtectedRoute` calls `supabase.auth.getSession()` before rendering its children, and renders nothing while checking. |
| BO-FR-02 | With a session, the Back Office renders. With no session, a failed check, or an unconfigured Supabase, the app redirects to `#/login`, replacing the entry in browser history. |
| BO-FR-03 | `ProtectedRoute` also listens with `supabase.auth.onAuthStateChange`, so a session that ends while the page is open redirects to `#/login`. The listener is removed on unmount. |
| BO-FR-04 | No header, footer, or mobile navigation link points to `#/backoffice`. |
| BO-FR-05 | On load, the page fetches `id, name, email, message, created_at` from `messages`, ordered by `created_at` descending. |
| BO-FR-06 | While fetching, the page shows "Loading messages…". |
| BO-FR-07 | If the fetch fails, a red error message with a "Try again" button is shown. |
| BO-FR-08 | If there are no messages, "No messages yet" is shown instead of the table. |
| BO-FR-09 | Otherwise a real `<table>` shows the columns Name, Email, Date, and Actions, with one row per message. |
| BO-FR-10 | Each row's Actions cell has a "View" button and a "Delete" button with a trash icon. Each button's accessible name includes the sender's name. |
| BO-FR-11 | "View" opens a modal showing the sender's name and email, the date and time, and the full message, keeping its line breaks. |
| BO-FR-12 | The modal closes with its "Close" button, with Escape, or by clicking outside it. Focus returns to the "View" button that opened it. |
| BO-FR-13 | "Delete" replaces that row's buttons with "Delete this message? This cannot be undone." and "Confirm" and "Cancel" buttons. Focus moves to "Cancel". "Cancel" restores the row, returns focus to "Delete", and sends nothing. |
| BO-FR-14 | On "Confirm", the row's buttons are disabled and the delete is sent. Once Supabase confirms that the row was removed, it disappears with no reload and "Message deleted." is shown. |
| BO-FR-15 | If the delete fails, or Supabase reports that no row was removed, the row stays and a red error message is shown. |
| BO-FR-16 | A "Log out" button is visible on the page and calls `supabase.auth.signOut()`. It is disabled during the request. |
| BO-FR-17 | After logging out, the session is gone from browser storage and the app is on `#/login`. The browser's Back button does not reopen the Back Office. |
| BO-FR-18 | If logging out fails, the admin stays on the page and a red error message is shown. |
| BO-FR-19 | The layout works from 320px up with no sideways page scrolling. Long names, emails, and messages wrap. At 768px or narrower, each table row stacks as a card with its column labels shown. |
| BO-FR-20 | All visible text lives in `src/data/back-office.json`. |

### User flow (admin)

1. Signs in, or opens `#/backoffice` with a session: the messages load, newest first.
2. Selects "View": reads the full message, then closes the modal.
3. Selects "Delete", then "Confirm": the row disappears.
4. Selects "Log out": lands on the login page, and the Back Office can't be reopened without signing in.

### User flow (signed-out visitor)

1. Types `https://driss0624.github.io/#/backoffice`: sees no Back Office content and lands on the login page.

---

## 6. Interfaces and Files Involved

| File | Change |
| --- | --- |
| `src/App.jsx` | Wrap the `/backoffice` route in `ProtectedRoute`. No other route changes |
| `src/components/ProtectedRoute.jsx` | New. Session check, listener, redirect |
| `src/pages/BackOffice.jsx` | Replace placeholder with header, logout, fetch, delete, states |
| `src/pages/BackOffice.css` | New. Page header and state messages |
| `src/components/MessageTable.jsx` | New. The table and its row buttons |
| `src/components/MessageTable.css` | New. Table styles and the stacked layout at ≤768px |
| `src/components/MessageModal.jsx` | New. The `<dialog>` showing one message |
| `src/components/MessageModal.css` | New. Dialog and backdrop styles |
| `src/data/back-office.json` | New. Page text |
| `ai/ai-spec.md` | Add the Back Office row to the Feature Index |

**Routes:** `/backoffice` keeps its path and gains the guard.
**Supabase:** session read, `SELECT`, `DELETE`, and sign-out only; no schema, policy, or settings change.
**Shared components and tokens:** none changed. The existing `--color-danger` tokens are reused.

---

## 7. Data, Validations, and Expected Behavior

### Text (`back-office.json`)

| Key | Value (draft) |
| --- | --- |
| `title` | Back Office |
| `intro` | Messages sent through your contact form. |
| `logout` / `loggingOut` | Log out / Logging out… |
| `logoutFailed` | Could not log out. Please try again. |
| `columns` | Name · Email · Date · Actions |
| `loading` | Loading messages… |
| `loadFailed` / `retry` | Could not load messages. / Try again |
| `empty` | No messages yet |
| `view` / `delete` | View / Delete |
| `confirmDelete` | Delete this message? This cannot be undone. |
| `confirm` / `cancel` | Confirm / Cancel |
| `deleted` | Message deleted. |
| `deleteFailed` | Could not delete the message. Please try again. |
| `modal` | From · Email · Date · Message · Close |

### Session check

```js
const { data } = await supabase.auth.getSession()
// data.session → render the page
// no session, or the call fails → <Navigate to="/login" replace />
```

### Fetch

```js
const { data, error } = await supabase
  .from('messages')
  .select('id, name, email, message, created_at')
  .order('created_at', { ascending: false })
```

### Delete

```js
const { data, error } = await supabase
  .from('messages')
  .delete()
  .eq('id', id)
  .select('id')
```

`.select('id')` matters: when RLS blocks a delete, Supabase reports no error and simply removes nothing. An empty `data` is therefore treated as a failure, so the page never says a message was deleted when it wasn't.

### Dates

Times are stored in UTC and shown in the viewer's own time zone with `Intl.DateTimeFormat`.

| Where | Example |
| --- | --- |
| Table | Nov 4, 2026 |
| Modal | Nov 4, 2026, 2:30 PM |

### States

| State | Look | Announced |
| --- | --- | --- |
| `checking` | Nothing renders | — |
| `loading` | "Loading messages…" | `role="status"` |
| `error` | Red box with "Try again" | `role="alert"` |
| `empty` | "No messages yet" | `role="status"` |
| `ready` | Table | — |
| Deleted | "Message deleted." above the table; focus moves to the page heading, because the focused button no longer exists | `role="status"` |
| Delete or logout failed | Red box above the table | `role="alert"` |

### Behavior by viewport

| Width | Layout |
| --- | --- |
| > 768px | Header with the logout button on the right; full-width table |
| ≤ 768px | Logout button under the title; each row stacks as a card with its column labels; modal nearly full width and scrolls inside itself |

---

## 8. Task Breakdown

| ID | Task | Requirements |
| --- | --- | --- |
| BO-TASK-01 | Create `back-office.json` | FR-20 |
| BO-TASK-02 | Build `ProtectedRoute.jsx` and use it in `App.jsx` | FR-01 to FR-03 |
| BO-TASK-03 | Build `MessageTable.jsx` and its CSS | FR-09, FR-10, FR-19 |
| BO-TASK-04 | Build `MessageModal.jsx` and its CSS | FR-11, FR-12, FR-19 |
| BO-TASK-05 | Build `BackOffice.jsx` and its CSS: fetch, states, delete, logout | FR-05 to FR-08, FR-13 to FR-18 |
| BO-TASK-06 | Confirm the route is unlinked; add the Feature Index row | FR-04 |
| BO-TASK-07 | Verify every state and width, then Driss performs the real delete and logout; record evidence | All |

### Traceability (checklist → requirement → task)

| Checklist line | Requirement ID | Task ID | Planned file change | Verification method |
| --- | --- | --- | --- | --- |
| 🤖🛠️ AI Feature Specification — Back Office | — | — | This file | File exists; listed in Feature Index |
| 🛠️ Back Office Route (authenticated renders; not authenticated redirects; verify before rendering; not in public navigation) | FR-01, FR-02, FR-03, FR-04 | TASK-02, 06 | `ProtectedRoute.jsx`, `App.jsx` | Visit signed in and signed out; search the rendered links on every page |
| 🛠️ Messages Table Display (fetch; error; empty; Name, Email, Date, Actions; one row per message; newest first; delete button; disappears instantly) | FR-05 to FR-10, FR-13 to FR-15 | TASK-03, 05 | `BackOffice.jsx`, `MessageTable.jsx` | Compare the table to the fetch response; force the failure and empty responses; Driss deletes a test message |
| 🛠️ View Message Modal (name and email; date and time; full text; close button; click outside; Escape) | FR-11, FR-12 | TASK-04 | `MessageModal.jsx` | Open it, then close it each of the three ways |
| 🛠️ Logout Button (visible; `signOut()`; session cleared; redirected) | FR-16, FR-17, FR-18 | TASK-05 | `BackOffice.jsx` | Driss logs out; confirm the auth key left browser storage; Back button |

---

## 9. Acceptance Criteria and Verification

### Static inspection, lint, and build

- [x] Text lives in `back-office.json`.
- [x] Every Supabase call uses the shared client; no credentials appear in any tracked file.
- [x] No `dangerouslySetInnerHTML` is used.
- [x] `npm run lint` passes; `npm run build` succeeds; `git diff --check` is clean.

### Local browser — route

- [x] Signed out, `#/backoffice` lands on `#/login` and no Back Office content appears at any point. *(Checked right after Driss logs out, so the session is not touched before then.)*
- [x] Signed in, `#/backoffice` renders the page, with one `<h1>`.
- [x] No link to `#/backoffice` exists on any page, at desktop or mobile width.

### Local browser — messages (real data, read only)

- [x] The table has the columns Name, Email, Date, and Actions, and one row per message.
- [x] Rows are in newest-first order and match the fetch response.
- [x] The modal shows the name, email, date and time, and the full message with its line breaks.
- [x] The modal closes with "Close", with Escape, and by clicking outside it, and focus returns to its "View" button.
- [x] A message containing HTML shows as plain text.

### Local browser — forced states (the browser's request is stubbed; nothing is deleted)

- [x] A failed fetch shows the red error, and "Try again" loads the messages.
- [x] An empty result shows "No messages yet".
- [x] A loading delay shows "Loading messages…".
- [x] "Cancel" sends no request, restores the row, and returns focus to "Delete".
- [x] A failed delete keeps the row and shows the red error.
- [x] A delete that removes no row (empty result) keeps the row and shows the red error.

### Local browser — real delete and logout (done by Driss)

- [x] After sending a test message through the Contact form, it appears at the top of the table.
- [x] Deleting it removes the row with no reload, and it is still gone after a refresh.
- [x] "Log out" lands on `#/login`, and the Supabase auth key is gone from browser storage.
- [x] After logging out, the Back button and typing `#/backoffice` both end on `#/login`.

### Local browser — layout (desktop, 768px, 375px, 320px)

- [x] `document.documentElement.scrollWidth` equals the viewport width; nothing is hidden behind the bottom bar.
- [x] A very long name, email, and message wrap inside the table and the modal.
- [x] No console errors at any width.

### Deployed

- [ ] After Driss merges `dev` into `main`, a signed-out visit to `#/backoffice` redirects, and the admin can read and delete a message and log out on the live site. *(Driss controls `main`; the agent does not push it.)*

---

## Needs review

- **Checklist coverage:**
  - Back Office Route → FR-01, FR-02, FR-03, FR-04
  - Messages Table Display → FR-05 to FR-10, FR-13 to FR-15
  - View Message Modal → FR-11, FR-12
  - Logout Button → FR-16, FR-17, FR-18
- **Assumptions:**
  - Delete asks for confirmation inside the row. The checklist doesn't ask for this, but a delete can't be undone. The first version used the browser's `window.confirm`; Driss chose in-page buttons on 2026-11-04 because the Claude app's Browser pane blocks that pop-up.
  - The row disappears after Supabase confirms the delete rather than before, so a failed delete never looks successful. This normally takes well under a second.
  - The checklist allows Home or Login after logout; this spec uses Login.
  - "View" is a button rather than a clickable row, because the checklist allows either and a button works with the keyboard without extra code.
  - Supabase returns up to 1,000 rows per request by default, which is far more than this site will receive, so there is no pagination.
  - The real delete and logout are done by Driss, because the agent doesn't delete real data and the session belongs to Driss.
  - The stacked cards at ≤768px use CSS on the same `<table>`, so there is only one copy of the markup.
  - A failed load takes about 7 seconds to show its error, because the Supabase client retries the request first. "Loading messages…" shows during that time.
  - The page text is a draft; Driss may reword it.
- **Open questions:** none.
- **Source conflicts:** none.
- **Spec gaps:** none.
- **Out-of-scope observations:** a "Reply" link using `mailto:` would be a convenient addition later; it is not required.
