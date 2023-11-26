$(document).ready(function() {
  // Function to open the accordion based on hash change and scroll to it
  function openAccordionFromHash() {
    var hash = window.location.hash;
    if (hash !== '' && $('.modal.show').length === 0) {
      var $accordionSection = $(hash);
      if ($accordionSection.length && $accordionSection.hasClass('accordion-collapse') && !$accordionSection.hasClass('show')) {
        var $modal = $accordionSection.closest('.modal');
        if ($modal.length && !$modal.hasClass('show')) {
          $modal.modal('show');
        }

        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', 'false');

        $accordionSection.addClass('show');
        var $heading = $accordionSection.closest('.accordion-item').find('.accordion-button');

        if ($heading.length) {
          $heading.removeClass('collapsed').attr('aria-expanded', 'true');

          var offset = $heading.offset().top - 100;
          $('html, body').animate({ scrollTop: offset }, 'slow');
        }
        changeAccordionIDs($modal); // Change accordion IDs within the modal after it's shown
      }
    }
  }

  // Override the specific part of modal-id.js script
  var modalIdHashChangeHandler = function() {
    openAccordionFromHash(); // Call the accordion function on hash change
  };

  // Disable modal-id.js hashchange handler temporarily
  $(window).off('hashchange', modalIdHashChangeHandler);

  // Enable modal-id.js hashchange handler again after a brief delay
  setTimeout(function() {
    $(window).on('hashchange', modalIdHashChangeHandler);
  }, 1000); // Adjust delay as needed (milliseconds)

  // Initial execution to open accordion based on hash
    openAccordionFromHash();

  // Prevent scrolling when a modal is open
  $(document).on('show.bs.modal', '.modal', function() {
    if (!$('body').hasClass('modal-open')) {
      // Scroll logic or adjustments if needed
    } else {
      var $heading = $(this).find('.accordion-button');
      if ($heading.length) {
        var offset = $heading.offset().top - 100;
        $('html, body').animate({ scrollTop: offset }, 'slow');
      }
    }
  });
});
