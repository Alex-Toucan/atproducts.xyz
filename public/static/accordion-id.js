$(document).ready(function() {
  function openAccordionFromHash() {
    const hash = decodeURIComponent(window.location.hash); // Decode the hash

    // Accordion opens with hashes
    if (hash && hash.startsWith('#')) {
      const targetId = hash.substring(1); // Remove '#' from the hash

      const accordion = $('#' + targetId); // Use the ID directly
      const modal = accordion.closest('.modal'); // Find the closest parent modal
      const accordionItem = accordion.closest('.accordion-item'); // Find parent accordion

      // If the accordion is nested
      if (accordionItem.length) {
        accordionItem.parents('.accordion-item').find('.collapse').collapse('hide'); // Hide all other collapses
        accordionItem.find('.collapse').collapse('show'); // Show only within the current accordionItem
        openAccordionFromHash(); // Call the function here
      }

      // If the accordion is in a modal
      if (modal && modal.length) {
        modal.modal('show'); // Open the modal if it exists
      }

      // Open the accordion and scroll to the accordion
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
    }
  }

  // If the hash changes
  $(window).on('hashchange', openAccordionFromHash);
  openAccordionFromHash(); // Call the function directly on document ready
});
