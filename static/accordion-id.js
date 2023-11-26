$(document).ready(function() {
  // Function to open the accordion based on hash change and scroll to it
  function openAccordionFromHash() {
    var hash = window.location.hash;
    if (hash !== '' && $('.modal.show').length === 0) {
      var $accordionSection = $(hash);
      if ($accordionSection.length && $accordionSection.hasClass('accordion-collapse') && !$accordionSection.hasClass('show')) {
        // Check if the accordion is within a modal
        var $modal = $accordionSection.closest('.modal');
        if ($modal.length && !$modal.hasClass('show')) {
          // If the accordion is within a closed modal, open the modal first
          $modal.modal('show');
        }

        $('.accordion-collapse').removeClass('show'); // Close all accordion sections
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', 'false'); // Reset all accordion buttons

        $accordionSection.addClass('show'); // Open the accordion section corresponding to the hash
        var $heading = $accordionSection.closest('.accordion-item').find('.accordion-button');

        $heading.removeClass('collapsed').attr('aria-expanded', 'true'); // Update attributes for the specific accordion button

        // Scroll to the opened accordion section with an offset above the button
        if (!$('body').hasClass('modal-open')) {
          /* nothing here */
        }
        else {
          var $heading = $(this).find('.accordion-button'); // Find the accordion button within the modal
          if ($heading.length) {
            var offset = $heading.offset().top - 100; // Adjust the offset as needed
            $('html, body').animate({ scrollTop: offset }, 'slow');
          }
        }
      }
    }
  }

  // Function to handle hash change event
  $(window).on('hashchange', function() {
    openAccordionFromHash();
  });

  // Initial execution to open accordion based on hash
  openAccordionFromHash();

  // Prevent scrolling when a modal is open
  $(document).on('show.bs.modal', '.modal', function() {
    if (!$('body').hasClass('modal-open')) {
      /* nothing here */
    }
    else {
      var $heading = $(this).find('.accordion-button'); // Find the accordion button within the modal
      if ($heading.length) {
        var offset = $heading.offset().top - 100; // Adjust the offset as needed
      }
    }
  });
});
