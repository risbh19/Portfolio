<div align="center">

# Rishabh Pal · Portfolio

**Projects, engineering work and competitive programming in one place.**

A responsive portfolio with seven projects, local-run snapshots, coding profiles, experience, skills, a downloadable résumé and a contact form. It is built with HTML, CSS and JavaScript.

![HTML](https://img.shields.io/badge/HTML-334155?style=flat-square)
![CSS](https://img.shields.io/badge/CSS-334155?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-334155?style=flat-square)

[Quick start](#quick-start) · [Project structure](#project-structure) · [Testing](#testing)

</div>

---

## The problem

Project work, coding profiles and experience often live across separate pages. This portfolio gives visitors one place to explore that work, open project details and get in touch.

## At a glance

| Area     | What it covers                                                         |
| -------- | ---------------------------------------------------------------------- |
| Work     | Seven-project carousel, implementation details and local-run snapshots |
| Profiles | Competitive programming and source links                               |
| Contact  | Résumé download, email and a configured contact form                   |

## Quick start

Use Node.js 24 and npm:

```sh
npm ci
npm run dev
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317). Stop with `Ctrl+C`; set `PORT` to use a different port. The website has no runtime dependencies or build step. To preview without development tools, run `node scripts/serve.mjs` directly.

## Project structure

```text
dist/                 Tracked, hand-authored website source
  index.html          Layout, coding profiles, experience, skills and artwork
  content.js          Profile details, social links and project descriptions
  app.js              Navigation and project dialogs
  project-slides.js   Project carousel and keyboard/touch controls
  project-slides.css  Carousel layout and styling
  style.css           Styles and responsive layout
  assets/             Portrait, résumé, computer illustration and project snapshots
scripts/              Local preview and source verification
.github/              Automatic checks and pull request template
vercel.json           Static deployment configuration
CONTRIBUTING.md       Review and merge workflow
```

`dist/` is the editable source and the deployed directory. Keep it tracked; there is no second source copy or generated bundle to rebuild.

## Update content

- Edit profile copy, email, social URLs, résumé path and project details in `dist/content.js`.
- Intro and About copy support `**bold phrases**` through their `data-emphasis` attributes. Keep their HTML fallbacks in sync when editing.
- Edit experience, education, achievements, skills, coding profile labels/handles, headings and fallback link destinations in `dist/index.html`.
- Coding profile destinations live alongside GitHub and LinkedIn in `socials` in `dist/content.js`. Keep their HTML fallbacks in sync. Handles come from the owner's GitHub profile; ratings and problem counts are not hard-coded.
- Put portfolio assets in `dist/assets/`. Update the résumé PDF when its details change.
- Keep project keys aligned across project records, `data-project`, `data-open-project` and the snapshot filenames.
- The snapshots come from local runs with sample or synthetic data. Paper Trading Engine shows the output of a simulated replay. Orbit and CaseTrace have private source repositories.

Email, social and résumé controls are normal links with HTML fallbacks. JavaScript keeps their destinations aligned with the configuration.

## Contact form setup

The contact section uses vanilla JavaScript and [Web3Forms](https://docs.web3forms.com/getting-started/api-reference). To change the recipient, set **`WEB3FORMS_ACCESS_KEY` at the top of `dist/contact.js`** to the access key for the receiving inbox. This static site has no build step, so Vercel environment variables are not injected into browser scripts. Web3Forms access keys are intended for client-side use.

The form posts `FormData` directly to Web3Forms, including the topic/name subject, reply email, message and hidden `botcheck` honeypot. It shows validation, sending, success/reset and failure states in place. Requests time out after 20 seconds; failures preserve the visitor's message. The email icon remains a direct fallback. With the placeholder key, the form shows the failure message without sending a request.

After adding your key and deploying, submit a test from the production domain and check that the message arrives and Reply uses the sender's email. Automated checks use mocked responses; they do not verify inbox delivery. This redesign replaces the earlier unmerged FormSubmit proposal (PR #4); do not merge both implementations.

## Testing

```sh
npm run format
npm run check
git diff --check
```

The checks validate JavaScript syntax, profile/project mappings, local files, anchors, duplicate IDs, conflict markers, Vercel settings and formatting. Also check the desktop and mobile layouts, all seven snapshots and project dialogs, keyboard navigation and focus restoration, and the contact form and résumé link in the browser.

GitHub Actions runs verification on pull requests and pushes to `main`. See [CONTRIBUTING.md](CONTRIBUTING.md) for the branch and merge workflow. Keep `package-lock.json` with dependency changes; dependencies, local exports, environment files and `.vercel/` stay out of Git.

## Deploy on Vercel

After reviewing and merging the current pull request, import `risbh19/Portfolio` into Vercel and use `main` as the production branch. `vercel.json` configures:

| Setting               | Value                  |
| --------------------- | ---------------------- |
| Root directory        | Repository root (`./`) |
| Framework preset      | Other                  |
| Install command       | Skipped                |
| Build command         | Skipped                |
| Output directory      | `dist`                 |
| Environment variables | None required          |

Only `dist/` is served. Development tooling runs locally and in GitHub Actions; deployment needs no package installation, build server or backend. Configuration follows the [Vercel configuration reference](https://vercel.com/docs/project-configuration/vercel-json).

Email links use the visitor's mail application.

## Design reference

The retro Macintosh-inspired design uses a desktop menu bar, striped title bars, offset shadows and an original computer SVG. The project carousel sits alongside coding profiles, an About window and a contact window.
