/* ============================================================
   Public profile — love toggle
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('love-btn');
  if (!btn) return;

  const csrfToken = btn.dataset.csrf || '';
  const loveCount = document.getElementById('love-count');
  if (!csrfToken || !loveCount) return;

  let busy = false;

  btn.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    setButtonLoading(btn, true);

    const fd = new FormData();
    fd.append('csrf_token', csrfToken);
    fd.append('user_id',    btn.dataset.userId);

    try {
      const res  = await fetch('love-user.php', { method: 'POST', body: fd });
      const data = await res.json();

      if (data.ok) {
        btn.classList.toggle('loved', data.has_loved);
        btn.setAttribute('aria-pressed', data.has_loved ? 'true' : 'false');
        btn.setAttribute('title', data.has_loved ? 'Click to unlove' : 'Love this creator');
        loveCount.textContent = data.received;
      }
    } catch (err) { /* silent */ }
    finally {
      setButtonLoading(btn, false);
      busy = false;
    }
  });
});