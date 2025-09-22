// Simple mobile nav toggle
const btn = document.getElementById('menuBtn');
const html = document.documentElement;

if (btn) {
  btn.addEventListener('click', () => {
    const isOpen = html.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}