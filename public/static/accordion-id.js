$(document).ready(function() {
  function openAccordionFromHash() {
    const hash = decodeURIComponent(window.location.hash);

    if (hash && hash.startsWith('#')) {
      const targetId = hash.substring(1);
      const targetAccordion = $('#' + targetId);

      if (targetAccordion.length && targetAccordion.hasClass('collapse')) {
        const parentAccordion = targetAccordion.closest('.accordion');

        if (parentAccordion.length) {
          const openParentAccordions = parentAccordion.find('.collapse.show');
          openParentAccordions.collapse('hide');
          parentAccordion.find('.collapse').collapse('show');
        } else {
          $('.collapse.show').collapse('hide');
        }

        targetAccordion.collapse('show');

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
