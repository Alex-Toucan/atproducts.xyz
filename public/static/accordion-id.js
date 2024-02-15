$(document).ready(function() {
  function openAccordionFromHash() {
    const hash = decodeURIComponent(window.location.hash);

    if (hash && hash.startsWith('#')) {
      const targetId = hash.substring(1);
      const childAccordion = $('#' + targetId);

      if (childAccordion.length && childAccordion.hasClass('collapse')) {
        if (!childAccordion.hasClass('show')) {
          $('.collapse.show').collapse('hide');
          childAccordion.collapse('show');

          // Check if the accordion has a parent accordion
          const parentAccordion = childAccordion.parents('.accordion');
          if (parentAccordion && parentAccordion.length) {
            parentAccordion.find('.collapse.show').collapse('hide');
            parentAccordion.find(childAccordion).collapse('show');
          }

          const element = document.getElementById(targetId);
          if (element) {
            const paddingTop = 150;
            const sectionTop = childAccordion.offset().top - paddingTop;
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
