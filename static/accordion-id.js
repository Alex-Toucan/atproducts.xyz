$(document).ready(function() {
  // Function to open accordion based on ID from hash
  function openAccordionFromHash() {
    const hash = window.location.hash;
    if (hash !== '' && hash.startsWith('#accordion')) {
      const accordionId = hash.substr(1);
      $(accordionId).collapse('show');

      // Check if the accordion is inside a modal and open the modal if necessary
      const modal = $(accordionId).closest('.modal');
      if (modal.length && !modal.hasClass('show')) {
        $('.modal').modal('hide'); // Close any open modal
        $('body').addClass('modal-open');
        modal.modal('show');
      }
    }
  }

  // Open accordion on page load if hash present
  openAccordionFromHash();

  // Event listener for hash changes to open accordion based on hash
  $(window).on('hashchange', openAccordionFromHash);

  // Function to open modal or accordion based on the text from hash
  function openElementFromHash() {
    const hash = decodeURIComponent(window.location.hash);
    const match = hash.match(/:(~|~:)([^~]+)/);
    if (match) {
      const keyword = match[2].trim();
      $('[id^="accordion"]').each(function() {
        const accordionText = $(this).text().trim();
        if (accordionText.includes(keyword)) {
          window.location.hash = `#${$(this).attr('id')}`;
        }
      });
    }
  }

  // Open modal or accordion on page load if text matches in hash
  openElementFromHash();

  // Event listener for hash changes to open modal or accordion based on text
  $(window).on('hashchange', openElementFromHash);
});
