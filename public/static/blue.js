(() => {
  'use strict';

  let audio = null;

  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
  };

  const getCookie = (name) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const playAudio = () => {
    if (!audio) {
      audio = new Audio('/media/images/sound.mp3');
      audio.loop = true;

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'Blue Ball Machine',
          artist: 'Alex Toucan',
          album: 'Blue Ball Machine Soundtrack',
          artwork: [
            { src: '/media/favicon/blueball.png', sizes: '192x192', type: 'image/png' }
          ]
        });

        navigator.mediaSession.setActionHandler('play', playAudio);
        navigator.mediaSession.setActionHandler('pause', pauseAudio);
      }
    }

    audio.play().then(() => updateButtonIcon(true))
      .catch(err => console.log('Audio play prevented:', err));
  };

  const pauseAudio = () => {
    if (audio) {
      audio.pause();
      updateButtonIcon(false);
    }
  };

  const toggleAudio = () => {
    const icon = document.querySelector('.audio-icon-active i');
    if (icon?.classList.contains('bi-volume-up-fill')) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const updateButtonIcon = (isPlaying) => {
    const icon = document.querySelector('.audio-icon-active i');
    if (isPlaying) {
      icon?.classList.remove('bi-volume-mute-fill');
      icon?.classList.add('bi-volume-up-fill');
    } else {
      icon?.classList.remove('bi-volume-up-fill');
      icon?.classList.add('bi-volume-mute-fill');
    }
  };

  const showNotification = () => {
    const notification = document.getElementById('audio-notification');
    if (notification) {
      notification.style.display = 'block';
      notification.classList.add('fade-in');
    }
  };

  const hideNotification = () => {
    const notification = document.getElementById('audio-notification');
    if (notification) {
      notification.classList.add('fade-out');
      notification.addEventListener('animationend', () => {
        notification.style.display = 'none';
      });
    }
  };

  const dismissNotification = () => {
    hideNotification();
    setCookie('audioNotificationDismissed', 'true', 7);
  };

  const resetGif = () => {
    const body = document.body;
    const current = body.style.backgroundImage;

    if (!current || current === 'none') return;

    const match = current.match(/url\(["']?(.*?)["']?\)/);
    if (!match) return;

    const url = match[1].split('?')[0];
    const newUrl = `${url}?t=${Date.now()}`;

    body.style.backgroundImage = `url("${newUrl}")`;
  };

  window.addEventListener('load', () => {

    const audioButton = document.getElementById('bd-audio');
    const closeButton = document.getElementById('close-notification');

    audioButton?.addEventListener('click', () => {
      toggleAudio();
      dismissNotification();
    });

    closeButton?.addEventListener('click', () => {
      dismissNotification();
    });

    if (!getCookie('audioNotificationDismissed')) {
      showNotification();
    }

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        playAudio();
        dismissNotification();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        pauseAudio();
      });
    }

    let selectedBackground = null;
    let selectedMusic = null;
    let previewAudio = null;

    const stopPreview = () => {
      if (previewAudio) {
        previewAudio.pause();
        previewAudio.currentTime = 0;
        previewAudio = null;
      }
    };

    const pauseMainAudioForPreview = () => {
      if (audio && !audio.paused) {
        audio.pause();
        updateButtonIcon(false);
      }
    };

    document.querySelectorAll('.preset-bg').forEach((card) => {
      card.addEventListener('click', () => {

        stopPreview();

        selectedBackground = card.dataset.bg || null;

        if (card.classList.contains('preset-linked') && card.dataset.music) {
          selectedMusic = card.dataset.music || null;

          document.querySelectorAll('.preset-music').forEach((i) => {
            i.classList.toggle('active', i.dataset.music === selectedMusic);
          });
        }
        
        document.body.style.backgroundImage =
          `url("${selectedBackground}?t=${Date.now()}")`;

        const shouldLoop = card.dataset.loop !== "false";
        if (!shouldLoop) {
          document.body.style.backgroundRepeat = "no-repeat";
          document.body.style.backgroundPosition = "center center";
          document.body.style.backgroundSize = "contain";
        } else {
          document.body.style.backgroundRepeat = "repeat";
          document.body.style.backgroundPosition = "initial";
          document.body.style.backgroundSize = "auto";
        }

        resetGif();

        const icon = document.querySelector('.audio-icon-active i');
        const userWantedAudio = icon?.classList.contains('bi-volume-up-fill');

        if (selectedMusic) {
          if (!audio) {
            audio = new Audio(selectedMusic);
            audio.loop = true;
          } else {
            audio.src = selectedMusic;
          }

          if (userWantedAudio) {
            audio.play().then(() => updateButtonIcon(true));
          }
        }

        const modalInstance = window.bootstrap.Modal.getInstance(document.getElementById('presetModal'));
        modalInstance?.hide();
      });
    });

    document.querySelectorAll('.preset-music').forEach((item) => {
      item.addEventListener('click', () => {
        stopPreview();
        document.querySelectorAll('.preset-music').forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
        selectedMusic = item.dataset.music || null;
      });
    });

    document.querySelectorAll('.preview-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();

        const music = btn.closest('.preset-music').dataset.music;

        stopPreview();
        pauseMainAudioForPreview();

        previewAudio = new Audio(music);
        previewAudio.play();
      });
    });

    document.querySelectorAll('.apply-music-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();

        stopPreview();

        const music = btn.closest('.preset-music').dataset.music;
        selectedMusic = music || null;

        document.querySelectorAll('.preset-music').forEach((i) => i.classList.remove('active'));
        btn.closest('.preset-music').classList.add('active');

        if (!audio) {
          audio = new Audio(selectedMusic);
          audio.loop = true;
        } else {
          audio.src = selectedMusic;
        }

        audio.play().then(() => updateButtonIcon(true));

        const modalInstance = window.bootstrap.Modal.getInstance(document.getElementById('presetModal'));
        modalInstance?.hide();
      });
    });

    const presetModal = document.getElementById('presetModal');
    presetModal?.addEventListener('hidden.bs.modal', () => {
      stopPreview();
    });

    document.getElementById('applyPresetBtn')?.addEventListener('click', () => {

      stopPreview();

      if (selectedBackground) {
        document.body.style.backgroundImage =
          `url("${selectedBackground}?t=${Date.now()}")`;

        const selectedCard = document.querySelector(`.preset-bg[data-bg="${selectedBackground}"]`);
        const shouldLoop = selectedCard && selectedCard.dataset.loop !== "false";

        if (!shouldLoop) {
          document.body.style.backgroundRepeat = "no-repeat";
          document.body.style.backgroundSize = "contain";
        } else {
          document.body.style.backgroundRepeat = "repeat";
          document.body.style.backgroundSize = "auto";
        }

        resetGif();
      }

      if (selectedMusic) {
        if (!audio) {
          audio = new Audio(selectedMusic);
          audio.loop = true;
        } else {
          audio.src = selectedMusic;
        }

        const icon = document.querySelector('.audio-icon-active i');
        const userWantedAudio = icon?.classList.contains('bi-volume-up-fill');

        if (userWantedAudio) {
          audio.play().then(() => updateButtonIcon(true));
        }
      }

      const modalInstance = window.bootstrap.Modal.getInstance(presetModal);
      modalInstance?.hide();
    });

  });

})();