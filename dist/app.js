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
    if (typeof value === 'string') node.textContent = value;
  });
  $$('[data-year]').forEach((node) => (node.textContent = new Date().getFullYear()));
  document.title = `${config.name.replace(/[\[\]]/g, '')} — Software Developer`;
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
    $('h3 button', card).textContent = project.title;
    $('.project-type', card).replaceChildren(
      document.createTextNode(project.category.toUpperCase()),
      document.createElement('br'),
      document.createTextNode(project.year),
    );
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

  const art = $('.signal-art');
  const motionButton = $('.motion-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  function syncMotion() {
    art.classList.toggle('paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute(
      'aria-label',
      paused ? 'Play orbit animation' : 'Pause orbit animation',
    );
    motionButton.innerHTML = paused
      ? 'PLAY <span aria-hidden="true">▷</span>'
      : 'PAUSE <span aria-hidden="true">Ⅱ</span>';
  }
  syncMotion();
  motionButton.addEventListener('click', () => {
    paused = !paused;
    syncMotion();
  });
  art.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || event.pointerType === 'touch') return;
    const rect = art.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
    $('.orbit-svg').style.transform = `translate(${x}px, ${y}px) rotate(${x / 3}deg)`;
  });
  art.addEventListener('pointerleave', () => {
    $('.orbit-svg').style.transform = '';
  });

  $$('.filter').forEach((button) =>
    button.addEventListener('click', () => {
      $$('.filter').forEach((b) => {
        const active = b === button;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      let count = 0;
      $$('.project').forEach((project) => {
        const visible =
          button.dataset.filter === 'all' || project.dataset.category === button.dataset.filter;
        project.hidden = !visible;
        if (visible) count++;
      });
      $('#visible-count').textContent = `(${String(count).padStart(2, '0')})`;
    }),
  );

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
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    previousFocus?.focus();
  });
  function openProject(id) {
    const project = config.projects[id];
    if (!project) return;
    openDialog(
      `SELECTED WORK / ${project.number}`,
      /* HTML */ `
        <div class="dialog-body">
          <p class="dialog-eyebrow mono"
            >DEVELOPMENT PROJECT / ${esc(project.category.toUpperCase())}</p
          >
          <h2 id="dialog-title">${esc(project.title)}</h2>
          <p class="project-intro">${esc(project.summary)}</p>
          <div class="dialog-art" aria-hidden="true"></div>
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
          ${
            project.link && safeUrl(project.link)
              ? `<a class="split-button" href="${esc(safeUrl(project.link))}" target="_blank" rel="noopener noreferrer"><span>${esc(project.linkLabel)}</span><span>↗</span></a>`
              : '<p class="link-placeholder mono">REPOSITORY / LIVE DEMO LINK — TO BE ADDED</p>'
          }
        </div>
      `,
    );
    const source = $(`[data-project="${id}"] .project-visual`);
    const clone = source.cloneNode(true);
    clone.removeAttribute('data-open-project');
    clone.removeAttribute('aria-label');
    clone.setAttribute('tabindex', '-1');
    clone.setAttribute('disabled', '');
    $$('.project-open', clone).forEach((node) => node.remove());
    const clonedIds = $$('[id]', clone).map((node) => {
      const old = node.id;
      node.id = `${old}-dialog`;
      return old;
    });
    let clonedMarkup = clone.innerHTML;
    clonedIds.forEach((id) => {
      clonedMarkup = clonedMarkup.replaceAll(`url(#${id})`, `url(#${id}-dialog)`);
    });
    clone.innerHTML = clonedMarkup;
    $('.dialog-art', dialog).appendChild(clone);
  }
  $$('[data-open-project]').forEach((button) =>
    button.addEventListener('click', () => openProject(button.dataset.openProject)),
  );
})();
