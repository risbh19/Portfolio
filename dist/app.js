(() => {
  'use strict';
  const config = window.PORTFOLIO;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const isPlaceholder = value => !value || /[\[\]]/.test(value);
  const safeUrl = value => { try { const u = new URL(value, location.href); return ['http:', 'https:'].includes(u.protocol) ? u.href : null; } catch { return null; } };
  $$('[data-content]').forEach(node => { const value = config[node.dataset.content]; if (typeof value === 'string') node.textContent = value; });
  $$('[data-year]').forEach(node => node.textContent = new Date().getFullYear());
  document.title = `${config.name.replace(/[\[\]]/g, '')} — Independent Portfolio`;
  $$('[data-project]').forEach(card => {
    const project = config.projects[card.dataset.project];
    if (!project) return;
    $('h3 button', card).textContent = project.title;
    $('.project-type', card).replaceChildren(document.createTextNode(project.category.toUpperCase()), document.createElement('br'), document.createTextNode(project.year));
  });

  const menuButton = $('.menu-toggle');
  const menu = $('#menu-panel');
  function closeMenu() { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); }
  menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menu.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); });
  $$('a', menu).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (!menu.hidden && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { closeMenu(); menuButton.focus(); } });

  const art = $('.signal-art');
  const motionButton = $('.motion-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  function syncMotion() { art.classList.toggle('paused', paused); motionButton.setAttribute('aria-pressed', String(paused)); motionButton.setAttribute('aria-label', paused ? 'Play orbit animation' : 'Pause orbit animation'); motionButton.innerHTML = paused ? 'PLAY <span aria-hidden="true">▷</span>' : 'PAUSE <span aria-hidden="true">Ⅱ</span>'; }
  syncMotion();
  motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); });
  art.addEventListener('pointermove', event => { if (reducedMotion.matches || event.pointerType === 'touch') return; const rect = art.getBoundingClientRect(); const x = ((event.clientX - rect.left) / rect.width - .5) * 12; const y = ((event.clientY - rect.top) / rect.height - .5) * 12; $('.orbit-svg').style.transform = `translate(${x}px, ${y}px) rotate(${x / 3}deg)`; });
  art.addEventListener('pointerleave', () => { $('.orbit-svg').style.transform = ''; });

  $$('.filter').forEach(button => button.addEventListener('click', () => {
    $$('.filter').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
    let count = 0;
    $$('.project').forEach(project => { const visible = button.dataset.filter === 'all' || project.dataset.category === button.dataset.filter; project.hidden = !visible; if (visible) count++; });
    $('#visible-count').textContent = `(${String(count).padStart(2, '0')})`;
  }));

  const dialog = $('#detail-dialog');
  const dialogContent = $('#dialog-content');
  const esc = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  let previousFocus;
  function openDialog(label, markup) { closeMenu(); previousFocus = document.activeElement; $('#dialog-label').textContent = label; dialogContent.innerHTML = markup; document.body.classList.add('modal-open'); dialog.showModal(); dialog.scrollTop = 0; $('.dialog-close').focus(); }
  function closeDialog() { dialog.close(); }
  $('.dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(); } });
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); previousFocus?.focus(); });
  function openProject(id) {
    const project = config.projects[id];
    if (!project) return;
    openDialog(`SELECTED WORK / ${project.number}`, `<div class="dialog-body"><p class="dialog-eyebrow mono">CONCEPT PLACEHOLDER / ${esc(project.category.toUpperCase())}</p><h2 id="dialog-title">${esc(project.title)}</h2><p class="dialog-notice">An original visual concept created for this portfolio layout. Replace it with your own project, images, and story. It does not represent completed client work.</p><div class="dialog-art" aria-hidden="true"></div><dl class="dialog-facts"><div><dt>DISCIPLINE</dt><dd>${esc(project.category)}</dd></div><div><dt>YEAR</dt><dd>${esc(project.year)}</dd></div><div><dt>YOUR ROLE</dt><dd>[Add your contribution]</dd></div></dl><section class="case-section"><h3>THE STARTING POINT</h3><p>${esc(project.brief)}</p></section><section class="case-section"><h3>MY CONTRIBUTION</h3><p>${esc(project.contribution)}</p></section><section class="case-section"><h3>THE OUTCOME</h3><p>${esc(project.outcome)}</p></section>${safeUrl(project.link) && project.link ? `<a class="split-button" href="${esc(safeUrl(project.link))}" target="_blank" rel="noopener noreferrer"><span>VISIT PROJECT</span><span>↗</span></a>` : ''}</div>`);
    const source = $(`[data-project="${id}"] .project-visual`);
    const clone = source.cloneNode(true);
    clone.removeAttribute('data-open-project'); clone.removeAttribute('aria-label'); clone.setAttribute('tabindex', '-1'); clone.setAttribute('disabled', '');
    $$('.project-open', clone).forEach(node => node.remove());
    const clonedIds = $$('[id]', clone).map(node => { const old = node.id; node.id = `${old}-dialog`; return old; });
    let clonedMarkup = clone.innerHTML;
    clonedIds.forEach(id => { clonedMarkup = clonedMarkup.replaceAll(`url(#${id})`, `url(#${id}-dialog)`); });
    clone.innerHTML = clonedMarkup;
    $('.dialog-art', dialog).appendChild(clone);
  }
  $$('[data-open-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.openProject)));

  let toastTimeout;
  function toast(message) { const node = $('.toast'); node.textContent = message; node.hidden = false; clearTimeout(toastTimeout); toastTimeout = setTimeout(() => node.hidden = true, 4200); }
  function contact() { if (!isPlaceholder(config.email)) { location.href = `mailto:${config.email}`; return; } openDialog('04 / SAY HELLO', `<div class="dialog-body"><p class="dialog-eyebrow mono">CONTACT DETAILS / PLACEHOLDER</p><h2 id="dialog-title">Let's make<br>something good.</h2><span class="contact-dialog-email">${esc(config.email)}</span><p class="dialog-notice">Your contact details belong here. Once your real email address is added, the email buttons will open a message to you.</p><p class="about-secondary">A project, a collaboration, or just a conversation. This is where it starts.</p></div>`); }
  $$('[data-open-contact], [data-email-action]').forEach(button => button.addEventListener('click', contact));
  $$('[data-social]').forEach(button => button.addEventListener('click', () => { const value = config.socials[button.dataset.social]; const url = value && safeUrl(value); if (url) window.open(url, '_blank', 'noopener,noreferrer'); else toast(`${button.dataset.social[0].toUpperCase() + button.dataset.social.slice(1)} profile — link to be added.`); }));
  $('[data-open-resume]').addEventListener('click', () => { const url = config.resumeUrl && safeUrl(config.resumeUrl); if (url) { window.open(url, '_blank', 'noopener,noreferrer'); return; } openDialog('ABOUT / THE LONGER STORY', `<div class="dialog-body"><p class="dialog-eyebrow mono">RÉSUMÉ / PLACEHOLDER</p><h2 id="dialog-title">${esc(config.name)}</h2><p class="dialog-notice">Your résumé will live here. The sections below are ready for your actual details.</p><div class="resume-row"><h3>ROLE & LOCATION</h3><p>${esc(config.role)} · ${esc(config.location)}</p></div><div class="resume-row"><h3>EXPERIENCE</h3><p>[Your role] · [Company / Independent]<br>[Start date — End date]<br>[A short description of the work you did.]</p></div><div class="resume-row"><h3>EDUCATION</h3><p>[Course or degree] · [Institution]<br>[Year]</p></div><div class="resume-row"><h3>SKILLS & TOOLS</h3><p>[Add your actual skills, tools, and areas of interest.]</p></div><div class="resume-row"><h3>CONTACT</h3><p>${esc(config.email)}</p></div></div>`); });
})();
