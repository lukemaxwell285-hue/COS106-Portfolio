// Mobile navigation toggle
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');

toggle.addEventListener('click', function () {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
