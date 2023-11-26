$(document).ready(function() {
  // Function to open the accordion based on hash change
  function openAccordionFromHash() {
    var hash = window.location.hash;
    if (hash !== '') {
      $('.accordion-button').addClass('collapsed');
      $('.accordion-collapse').removeClass('show');
      $(hash).collapse('show');
    }
  }

  // Function to handle hash change event
  $(window).on('hashchange', function() {
    openAccordionFromHash();
  });

  // Initial execution to open accordion based on hash
  openAccordionFromHash();
});
