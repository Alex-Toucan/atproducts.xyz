(() => {
  'use strict';

  let isPlaying = false;
  let currentMidi = null;
  let audioUnlocked = false;

  const detectPageMidi = () => {
    if (window.pageMidi) return window.pageMidi;

    const meta = document.querySelector('meta[name="page-midi"]');
    return meta ? meta.content : null;
  };

  const playMidi = () => {
    if (!currentMidi) return;
    MIDIjs.play(currentMidi);
    updateButtonIcon(true);
    isPlaying = true;
  };

  const pauseMidi = () => {
    MIDIjs.stop();
    updateButtonIcon(false);
    isPlaying = false;
  };

  const toggleMidi = () => {
    if (!audioUnlocked) {
      // 🔥 Unlock WebAudio on first click
      if (MIDIjs.resume) MIDIjs.resume();
      audioUnlocked = true;
    }

    if (isPlaying) pauseMidi();
    else playMidi();
  };

  const updateButtonIcon = (playing) => {
    const icon = document.querySelector('.audio-icon-active i');
    if (!icon) return;

    icon.classList.toggle('bi-volume-up-fill', playing);
    icon.classList.toggle('bi-volume-mute-fill', !playing);
  };

  window.addEventListener('load', () => {
    currentMidi = detectPageMidi();

    if (currentMidi) {
      MIDIjs.play(currentMidi);
      isPlaying = true;
      updateButtonIcon(true);
    }

    const audioButton = document.getElementById('bd-audio');
    audioButton?.addEventListener('click', toggleMidi);
  });

})();