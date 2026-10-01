/* ============================================================
   Tutorial detail page — star rating + AJAX submit
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submit-rating');
  const feedback  = document.getElementById('rating-feedback');
  const qualityGroup = document.querySelector('.stars[data-type="quality"]');
  const clarityGroup = document.querySelector('.stars[data-type="clarity"]');

  if (!submitBtn || !qualityGroup || !clarityGroup) return;

  const tutorialId = parseInt(submitBtn.dataset.tutorialId, 10);
  const csrfToken  = submitBtn.dataset.csrf || '';
  if (!tutorialId || !csrfToken) return;

  const groups = [qualityGroup, clarityGroup];

  let selectedQuality = parseInt(qualityGroup.dataset.value, 10) || 0;
  let selectedClarity = parseInt(clarityGroup.dataset.value, 10) || 0;
  const initialQuality = selectedQuality;
  const initialClarity = selectedClarity;

  groups.forEach(group => {
    const starEls = group.querySelectorAll('.star');
    starEls.forEach(star => {
      star.addEventListener('mouseenter', () => {
        const val = parseInt(star.dataset.value, 10);
        starEls.forEach(s => s.classList.toggle('hover', parseInt(s.dataset.value, 10) <= val));
      });
      star.addEventListener('mouseleave', () => {
        starEls.forEach(s => s.classList.remove('hover'));
      });
      star.addEventListener('click', () => {
        const val = parseInt(star.dataset.value, 10);
        if (group.dataset.type === 'quality') selectedQuality = val;
        else                                  selectedClarity = val;
        group.dataset.value = val;
        starEls.forEach(s => s.classList.toggle('filled', parseInt(s.dataset.value, 10) <= val));
        updateSubmitBtn();
      });
    });
  });

  function updateSubmitBtn() {
    const changed  = (selectedQuality !== initialQuality) || (selectedClarity !== initialClarity);
    const complete = selectedQuality > 0 && selectedClarity > 0;
    submitBtn.disabled = !(changed && complete);
  }

  submitBtn.addEventListener('click', async () => {
    setButtonLoading(submitBtn, true);
    feedback.textContent = '';
    feedback.style.color = '';

    const fd = new FormData();
    fd.append('csrf_token',  csrfToken);
    fd.append('tutorial_id', tutorialId);
    fd.append('quality',     selectedQuality);
    fd.append('clarity',     selectedClarity);

    try {
      const res  = await fetch('rate-tutorial.php', { method: 'POST', body: fd });
      const data = await res.json();

      if (data.ok) {
        feedback.textContent = '✓ Rating saved';
        feedback.style.color = 'hsl(var(--accent))';

        document.getElementById('stat-quality').textContent =
          data.stats.total > 0 ? data.stats.avg_quality.toFixed(1) : '—';
        document.getElementById('stat-clarity').textContent =
          data.stats.total > 0 ? data.stats.avg_clarity.toFixed(1) : '—';

        document.getElementById('rating-total').textContent =
          data.stats.total + ' ' + (data.stats.total === 1 ? 'rating' : 'ratings');

        submitBtn.textContent = 'Rating Submitted';
        submitBtn.disabled = true;
      } else {
        feedback.textContent = data.error || 'Failed to save.';
        feedback.style.color = 'hsl(var(--destructive))';
        setButtonLoading(submitBtn, false);
      }
    } catch (err) {
      feedback.textContent = 'Network error. Try again.';
      feedback.style.color = 'hsl(var(--destructive))';
      setButtonLoading(submitBtn, false);
    }
  });
});