(() => {
  'use strict';

  const section = document.querySelector('#work');
  const track = section?.querySelector('.project-grid');
  const heading = section?.querySelector('.work-heading');
  const cards = [...(track?.querySelectorAll('[data-project]') ?? [])];
  if (!heading || cards.length < 2) return;

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
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  track.setAttribute('aria-roledescription', 'carousel');
  track.classList.add('is-carousel');
  track.id = 'project-carousel-track';
  track.setAttribute('role', 'region');
  track.setAttribute('aria-label', 'Project cards');

  function appendProjectLinks(actions, project) {
    const source = document.createElement('a');
    source.className = 'project-card__source';
    source.href = project.link;
    source.textContent = 'GitHub';
    source.setAttribute('aria-label', 'View ' + project.title + ' source code on GitHub');
    actions.append(source);
    const demo = document.createElement(project.demo ? 'a' : 'span');
    demo.className = project.demo ? 'project-card__source' : 'demo-placeholder';
    demo.textContent = project.demo ? 'Live demo' : 'Demo coming soon';
    if (project.demo) {
      demo.href = project.demo;
      demo.setAttribute('aria-label', 'Open ' + project.title + ' live demo');
    }
    actions.append(demo);
    for (const link of actions.querySelectorAll('a')) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  }

  section.querySelectorAll('.more-project-card').forEach((card) => {
    const actions = document.createElement('div');
    actions.className = 'project-card__actions';
    actions.append(card.querySelector('[data-open-project]'));
    appendProjectLinks(actions, projects[card.dataset.project]);
    card.append(actions);
  });

  cards.forEach((card, i) => {
    const { project: key } = card.dataset;
    const project = projects[key];
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'slide');
    card.setAttribute('aria-label', `${project.title}, ${i + 1} of ${cards.length}`);
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
    appendProjectLinks(actions, project);
    if (key === 'miniredis' || key === 'racesafe') {
      const result = document.createElement('p');
      result.className = 'project-result';
      result.textContent = project.contribution;
      copy.append(title, summary, result, stack, actions);
    } else {
      copy.append(title, summary, stack, actions);
    }
    card.append(figure, copy);
  });

  const navigation = document.createElement('div');
  navigation.className = 'project-navigation';
  navigation.innerHTML = `
    <button type="button" aria-label="Previous project" aria-controls="project-carousel-track">←</button>
    <span class="project-navigation__position" aria-hidden="true"></span>
    <button type="button" aria-label="Next project" aria-controls="project-carousel-track">→</button>
  `;
  const slider = document.createElement('div');
  slider.className = 'featured-slider';
  track.before(slider);
  slider.append(track, navigation);
  const [previous, next] = navigation.querySelectorAll('button');
  const position = navigation.querySelector('.project-navigation__position');

  const index = document.createElement('div');
  index.className = 'project-index';
  index.setAttribute('role', 'group');
  index.setAttribute('aria-label', 'Choose a project');
  const status = document.createElement('p');
  status.className = 'project-carousel-status';
  status.setAttribute('role', 'status');
  navigation.after(index, status);

  let current = 0;
  let scrollTimer;
  const format = (n) => String(n).padStart(2, '0');
  const offset = (card) => card.offsetLeft - cards[0].offsetLeft;
  const choices = cards.map((card, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = format(i + 1);
    button.setAttribute('aria-label', projects[card.dataset.project].title);
    button.setAttribute('aria-controls', track.id);
    button.addEventListener('click', () => select(i));
    index.append(button);
    return button;
  });

  function update(i, announce) {
    current = i;
    position.textContent = `${format(i + 1)} / ${format(cards.length)}`;
    previous.disabled = i === 0;
    next.disabled = i === cards.length - 1;
    choices.forEach((button, choice) => button.setAttribute('aria-current', String(choice === i)));
    if (announce)
      status.textContent = `${projects[cards[i].dataset.project].title}, project ${i + 1} of ${cards.length}`;
  }

  function select(i) {
    const target = Math.min(Math.max(i, 0), cards.length - 1);
    if (target === current) return;
    update(target, true);
    track.scrollTo({
      left: offset(cards[target]),
      behavior: motion.matches ? 'instant' : 'smooth',
    });
  }

  track.addEventListener(
    'scroll',
    () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const distance = (card) => Math.abs(offset(card) - track.scrollLeft);
        const nearest = cards.reduce((best, card) =>
          distance(card) < distance(best) ? card : best,
        );
        const i = cards.indexOf(nearest);
        if (i !== current) update(i, true);
      }, 140);
    },
    { passive: true },
  );
  previous.addEventListener('click', () => select(current - 1));
  next.addEventListener('click', () => select(current + 1));
  section.addEventListener('keydown', (event) => {
    if (
      !track.contains(event.target) &&
      !navigation.contains(event.target) &&
      !index.contains(event.target)
    )
      return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') select(0);
    else if (event.key === 'End') select(cards.length - 1);
    else select(current + (event.key === 'ArrowLeft' ? -1 : 1));
    if (index.contains(event.target)) choices[current].focus();
    if (event.target.closest('.project-card')) {
      cards[current].querySelector('[data-open-project]').focus({ preventScroll: true });
    }
  });
  update(0, false);
})();
