(() => {
  'use strict';

  const section = document.querySelector('#work');
  const track = section?.querySelector('.project-grid');
  const cards = [...(track?.querySelectorAll('[data-project]') ?? [])];
  if (!cards.length) return;

  const captions = {
    miniredis: 'Dashboard and sample keys',
    collegeforum: 'Forum boards and demo posts',
    racesafe: 'Team recruitment workspace',
    nextup: 'Confirmed demo clinic booking',
    apisentinel: 'Synthetic API traffic overview',
    trading: 'Local paper-trading replay',
    orbit: 'Hello Orbit workspace',
    casetrace: 'Synthetic transfer trail',
  };
  const projects = window.PORTFOLIO.projects;
  cards.forEach((card) => {
    const { project: key } = card.dataset;
    const project = projects[key];
    const category = card.querySelector('.project-type');
    const title = card.querySelector('h3');
    const details = card.querySelector('[data-open-project]');
    const summary = card.querySelector('p:not(.project-type)');

    category.classList.add('project-card__bar');
    const figure = document.createElement('figure');
    figure.className = 'project-card__snapshot';
    const image = new Image(1120, 700);
    image.src = project.snapshot || `assets/project-snapshots/${key}.webp`;
    image.alt = `${project.title} — ${captions[key]}`;
    image.loading = 'lazy';
    image.decoding = 'async';
    const caption = document.createElement('figcaption');
    caption.textContent = captions[key];
    figure.append(image, caption);

    const copy = document.createElement('div');
    copy.className = 'project-card__copy';
    const stack = document.createElement('p');
    stack.className = 'project-card__stack';
    stack.textContent = project.stack;
    title.textContent = project.title;
    details.textContent = 'Explore project ↗';
    details.setAttribute('aria-label', `Project details — ${project.title}`);

    const actions = document.createElement('div');
    actions.className = 'project-card__actions';
    actions.append(details);
    if (project.link) {
      const source = document.createElement('a');
      source.className = 'project-card__source';
      source.href = project.link;
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      source.textContent = 'Source code ↗';
      source.setAttribute('aria-label', `View ${project.title} source code on GitHub`);
      actions.append(source);
    }
    copy.append(title, summary, stack, actions);
    card.append(figure, copy);
  });
})();
