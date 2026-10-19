# Rishabh Pal — Portfolio

A minimal, responsive portfolio for Rishabh Pal, a Computer Science student, software developer, and Software Testing Intern. Built with HTML, CSS, and JavaScript, with original SVG/CSS illustrations, an interactive typographic orbit, project filters, project dialogs, a mobile menu, and reduced-motion support.

Profile, CareFlow and Wave-Safe project details, internship, education, skills, and achievements were transcribed from the supplied résumé. GitHub, LinkedIn, email, and the bundled résumé link are configured. Project descriptions represent résumé-reported implementations; they do not imply a public production deployment.

**Still to add:** actual product screenshots and a repository or demo URL for CareFlow. The supplied portrait is included. Project visuals are original architecture/system illustrations, clearly labelled as illustrations. The Wave-Safe card links to its source repository.

## Quick start

Use Node.js 24 and npm:

```sh
npm ci
npm run dev
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317). Stop the preview with `Ctrl+C`. Set the `PORT` environment variable if this port is occupied.

The site has no build step or runtime package dependencies. npm installs only development tooling. You can also run `node scripts/serve.mjs` without installing packages, serve `dist/` with any static server, or open `dist/index.html` directly.

## Project structure

```text
dist/
  index.html              Page layout and original project artwork
  style.css               Visual styles, responsive layout, and motion
  content.js              Editable profile and project details
  app.js                  Navigation, filters, dialogs, and interactions
  assets/mark.svg         Original R monogram favicon
  assets/profile.png      Supplied personal portrait
  assets/Rishabh_Resume.pdf  Supplied résumé, served by the résumé controls
scripts/
  serve.mjs               Local static preview server
  check.mjs               Source and content consistency checks
.github/
  workflows/checks.yml    Pull request and main-branch checks
  pull_request_template.md
.openai/hosting.json      Existing Sites hosting configuration
CONTRIBUTING.md           Review and merge workflow
package.json              Development commands and pinned formatter
package-lock.json         Reproducible dependency versions
```

**`dist/` is the hand-authored source of this project, and is intentionally tracked.** It is also the published directory. Do not delete it as build output or create a second editable copy in `src/`.

## Personalize

| Change                                                                    | File                                 |
| ------------------------------------------------------------------------- | ------------------------------------ |
| Name, role, location, email, intro, about, status, focus                  | `dist/content.js`                    |
| Social links and résumé URL                                               | `dist/content.js`                    |
| Project titles, categories, years, briefs, contributions, outcomes, links | `dist/content.js`                    |
| Portrait, project artwork, page sections                                  | `dist/index.html` and `dist/assets/` |
| Colors, typography, spacing, animation, responsive layout                 | `dist/style.css`                     |
| Menus, filters, dialogs, and other behavior                               | `dist/app.js`                        |
| Default page title, description, and static headings                      | `dist/index.html`                    |

Keep profile and project facts in `content.js` current. The `focus` and `aboutSecondary` fields hold the current technical focus and supporting about text. Experience, education, achievements, skill groups, static fallback copy, and page headings are in `index.html`. Update the supplied PDF in `dist/assets/` whenever the résumé changes. `resumeUrl` accepts a web URL or a relative asset path. The document title updates from the configured name.

Project keys (`careflow`, `wavesafe`) must match their `data-project` cards and `data-open-project` buttons in `index.html`. When adding or removing projects, update these together. Filter categories and filter counts are defined in the HTML; update those too. The display category in `content.js` is independent of the filter category. Each project also supplies its role, stack, summary, illustration note, and source-link label for the detail dialog.

Replace illustrative project visuals with real screenshots when available. Keep illustration/screenshot labels accurate. Leave an unknown URL empty rather than inventing a link; the project dialog displays a clear missing-link note.

## Verify changes

```sh
npm run format
npm run check
git diff --check
```

| Command                     | Purpose                                                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev` / `npm start` | Preview the site locally                                                                                                           |
| `npm run format`            | Format supported source and documentation files                                                                                    |
| `npm run format:check`      | Check formatting without changing files                                                                                            |
| `npm run check`             | Check JavaScript syntax, profile/project mappings, HTML IDs and local references, merge markers, hosting directory, and formatting |

These checks catch common source mistakes. They do not replace browser review: test desktop and mobile layouts, navigation, project filters, dialogs, keyboard focus, and any changed contact or résumé links.

GitHub Actions runs the same checks on pull requests and pushes to `main`. It reports results and does not deploy the site. Requiring a successful check before merging is a separate GitHub branch-rule setting.

## Review and merge

See [CONTRIBUTING.md](CONTRIBUTING.md) for the branch, review, and merge workflow. Keep each change focused, use the pinned formatter, and commit `package-lock.json` with dependency updates. Keep local exports, caches, credentials, and `node_modules/` out of Git.

Shared formatting and LF line endings reduce avoidable conflicts. Edits to the same content can still conflict; inspect both versions and rerun the checks after resolving them.

## Hosting

Publish `dist/` as a static site; no build command is needed. `.openai/hosting.json` retains the existing Sites project and static directory. Preserve that mapping when maintaining this project. To deploy elsewhere, choose `dist/` as the public directory.

Google Fonts is optional; system font fallbacks are included. The site has no backend, analytics, or form submission service. A configured email address opens the visitor's mail app.

## Design reference

The cream and charcoal palette, technical labels, and kinetic typography were inspired by [Content Architecture](https://www.contentarchitecture.dev/). The layout, copy, SVG artwork, typographic sculpture, and project compositions were created for this portfolio; no source code or assets were copied from the reference.
