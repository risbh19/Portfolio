import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const read = (path) => readFileSync(join(root, path), 'utf8');
const values = (html, attribute) =>
  [...html.matchAll(new RegExp(`\\b${attribute}="([^"]*)"`, 'g'))].map((match) => match[1]);

function textFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return textFiles(path);
    return /\.(?:html|css|js|mjs|json|svg|md)$/.test(entry.name) ? [path] : [];
  });
}

try {
  for (const path of [
    'dist/app.js',
    'dist/contact.js',
    'dist/content.js',
    'dist/project-slides.js',
    'scripts/serve.mjs',
    'scripts/check.mjs',
  ]) {
    const result = spawnSync(process.execPath, ['--check', join(root, path)], { encoding: 'utf8' });
    assert.equal(
      result.status,
      0,
      `${path}: ${result.stderr || result.error || 'syntax check failed'}`,
    );
  }

  const contactTests = spawnSync(
    process.execPath,
    ['--test', join(root, 'scripts/contact.test.mjs')],
    { encoding: 'utf8' },
  );
  assert.equal(contactTests.status, 0, contactTests.stdout + contactTests.stderr);

  const html = read('dist/index.html');
  const ids = values(html, 'id');
  assert.equal(new Set(ids).size, ids.length, 'HTML IDs must be unique.');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, 'The page must have one h1.');
  assert.ok(ids.includes('main'), 'The main content anchor is missing.');
  assert.ok(
    html.includes('class="hero-actions"'),
    'The hero project and résumé actions are missing.',
  );
  assert.ok(
    html.includes('class="work-heading__subtitle"'),
    'The featured work introduction is missing.',
  );
  assert.ok(html.includes('rel="canonical"'), 'Canonical site metadata is missing.');
  const scripts = values(html, 'src');
  assert.ok(scripts.includes('content.js'), 'The content script is missing.');
  assert.ok(
    scripts.indexOf('app.js') > scripts.indexOf('content.js'),
    'Load content.js before app.js.',
  );

  for (const url of [...values(html, 'href'), ...values(html, 'src')]) {
    if (!url || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) continue;
    if (url.startsWith('#')) {
      assert.ok(ids.includes(url.slice(1)), `Missing anchor: ${url}`);
      continue;
    }
    const path = resolve(dist, decodeURIComponent(url.split(/[?#]/)[0]));
    const localPath = relative(dist, path);
    assert.ok(!localPath.startsWith('..') && !isAbsolute(localPath), `Asset outside dist: ${url}`);
    assert.ok(existsSync(path) && statSync(path).isFile(), `Missing local asset: ${url}`);
  }

  const context = { window: {} };
  runInNewContext(read('dist/content.js'), context, { timeout: 1000 });
  const config = context.window.PORTFOLIO;
  assert.ok(config, 'window.PORTFOLIO must be defined.');
  for (const key of values(html, 'data-content')) {
    assert.equal(typeof config[key], 'string', `Missing profile field: ${key}`);
  }
  const projectIds = values(html, 'data-project');
  assert.equal(new Set(projectIds).size, projectIds.length, 'Project card keys must be unique.');
  const featuredIds = values(
    html.split('<div class="project-grid">')[1].split('</div>')[0],
    'data-project',
  );
  const additionalIds = values(
    html.split('<div class="more-projects-grid">')[1].split('</div>')[0],
    'data-project',
  );
  assert.equal(featuredIds.length, 6, 'Expected six featured projects.');
  const projectScript = read('dist/project-slides.js');
  assert.ok(
    projectScript.includes("source.className = 'project-card__source'"),
    'Featured cards must expose a source link without opening the modal.',
  );
  assert.equal(additionalIds.length, 2, 'Expected two additional projects.');
  assert.deepEqual(
    [...projectIds].sort(),
    Object.keys(config.projects).sort(),
    'Project cards and content keys must match.',
  );
  for (const id of projectIds) {
    const snapshotPath = config.projects[id].snapshot || `assets/project-snapshots/${id}.webp`;
    if (snapshotPath.startsWith('https://')) {
      const url = new URL(snapshotPath);
      assert.equal(url.hostname, 'raw.githubusercontent.com', `Untrusted snapshot host: ${id}`);
      assert.ok(
        url.pathname.startsWith('/risbh19/api-sentinel/'),
        `Unknown snapshot source: ${id}`,
      );
    } else {
      const snapshot = resolve(dist, snapshotPath);
      const localPath = relative(dist, snapshot);
      assert.ok(
        !localPath.startsWith('..') && !isAbsolute(localPath),
        `Invalid snapshot path: ${id}`,
      );
      assert.ok(
        existsSync(snapshot) && statSync(snapshot).isFile(),
        `Missing project snapshot: ${id}`,
      );
    }
    for (const field of [
      'title',
      'category',
      'year',
      'number',
      'role',
      'stack',
      'summary',
      'brief',
      'contribution',
      'outcome',
      'visualNote',
      'link',
      'linkLabel',
    ]) {
      assert.equal(
        typeof config.projects[id][field],
        'string',
        `Missing project field: ${id}.${field}`,
      );
    }
  }
  for (const id of values(html, 'data-open-project')) {
    assert.ok(projectIds.includes(id), `Project button has no matching card: ${id}`);
  }
  for (const key of values(html, 'data-social')) {
    assert.equal(typeof config.socials[key], 'string', `Missing social field: ${key}`);
  }
  assert.equal(typeof config.resumeUrl, 'string', 'resumeUrl must be a string.');
  const hosting = JSON.parse(read('vercel.json'));
  assert.equal(hosting.outputDirectory, 'dist', 'Vercel must serve the tracked dist directory.');
  assert.equal(hosting.framework, null, 'Use the Other preset for this static site.');
  assert.equal(hosting.buildCommand, '', 'This static site does not require a build.');
  assert.equal(hosting.installCommand, '', 'Deployment does not require package installation.');

  const files = [
    ...textFiles(dist),
    ...textFiles(join(root, 'scripts')),
    join(root, 'README.md'),
    join(root, 'CONTRIBUTING.md'),
  ];
  for (const path of files) {
    assert.ok(
      !/^(?:<{7}|={7}|>{7})(?:\s|$)/m.test(readFileSync(path, 'utf8')),
      `Unresolved merge marker: ${relative(root, path)}`,
    );
  }

  console.log(
    `Source checks passed: JavaScript syntax, ${featuredIds.length} featured and ${additionalIds.length} additional projects, profile fields, assets, anchors, and merge markers.`,
  );
} catch (error) {
  console.error(`Source check failed: ${error.message}`);
  process.exitCode = 1;
}
