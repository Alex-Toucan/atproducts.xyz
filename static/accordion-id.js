$(document).ready(function() {
  // Function to open the accordion based on hash change and scroll to it
  function openAccordionFromHash() {
    var hash = window.location.hash;
    if (hash !== '') {
      $('.accordion-collapse').removeClass('show'); // Close all accordion sections
      $('.accordion-button').addClass('collapsed').attr('aria-expanded', 'false'); // Reset all accordion buttons

      $(hash).addClass('show'); // Open the accordion section corresponding to the hash
      var $heading = $(hash).prev('.accordion-header');
      $heading.find('.accordion-button').removeClass('collapsed').attr('aria-expanded', 'true'); // Update attributes for the specific accordion button

      // Scroll to the opened accordion section with an offset above the button
      var buttonTop = $heading.offset().top;
      var offset = buttonTop - 100; // Adjust the offset as needed

      $('html, body').animate({ scrollTop: offset }, 'slow');
    }
  }

  // Function to handle hash change event
  $(window).on('hashchange', function() {
    openAccordionFromHash();
  });

  // Initial execution to open accordion based on hash
  openAccordionFromHash();
});
