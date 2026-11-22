// Contact form validation
const form = document.getElementById('contact-form');
const success = document.getElementById('form-success');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const digitsOnly = /^\d+$/;

function showError(field, message) {
  document.getElementById(field.id + '-error').textContent = message;
  field.classList.toggle('invalid', message !== '');
  field.setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
}

function checkField(field) {
  const value = field.value.trim();
  let message = '';

  if (value === '') {
    message = 'This field cannot be empty.';
  } else if (field.id === 'email' && !emailPattern.test(value)) {
    message = 'Enter a valid email address, like name@example.com.';
  } else if (field.id === 'phone' && !digitsOnly.test(value)) {
    message = 'Use digits only, with no spaces, dashes or plus sign.';
  }

  showError(field, message);
  return message === '';
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  success.hidden = true;

  const fields = Array.from(form.querySelectorAll('input, textarea'));
  const results = fields.map(checkField);   // check every field so all errors show
  const firstBad = fields[results.indexOf(false)];

  if (firstBad) {
    firstBad.focus();
    return;
  }

  // Simulated send: no server is connected yet.
  success.hidden = false;
  form.reset();
});

// Re-check a field once the user leaves it
form.addEventListener('focusout', function (e) {
  if (e.target.matches('input, textarea') && e.target.value !== '') checkField(e.target);
});
