# Feature Specification — Links Page

*Feature 5 of 8 · Branch: `feature/module-16-link-page` · Must be used with `ai/ai-spec.md` and `ai/features/header-footer.feature.md` · Last updated: 2026-11-03*

---

## 1. Feature Goal and Outcomes

Give visitors one place to find Driss's profiles elsewhere on the web.

When this feature is done:

- `#/links` shows at least 3 links as cards: GitHub, LinkedIn, and YouTube.
- Each card has an image, a title, a 1–3 sentence description, and a URL that opens in a new tab.
- At least one image on the page is AI-generated and has `alt` text.
- It works at desktop width and at 768px or narrower, inside the shared layout.

---

## 2. Feature Scope

### In scope

- Replacing the placeholder `Links.jsx` with a page header and a grid of link cards.
- `src/data/links.json` holding the intro sentence and the links.
- A reusable `LinkCard` component.
- Three AI-generated thumbnails, one per card, with `alt` text and the documented tool.
- Links-specific CSS built on the shared tokens.

### Out of scope

- Header, footer, navigation, and tokens (Project Layout). The footer's own GitHub and LinkedIn links stay as they are.
- Live previews fetched from the linked sites (no network calls; the site stays static).
- Hidden routes (`#/login`, `#/backoffice`), which are never linked from here.
- New dependencies.

---

## 3. Constraints

- Follow `ai/ai-spec.md` §5, §7, and §11: content in `src/data/*.json`, one component per file, tokens for every color and spacing value, the single 768px breakpoint, `alt` text and a documented tool for every AI image.
- Every link opens in a new tab with `target="_blank"` and `rel="noreferrer"`, and its accessible name says it opens in a new tab.
- Only real, working URLs owned by Driss. No placeholders on the deployed page.
- One `<h1>` ("Links"); card titles are `<h2>` because the cards are the page's only sections.

---

## 4. Decisions Already Taken

| Decision | Source |
| --- | --- |
| Links is the route `/links` (`#/links`), already routed and in the navigation | `ai-spec.md` §4; Project Layout |
| Links: GitHub profile, LinkedIn, YouTube channel | Driss, 2026-11-03 |
| At least one AI image on this page (not two) | `ai-spec.md` §2 source conflicts; checklist bullet; business doc v2 |
| Same card look as Home and Portfolio | Consistency with built features |

---

## 5. Requirements Breakdown and User Flow

| ID | Requirement |
| --- | --- |
| LINK-FR-01 | The page renders at `#/links` inside `MainLayout`; the Links nav link is active. |
| LINK-FR-02 | A page header shows the `<h1>` "Links" and one sentence of introduction. |
| LINK-FR-03 | At least 3 links are displayed, each as a card. |
| LINK-FR-04 | Each card shows an image (thumbnail), a title, and a short description of 1–3 sentences. |
| LINK-FR-05 | Each card has a clickable URL that opens in a new tab. The visible URL text is shown on the card. |
| LINK-FR-06 | At least 1 image on the page is AI-generated, with descriptive `alt` text, and the tool is documented here and in a code comment. |
| LINK-FR-07 | Cards sit in a grid: three columns on desktop, one column at 768px or narrower. Images scale with the card; nothing overflows the viewport from 320px up. |
| LINK-FR-08 | All text and URLs live in `src/data/links.json`, not in JSX. |

### User flow (visitor)

1. Selects Links in the navigation: sees the title, a one-line intro, and three cards.
2. Reads a card and clicks it: the profile opens in a new tab; the portfolio stays open.

---

## 6. Interfaces and Files Involved

| File | Change |
| --- | --- |
| `src/pages/Links.jsx` | Replace placeholder with header and card grid |
| `src/pages/Links.css` | New. Page header and grid |
| `src/components/LinkCard.jsx` | New. Image, title, description, URL; the whole card is the link |
| `src/components/LinkCard.css` | New |
| `src/components/linkImages.js` | New. Maps image keys in `links.json` to imported images; a missing key renders the card without an image |
| `src/data/links.json` | New. Intro sentence and links |
| `src/assets/images/links-github.webp` | New. AI thumbnail (supplied by Driss) |
| `src/assets/images/links-linkedin.webp` | New. AI thumbnail (supplied by Driss) |
| `src/assets/images/links-youtube.webp` | New. AI thumbnail (supplied by Driss) |

**Routes:** unchanged. **Supabase:** not touched. **Shared components:** none changed.

---

## 7. Data, Validations, and Expected Behavior

### Page intro (`links.json` → `intro`)

> Where to find me online: my code, my professional profile, and my videos.

### Links (`links.json` → `links`)

| Title | URL | Image key | Description (draft) |
| --- | --- | --- | --- |
| GitHub | `https://github.com/Driss0624` | `github` | My code lives here, including this portfolio and my CodeBoxx coursework. It shows how I structure projects, branches, and commits. |
| LinkedIn | `https://www.linkedin.com/in/drisselhail` | `linkedin` | My professional profile, with my CodeBoxx training, experience, and skills. Connect with me here. |
| YouTube | https://www.youtube.com/@DrissElCode | `youtube` | My elevator pitch and technical videos, where I explain how my projects and solutions work. |

The card shows the URL without `https://` (for example `github.com/Driss0624`) under the description.

A link whose `url` is empty is left off the page rather than shown with a placeholder. All three links have URLs, so FR-03 is met.

### AI images

| File | Card | `alt` (draft) | Suggested prompt |
| --- | --- | --- | --- |
| `links-github.webp` | GitHub | Illustration of code branches and commits flowing between laptops, in navy and cyan | "Flat vector illustration of code branches and commits connecting laptops, dark navy background, cyan accents, minimal, no text, no logos, 16:9" |
| `links-linkedin.webp` | LinkedIn | Illustration of a professional profile card connected to a network of people, in navy and cyan | "Flat vector illustration of a professional profile card linked to a network of people icons, dark navy background, cyan accents, minimal, no text, no logos, 16:9" |
| `links-youtube.webp` | YouTube | Illustration of a video player showing a developer presenting code, in navy and cyan | "Flat vector illustration of a video player with a developer presenting code on screen, dark navy background, cyan accents, minimal, no text, no logos, 16:9" |

Generating tool: **ChatGPT** image generation, noted in a comment in `Links.jsx`. Landscape 16:9 (1280×720), WebP, under 150 KB each. The prompts avoid brand logos so the images stay original.

### Card behavior

- The whole card is one `<a>` (`target="_blank"`, `rel="noreferrer"`), with an accessible name of "<Title> (opens in a new tab)".
- A small external-link icon (`FaExternalLinkAlt`, `aria-hidden`) sits beside the visible URL.
- Hover and keyboard focus show the accent border, as on the other cards.

### Behavior by viewport

| Width | Grid |
| --- | --- |
| > 768px | Three columns |
| ≤ 768px | One column |

---

## 8. Task Breakdown

| ID | Task | Requirements |
| --- | --- | --- |
| LINK-TASK-01 | Create `links.json` with the approved intro and links | FR-03, FR-04, FR-08 |
| LINK-TASK-02 | Create `linkImages.js`, `LinkCard.jsx`, and its CSS | FR-04, FR-05, FR-07 |
| LINK-TASK-03 | Build `Links.jsx` and `Links.css` | FR-01, FR-02, FR-07 |
| LINK-TASK-04 | Add the three AI images with `alt` text and the tool comment | FR-04, FR-06 |
| LINK-TASK-05 | Verify at desktop, 768px, 375px, and 320px; check each link opens in a new tab | All |

### Traceability (checklist → requirement → task)

| Checklist line | Requirement ID | Task ID | Planned file change | Verification method |
| --- | --- | --- | --- | --- |
| 🤖 AI Feature Specification — Link Page | — | — | This file | File exists; listed in Feature Index |
| 🛠️ Display Links (card; image, title, 1–3 sentences, URL in new tab; ≥3) | FR-03, FR-04, FR-05, FR-07 | TASK-01, 02, 03 | `links.json`, `LinkCard.jsx`, `Links.jsx` | Count cards; click each; check `target` |
| 🛠️ AI-Generated Images (≥1; complement content; `alt`) | FR-06 | TASK-04 | 3 WebP files, `Links.jsx` | `alt` present; tool in comment and spec |

---

## 9. Acceptance Criteria and Verification

### Static inspection, lint, and build

- [x] `links.json` holds all text and URLs; `Links.jsx` contains no hard-coded links.
- [x] Every description is 1–3 sentences.
- [x] Every image has `alt` text; the tool is named in `Links.jsx` and in this spec.
- [x] `npm run lint` passes; `npm run build` succeeds; `git diff --check` is clean.

### Local browser — desktop (> 768px)

- [x] `#/links` shows the page inside the layout; the Links nav link is active.
- [x] Exactly one `<h1>`; each card has a title, description, and URL.
- [x] Three cards, each with its image.
- [x] Each card opens the right URL in a new tab (`target="_blank"`, `rel="noreferrer"`, "opens in a new tab" label).

### Local browser — mobile (768px, 375px, 320px)

- [x] Cards are one column; `document.documentElement.scrollWidth` equals the viewport width.
- [x] No console errors at any width.

### Deployed

- [ ] After Driss merges `dev` into `main`, the live page matches the local results. *(Driss controls `main`; the agent does not push it.)*

---

## Needs review

- **Checklist coverage:**
  - Display Links → FR-03, FR-04, FR-05, FR-07
  - AI-Generated Images → FR-06
- **Assumptions:**
  - Each card gets its own AI thumbnail, which covers the "image per link" and "at least one AI image" lines together. Alternative: one AI banner for the page, with icon tiles as card images.
  - The descriptions are drafts. Driss must confirm they are accurate (for example, that his GitHub shows his CodeBoxx coursework).
- **Open questions:**
  - Driss: send the YouTube channel URL. *(Done 2026-11-03.)*
  - Driss: generate the three images with the prompts above. *(Done 2026-11-03.)*
- **Source conflicts:** the checklist's first line says two images "into the Portfolio page"; the bullet and the business document say at least one on the Links page. Decided: at least one (`ai-spec.md` §2). This page has three.
- **Spec gaps:** none.
- **Out-of-scope observations:** a LeetCode profile card could be added later; it is not required.
