/* ============================================================
   Reusable gender selector
   Auto-initializes the first .gender-grid on the page.
   Uses: #gender_input, #gender_custom_wrapper, #gender_custom_input
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.gender-grid');
  if (!grid) return;

  const options       = grid.querySelectorAll('.gender-option');
  const hiddenInput   = document.getElementById('gender_input');
  const customWrapper = document.getElementById('gender_custom_wrapper');
  const customInput   = document.getElementById('gender_custom_input');

  if (!hiddenInput || !customWrapper) return;

  function selectOption(btn) {
    options.forEach(o => {
      o.classList.remove('selected');
      o.setAttribute('aria-checked', 'false');
    });
    btn.classList.add('selected');
    btn.setAttribute('aria-checked', 'true');
    hiddenInput.value = btn.dataset.value;

    if (btn.dataset.value === 'Others') {
      customWrapper.classList.add('show');
      customWrapper.setAttribute('aria-hidden', 'false');
      if (customInput) setTimeout(() => customInput.focus({ preventScroll: true }), 340);
    } else {
      customWrapper.classList.remove('show');
      customWrapper.setAttribute('aria-hidden', 'true');
      if (customInput) customInput.value = '';
    }
  }

  options.forEach(btn => {
    btn.addEventListener('click', () => selectOption(btn));
  });

  if (customInput) {
    customInput.addEventListener('input', () => {
      customInput.style.borderColor = '';
      customInput.style.boxShadow = '';
    });
  }
});