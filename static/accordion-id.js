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
          const $heading = $('[href="' + hash + '"]');
          if ($heading.length) {
            $heading.removeClass('collapsed').attr('aria-expanded', 'true');
            const element = document.getElementById(hash.substring(1)); // Get the element by ID
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }
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
    const $heading = $(this);
    if ($heading.length) {
      $heading.removeClass('collapsed').attr('aria-expanded', 'true');
      const hash = $heading.attr('href');
      const element = document.getElementById(hash.substring(1)); // Get the element by ID
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Reset padding-right for .navbar when accordion is fully shown
  $(document).on('shown.bs.collapse', '.collapse', function() {
    // ... (existing actions after accordion shown remains unchanged)
  });
});
