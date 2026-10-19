# Contributing

## Start a focused change

Check `git status` first and preserve any unfinished local work. Start from an up-to-date `main`:

```sh
git switch main
git pull --ff-only origin main
git switch -c feature/short-description
npm ci
```

Use Node.js 24, as recorded in `.nvmrc`. Keep one purpose per branch and pull request. Do not force-push `main`.

## Edit the right source

Use the file map in [README.md](README.md). `dist/` contains the tracked, hand-authored website. Profile and project copy belongs in `dist/content.js`; page structure and artwork belong in `dist/index.html`. Keep project keys and HTML data attributes aligned.

Keep unrelated formatting and file moves out of functional changes. For a broad cleanup, put formatting in a separate commit so reviewers can inspect behavior changes independently. Use npm and keep only `package-lock.json` as the dependency lockfile.

Do not commit credentials, local environment files, installed dependencies, preview screenshots, archives, or tool caches. Add public portfolio images and résumé files under `dist/assets/` when needed.

## Verify before opening a pull request

```sh
npm run format
npm run check
git diff --check
git diff --stat
git diff
```

Review the actual diff for unrelated changes and accidental content removal. For visible or interactive changes, open the local preview and check desktop/mobile layouts, menu behavior, each project filter, project dialogs, contact/résumé controls, and keyboard navigation. Include relevant screenshots or explain why browser checks were unnecessary.

Commit the intended files, push your branch, and open a pull request into `main`. Describe the resulting change and the verification performed. Review the diff and the GitHub check result before merging.

## Bring in changes from main

With a clean working tree on your feature branch:

```sh
git fetch origin
git merge origin/main
```

If conflicts appear, inspect both versions and retain the intended behavior from each. Avoid accepting an entire side without reviewing it. Keep formatting consistent, check project mappings, and remove all conflict markers. If dependencies changed, run `npm ci` again.

Rerun `npm run check` and relevant browser checks, review the resolved diff, then commit and push. This merge workflow avoids rewriting a shared branch's history.

GitHub Actions provides verification results. Enforcing those results as a requirement before merge is a separate repository setting.
