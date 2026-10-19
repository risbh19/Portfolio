// Paste the access key for your receiving email here. This is a public client-side key.
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

(() => {
  'use strict';
  const form = document.querySelector('#conversation-form');
  const topics = [...form.querySelectorAll('[data-contact-topic]')];
  const fields = ['name', 'email', 'message'].map((name) => form.elements.namedItem(name));
  const submit = form.querySelector('[type="submit"]');
  const alert = document.querySelector('#contact-alert');
  const success = document.querySelector('#contact-success');
  const thanks = document.querySelector('#contact-thanks');
  const another = document.querySelector('#contact-another');
  const failureMessage = 'Something went wrong. You can also email me at palrishabh989@gmail.com.';
  let topic = topics[0].textContent.trim();
  let sending = false;

  function chooseTopic(button) {
    topic = button.textContent.trim();
    topics.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  }
  topics.forEach((button) => button.addEventListener('click', () => chooseTopic(button)));
  submit.disabled = false;

  function showAlert(message) {
    alert.textContent = message;
    alert.hidden = false;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    alert.hidden = true;
    alert.textContent = '';
    fields.forEach((field) => {
      field.value = field.value.trim();
      field.removeAttribute('aria-invalid');
    });
    const invalid = fields.filter((field) => !field.value || !field.validity.valid);
    if (invalid.length) {
      invalid.forEach((field) => field.setAttribute('aria-invalid', 'true'));
      showAlert('Please add your name, a valid email and a short message.');
      invalid[0].focus();
      return;
    }
    if (
      !WEB3FORMS_ACCESS_KEY ||
      WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY' ||
      form.elements.namedItem('botcheck').checked
    ) {
      showAlert(failureMessage);
      return;
    }

    const data = new FormData(form);
    data.set('access_key', WEB3FORMS_ACCESS_KEY);
    data.set('subject', `Portfolio: ${topic} from ${fields[0].value}`);
    data.set('from_name', 'Portfolio contact form');
    const controls = [...form.querySelectorAll('input, textarea, button')];
    sending = true;
    controls.forEach((control) => (control.disabled = true));
    submit.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('Submission rejected');
      const firstName = fields[0].value.split(/\s+/)[0];
      thanks.textContent = `Thanks, ${firstName}. I will get back to you soon.`;
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch {
      showAlert(failureMessage);
    } finally {
      clearTimeout(timeout);
      sending = false;
      controls.forEach((control) => (control.disabled = false));
      submit.textContent = 'Send message →';
      form.removeAttribute('aria-busy');
    }
  });

  another.addEventListener('click', () => {
    form.reset();
    fields.forEach((field) => field.removeAttribute('aria-invalid'));
    chooseTopic(topics[0]);
    alert.hidden = true;
    alert.textContent = '';
    success.hidden = true;
    form.hidden = false;
    fields[0].focus();
  });
})();
