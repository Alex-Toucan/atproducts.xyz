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
          if (!$('body').hasClass('modal-open')) {
            /* nothing here */
           }
           else {
            var offset = $heading.offset().top - 100;
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
});
