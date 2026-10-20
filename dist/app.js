(() => {
  'use strict';
  const config = window.PORTFOLIO;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const safeUrl = (value) => {
    try {
      const u = new URL(value, location.href);
      return ['http:', 'https:'].includes(u.protocol) ? u.href : null;
    } catch {
      return null;
    }
  };
  $$('[data-content]').forEach((node) => {
    const value = config[node.dataset.content];
    if (typeof value !== 'string') return;
    if (!node.hasAttribute('data-emphasis')) {
      node.textContent = value;
      return;
    }
    // Support **bold phrases** in opted-in copy without interpreting HTML.
    node.replaceChildren(
      ...value.split(/(\*\*[^*]+\*\*)/g).map((part) => {
        if (!part.startsWith('**') || !part.endsWith('**')) return part;
        const strong = document.createElement('strong');
        strong.textContent = part.slice(2, -2);
        return strong;
      }),
    );
  });
  $$('[data-year]').forEach((node) => (node.textContent = new Date().getFullYear()));
  const pageProject = config.projects[document.body.dataset.projectPage];
  document.title = pageProject
    ? `${pageProject.title} — ${config.name}`
    : `${config.name} — Software Developer`;
  $$('[data-email-link]').forEach((link) => {
    link.href = `mailto:${config.email}`;
  });
  $$('[data-social]').forEach((link) => {
    const url = safeUrl(config.socials[link.dataset.social]);
    if (url) link.href = url;
  });
  $$('[data-resume-link]').forEach((link) => {
    const url = safeUrl(config.resumeUrl);
    if (url) link.href = url;
  });
  $$('[data-project]').forEach((card) => {
    const project = config.projects[card.dataset.project];
    if (!project) return;
    $('h3 a', card).textContent = project.title;
    $('.project-type', card).textContent = project.category.toUpperCase();
  });

  if (pageProject) {
    $$('[data-project-field]').forEach((node) => {
      const value = pageProject[node.dataset.projectField];
      if (typeof value === 'string') node.textContent = value;
    });
    const source = $('[data-project-source]');
    const url = safeUrl(pageProject.link);
    if (source && url) source.href = url;
  }
})();
