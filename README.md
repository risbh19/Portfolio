# Rishabh Pal — Portfolio

A responsive software development portfolio built with HTML, CSS and JavaScript. Includes CareFlow and Wave-Safe project details, experience, education, skills, achievements, a personal portrait and a downloadable résumé.

## Run locally

Use Node.js 24 and npm:

```sh
npm ci
npm run dev
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317). Stop with `Ctrl+C`; set `PORT` to use a different port. The website has no runtime dependencies or build step. To preview without development tools, run `node scripts/serve.mjs` directly.

## Files

```text
dist/                 Tracked, hand-authored website source
  index.html          Layout, experience, education, skills and artwork
  content.js          Profile details, social links and project descriptions
  app.js              Menu, animation, filters and project dialogs
  style.css           Styles and responsive layout
  assets/             Portrait, favicon and supplied résumé PDF
scripts/              Local preview and source verification
.github/              Automatic checks and pull request template
vercel.json           Static deployment configuration
CONTRIBUTING.md       Review and merge workflow
```

`dist/` is the editable source and the deployed directory. Keep it tracked; there is no second source copy or generated bundle to rebuild.

## Update content

- Edit profile copy, email, social URLs, résumé path and project details in `dist/content.js`.
- Edit experience, education, achievements, skills, headings and fallback link destinations in `dist/index.html`.
- Put portfolio assets in `dist/assets/`. Update the résumé PDF when its details change.
- Keep project keys (`careflow`, `wavesafe`) aligned with `data-project` and `data-open-project` attributes. Update HTML filter categories and counts when changing projects.
- The supplied résumé backs the project and profile facts. The project visuals are labelled illustrations. Actual product screenshots and CareFlow's repository/demo URL are still to be added.

Email, social and résumé controls are normal links with HTML fallbacks. JavaScript keeps their destinations aligned with the configuration.

## Contact form setup

The contact section uses vanilla JavaScript and [Web3Forms](https://docs.web3forms.com/getting-started/api-reference). Paste the access key for `palrishabh989@gmail.com` into **`WEB3FORMS_ACCESS_KEY` at the top of `dist/contact.js`**, replacing `YOUR_WEB3FORMS_ACCESS_KEY`. This static site has no build step, so Vercel environment variables are not injected into browser scripts. Web3Forms access keys are intended for client-side use.

The form posts `FormData` directly to Web3Forms, including the topic/name subject, reply email, message and hidden `botcheck` honeypot. It shows validation, sending, success/reset and failure states in place. Requests time out after 20 seconds; failures preserve the visitor's message. The email icon remains a direct fallback. With the placeholder key, the form shows the failure message without sending a request.

After adding your key and deploying, submit a test from the production domain and check that the message arrives and Reply uses the sender's email. Automated checks use mocked responses; they do not verify inbox delivery. This redesign replaces the earlier unmerged FormSubmit proposal (PR #4); do not merge both implementations.

## Verify and review

```sh
npm run format
npm run check
git diff --check
```

The checks validate JavaScript syntax, profile/project mappings, local files, anchors, duplicate IDs, conflict markers, Vercel settings and formatting. Also check desktop/mobile layouts, keyboard navigation, filters, project dialogs and any changed links in the browser.

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

Google Fonts has system font fallbacks. Email links use the visitor's mail application.

## Design reference

Inspired by the editorial palette and kinetic typography of [Content Architecture](https://www.contentarchitecture.dev/). Layout, copy, SVG/CSS illustrations and project compositions were created for this portfolio.
