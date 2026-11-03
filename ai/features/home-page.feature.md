# Feature Specification — Home Page

*Feature 3 of 8 · Branch: `feature/module-16-home-page` · Must be used with `ai/ai-spec.md` and `ai/features/header-footer.feature.md` · Last updated: 2026-11-03*

---

## 1. Feature Goal and Outcomes

Make the landing page answer, in a few seconds, who Driss is, what he builds, and what he brings to a team.

When this feature is done:

- `#/` shows a prominent introduction with Driss's full name, the tagline "Full-Stack Developer", and a short paragraph.
- Below it, two card grids list four technical skills and four soft skills, each with an icon and a real description.
- The page has three visually distinct sections and two AI-generated images that fit their content.
- It works at desktop width and at 768px or narrower, inside the shared layout.

---

## 2. Feature Scope

### In scope

- Replacing the placeholder `Home.jsx` with the three sections.
- `src/data/home.json` holding the introduction text and both skill lists.
- A reusable skill card used by both skill sections.
- Two AI-generated images, with `alt` text and the documented tool.
- Home-specific CSS built on the shared tokens.

### Out of scope

- Header, footer, navigation, and global tokens (Project Layout, already done).
- Education, work, projects, and the résumé download (Portfolio page).
- Animations, a contact form, or calls to Supabase.
- New dependencies. Icons come from `react-icons`.

---

## 3. Constraints

- Follow `ai/ai-spec.md` §5, §7, and §11: content in `src/data/*.json`, one component per file, tokens for every color and spacing value, the single 768px breakpoint, `alt` text and a documented tool for every AI image.
- All content is truthful. Every skill description refers to work Driss has actually done (CodeBoxx, CodeBloggs, this portfolio).
- The page uses one `<h1>` (Driss's name); section titles are `<h2>`.
- Icons are decorative (`aria-hidden`); each card's text carries the meaning.

---

## 4. Decisions Already Taken

| Decision | Source |
| --- | --- |
| Home is the route `/` and the landing page | Business doc v2 "Home"; checklist "Root Path"; `ai-spec.md` §4 (already routed) |
| Tagline: **Full-Stack Developer** | Driss, 2026-11-03 |
| Technical skills: JavaScript & React; Node.js & Express; Databases (MongoDB, PostgreSQL/Supabase); Git & GitHub | Driss, 2026-11-03 |
| Soft skills: Problem solving; Teamwork; Communication; Fast learner | Driss, 2026-11-03 |
| Skills shown as cards in a responsive grid | Business doc ("cards or a grid"); checklist |
| Two AI images: a hero illustration in the introduction and an illustration beside the soft skills | Checklist "AI-Generated Images" (at least 2) |

---

## 5. Requirements Breakdown and User Flow

| ID | Requirement |
| --- | --- |
| HOME-FR-01 | Home renders at `#/` inside `MainLayout` and is the page shown on first visit and for unknown routes. |
| HOME-FR-02 | The introduction section shows Driss's full name as the page's only `<h1>`, styled prominently. |
| HOME-FR-03 | The introduction shows the tagline "Full-Stack Developer" directly under the name. |
| HOME-FR-04 | The introduction includes a short paragraph (2–4 sentences) on who Driss is and what he brings. |
| HOME-FR-05 | A technical skills section lists at least 3 skills (4 planned). Each has a representative icon, a name, and a description longer than one word. |
| HOME-FR-06 | A soft skills section lists at least 3 skills or talents (4 planned), with the same card structure as FR-05. |
| HOME-FR-07 | Both skill sections use the same card component in a grid: several columns on desktop, one column at 768px or narrower. |
| HOME-FR-08 | The page has at least 3 distinct sections (introduction, technical skills, soft skills), separated by spacing and alternating backgrounds. |
| HOME-FR-09 | At least 2 AI-generated images appear on the page, each relevant to its section, with descriptive `alt` text and the generating tool documented here and in a code comment. |
| HOME-FR-10 | Images scale with their container and the introduction stacks vertically at 768px or narrower; nothing overflows the viewport from 320px up. |
| HOME-FR-11 | Text content (introduction and skills) lives in `src/data/home.json`, not in JSX. |

### User flow (visitor)

1. Opens `https://driss0624.github.io`: sees the name, tagline, intro paragraph, and hero image first.
2. Scrolls: reads four technical skill cards, then four soft skill cards beside the second image.
3. Uses the navigation to continue to Portfolio, Links, or Contact.

---

## 6. Interfaces and Files Involved

| File | Change |
| --- | --- |
| `src/pages/Home.jsx` | Replace placeholder with the three sections |
| `src/pages/Home.css` | New. Introduction and section styles |
| `src/components/SkillCard.jsx` | New. Icon, name, and description card |
| `src/components/SkillCard.css` | New. Card and grid styles |
| `src/components/skillIcons.js` | New. Maps the icon keys in `home.json` to `react-icons` components |
| `src/data/home.json` | New. Introduction text and both skill lists |
| `src/assets/images/home-hero.webp` | New. AI image for the introduction (supplied by Driss) |
| `src/assets/images/home-soft-skills.webp` | New. AI image for the soft skills section (supplied by Driss) |
| `README.md` | No change expected |

**Routes:** unchanged. **Supabase:** not touched. **Shared components:** none changed; `SkillCard` is new.

---

## 7. Data, Validations, and Expected Behavior

### Introduction (`home.json` → `intro`)

| Field | Value |
| --- | --- |
| `name` | Driss Elhail |
| `tagline` | Full-Stack Developer |
| `paragraph` | Draft below; Driss approves or edits it before the build |

Draft paragraph:

> I'm a full-stack developer training at CodeBoxx, building web applications from the database to the interface. I helped build CodeBloggs, a team MERN application, and built this portfolio with React, Supabase, and GitHub Actions. I like turning messy problems into clean, working features, and I'm looking for my first developer role where I can keep learning and ship real work.

### Technical skills (`home.json` → `technicalSkills`)

| Name | Icon key | Description (draft) |
| --- | --- | --- |
| JavaScript & React | `react` | Building interactive interfaces with components, hooks, and client-side routing, including this site and the CodeBloggs front end. |
| Node.js & Express | `node` | Designing REST APIs with routing, validation, and authentication, as in the CodeBloggs back end. |
| Databases | `database` | Modeling and querying data in MongoDB and PostgreSQL, and securing it with Supabase row-level security. |
| Git & GitHub | `git` | Working in feature branches, reviewing changes, and automating builds and deploys with GitHub Actions. |

### Soft skills (`home.json` → `softSkills`)

| Name | Icon key | Description (draft) |
| --- | --- | --- |
| Problem solving | `puzzle` | Breaking hard problems into small steps, sharpened through regular LeetCode practice. |
| Teamwork | `team` | Sharing work across a team through clear tasks, branches, and code reviews on CodeBloggs. |
| Communication | `chat` | Explaining technical work clearly in demos, documentation, and elevator pitches. |
| Fast learner | `bolt` | Picking up new tools quickly at bootcamp pace, from Express to Supabase. |

### Icon map (`skillIcons.js`)

| Key | `react-icons` component |
| --- | --- |
| `react` | `FaReact` |
| `node` | `FaNodeJs` |
| `database` | `FaDatabase` |
| `git` | `FaGitAlt` |
| `puzzle` | `FaPuzzlePiece` |
| `team` | `FaUsers` |
| `chat` | `FaComments` |
| `bolt` | `FaBolt` |

An unknown key renders the card without an icon rather than crashing.

### AI images

| File | Section | `alt` (draft) | Suggested prompt |
| --- | --- | --- | --- |
| `home-hero.webp` | Introduction | Illustration of a developer's desk with code on a laptop screen, in navy and cyan | "Flat vector illustration of a modern developer workspace, laptop showing code, dark navy background, cyan accents, minimal, no text" |
| `home-soft-skills.webp` | Soft skills | Illustration of a small team collaborating around a whiteboard, in navy and cyan | "Flat vector illustration of three developers collaborating at a whiteboard, dark navy background, cyan accents, minimal, no text" |

Generating tool: **ChatGPT** image generation (2026-11-03), also noted in a comment in `Home.jsx`. Both images are 1254×1254 WebP files used as generated.

### Behavior by viewport

| Width | Introduction | Skill grids |
| --- | --- | --- |
| > 768px | Text and hero image side by side | 2–4 columns (auto-fit, min card width about 240px) |
| ≤ 768px | Image stacks under the text | One column |

---

## 8. Task Breakdown

| ID | Task | Requirements |
| --- | --- | --- |
| HOME-TASK-01 | Create `home.json` with the approved intro and skills | FR-04, FR-05, FR-06, FR-11 |
| HOME-TASK-02 | Create `skillIcons.js` and `SkillCard.jsx` with its CSS | FR-05, FR-06, FR-07 |
| HOME-TASK-03 | Build the introduction section in `Home.jsx` | FR-01, FR-02, FR-03, FR-04 |
| HOME-TASK-04 | Build both skill sections with the shared card grid | FR-05, FR-06, FR-07, FR-08 |
| HOME-TASK-05 | Add both AI images with `alt` text and the tool comment; record the tool here | FR-09 |
| HOME-TASK-06 | Write `Home.css`: section separation, stacking, image scaling | FR-08, FR-10 |
| HOME-TASK-07 | Verify at desktop, 768px, 375px, and 320px; record evidence | All |

### Traceability (checklist → requirement → task)

| Checklist line | Business document reference | Requirement ID | Task ID | Planned file change | Verification method |
| --- | --- | --- | --- | --- | --- |
| 🤖 AI Feature Specification — Home Page | Specifying Before You Build | — | — | This file | File exists; listed in Feature Index |
| 🛠️ Root Path (`/`; default landing page) | Home ¶ "mounted at the root path" | FR-01 | TASK-03 | `Home.jsx` (route exists) | Open `#/` and an unknown route |
| 🛠️ Introduction Section (name; tagline; paragraph) | Home ¶ "prominently styled introduction" | FR-02, FR-03, FR-04 | TASK-01, 03 | `Home.jsx`, `home.json` | Browser; one `<h1>` |
| 🛠️ Technical Skills Section (≥3; text + icon; organized) | Home ¶ "at least three technical skills" | FR-05, FR-07 | TASK-01, 02, 04 | `SkillCard.jsx`, `home.json` | Count cards; each has icon and multi-word text |
| 🛠️ Soft Skills or Talents Section (≥3; text + icon; organized) | Home ¶ "at least three soft skills" | FR-06, FR-07 | TASK-01, 02, 04 | `SkillCard.jsx`, `home.json` | Same as above |
| 🛠️ Layout (≥3 sections; visually separated) | Home ¶ "two parallel sections … consistent structured layout" | FR-08 | TASK-04, 06 | `Home.jsx`, `Home.css` | Browser at desktop and mobile |
| 🛠️ AI-Generated Images (≥2; relevant; `alt`; tool documented) | Shared constraints on AI imagery | FR-09, FR-10 | TASK-05, 06 | 2 PNGs, `Home.jsx` | `alt` present; tool in comment and spec |

---

## 9. Acceptance Criteria and Verification

### Static inspection, lint, and build

- [x] `home.json` holds the intro and both skill lists; `Home.jsx` contains no hard-coded skill text.
- [x] At least 3 technical and 3 soft skills, each with an icon key and a multi-word description.
- [x] Both images have `alt` text; the tool is named in `Home.jsx` and in this spec.
- [x] `npm run lint` passes; `npm run build` succeeds; `git diff --check` is clean.

### Local browser — desktop (> 768px)

- [x] `#/` and an unknown route show Home inside the layout; the Home nav link is active.
- [x] Exactly one `<h1>` (the name), followed by the tagline and paragraph.
- [x] Three sections are visibly separated; skill cards sit in a multi-column grid with icons.
- [x] Both images load and are relevant to their sections.

### Local browser — mobile (768px, 375px, 320px)

- [x] The hero image stacks under the introduction text; skill cards are one column.
- [x] `document.documentElement.scrollWidth` equals the viewport width; no content is hidden behind the bottom bar.
- [x] No console errors at any width.

### Deployed

- [ ] After Driss merges `dev` into `main`, the live Home page matches the local results. *(Driss controls `main`; the agent does not push it.)*

---

## Needs review

- **Checklist coverage:**
  - Root Path → FR-01
  - Introduction Section → FR-02, FR-03, FR-04
  - Technical Skills Section → FR-05, FR-07
  - Soft Skills or Talents Section → FR-06, FR-07
  - Layout → FR-08
  - AI-Generated Images → FR-09, FR-10
- **Assumptions:**
  - Four skills in each section, above the minimum of three.
  - The intro paragraph and the eight skill descriptions are drafts written from Driss's known coursework (CodeBoxx, CodeBloggs, this portfolio, LeetCode). Driss must confirm they are accurate.
  - Hero image beside the introduction; second image beside the soft skills. Alternative: a banner between the two skill sections.
  - Icons come from the Font Awesome set in `react-icons` (`fa`) for one consistent look.
- **Open questions:**
  - Resolved: Driss approved the intro paragraph and skill descriptions (2026-11-03).
  - Resolved: both images were made with ChatGPT image generation.
- **Source conflicts:** none.
- **Spec gaps:** none.
- **Out-of-scope observations:** a "View my work" button linking to Portfolio would guide visitors; it is not required and is left out unless approved.
