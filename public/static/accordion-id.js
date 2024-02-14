$(document).ready(function() {
  function openAccordionFromHash() {
    const hash = decodeURIComponent(window.location.hash);

    if (hash && hash.startsWith('#')) {
      const targetId = hash.substring(1);
      const accordion = $('#' + targetId);

      if (accordion.length && accordion.hasClass('collapse')) {
        const parentAccordion = accordion.closest('.accordion');
        
        if (parentAccordion.length) {
          const parentAccordionButton = parentAccordion.find('[data-bs-toggle="collapse"]');
          const targetButton = parentAccordion.find('[data-bs-target="#' + targetId + '"]');

          if (targetButton.length) {
            parentAccordion.find('.collapse.show').collapse('hide'); // Close other children
            targetButton.addClass('show'); // Open the target child
            parentAccordionButton.trigger('click'); // Open the parent accordion
          }
        } else {
          $('.collapse.show').collapse('hide'); // Close other top-level accordions
          accordion.collapse('show');
        }

        const element = document.getElementById(targetId);

        if (element) {
          const paddingTop = 150;
          const sectionTop = accordion.offset().top - paddingTop;
          $('html, body').animate({
            scrollTop: sectionTop
          }, 800);
        }
      }
    }
  }

  $(window).on('hashchange', openAccordionFromHash);
  openAccordionFromHash();
});
