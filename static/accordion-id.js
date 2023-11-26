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
          const element = document.getElementById(hash.substring(1)); // Get the element by ID
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    }
  }

  // Event listener for hash changes to open accordion
  $(window).on('hashchange', openAccordionFromHash);

  // Open accordion on page load if hash present
  openAccordionFromHash();

  // Handle clicks on accordion headers and scroll to the clicked element
  $(document).on('click', '.accordion-button', function() {
    const $heading = $(this);
    if ($heading.length) {
      $heading.removeClass('collapsed').attr('aria-expanded', 'true');
      const hash = $heading.attr('id'); // Get the ID of the clicked element
      const element = document.getElementById(hash); // Get the element by ID
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});
