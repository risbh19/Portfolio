(() => {
  'use strict';

  const portfolio = window.PORTFOLIO;
  const section = document.querySelector('#projects') ?? document.querySelector('#work');
  if (!section || !portfolio?.projects) return;

  const projects = [
    ['miniredis', 'mini-redis', 'C++17 · RESP2 · epoll', 'Dashboard and sample keys'],
    [
      'collegeforum',
      'College Forum',
      'Next.js · FastAPI · PostgreSQL',
      'Forum boards and demo posts',
    ],
    ['racesafe', 'RaceSafe', 'React · FastAPI · PostgreSQL', 'Team recruitment workspace'],
    ['nextup', 'NextUp', 'Next.js · FastAPI · PostgreSQL', 'Confirmed demo clinic booking'],
    [
      'trading',
      'Paper Trading Engine',
      'C++20 · Python · CSV replay',
      'Local paper-trading replay',
    ],
    ['orbit', 'Orbit', 'TypeScript · Electron · LSP', 'Hello Orbit workspace'],
    ['casetrace', 'CaseTrace', 'React · FastAPI · SQLite', 'Synthetic transfer trail'],
  ].map(([key, title, stack, caption]) => ({
    key,
    title,
    stack,
    caption,
    record: portfolio.projects[key],
    trigger: section.querySelector(`[data-open-project="${key}"]`),
  }));
  if (projects.some(({ record, trigger }) => !record || !trigger)) return;

  const deck = document.createElement('div');
  deck.className = 'project-slides';
  deck.innerHTML = `
    <h2 class="project-slides__heading" id="project-slides-title">Selected projects</h2>
    <div class="project-slides__window" role="region" aria-roledescription="carousel" aria-labelledby="project-slides-title">
      <div class="project-slides__bar">
        <span aria-hidden="true" class="project-slides__mark"></span>
        <span>Projects</span>
        <span data-slide-position></span>
      </div>
      <div class="project-slides__stage" id="project-slides-stage">
        <div class="project-slides__copy">
          <p class="project-slides__category" data-slide-category></p>
          <h3 data-slide-title></h3>
          <p class="project-slides__summary" data-slide-summary></p>
          <p class="project-slides__stack" data-slide-stack></p>
          <button class="project-slides__details" type="button" data-slide-details>Project details <span aria-hidden="true">↗</span></button>
        </div>
        <figure class="project-slides__figure">
          <div class="project-slides__screen">
            <img width="1120" height="700" alt="" data-slide-image />
            <p data-slide-missing hidden>Local capture pending</p>
          </div>
          <figcaption data-slide-caption></figcaption>
        </figure>
      </div>
      <div class="project-slides__controls">
        <button type="button" aria-label="Previous project" aria-controls="project-slides-stage" data-slide-prev><span aria-hidden="true">←</span> <span>Prev</span></button>
        <div class="project-slides__list" role="group" aria-label="Choose a project"></div>
        <button type="button" aria-label="Next project" aria-controls="project-slides-stage" data-slide-next><span>Next</span> <span aria-hidden="true">→</span></button>
      </div>
      <p class="project-slides__sr" role="status" data-slide-status></p>
    </div>
  `;

  // Keep the project details buttons attached to the page for the dialog handlers.
  const original = document.createElement('div');
  original.className = 'project-slides__original';
  original.hidden = true;
  original.append(...section.childNodes);
  section.append(deck, original);
  section.setAttribute('aria-labelledby', 'project-slides-title');

  const find = (selector) => deck.querySelector(selector);
  const stage = find('#project-slides-stage');
  const list = find('.project-slides__list');
  const image = find('[data-slide-image]');
  const missing = find('[data-slide-missing]');
  const details = find('[data-slide-details]');
  const buttons = projects.map(({ title }, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(index + 1).padStart(2, '0');
    button.setAttribute('aria-label', title);
    button.setAttribute('aria-controls', stage.id);
    button.addEventListener('click', () => show(index));
    list.append(button);
    return button;
  });

  let current = 0;
  const count = projects.length;
  function show(index, announce = true) {
    current = (index + count) % count;
    const { key, title, stack, caption, record } = projects[current];
    const position = String(current + 1).padStart(2, '0');
    find('[data-slide-position]').textContent = `${position} / ${String(count).padStart(2, '0')}`;
    find('[data-slide-category]').textContent = record.category;
    find('[data-slide-title]').textContent = title;
    find('[data-slide-summary]').textContent = record.summary;
    find('[data-slide-stack]').textContent = stack;
    find('[data-slide-caption]').textContent = caption;
    image.alt = `${title} — ${caption}`;
    image.src = `assets/project-snapshots/${key}.webp`;
    image.hidden = false;
    missing.hidden = true;
    buttons.forEach((button, i) => button.setAttribute('aria-current', String(i === current)));
    if (announce)
      find('[data-slide-status]').textContent = `${title}, project ${current + 1} of ${count}`;
  }

  image.addEventListener('error', () => {
    image.hidden = true;
    missing.hidden = false;
    find('[data-slide-caption]').textContent = '';
  });
  details.addEventListener('click', () => {
    details.focus();
    projects[current].trigger.click();
  });
  find('[data-slide-prev]').addEventListener('click', () => show(current - 1));
  find('[data-slide-next]').addEventListener('click', () => show(current + 1));
  deck.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') show(0);
    else if (event.key === 'End') show(count - 1);
    else show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    if (list.contains(event.target)) buttons[current].focus();
  });

  let touch;
  stage.addEventListener(
    'touchstart',
    (event) => {
      touch = event.touches.length === 1 ? event.touches[0] : null;
    },
    { passive: true },
  );
  stage.addEventListener(
    'touchend',
    (event) => {
      if (!touch) return;
      const { clientX, clientY } = event.changedTouches[0];
      const distance = clientX - touch.clientX;
      if (Math.abs(distance) > 50 && Math.abs(distance) > Math.abs(clientY - touch.clientY) * 1.5) {
        show(current + (distance < 0 ? 1 : -1));
      }
      touch = null;
    },
    { passive: true },
  );
  stage.addEventListener(
    'touchcancel',
    () => {
      touch = null;
    },
    { passive: true },
  );

  show(0, false);
})();
