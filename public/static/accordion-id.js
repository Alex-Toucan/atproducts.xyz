$(document).ready(function() {
  function openAccordionFromHash() {
    const hash = decodeURIComponent(window.location.hash); // Decode the hash

    if (hash && hash.startsWith('#')) {
      const targetId = hash.substring(1); // Remove '#' from the hash

      const accordion = $('#' + targetId); // Use the ID directly
      const modal = accordion.closest('.modal'); // Find the closest parent modal

      if (modal && modal.length) {
        modal.modal('show'); // Open the modal if it exists
      }

      if (accordion.length && accordion.hasClass('collapse')) {
        if (!accordion.hasClass('show')) {
          $('.collapse.show').collapse('hide');
          accordion.collapse('show');
          const element = document.getElementById(targetId);

          // Scroll to the element's section with padding and animation
          if (element) {
            const paddingTop = 150; // 150px
            const sectionTop = accordion.offset().top - paddingTop;
            $('html, body').animate({
              scrollTop: sectionTop
            }, 800);
          }
        }
      }

      // Check if the accordion is a child, and open the parent accordion if needed
      const parentAccordion = accordion.parents('.accordion').first();
      if (parentAccordion.length) {
        const parentAccordionId = parentAccordion.attr('id');
        const parentAccordionButton = $(`[data-bs-target="#${parentAccordionId}"]`);
        parentAccordionButton.trigger('click');
      }
    }
  }

  $(window).on('hashchange', openAccordionFromHash);
  openAccordionFromHash();

  // Listen for show.bs.collapse event on child accordions
  $('.accordion [data-bs-toggle="collapse"]').on('show.bs.collapse', function() {
    const parentAccordionId = $(this).attr('data-bs-parent');
    if (parentAccordionId) {
      const parentAccordion = $(parentAccordionId);
      if (parentAccordion.length && !parentAccordion.hasClass('show')) {
        parentAccordion.collapse('show');
      }
    }
  });
});
