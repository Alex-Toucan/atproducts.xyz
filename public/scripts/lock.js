'use strict';

(function () {
  let targetEl = null;
  const lockBtn = document.getElementById('lockBtn');
  const lockIcon = lockBtn.querySelector('i');

  // Synchronous target resolution used at click time
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

    // 3) Iframe handling
    const iframe = document.querySelector('iframe');
    if (iframe) {
      try {
        // Same-origin iframe
        const doc = iframe.contentDocument;
        if (doc) {
          const iframeCanvas = doc.querySelector('canvas');
          if (iframeCanvas) return iframeCanvas;
          // No canvas: fallback to iframe element itself
          return iframe;
        }
      } catch (_) {
        // Cross-origin iframe: fallback to iframe element itself
        return iframe;
      }
      // If contentDocument is null (likely cross-origin), fallback to iframe element
      return iframe;
    }

    // Nothing found
    return null;
  }

  // Optional retries to pre-cache targetEl (non-blocking)
  function warmFind(retryCount = 0) {
    const found = resolveTarget();
    if (found) {
      targetEl = found;
      targetEl.setAttribute('tabindex', '0');
      console.log('Target ready:', targetEl);
      return;
    }
    if (retryCount < 10) {
      setTimeout(() => warmFind(retryCount + 1), 500);
    }
  }

  function requestLock() {
    // Always resolve synchronously right before requesting
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

      // Optimistic icon update; final state will be confirmed by events/polling
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

  // Keep the UI in sync with actual pointer lock state
  function setupPointerLockSync() {
    // Event fires on the parent document when locking elements in the parent,
    // including iframe element itself. That’s why we prefer locking the iframe element.
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

    // Lightweight polling fallback (covers rare cases, debounced to 200ms)
    let pollTimer = null;
    const startPoll = () => {
      if (pollTimer) return;
      pollTimer = setInterval(() => {
        const active = !!document.pointerLockElement;
        updateIcon(active);
      }, 200);
    };
    const stopPoll = () => {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    };

    // Start polling after DOMContentLoaded, stop when page hides
    startPoll();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') stopPoll();
      else startPoll();
    });

    // ESC key: if lock is gone, ensure icon is reset
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // After ESC, pointerLockElement should be null on the parent
        const active = !!document.pointerLockElement;
        if (!active) updateIcon(false);
      }
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    warmFind();           // Pre-cache target if available
    enableLockButton();   // Wire up controls
    setupPointerLockSync();
  });
})();
