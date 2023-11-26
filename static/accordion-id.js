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
  
  function changeAccordionIDs($modal) {
    if ($modal) {
      $modal.find('.accordion-collapse').each(function(index) {
        var newID = 'accordionItem_' + index;
        $(this).attr('id', newID);
        // Update the button aria-controls attribute with the new ID
        var $button = $(this).prev('.accordion-button');
        $button.attr('aria-controls', newID);
      });
    }
  }

  $(window).on('hashchange', function() {
    openAccordionFromHash();
  });

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
