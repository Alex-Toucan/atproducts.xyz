'use strict';

(function () {
  let targetEl = null;
  let $lockBtn = null;
  let $lockIcon = null;

  function resolveTarget() {
    const pageCanvas = $('canvas')[0];
    if (pageCanvas) return pageCanvas;

    const ruffle = $('ruffle-object')[0];
    if (ruffle && ruffle.shadowRoot) {
      const ruffleCanvas = ruffle.shadowRoot.querySelector('canvas');
      if (ruffleCanvas) return ruffleCanvas;
    }

    const iframe = $('iframe')[0];
    if (iframe) return iframe;

    return null;
  }

  function requestLock() {
    targetEl = resolveTarget();

    if (!targetEl) {
      console.warn('requestLock called but no targetEl set.');
      updateIcon(false);
      return;
    }

    try {
      targetEl.setAttribute('tabindex', '0');
      targetEl.focus();
      targetEl.requestPointerLock();
      updateIcon(true);
    } catch (err) {
      console.warn('Pointer lock request failed:', err);
      updateIcon(false);
    }
  }

  function updateIcon(locked) {
    if (!$lockIcon) return;

    if (locked) {
      $lockIcon.removeClass().addClass('bi bi-mouse-fill');
      $lockBtn.attr('aria-label', 'Exit pointer lock');
      $lockBtn.attr('data-bs-title', 'Exit Lock');
    } else {
      $lockIcon.removeClass().addClass('bi bi-mouse');
      $lockBtn.attr('aria-label', 'Enter pointer lock');
      $lockBtn.attr('data-bs-title', 'Pointer Lock');
    }
  }

  function setupPointerLockSync() {
    $(document).on('pointerlockchange', () => {
      const active = !!document.pointerLockElement;
      updateIcon(active);
    });

    $(document).on('pointerlockerror', () => {
      updateIcon(false);
    });

    $(document).on('keydown', (e) => {
      if (e.key === 'Escape' && !document.pointerLockElement) {
        updateIcon(false);
      }
    });
  }

  $(document).ready(() => {
    $lockBtn = $('#lockBtn');
    $lockIcon = $lockBtn.find('i');

    if ($lockBtn.length === 0 || $lockIcon.length === 0) {
      console.warn('Lock button or icon not found.');
      return;
    }

    $lockBtn.on('click', requestLock);

    $lockBtn.on('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        requestLock();
      }
    });

    setupPointerLockSync();
  });
})();
