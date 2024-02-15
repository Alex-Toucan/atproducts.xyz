$(document).ready(function() {
  function openAccordionFromHash() {
    const hash = decodeURIComponent(window.location.hash);

    if (hash && hash.startsWith('#')) {
      const targetId = hash.substring(1);
      const accordion = $('#' + targetId);
      const modal = accordion.closest('.modal');

      if (modal && modal.length) {
        modal.modal('show');
      }

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

      // Check if the accordion is a child and open both child and parent accordions
      accordion.on('show.bs.collapse', function() {
        const parentAccordion = accordion.parents('.accordion').first();
        if (parentAccordion.length) {
          const childAccordion = parentAccordion.find(`[data-bs-target="#${targetId}"]`);
          if (childAccordion.length) {
            childAccordion.collapse('show');
          }
        }
      });
    }
  }

  $(window).on('hashchange', openAccordionFromHash);
  openAccordionFromHash();
});
