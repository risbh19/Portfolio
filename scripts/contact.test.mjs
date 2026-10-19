import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../dist/contact.js', import.meta.url), 'utf8');

function setup({
  key = 'test-access-key',
  fetcher = async () => ({ ok: true, json: async () => ({ success: true }) }),
} = {}) {
  let focused;
  let timeout;
  const element = (text = '') => ({
    textContent: text,
    hidden: false,
    disabled: false,
    value: '',
    checked: false,
    attributes: new Map(),
    listeners: new Map(),
    validity: { valid: true },
    setAttribute(name, value) {
      this.attributes.set(name, value);
    },
    removeAttribute(name) {
      this.attributes.delete(name);
    },
    addEventListener(name, callback) {
      this.listeners.set(name, callback);
    },
    focus() {
      focused = this;
    },
  });
  const fields = Object.fromEntries(
    ['name', 'email', 'message', 'botcheck'].map((name) => [name, element()]),
  );
  const topics = ['A project', 'A question', 'Just saying hi'].map(element);
  topics.forEach((button, index) => button.setAttribute('aria-pressed', String(index === 0)));
  const submit = element('Send message →');
  const alert = element();
  const success = element();
  alert.hidden = success.hidden = true;
  const thanks = element();
  const another = element('Send another');
  const form = element();
  form.elements = { namedItem: (name) => fields[name] };
  form.querySelector = () => submit;
  form.querySelectorAll = (selector) =>
    selector === '[data-contact-topic]' ? topics : [...Object.values(fields), ...topics, submit];
  form.reset = () =>
    Object.values(fields).forEach((field) => {
      field.value = '';
      field.checked = false;
    });
  const nodes = {
    '#conversation-form': form,
    '#contact-alert': alert,
    '#contact-success': success,
    '#contact-thanks': thanks,
    '#contact-another': another,
  };
  const calls = [];
  class TestFormData extends Map {
    constructor() {
      super(
        Object.entries(fields)
          .filter(([name, field]) => name !== 'botcheck' || field.checked)
          .map(([name, field]) => [name, field.value]),
      );
    }
  }
  const testSource = source.replace(
    /const WEB3FORMS_ACCESS_KEY = '[^']*';/,
    `const WEB3FORMS_ACCESS_KEY = '${key}';`,
  );
  runInNewContext(testSource, {
    document: { querySelector: (selector) => nodes[selector] },
    FormData: TestFormData,
    AbortController,
    setTimeout: (callback) => {
      timeout = callback;
      return 1;
    },
    clearTimeout: () => {},
    fetch: (...args) => {
      calls.push(args);
      return fetcher(...args);
    },
  });
  return {
    fields,
    topics,
    submit,
    form,
    alert,
    success,
    thanks,
    another,
    calls,
    get focused() {
      return focused;
    },
    valid() {
      fields.name.value = '  Ada Lovelace  ';
      fields.email.value = 'ada@example.com';
      fields.message.value = '  Hello, a project question.  ';
    },
    click: (button) => button.listeners.get('click')(),
    send: () => form.listeners.get('submit')({ preventDefault() {} }),
    expire: () => timeout(),
  };
}

test('topics are exclusive and invalid submissions never send', async () => {
  const ui = setup();
  ui.click(ui.topics[2]);
  assert.deepEqual(
    ui.topics.map((button) => button.attributes.get('aria-pressed')),
    ['false', 'false', 'true'],
  );
  ui.valid();
  ui.fields.name.value = '  ';
  ui.fields.email.validity.valid = false;
  await ui.send();
  assert.equal(ui.alert.textContent, 'Please add your name, a valid email and a short message.');
  assert.equal(ui.alert.hidden, false);
  assert.equal(ui.focused, ui.fields.name);
  assert.equal(ui.fields.email.attributes.get('aria-invalid'), 'true');
  assert.equal(ui.calls.length, 0);
});

test('the placeholder key and honeypot block requests without pretending success', async () => {
  for (const key of ['YOUR_WEB3FORMS_ACCESS_KEY', 'test-access-key']) {
    const ui = setup({ key });
    ui.valid();
    ui.fields.botcheck.checked = key === 'test-access-key';
    await ui.send();
    assert.equal(ui.calls.length, 0);
    assert.equal(ui.alert.hidden, false);
    assert.equal(ui.success.hidden, true);
  }
});

test('sends one FormData request, shows pending state, then success and a clean reset', async () => {
  let resolve;
  const ui = setup({
    fetcher: () =>
      new Promise((done) => {
        resolve = done;
      }),
  });
  ui.valid();
  ui.click(ui.topics[1]);
  const sending = ui.send();
  assert.equal(ui.submit.disabled, true);
  assert.equal(ui.submit.textContent, 'Sending…');
  assert.equal(ui.form.attributes.get('aria-busy'), 'true');
  await ui.send();
  assert.equal(ui.calls.length, 1);
  const [url, request] = ui.calls[0];
  assert.equal(url, 'https://api.web3forms.com/submit');
  assert.equal(request.method, 'POST');
  assert.equal(request.body.get('access_key'), 'test-access-key');
  assert.equal(request.body.get('name'), 'Ada Lovelace');
  assert.equal(request.body.get('email'), 'ada@example.com');
  assert.equal(request.body.get('message'), 'Hello, a project question.');
  assert.equal(request.body.get('subject'), 'Portfolio: A question from Ada Lovelace');
  assert.equal(request.body.get('from_name'), 'Portfolio contact form');
  assert.equal(request.body.has('botcheck'), false);
  resolve({ ok: true, json: async () => ({ success: true }) });
  await sending;
  assert.equal(ui.form.hidden, true);
  assert.equal(ui.success.hidden, false);
  assert.equal(ui.thanks.textContent, 'Thanks, Ada. I will get back to you soon.');
  assert.equal(ui.focused, ui.success);
  ui.click(ui.another);
  assert.equal(ui.form.hidden, false);
  assert.equal(ui.success.hidden, true);
  assert.equal(ui.fields.message.value, '');
  assert.equal(ui.topics[0].attributes.get('aria-pressed'), 'true');
  assert.equal(ui.focused, ui.fields.name);
});

test('HTTP, API, malformed JSON and network failures preserve the message and allow retry', async () => {
  for (const fetcher of [
    async () => ({ ok: false, json: async () => ({ success: true }) }),
    async () => ({ ok: true, json: async () => ({ success: false }) }),
    async () => ({
      ok: true,
      json: async () => {
        throw new SyntaxError('Invalid JSON');
      },
    }),
    async () => {
      throw new Error('Offline');
    },
  ]) {
    const ui = setup({ fetcher });
    ui.valid();
    await ui.send();
    assert.equal(ui.form.hidden, false);
    assert.equal(ui.success.hidden, true);
    assert.equal(ui.fields.message.value, 'Hello, a project question.');
    assert.equal(
      ui.alert.textContent,
      'Something went wrong. You can also email me at palrishabh989@gmail.com.',
    );
    assert.equal(ui.submit.disabled, false);
    assert.equal(ui.submit.textContent, 'Send message →');
    assert.equal(ui.form.attributes.has('aria-busy'), false);
    await ui.send();
    assert.equal(ui.calls.length, 2);
  }
});

test('a stalled request times out and restores the form', async () => {
  const ui = setup({
    fetcher: (_, { signal }) =>
      new Promise((_, reject) => {
        signal.addEventListener('abort', () => reject(new Error('Aborted')));
      }),
  });
  ui.valid();
  const sending = ui.send();
  ui.expire();
  await sending;
  assert.equal(ui.alert.hidden, false);
  assert.equal(ui.submit.disabled, false);
  assert.equal(ui.fields.message.value, 'Hello, a project question.');
});
