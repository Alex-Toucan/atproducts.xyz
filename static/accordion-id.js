$(document).ready(function() {
  function openElementFromHash() {
    const hash = window.location.hash;
    if (hash !== '') {
      const elementId = hash.substr(1);
      $(`#${elementId}`).show(); // Show the element directly
    }
  }

  openElementFromHash();

  $(window).on('hashchange', openElementFromHash);
});
