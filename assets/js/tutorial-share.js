/* ============================================================
   Share Tutorial modal — copy the tutorial link
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('share-btn');
  if (!btn) return;

  const modal      = document.getElementById('share-modal');
  const closeBtn   = document.getElementById('share-modal-close');
  const cancelBtn  = document.getElementById('share-modal-cancel');
  const urlInput   = document.getElementById('share-url-input');
  const copyBtn    = document.getElementById('share-copy-btn');

  if (!modal || !urlInput || !copyBtn) return;

  /* ---- Open / close ---- */
  function open() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      urlInput.focus({ preventScroll: true });
      urlInput.setSelectionRange(0, urlInput.value.length);
    }, 100);
  }

  function close() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    copyBtn.textContent = 'Copy';
  }

  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) close();
  });

  /* ---- Copy link ---- */
  copyBtn.addEventListener('click', async () => {
    const url = urlInput.value;
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      copyBtn.textContent = '✓ Copied!';
      setTimeout(() => copyBtn.textContent = 'Copy', 1800);
    } catch {
      /* Fallback for non-HTTPS / older browsers */
      urlInput.focus();
      urlInput.select();
      urlInput.setSelectionRange(0, urlInput.value.length);
      try {
        document.execCommand('copy');
        copyBtn.textContent = '✓ Copied!';
      } catch {
        copyBtn.textContent = 'Copy failed';
      }
      setTimeout(() => copyBtn.textContent = 'Copy', 1800);
    }
  });
});