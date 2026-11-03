# Feature Specification — Contact Page

*Feature 6 of 8 · Branch: `feature/module-16-contact-page` · Must be used with `ai/ai-spec.md` (§6 Supabase) and `ai/features/header-footer.feature.md` · Last updated: 2026-11-03*

---

## 1. Feature Goal and Outcomes

Let a visitor send Driss a message without leaving the site, and store it safely in Supabase for the Back Office.

When this feature is done:

- `#/contact` shows a form with name, email, and message, each with a visible label.
- The form refuses to submit while a field is empty or the email is malformed, and says why.
- A valid message is inserted into the Supabase `messages` table.
- The visitor sees a green success message (and the form clears) or a red failure message.
- It works at desktop width and at 768px or narrower, inside the shared layout.

---

## 2. Feature Scope

### In scope

- Replacing the placeholder `Contact.jsx` with a page header and the form.
- A `ContactForm` component holding the form state, validation, submission, and feedback.
- A pure validation function, kept apart from the component so its rules are easy to read and test.
- `src/data/contact-page.json` holding the page and form text.
- Two shared color tokens for success and error feedback.

### Out of scope

- Reading or deleting messages (Back Office).
- Email notifications, CAPTCHA, or spam filtering beyond length limits.
- Any change to the `messages` table or its RLS policies (§6 is already set up and verified).
- New dependencies.

---

## 3. Constraints

- Follow `ai/ai-spec.md` §5, §6, and §7: content in `src/data/*.json`, one component per file, tokens for every color, the single 768px breakpoint, real `<label>` elements, correct input types, and feedback that is visually distinct and never silent.
- The insert uses the shared client from `src/lib/supabaseClient.js`. No second client, no keys in components.
- The insert must **not** ask for the inserted row back (no `.select()`): the anonymous role has no `SELECT` policy, so asking for the row would make a successful insert look like a failure.
- When `isSupabaseConfigured` is false, the page still renders, explains that the form is unavailable, and offers the email address instead.
- One `<h1>` ("Contact").

---

## 4. Decisions Already Taken

| Decision | Source |
| --- | --- |
| Contact is the route `/contact` (`#/contact`), already routed and in the navigation | `ai-spec.md` §4; Project Layout |
| Messages are stored in `messages` (`name`, `email`, `message`; `id` and `created_at` set by the database) | `ai-spec.md` §6; checklist "Supabase Setup" |
| Anonymous visitors may only insert; RLS was verified during Setup & Deploy | `ai-spec.md` §6; `setup-deploy.feature.md` |
| The form uses custom validation messages rather than the browser's built-in bubbles, so the wording and look are consistent | Checklist "Validation errors are displayed to the user" |

---

## 5. Requirements Breakdown and User Flow

| ID | Requirement |
| --- | --- |
| CONT-FR-01 | The page renders at `#/contact` inside `MainLayout`; the Contact nav link is active. |
| CONT-FR-02 | A page header shows the `<h1>` "Contact", a short introduction, and Driss's email address as an alternative. |
| CONT-FR-03 | The form has a text input for **name**, an `type="email"` input for **email**, and a `<textarea>` for **message**, each with a visible `<label>`. |
| CONT-FR-04 | All three fields are required. Values are trimmed; a field containing only spaces counts as empty. |
| CONT-FR-05 | The email must match a basic address format (`something@something.domain`). |
| CONT-FR-06 | On a failed submit, each invalid field shows its own error under it (`aria-invalid`, linked with `aria-describedby`), a summary reads "Please fill in all fields." or "Please enter a valid email address.", and focus moves to the first invalid field. Nothing is sent. |
| CONT-FR-07 | On a valid submit, the form calls `supabase.from('messages').insert({ name, email, message })` through the shared client. |
| CONT-FR-08 | While sending, the button is disabled and reads "Sending…", so a message cannot be sent twice. |
| CONT-FR-09 | On success: a green message with a check icon reads "Message sent! I'll get back to you soon.", and all fields are cleared. |
| CONT-FR-10 | The success message disappears after 5 seconds or as soon as the visitor starts typing again. |
| CONT-FR-11 | On failure: a red message with an X icon reads "Something went wrong. Please try again, or email me at drisselhail08@gmail.com.", and the fields keep what the visitor typed. |
| CONT-FR-12 | When Supabase is not configured, a notice replaces the submit action and points to the email address; the page does not crash. |
| CONT-FR-13 | The layout works from 320px up; at 768px or narrower the form takes the full width. |
| CONT-FR-14 | All visible text lives in `src/data/contact-page.json`; the email address comes from the existing `src/data/contact.json`. |

### User flow (visitor)

1. Selects Contact in the navigation: sees the title, the intro, and the form.
2. Clicks "Send message" with a field empty: sees which fields need attention; nothing is sent.
3. Fixes the fields and sends: the button shows "Sending…", then a green confirmation appears and the form clears.
4. If the network or Supabase fails: a red message appears and the text is kept so the visitor can try again.

---

## 6. Interfaces and Files Involved

| File | Change |
| --- | --- |
| `src/pages/Contact.jsx` | Replace placeholder with header and `ContactForm` |
| `src/pages/Contact.css` | New. Page header and layout |
| `src/components/ContactForm.jsx` | New. Fields, state, validation, insert, feedback |
| `src/components/ContactForm.css` | New. Field, error, button, and feedback styles |
| `src/lib/validateContact.js` | New. Pure function: values in, `{ errors, summary }` out |
| `src/data/contact-page.json` | New. Page and form text |
| `src/styles/tokens.css` | Add `--color-success` and `--color-danger` (shared; reused by Login and Back Office) |

**Routes:** unchanged. **Supabase:** `INSERT` into `messages` only; schema and policies unchanged. **Shared components:** none changed.

---

## 7. Data, Validations, and Expected Behavior

### Text (`contact-page.json`)

| Key | Value (draft) |
| --- | --- |
| `title` | Contact |
| `intro` | Have a role, a project, or a question? Send me a message and I'll reply by email. |
| `emailPrompt` | Prefer email? Write to me at |
| `labels` | Name · Email · Message |
| `submit` / `sending` | Send message / Sending… |
| `success` | Message sent! I'll get back to you soon. |
| `failure` | Something went wrong. Please try again, or email me at |
| `unavailable` | The contact form is unavailable right now. Please email me at |

### Fields

| Field | Element | Attributes | Rule | Error text |
| --- | --- | --- | --- | --- |
| `name` | `<input type="text">` | `autocomplete="name"`, `maxLength=100` | Required after trimming | Please enter your name. |
| `email` | `<input type="email">` | `autocomplete="email"`, `maxLength=254` | Required; matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | Please enter your email. / Please enter a valid email address. |
| `message` | `<textarea rows=6>` | `maxLength=2000` | Required after trimming | Please enter a message. |

The form uses `noValidate`, so the custom messages above replace the browser's built-in bubbles.

### `validateContact(values)`

- Input: `{ name, email, message }` (strings).
- Output: `{ errors: { name?, email?, message? }, summary }`, where `summary` is `''` when valid, "Please fill in all fields." when any field is empty, and otherwise "Please enter a valid email address.".

### Submission

```js
const { error } = await supabase
  .from('messages')
  .insert({ name: name.trim(), email: email.trim(), message: message.trim() })
```

- `error` is `null` → success state. Any `error`, or a thrown network error → failure state.
- No `.select()`, as explained in §3.

### Feedback states

| State | Look | Announced | Fields |
| --- | --- | --- | --- |
| `idle` | — | — | As typed |
| `invalid` | Red summary and red field errors | Summary in an `aria-live` region | As typed; focus on first invalid |
| `sending` | Button disabled, "Sending…" | — | Locked until done |
| `success` | Green box, `FaCheckCircle` | `role="status"` | Cleared; message hides after 5 s or on typing |
| `failure` | Red box, `FaTimesCircle` | `role="alert"` | Kept |

### Tokens

`--color-success: #34d399` and `--color-danger: #f87171`, each paired with a low-opacity background in the feedback boxes. Both pass 4.5:1 contrast on `--color-bg` and `--color-surface`.

### Behavior by viewport

| Width | Layout |
| --- | --- |
| > 768px | Header above a form about 640px wide |
| ≤ 768px | Header and form full width; button full width |

---

## 8. Task Breakdown

| ID | Task | Requirements |
| --- | --- | --- |
| CONT-TASK-01 | Add the success and danger tokens | FR-06, FR-09, FR-11 |
| CONT-TASK-02 | Create `contact-page.json` | FR-02, FR-14 |
| CONT-TASK-03 | Write `validateContact.js` | FR-04, FR-05, FR-06 |
| CONT-TASK-04 | Build `ContactForm.jsx`: fields, validation display, insert, feedback, timer | FR-03 to FR-12 |
| CONT-TASK-05 | Build `Contact.jsx`, `Contact.css`, `ContactForm.css` | FR-01, FR-02, FR-13 |
| CONT-TASK-06 | Verify validation, a real insert, a forced failure, and widths; record evidence | All |

### Traceability (checklist → requirement → task)

| Checklist line | Requirement ID | Task ID | Planned file change | Verification method |
| --- | --- | --- | --- | --- |
| 🤖 AI Feature Specification — Contact Page | — | — | This file | File exists; listed in Feature Index |
| 🛠️ Contact Form Fields (name text, email, message textarea; labels) | FR-03 | TASK-04, 05 | `ContactForm.jsx` | Inspect element types and labels |
| 🛠️ Client-Side Validation (required; email format; errors shown; submission blocked) | FR-04, FR-05, FR-06 | TASK-03, 04 | `validateContact.js`, `ContactForm.jsx` | Submit empty and malformed forms; no network request |
| 🛠️ Form Submission to Supabase (INSERT; name, email, message; shared client) | FR-07, FR-08 | TASK-04 | `ContactForm.jsx` | Network tab shows `POST /rest/v1/messages`; row visible in Supabase |
| 🛠️ Success/Failure Feedback (distinct colors and icons; reset; auto-hide) | FR-09, FR-10, FR-11 | TASK-01, 04 | `ContactForm.jsx`, `tokens.css` | Send a real message; force a failure offline |

---

## 9. Acceptance Criteria and Verification

### Static inspection, lint, and build

- [x] Text lives in `contact-page.json`; the email address comes from `contact.json`.
- [x] The insert uses the shared client and has no `.select()`.
- [x] `npm run lint` passes; `npm run build` succeeds; `git diff --check` is clean. *(The build now warns that the JS bundle is over 500 kB because Supabase is loaded; it is a warning, not an error.)*

### Local browser — validation

- [x] Submitting the empty form shows "Please fill in all fields." and three field errors; no request is sent.
- [x] Spaces only in a field count as empty.
- [x] `driss@` shows "Please enter a valid email address."; no request is sent.
- [x] Focus moves to the first invalid field.

### Local browser — submission

- [x] A valid message returns `201` from `POST /rest/v1/messages` and shows the green confirmation; the fields clear.
- [x] The confirmation disappears after 5 seconds, or at once when typing starts.
- [x] With Supabase unreachable (a separate test build pointed at `https://unreachable.invalid`), the red failure message appears with `role="alert"` and the text is kept; typing again hides it.
- [x] The button is disabled and reads "Sending…" during the request.

### Local browser — layout (desktop, 768px, 375px, 320px)

- [x] `document.documentElement.scrollWidth` equals the viewport width; nothing is hidden behind the bottom bar.
- [x] No console errors at any width.

### Deployed

- [ ] After Driss merges `dev` into `main`, a message sent from the live site appears in Supabase. *(Driss controls `main`; the agent does not push it.)*

---

## Needs review

- **Checklist coverage:**
  - Contact Form Fields → FR-03
  - Client-Side Validation → FR-04, FR-05, FR-06
  - Form Submission to Supabase → FR-07, FR-08
  - Success/Failure Feedback → FR-09, FR-10, FR-11
- **Assumptions:**
  - Errors appear on submit (and clear per field as it is corrected), rather than while the visitor is still typing.
  - The intro sentence and messages are drafts; Driss may reword them.
  - Verification sends one or two real test messages named "Test (Claude)". They stay in `messages` and become test data for the Back Office; Driss can delete them there.
- **Open questions:** none.
- **Source conflicts:** none.
- **Spec gaps:** none.
- **Out-of-scope observations:** a hidden "honeypot" field would cut down bot spam cheaply; it is not required and is left out unless approved.
