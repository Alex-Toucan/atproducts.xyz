'use strict';

window.addEventListener('DOMContentLoaded', () => {
  const btn = $('#fullScreenBtn');

  btn.on('click', function () {
    const elem = $('#full-screen')[0];
    if (!elem) return;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  });
});
