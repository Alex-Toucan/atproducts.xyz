$(document).ready(function() {
  function openAccordionFromHash() {
    const hash = window.location.hash;
    if (hash !== '' && hash.startsWith('#accordion')) {
      const accordionId = hash.substr(1);
      $(accordionId).collapse('show');
    }
  }

  openAccordionFromHash();

  $(window).on('hashchange', openAccordionFromHash);
});
