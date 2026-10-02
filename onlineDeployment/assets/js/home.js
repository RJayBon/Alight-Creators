/* Welcome toast animation on home page */

document.addEventListener('DOMContentLoaded', () => {
  const t = document.getElementById('welcome-toast');
  if (!t) return;
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => t.classList.remove('show'), 5000);
});