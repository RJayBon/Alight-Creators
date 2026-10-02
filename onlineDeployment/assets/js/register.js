/* ============================================================
   Register page — handle auto-fill, birthdate, submit guards
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const nameInput   = document.getElementById('register_name_input');
  const handleInput = document.getElementById('register_username_input');

  if (nameInput && handleInput) {
    nameInput.addEventListener('input', function () {
      handleInput.value = this.value.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    });
  }
  if (handleInput) {
    handleInput.addEventListener('input', function () {
      this.value = this.value.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    });
  }

  /* ============================================================
     BIRTHDATE — typed + calendar picker, with strict clamping
     ============================================================ */
  const textInput = document.getElementById('register_birthdate');
  const btn       = document.getElementById('register_birthdate_btn');
  const picker    = document.getElementById('register_birthdate_picker');

  if (textInput && btn && picker) {
    const today    = new Date();
    const maxDate  = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    const minDate  = new Date(today.getFullYear() - 120, 0, 1);

    const toISO = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    picker.min = toISO(minDate);
    picker.max = toISO(maxDate);

    function clampDigits(raw) {
      let d = raw.replace(/\D/g, '').slice(0, 8);

      if (d.length >= 4) {
        let y = parseInt(d.slice(0, 4), 10);
        if (y < 1900)  y = 1900;
        if (y > today.getFullYear()) y = today.getFullYear();
        d = String(y).padStart(4, '0') + d.slice(4);
      }

      if (d.length >= 6) {
        let m = parseInt(d.slice(4, 6), 10);
        if (!Number.isFinite(m) || m < 1)  m = 1;
        if (m > 12) m = 12;
        d = d.slice(0, 4) + String(m).padStart(2, '0') + d.slice(6);
      }

      if (d.length >= 8) {
        const y = parseInt(d.slice(0, 4), 10);
        const m = parseInt(d.slice(4, 6), 10);
        const daysInMonth = new Date(y, m, 0).getDate();
        let day = parseInt(d.slice(6, 8), 10);
        if (!Number.isFinite(day) || day < 1) day = 1;
        if (day > daysInMonth) day = daysInMonth;
        d = d.slice(0, 6) + String(day).padStart(2, '0');
      }

      let out = '';
      if (d.length > 0) out += d.slice(0, 4);
      if (d.length > 4) out += '-' + d.slice(4, 6);
      if (d.length > 6) out += '-' + d.slice(6, 8);
      return out;
    }

    function isFullyValid(iso) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
      const [y, m, day] = iso.split('-').map(Number);
      const dt = new Date(y, m - 1, day);
      if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== day) return false;
      if (iso < toISO(minDate)) return false;
      if (iso > toISO(maxDate)) return false;
      return true;
    }

    textInput.addEventListener('input', function () {
      const cursorWasAtEnd = this.selectionStart === this.value.length;

      this.value = clampDigits(this.value);

      if (/^\d{4}-\d{2}-\d{2}$/.test(this.value)) {
        const ok = isFullyValid(this.value);
        this.classList.toggle('input-invalid', !ok);
        this.setAttribute('aria-invalid', ok ? 'false' : 'true');
        picker.value = ok ? this.value : '';
      } else {
        this.classList.remove('input-invalid');
        this.removeAttribute('aria-invalid');
        picker.value = '';
      }

      if (cursorWasAtEnd) {
        const len = this.value.length;
        this.setSelectionRange(len, len);
      }
    });

    picker.addEventListener('change', function () {
      if (this.value) {
        textInput.value = this.value;
        textInput.classList.remove('input-invalid');
        textInput.setAttribute('aria-invalid', 'false');
      }
    });

    btn.addEventListener('click', function () {
      if (/^\d{4}-\d{2}-\d{2}$/.test(textInput.value) && isFullyValid(textInput.value)) {
        picker.value = textInput.value;
      }
      if (typeof picker.showPicker === 'function') {
        try { picker.showPicker(); return; } catch (e) { /* fall through */ }
      }
      picker.focus();
      picker.click();
    });
  }

  /* ============================================================
     PASSWORD + CONFIRM PASSWORD — live match feedback
     ============================================================ */
  const pwInput      = document.getElementById('register_password');
  const cpwInput     = document.getElementById('register_confirm_password');
  const cpwHelp      = document.getElementById('confirm_password_help');

  function syncPasswordState() {
    if (!pwInput || !cpwInput) return;

    // Only flag mismatch after the user has typed something in both fields
    const pw  = pwInput.value;
    const cpw = cpwInput.value;

    if (cpw === '') {
      cpwInput.classList.remove('input-invalid');
      cpwInput.setAttribute('aria-invalid', 'false');
      if (cpwHelp) {
        cpwHelp.textContent = 'Must match your password above.';
        cpwHelp.style.color = '';
      }
      return;
    }

    const matches = (pw === cpw);
    cpwInput.classList.toggle('input-invalid', !matches);
    cpwInput.setAttribute('aria-invalid', matches ? 'false' : 'true');

    if (cpwHelp) {
      cpwHelp.textContent = matches ? '✓ Passwords match.' : '✕ Passwords do not match.';
      cpwHelp.style.color = matches
        ? 'hsl(var(--accent))'
        : 'hsl(var(--destructive))';
    }
  }

  if (pwInput)  pwInput.addEventListener('input', syncPasswordState);
  if (cpwInput) cpwInput.addEventListener('input', syncPasswordState);

  /* ============================================================
     SUBMIT — gender, custom gender, birthdate, password match
     ============================================================ */
  const form        = document.getElementById('register-form');
  const hiddenInput = document.getElementById('gender_input');
  const customInput = document.getElementById('gender_custom_input');

  if (form && hiddenInput) {
    form.addEventListener('submit', (e) => {
      /* Gender required */
      if (hiddenInput.value === '') {
        e.preventDefault();
        const grid = document.querySelector('.gender-grid');
        if (grid) {
          grid.animate(
            [
              { transform: 'translateX(0)' },
              { transform: 'translateX(-6px)' },
              { transform: 'translateX(6px)' },
              { transform: 'translateX(-4px)' },
              { transform: 'translateX(0)' },
            ],
            { duration: 320, easing: 'ease-out' }
          );
        }
        return;
      }

      /* "Others" requires a custom value */
      if (hiddenInput.value === 'Others' && customInput && customInput.value.trim() === '') {
        e.preventDefault();
        customInput.focus();
        customInput.style.borderColor = '#ff4d6d';
        customInput.style.boxShadow = '0 0 0 3px rgba(255, 77, 109, 0.15)';
        return;
      }

      /* Passwords must match */
      if (pwInput && cpwInput && pwInput.value !== cpwInput.value) {
        e.preventDefault();
        syncPasswordState();
        cpwInput.focus();
        return;
      }

      /* Birthdate — if filled, must be valid */
      const bd = document.getElementById('register_birthdate');
      if (bd && bd.value.trim() !== '' && bd.getAttribute('aria-invalid') === 'true') {
        e.preventDefault();
        bd.focus();
        bd.classList.add('input-invalid');
      }
    });
  }

  if (customInput) {
    customInput.addEventListener('input', () => {
      customInput.style.borderColor = '';
      customInput.style.boxShadow = '';
    });
  }
});