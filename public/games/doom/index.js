'use strict';

(function () {
  var preview = null;
  var doomCanvas = null;

  window.Module = {
    canvas: null,
    setStatus: null,
    progress: null,
    loader: null
  };

  function onGameClick(game) {
    var doomScript = document.createElement('script');
    doomScript.type = 'text/javascript';
    doomScript.src = game + '.js';
    document.body.appendChild(doomScript);

    preview.classList.add('hidden');
  }

  function enablePointerLock() {
    // Request pointer lock and focus canvas immediately
    doomCanvas.addEventListener('mousedown', function () {
      if (doomCanvas.requestPointerLock) {
        doomCanvas.requestPointerLock();
      } else if (doomCanvas.mozRequestPointerLock) {
        doomCanvas.mozRequestPointerLock();
      } else if (doomCanvas.webkitRequestPointerLock) {
        doomCanvas.webkitRequestPointerLock();
      }
      doomCanvas.focus();
    });

    // Re‑focus canvas whenever pointer lock is acquired
    document.addEventListener('pointerlockchange', function () {
      if (document.pointerLockElement === doomCanvas) {
        doomCanvas.focus();
      }
    });
    document.addEventListener('mozpointerlockchange', function () {
      if (document.mozPointerLockElement === doomCanvas) {
        doomCanvas.focus();
      }
    });
    document.addEventListener('webkitpointerlockchange', function () {
      if (document.webkitPointerLockElement === doomCanvas) {
        doomCanvas.focus();
      }
    });
  }

  function getStatus(status) {
    var loading = status.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
    if (loading) {
      var progress = loading[2] / loading[4] * 100;
      Module.progress.innerHTML = progress.toFixed(1) + '%';

      if (progress === 100) {
        setTimeout(function () {
          Module.loader.classList.add('completed');
          doomCanvas.classList.add('ready');
        }, 500);
      }
    }
  }

  window.addEventListener('DOMContentLoaded', function () {
    var games = document.getElementsByClassName('doom');
    preview = document.getElementById('preview');
    doomCanvas = document.getElementById('doom');

    // Make canvas focusable for keyboard events
    doomCanvas.setAttribute('tabindex', '0');

    Module.canvas = doomCanvas;
    Module.progress = document.getElementById('progress');
    Module.loader = document.getElementById('loader');
    Module.setStatus = getStatus;

    games[0].addEventListener('click', onGameClick.bind(null, 'doom1'));
    games[1].addEventListener('click', onGameClick.bind(null, 'doom2'));

    enablePointerLock();
  });
})();
