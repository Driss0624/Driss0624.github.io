# Feature Specification — Portfolio Page

*Feature 4 of 8 · Branch: `feature/module-16-portfolio-page` · Must be used with `ai/ai-spec.md` and `ai/features/header-footer.feature.md` · Last updated: 2026-11-03*

---

## 1. Feature Goal and Outcomes

Give employers Driss's résumé as a web page: where he studied, where he worked, what he has built, and a PDF they can keep.

When this feature is done:

- `#/portfolio` shows Education, Work, and Projects as three visually separated sections.
- Education and Work entries are listed most recent first, with dates.
- Each project shows its name, tech stack, description, and an image.
- A button downloads the résumé as a PDF.
- At least two AI-generated images support the content, each with `alt` text.
- It works at desktop width and at 768px or narrower, inside the shared layout.

---

## 2. Feature Scope

### In scope

- Replacing the placeholder `Portfolio.jsx` with a page header, the résumé button, and the three sections.
- `src/data/portfolio.json` holding education, work, and projects.
- Two reusable components: a timeline entry (education and work) and a project card.
- The résumé download from `public/resume.pdf`.
- AI-generated images with `alt` text and the documented tool.
- Portfolio-specific CSS built on the shared tokens.

### Out of scope

- Header, footer, navigation, and tokens (Project Layout).
- Skills (already on Home), external links (Links page), and the contact form.
- Filtering, sorting controls, modals, or animations.
- New dependencies.

---

## 3. Constraints

- Follow `ai/ai-spec.md` §5, §7, and §11: content in `src/data/*.json`, one component per file, tokens for every color and spacing value, the single 768px breakpoint, `alt` text and a documented tool for every AI image.
- All content is truthful and matches the résumé and Driss's answers. No invented dates, titles, or results.
- One `<h1>` ("Portfolio"); section titles are `<h2>`; entry titles are `<h3>`.
- Reverse chronological order is set by the order in `portfolio.json`; the component renders the arrays as stored.
- The résumé link uses `import.meta.env.BASE_URL` so it works locally and on GitHub Pages.

---

## 4. Decisions Already Taken

| Decision | Source |
| --- | --- |
| Portfolio is the route `/portfolio` (`#/portfolio`), already routed and in the navigation | `ai-spec.md` §4; Project Layout |
| Education: CodeBoxx (Jul 2026 – Nov 2026, expected), then Lennard High School (2026) | Driss, 2026-11-03; résumé |
| Work: Cook, Tropical Smoothie Café, Ruskin, FL, 2025 – 2026 | Driss, 2026-11-03; résumé |
| Projects: CodeBloggs and this portfolio | Driss, 2026-11-03 |
| Résumé: the final PDF, reviewed and confirmed by Driss, is served from `public/resume.pdf` | Driss, 2026-11-04 |
| Three sections with alternating backgrounds, matching Home | Checklist "Layout"; Home page pattern |

---

## 5. Requirements Breakdown and User Flow

| ID | Requirement |
| --- | --- |
| PORT-FR-01 | The page renders at `#/portfolio` inside `MainLayout`; the Portfolio nav link is active. |
| PORT-FR-02 | A page header shows the `<h1>` "Portfolio", one sentence of introduction, and the résumé download button. |
| PORT-FR-03 | An Education section lists at least one institution. Each entry shows the institution, the degree or program, and the dates. |
| PORT-FR-04 | Education entries are in reverse chronological order (CodeBoxx first). |
| PORT-FR-05 | A Work section lists at least one job. Each entry shows the role, the organization, the dates, and a description of responsibilities or achievements. |
| PORT-FR-06 | Work entries are in reverse chronological order. |
| PORT-FR-07 | A Projects section lists at least one project (two planned). Each card shows the name, the tech stack, a description of what the project is and why it exists, and an image. |
| PORT-FR-08 | The résumé button downloads `resume.pdf` (saved as `Driss-Elhail-Resume.pdf`) and works on the deployed site. |
| PORT-FR-09 | The page has at least 3 distinct sections (Education, Work, Projects), separated by spacing and alternating backgrounds. |
| PORT-FR-10 | At least 2 AI-generated images complement the content, each with descriptive `alt` text and the generating tool documented here and in a code comment. |
| PORT-FR-11 | Project cards sit in a grid (two columns on desktop, one at 768px or narrower); images scale with their container; nothing overflows the viewport from 320px up. |
| PORT-FR-12 | All text content lives in `src/data/portfolio.json`, not in JSX. |

### User flow (visitor)

1. Selects Portfolio in the navigation: sees the page title, a one-line intro, and "Download résumé (PDF)".
2. Scrolls through Education, then Work, then the two project cards.
3. Downloads the résumé, or follows the portfolio project's GitHub link.

---

## 6. Interfaces and Files Involved

| File | Change |
| --- | --- |
| `src/pages/Portfolio.jsx` | Replace placeholder with header, button, and three sections |
| `src/pages/Portfolio.css` | New. Page, section, and grid styles |
| `src/components/TimelineEntry.jsx` | New. One education or work entry |
| `src/components/TimelineEntry.css` | New |
| `src/components/ProjectCard.jsx` | New. Image, name, tech tags, description, optional link |
| `src/components/ProjectCard.css` | New |
| `src/components/projectImages.js` | New. Maps the image keys in `portfolio.json` to imported images; a missing key renders the card without an image |
| `src/data/portfolio.json` | New. Intro sentence, education, work, projects |
| `src/assets/images/portfolio-codebloggs.webp` | New. AI image for the CodeBloggs card (supplied by Driss) |
| `src/assets/images/portfolio-site.webp` | New. AI image for the portfolio card (supplied by Driss) |
| `public/resume.pdf` | New. Final résumé (drafted with Claude, confirmed by Driss) |

**Routes:** unchanged. **Supabase:** not touched. **Shared components:** none changed.

---

## 7. Data, Validations, and Expected Behavior

### Page intro (`portfolio.json` → `intro`)

> My education, work experience, and the projects I've built. Download the PDF for a copy of my résumé.

### Education (`portfolio.json` → `education`, most recent first)

| Institution | Program | Location | Dates | Detail (draft) |
| --- | --- | --- | --- | --- |
| CodeBoxx | Full-Stack Developer Program | Hybrid | Jul 2026 – Nov 2026 (expected) | Intensive bootcamp in JavaScript, React, Node.js and Express, MongoDB, PostgreSQL, Git, and DevOps, through team and individual projects. |
| Lennard High School | High School Diploma, Honors | Ruskin, FL | 2026 | Honors student, GPA 4.5. |

### Work (`portfolio.json` → `work`, most recent first)

| Role | Organization | Location | Dates |
| --- | --- | --- | --- |
| Cook | Tropical Smoothie Café | Ruskin, FL | 2025 – 2026 |

Description bullets (from the résumé):

- Prepared food orders quickly and accurately in a fast-paced environment.
- Followed food safety and cleanliness standards on every shift.
- Handled prep work, including ingredient preparation and organization.
- Worked with the team to keep daily operations running smoothly.

### Projects (`portfolio.json` → `projects`)

| Name | Tech | Description (draft) | Link |
| --- | --- | --- | --- |
| CodeBloggs | React, Redux, Node.js, Express, MongoDB, Mongoose, bcrypt | A social blogging platform for developers, built as a team MERN application at CodeBoxx. Members register, write posts, comment, like, and browse the network, while admins manage users and content. I later audited its Login and Home pages with Lighthouse, refactored them based on the findings, and added Selenium IDE tests. | None (repository is private) |
| Personal Portfolio | React, Vite, React Router, Supabase, GitHub Actions | This website. It presents my skills, experience, and projects to employers. Visitors can send me a message that is stored in Supabase, a hidden admin area lets me read it, and GitHub Actions deploys every update to GitHub Pages. | `https://github.com/Driss0624/Driss0624.github.io` |

A project without a `link` renders without a link rather than an empty or broken one.

### AI images

| File | Used in | `alt` (draft) | Suggested prompt |
| --- | --- | --- | --- |
| `portfolio-codebloggs.webp` | CodeBloggs card | Illustration of a developer blogging platform with posts, comments, and likes, in navy and cyan | "Flat vector illustration of a social blogging app for developers: post cards, comment bubbles, heart icons, dark navy background, cyan accents, minimal, no text, 16:9" |
| `portfolio-site.webp` | Portfolio card | Illustration of a personal portfolio website on a laptop and phone, in navy and cyan | "Flat vector illustration of a personal portfolio website shown on a laptop and a phone, dark navy background, cyan accents, minimal, no text, 16:9" |

Generating tool: **ChatGPT** image generation (same as Home), noted in a comment in `Portfolio.jsx`. Images are landscape 16:9 (1280×720), WebP, under 150 KB each.

### Résumé button

- `<a href={`${import.meta.env.BASE_URL}resume.pdf`} download="Driss-Elhail-Resume.pdf">` styled as a button, with a `FaFileDownload` icon (`aria-hidden`) and the text "Download résumé (PDF)".

### Behavior by viewport

| Width | Header | Timeline entries | Project grid |
| --- | --- | --- | --- |
| > 768px | Title and intro on the left, button on the right | Dates beside the title | Two columns |
| ≤ 768px | Stacked; button full width | Dates under the title | One column |

---

## 8. Task Breakdown

| ID | Task | Requirements |
| --- | --- | --- |
| PORT-TASK-01 | Create `portfolio.json` with the approved content in reverse chronological order | FR-03 to FR-07, FR-12 |
| PORT-TASK-02 | Create `TimelineEntry.jsx` and its CSS | FR-03, FR-05 |
| PORT-TASK-03 | Create `ProjectCard.jsx` and its CSS | FR-07, FR-11 |
| PORT-TASK-04 | Build `Portfolio.jsx`: header, button, three sections | FR-01, FR-02, FR-09 |
| PORT-TASK-05 | Add the two AI images with `alt` text and the tool comment | FR-10 |
| PORT-TASK-06 | Write `Portfolio.css`: separation, header layout, grid, stacking | FR-09, FR-11 |
| PORT-TASK-07 | Add `public/resume.pdf`; test the download | FR-08 |
| PORT-TASK-08 | Verify at desktop, 768px, 375px, and 320px; record evidence | All |

### Traceability (checklist → requirement → task)

| Checklist line | Requirement ID | Task ID | Planned file change | Verification method |
| --- | --- | --- | --- | --- |
| 🤖 AI Feature Specification — Portfolio Page | — | — | This file | File exists; listed in Feature Index |
| 🛠️ Education Section (≥1; institution, program, dates; reverse order) | FR-03, FR-04 | TASK-01, 02, 04 | `portfolio.json`, `TimelineEntry.jsx` | Browser; CodeBoxx listed first |
| 🛠️ Work Section (≥1; role, org, dates, description; reverse order) | FR-05, FR-06 | TASK-01, 02, 04 | `portfolio.json`, `TimelineEntry.jsx` | Browser; bullets present |
| 🛠️ Project/Portfolio Section (≥1; name, tech, description, image) | FR-07, FR-11 | TASK-01, 03, 04 | `ProjectCard.jsx`, `portfolio.json` | Each card has all four parts |
| 🛠️ Downloadable PDF | FR-08 | TASK-07 | `public/resume.pdf`, `Portfolio.jsx` | Click downloads a valid PDF, locally and deployed |
| 🛠️ Layout (≥3 sections; visually separated) | FR-09 | TASK-04, 06 | `Portfolio.jsx`, `Portfolio.css` | Browser at desktop and mobile |
| 🛠️ AI-Generated Images (≥2; complement content; `alt`) | FR-10 | TASK-05 | 2 WebP files, `Portfolio.jsx` | `alt` present; tool in comment and spec |

---

## 9. Acceptance Criteria and Verification

### Static inspection, lint, and build

- [x] `portfolio.json` holds all text; `Portfolio.jsx` contains no hard-coded entries.
- [x] Education and Work arrays are stored most recent first.
- [x] Both images have `alt` text; the tool is named in `Portfolio.jsx` and in this spec.
- [x] `npm run lint` passes; `npm run build` succeeds; `git diff --check` is clean.
- [x] `npm run build` copies `resume.pdf` into `dist/`.

### Local browser — desktop (> 768px)

- [x] `#/portfolio` shows the page inside the layout; the Portfolio nav link is active.
- [x] Exactly one `<h1>`; Education, Work, and Projects are visibly separated.
- [x] Each project card shows its name, tech, and description; the portfolio card's GitHub link opens in a new tab.
- [x] Each project card shows its image.
- [x] The résumé button links to a valid PDF, with the save name `Driss-Elhail-Resume.pdf`.

### Local browser — mobile (768px, 375px, 320px)

- [x] Header and timeline entries stack; project cards are one column.
- [x] `document.documentElement.scrollWidth` equals the viewport width; nothing is hidden behind the bottom bar.
- [x] No console errors at any width.

### Deployed

- [ ] After Driss merges `dev` into `main`, the live page and the résumé download match the local results. *(Driss controls `main`; the agent does not push it.)*

---

## Needs review

- **Checklist coverage:**
  - Education Section → FR-03, FR-04
  - Work Section → FR-05, FR-06
  - Project/Portfolio Section → FR-07, FR-11
  - Downloadable PDF → FR-08
  - Layout → FR-09
  - AI-Generated Images → FR-10
- **Assumptions:**
  - The project images are AI illustrations, not screenshots, because CodeBloggs is in a private repository and its wireframes belong to CodeBoxx. They also cover the two required AI images. Alternative: real screenshots for the projects plus two separate AI images.
  - The CodeBoxx program name is "Full-Stack Developer Program" and its location is "Hybrid", confirmed by Driss on 2026-11-04.
  - The Tropical Smoothie dates are shown as "2025 – 2026" (the job has ended). If Driss still works there, this becomes "2025 – Present".
  - The CodeBloggs and portfolio descriptions are drafts written from the project READMEs. Driss must confirm they are accurate.
- **Open questions:**
  - Driss: confirm or edit the CodeBoxx program name and location, and the project descriptions.
  - Driss: generate the two images with the prompts above. *(Done 2026-11-03.)*
  - Driss: supply the final résumé PDF. It should add the dates, CodeBoxx, and the two projects so it matches this page.
- **Source conflicts:** none.
- **Spec gaps:** none.
- **Out-of-scope observations:** CodeBloggs could link to a public repository or a live demo if one exists later.
