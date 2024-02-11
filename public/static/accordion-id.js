$(document).ready(function() {
  function openAccordionFromHash() {
    const hash = decodeURIComponent(window.location.hash);

    if (hash && hash.startsWith('#')) {
      const targetId = hash.substring(1);
      const targetAccordion = $('#' + targetId);

      if (targetAccordion.length && targetAccordion.hasClass('collapse')) {
        const parentAccordion = targetAccordion.closest('.accordion-item');

        if (parentAccordion.length) {
          const openAccordions = parentAccordion.find('.collapse.show');
          openAccordions.collapse('hide');
          targetAccordion.collapse('show');
        } else {
          $('.collapse.show').collapse('hide');
          targetAccordion.collapse('show');
        }

        const element = document.getElementById(targetId);

        if (element) {
          const paddingTop = 150;
          const sectionTop = targetAccordion.offset().top - paddingTop;
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
