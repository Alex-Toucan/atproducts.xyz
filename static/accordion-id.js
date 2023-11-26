$(document).ready(function() {
  // Function to check if the hash matches any accordion and open it
  function openAccordionFromHash() {
    const hash = window.location.hash;
    if (hash !== '') {
      const accordion = $(hash);
      if (accordion.length && accordion.hasClass('collapse')) {
        if (!accordion.hasClass('show')) {
          $('.collapse.show').collapse('hide'); // Hide any open accordion
          accordion.collapse('show');
        }
      }
    }
  }

  // Event listener for hash changes to open accordion
  $(window).on('hashchange', openAccordionFromHash);

  // Open accordion on page load if hash present
  openAccordionFromHash();

  // Handle clicks on accordion headers and URL hash changes
  $(document).on('click', '.accordion-button', function() {
    const accordion = $(this).closest('.accordion-header').next('.collapse');
    if (accordion.length) {
      const hash = '#' + accordion.attr('id');
      if (window.location.hash !== hash) {
        window.location.hash = hash;
      } else {
        window.location.hash = ''; // Clear hash to close accordion
      }
    }
  });

  // Scroll to accordion item when page scrolls above 100px
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      const accordionItem = $('.accordion-item');
      if (accordionItem.length) {
        const accordionOffset = accordionItem.offset().top - 50; // Adjust the offset as needed
        if ($(window).scrollTop() < accordionOffset) {
          $('html, body').animate({
            scrollTop: accordionOffset
          }, 500);
        } else {
          $(window).off('scroll'); // Stop the scroll event once the accordion is reached
        }
      }
    }
  });

  // Reset padding-right for .navbar when accordion is fully shown
  $(document).on('shown.bs.collapse', '.collapse', function() {
    // Perform additional actions after the accordion is fully shown if needed
  });
});
