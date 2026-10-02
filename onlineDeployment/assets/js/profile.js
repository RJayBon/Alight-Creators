/* ============================================================
   Alight Creators — Profile edit page
   Handles: handle sanitization, account deletion, birthdate
            picker, avatar/banner cropper.
   Load AFTER cropper.min.js and gender-selector.js.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Handle input: lowercase + safe chars only ---------- */
  const handleEl = document.getElementById('user_handle_input');
  if (handleEl) {
    handleEl.addEventListener('input', function () {
      this.value = this.value.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    });
  }

  /* ---------- Account / user deletion confirmation ---------- */
  const deleteForm = document.getElementById('delete_account_form');
  if (deleteForm) {
    const deleteTarget = (deleteForm.dataset.deleteTarget || '').trim();
    const isAdminDelete = deleteTarget !== '';

    const promptText = isAdminDelete
      ? `Are you sure you want to delete ${deleteTarget}'s account?\n\n`
        + `This will permanently remove their profile, all their tutorials, `
        + `and every uploaded file.\n\n`
        + `You will NOT be logged out.\n\n`
        + `Type "CONFIRM" to proceed:`
      : 'Are you absolutely sure you want to delete your account?\n\n'
        + 'This action cannot be undone.\n\n'
        + 'Type "CONFIRM" to proceed:';

    deleteForm.addEventListener('submit', function (event) {
      const userInput = prompt(promptText);

      if (userInput === 'CONFIRM') {
        return true; // allow submission
      }

      event.preventDefault();
      if (userInput !== null) {
        alert('Deletion cancelled. You must type exactly "CONFIRM" (all uppercase).');
      }
      return false;
    });
  }

  /* ---------- Birthdate: type or pick ---------- */
  const bdText   = document.getElementById('profile_birthdate');
  const bdBtn    = document.getElementById('profile_birthdate_btn');
  const bdPicker = document.getElementById('profile_birthdate_picker');

  if (bdText && bdBtn && bdPicker) {
    bdPicker.max = new Date().toISOString().split('T')[0];

    bdText.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '').slice(0, 8);
      if (v.length > 6)      v = v.slice(0, 4) + '-' + v.slice(4, 6) + '-' + v.slice(6);
      else if (v.length > 4) v = v.slice(0, 4) + '-' + v.slice(4);
      this.value = v;
      if (/^\d{4}-\d{2}-\d{2}$/.test(v)) bdPicker.value = v;
    });

    bdPicker.addEventListener('change', function () {
      if (this.value) bdText.value = this.value;
    });

    bdBtn.addEventListener('click', function () {
      if (/^\d{4}-\d{2}-\d{2}$/.test(bdText.value)) bdPicker.value = bdText.value;
      if (typeof bdPicker.showPicker === 'function') {
        try { bdPicker.showPicker(); return; } catch (e) { /* fall through */ }
      }
      bdPicker.focus();
      bdPicker.click();
    });
  }

  /* ---------- Cropper: avatar + banner ---------- */
  const cropModal   = document.getElementById('crop_modal');
  const cropImage   = document.getElementById('crop_image');
  const cropTitle   = document.getElementById('crop_modal_title');
  const cropApply   = document.getElementById('crop_modal_apply');
  const cropCancel  = document.getElementById('crop_modal_cancel');
  const cropClose   = document.getElementById('crop_modal_close');
  const avatarInput = document.getElementById('avatar_upload');
  const bannerInput = document.getElementById('banner_upload');
  const avatarPrev  = document.getElementById('avatar_preview');
  const bannerPrev  = document.getElementById('banner_preview');
  const bannerBlock = document.querySelector('.banner-preview');

  if (!cropModal || !cropImage) return;

  let cropper            = null;
  let currentTarget      = null;
  let croppedAvatarBlob  = null;
  let croppedBannerBlob  = null;

  function openCropper(file, target) {
    if (!file) return;
    currentTarget = target;
    cropTitle.textContent = target === 'avatar' ? 'Crop Profile Picture' : 'Crop Banner';
    cropModal.classList.toggle('avatar-mode', target === 'avatar');

    const reader = new FileReader();
    reader.onload = function (e) {
      cropImage.src = e.target.result;
      cropModal.classList.add('show');

      // Wait two frames so the modal has layout before initializing Cropper
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cropper) { cropper.destroy(); cropper = null; }

          cropper = new Cropper(cropImage, {
            aspectRatio: target === 'avatar' ? 1 : 4,
            viewMode: 1,
            autoCropArea: 0.9,
            movable: true,
            zoomable: true,
            rotatable: false,
            scalable: false,
            background: false,
            guides: true,
            center: true,
            highlight: false,
            responsive: true,
            checkOrientation: false,
            ready: function () {
              cropper.resize();
              setTimeout(() => { if (cropper) cropper.resize(); }, 100);
            },
          });
        });
      });
    };
    reader.readAsDataURL(file);
  }

  function closeCropper() {
    cropModal.classList.remove('show');
    cropModal.classList.remove('avatar-mode');
    if (cropper) { cropper.destroy(); cropper = null; }
    cropImage.src = '';
    currentTarget = null;
  }

  if (cropCancel) cropCancel.addEventListener('click', closeCropper);
  if (cropClose)  cropClose.addEventListener('click', closeCropper);
  cropModal.addEventListener('click', function (e) {
    if (e.target === cropModal) closeCropper();
  });

  if (cropApply) {
    cropApply.addEventListener('click', function () {
      if (!cropper || !currentTarget) return;

      const isAvatar = currentTarget === 'avatar';
      const canvas = cropper.getCroppedCanvas({
        width:  isAvatar ? 400  : 1200,
        height: isAvatar ? 400  : 300,
        imageSmoothingQuality: 'high',
      });

      canvas.toBlob(function (blob) {
        if (!blob) return;
        const url = URL.createObjectURL(blob);

        if (isAvatar) {
          croppedAvatarBlob = blob;
          if (avatarPrev) avatarPrev.src = url;
        } else {
          croppedBannerBlob = blob;
          if (bannerPrev) bannerPrev.style.backgroundImage = `url(${url})`;
        }

        closeCropper();
      }, 'image/jpeg', 0.9);
    });
  }

  if (avatarInput) {
    avatarInput.addEventListener('change', function () {
      const file = this.files && this.files[0];
      if (!file) return;
      openCropper(file, 'avatar');
      this.value = ''; // reset so choosing the same file again still fires
    });
  }

  if (bannerInput) {
    bannerInput.addEventListener('change', function () {
      const file = this.files && this.files[0];
      if (!file) return;
      openCropper(file, 'banner');
      this.value = '';
    });
  }

  // Allow clicking the banner preview to open the file picker
  if (bannerBlock && bannerInput) {
    bannerBlock.addEventListener('click', () => bannerInput.click());
  }

  /* ---------- On form submit, inject cropped blobs ---------- */
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', function () {
      if (croppedAvatarBlob && avatarInput) {
        const dt = new DataTransfer();
        dt.items.add(new File([croppedAvatarBlob], 'avatar.jpg', { type: 'image/jpeg' }));
        avatarInput.files = dt.files;
      }
      if (croppedBannerBlob && bannerInput) {
        const dt = new DataTransfer();
        dt.items.add(new File([croppedBannerBlob], 'banner.jpg', { type: 'image/jpeg' }));
        bannerInput.files = dt.files;
      }
    });
  }
});