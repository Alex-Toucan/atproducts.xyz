$(document).ready(function() {
  // Function to check if the hash matches any accordion and open it
  function openAccordionFromHash() {
    const hash = window.location.hash;
    if (hash !== '') {
      const accordion = $(hash);
      if (accordion.length && accordion.hasClass('accordion')) {
        const parentCollapse = accordion.closest('.collapse');
        if (parentCollapse.length && !parentCollapse.hasClass('show')) {
          $('.collapse.show').removeClass('show'); // Close any open accordion
          parentCollapse.addClass('show').prev('.accordion-header').find('.accordion-button').attr('aria-expanded', 'true');
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
    const accordion = $(this).closest('.accordion');
    if (accordion.length) {
      const hash = '#' + accordion.attr('id');
      if (window.location.hash !== hash) {
        window.location.hash = hash;
      } else {
        window.location.hash = ''; // Clear hash to close accordion
      }
    }
  });
});
