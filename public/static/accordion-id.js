$(document).ready(function() {
  function openAccordionFromHash() {
    const hash = decodeURIComponent(window.location.hash);

    if (hash && hash.startsWith('#')) {
      const targetId = hash.substring(1);
      const accordionItem = $('#' + targetId).closest('.accordion-item');

      if (accordionItem.length) {
        const parentAccordionItem = accordionItem.closest('.accordion-item');
        const parentAccordion = parentAccordionItem.closest('.accordion');
        const parentAccordionButton = parentAccordion.find('[data-bs-toggle="collapse"]');
        const targetButton = parentAccordionItem.find('[data-bs-toggle="collapse"]');

        parentAccordion.find('.collapse.show').collapse('hide'); // Close other children
        targetButton.addClass('show'); // Open the target child
        parentAccordionButton.trigger('click'); // Open the parent accordion

        const element = document.getElementById(targetId);

        if (element) {
          const paddingTop = 150;
          const sectionTop = accordionItem.offset().top - paddingTop;
          $('html, body').animate({
            scrollTop: sectionTop
          }, 800);
        }
      } else {
        $('.accordion .collapse.show').collapse('hide'); // Close other top-level accordions
        $('#' + targetId).collapse('show');

        const element = document.getElementById(targetId);

        if (element) {
          const paddingTop = 150;
          const sectionTop = $('#' + targetId).offset().top - paddingTop;
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
