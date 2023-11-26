$(document).ready(function() {
  // Function to open the accordion based on hash change and scroll to it
  function openAccordionFromHash() {
    var hash = window.location.hash;
    if (hash !== '') {
      $('.accordion-collapse').removeClass('show'); // Close all accordion sections
      $(hash).addClass('show'); // Open the accordion section corresponding to the hash

      // Scroll to the opened accordion section with an offset from the top
      var offsetTop = $(hash).offset().top;
      $('html, body').animate({ scrollTop: offsetTop - 50 }, 'slow');
    }
  }

  // Function to handle hash change event
  $(window).on('hashchange', function() {
    openAccordionFromHash();
  });

  // Initial execution to open accordion based on hash
  openAccordionFromHash();
});
