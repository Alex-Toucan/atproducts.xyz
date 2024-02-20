$(document).ready(function() {
  "use strict";

  function openAccordionFromHash() {
    const hash = decodeURIComponent(window.location.hash);

    if (hash && hash.startsWith('#')) {
      const targetId = hash.substring(1);
      const accordion = $('#' + targetId);
      const modal = accordion.closest('.modal');

      if (modal && modal.length) {
        modal.modal('show');
      }

      // Unbind the event handler after it's triggered
      $('.accordion').one('show.bs.collapse', function(event) {
        const accordionItem = accordion.closest('.accordion-item');
        if (accordionItem.length) {
          accordionItem.parents('.accordion-item').collapse('show');
        }
      });

      if (accordion.length && accordion.hasClass('collapse')) {
        if (!accordion.hasClass('show')) {
          $('.collapse.show').collapse('hide');
          accordion.collapse('show');
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
  }

  $(window).on('hashchange', openAccordionFromHash);
  openAccordionFromHash();
});
