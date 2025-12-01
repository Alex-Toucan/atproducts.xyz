'use strict';

(function () {
  let targetEl = null;
  const lockBtn = document.getElementById('lockBtn');
  const lockIcon = lockBtn.querySelector('i');

  // Resolve target element: canvas if present, otherwise iframe itself
  function resolveTarget() {
    // 1) Direct DOM canvas
    const pageCanvas = document.querySelector('canvas');
    if (pageCanvas) return pageCanvas;

    // 2) Ruffle shadow DOM canvas
    const ruffle = document.querySelector('ruffle-object');
    if (ruffle && ruffle.shadowRoot) {
      const ruffleCanvas = ruffle.shadowRoot.querySelector('canvas');
      if (ruffleCanvas) return ruffleCanvas;
    }

    // 3) Iframe fallback: always lock the iframe element itself
    const iframe = document.querySelector('iframe');
    if (iframe) return iframe;

    // Nothing found
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
      console.log('Pointer lock requested on:', targetEl);

      // Optimistic icon update; final state confirmed by events
      updateIcon(true);
    } catch (err) {
      console.warn('Pointer lock request failed:', err);
      updateIcon(false);
    }
  }

  function updateIcon(locked) {
    if (locked) {
      lockIcon.className = 'bi bi-mouse-fill';
      lockBtn.setAttribute('aria-label', 'Exit pointer lock');
      lockBtn.setAttribute('data-bs-title', 'Exit Lock');
    } else {
      lockIcon.className = 'bi bi-mouse';
      lockBtn.setAttribute('aria-label', 'Enter pointer lock');
      lockBtn.setAttribute('data-bs-title', 'Pointer Lock');
    }
  }

  function enableLockButton() {
    lockBtn.addEventListener('click', requestLock);

    lockBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        requestLock();
      }
    });
  }

  function setupPointerLockSync() {
    document.addEventListener('pointerlockchange', () => {
      const active = !!document.pointerLockElement;
      updateIcon(active);
      if (active) {
        console.log('Pointer lock active on:', document.pointerLockElement);
      } else {
        console.log('Pointer lock released.');
      }
    });

    document.addEventListener('pointerlockerror', () => {
      console.warn('Pointer lock error.');
      updateIcon(false);
    });

    // ESC key: ensure icon resets when lock is gone
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !document.pointerLockElement) {
        updateIcon(false);
      }
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    enableLockButton();
    setupPointerLockSync();
  });
})();
