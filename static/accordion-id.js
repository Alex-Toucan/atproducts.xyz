$(document).ready(function() {
  // Function to open the accordion based on hash change and scroll to it
  function openAccordionFromHash() {
    var hash = window.location.hash;
    if (hash !== '' && $('.modal.show').length === 0) {
      var $accordionSection = $(hash);
      if ($accordionSection.length && $accordionSection.hasClass('accordion-collapse') && !$accordionSection.hasClass('show')) {
        // Check if the accordion is within a modal
        var $modal = $accordionSection.closest('.modal');
        if ($modal.length && !$modal.hasClass('show')) {
          // If the accordion is within a closed modal, open the modal first
          $modal.modal('show');
        }

        $('.accordion-collapse').removeClass('show'); // Close all accordion sections
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', 'false'); // Reset all accordion buttons

        $accordionSection.addClass('show'); // Open the accordion section corresponding to the hash
        var $heading = $accordionSection.closest('.accordion-item').find('.accordion-button');

        if ($heading.length) {
          $heading.removeClass('collapsed').attr('aria-expanded', 'true'); // Update attributes for the specific accordion button

          // Scroll to the opened accordion section with an offset above the button
          var offset = $heading.offset().top - 100; // Adjust the offset as needed
          $('html, body').animate({ scrollTop: offset }, 'slow');
        }
      }
    }
  }

  // Function to handle text parameter in the URL and open accordion if needed
  // Function to handle text parameter in the URL and open accordion if needed
  function handleTextParameter() {
    var urlParams = new URLSearchParams(window.location.search);
    var searchText = urlParams.get("text");
    
    if (searchText) {
      // Your logic to handle the text parameter
      // This is a placeholder logic, you can replace this with your specific functionality
      console.log("Search text found:", searchText);
    
    // Simulated logic: Search for the text in accordion content
      $('.accordion-body').each(function() {
        var accordionText = $(this).text().toLowerCase();
        if (accordionText.includes(searchText.toLowerCase())) {
          // If the text is found, log a message or perform any action you require
          console.log("Accordion contains text:", searchText);
          // Additionally, you can open the accordion here if necessary
          // Add logic to open the accordion section based on the found text
          // Example: $(this).closest('.accordion-collapse').addClass('show');
        }
      });

      // Call the accordion opening function after handling the text parameter
      openAccordionFromHash();
    }
  }

  // Call the function to handle text parameter in the URL
  handleTextParameter();

  // Function to handle hash change event
  $(window).on('hashchange', function() {
    openAccordionFromHash();
  });

  // Call function to handle text parameter in the URL
  handleTextParameter();

  // Prevent scrolling when a modal is open
  $(document).on('show.bs.modal', '.modal', function() {
    if (!$('body').hasClass('modal-open')) {
      /* nothing here */
    }
    else {
      var $heading = $(this).find('.accordion-button'); // Find the accordion button within the modal
      if ($heading.length) {
        var offset = $heading.offset().top - 100; // Adjust the offset as needed
      }
    }
  });
});
