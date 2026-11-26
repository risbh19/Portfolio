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
  document.title = `${config.name.replace(/[\[\]]/g, '')} — Backend & Systems Engineering`;
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
    const title = $('h3 button, h4', card);
    if (title) title.textContent = project.title;
    $('.project-type', card).textContent = project.category.toUpperCase();
  });

  const menuButton = $('.menu-toggle');
  const menu = $('#menu-panel');
  function closeMenu() {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
  });
  $$('a', menu).forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (event) => {
    if (!menu.hidden && !menu.contains(event.target) && !menuButton.contains(event.target))
      closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      closeMenu();
      menuButton.focus();
    }
  });

  const dialog = $('#detail-dialog');
  const dialogContent = $('#dialog-content');
  const esc = (text) =>
    String(text).replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
    );
  let previousFocus;
  function openDialog(label, markup) {
    closeMenu();
    previousFocus = document.activeElement;
    $('#dialog-label').textContent = label;
    dialogContent.innerHTML = markup;
    document.body.classList.add('modal-open');
    dialog.showModal();
    dialog.scrollTop = 0;
    $('.dialog-close').focus();
  }
  function closeDialog() {
    dialog.close();
  }
  $('.dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        closeDialog();
    }
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button:not(:disabled), a[href]')];
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    previousFocus?.focus();
  });
  function projectLink(label, value) {
    const url = value && safeUrl(value);
    return url
      ? `<a class="raised-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} <span aria-hidden="true">↗</span></a>`
      : '';
  }

  function openProject(id) {
    const project = config.projects[id];
    if (!project) return;
    const snapshot = project.snapshot || `assets/project-snapshots/${id}.webp`;
    openDialog(
      `SELECTED WORK / ${project.number}`,
      /* HTML */ `
        <div class="dialog-body">
          <p class="dialog-eyebrow mono"
            >DEVELOPMENT PROJECT / ${esc(project.category.toUpperCase())}</p
          >
          <h2 id="dialog-title">${esc(project.title)}</h2>
          <p class="project-intro">${esc(project.summary)}</p>
          <figure class="dialog-art">
            <img
              src="${esc(snapshot)}"
              width="1120"
              height="700"
              alt="${esc(project.snapshot ? `Demo view of ${project.title}` : `Local capture of ${project.title}`)}"
            />
          </figure>
          <p class="visual-note mono">${esc(project.visualNote)}</p>
          <dl class="dialog-facts">
            <div><dt>DISCIPLINE</dt><dd>${esc(project.category)}</dd></div>
            <div><dt>YEAR</dt><dd>${esc(project.year)}</dd></div>
            <div><dt>MY ROLE</dt><dd>${esc(project.role)}</dd></div>
          </dl>
          <section class="case-section"><h3>THE STACK</h3><p>${esc(project.stack)}</p></section>
          <section class="case-section"
            ><h3>THE STARTING POINT</h3><p>${esc(project.brief)}</p></section
          >
          <section class="case-section"
            ><h3>WHAT I BUILT</h3><p>${esc(project.contribution)}</p></section
          >
          <section class="case-section"
            ><h3>THE IMPLEMENTATION</h3><p>${esc(project.outcome)}</p></section
          >
          <div class="dialog-links">
            ${projectLink(project.linkLabel, project.link)}
            ${projectLink('Live demo', project.demo)}
            ${project.link ? '' : '<p class="link-placeholder mono">Source repository is private.</p>'}
          </div>
        </div>
      `,
    );
  }
  $$('[data-open-project]').forEach((button) =>
    button.addEventListener('click', () => openProject(button.dataset.openProject)),
  );
})();
