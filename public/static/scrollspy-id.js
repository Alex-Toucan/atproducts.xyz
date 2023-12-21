$(document).ready(function() {
    function scrollToSectionFromHash() {
      const hash = decodeURIComponent(window.location.hash); // Decode the hash
  
      if (hash && hash.startsWith('#')) {
        const targetId = hash.substring(1); // Remove '#' from the hash
        const targetSection = $('#' + targetId); // Find the section based on ID
  
        if (targetSection.length) {
          const modal = targetSection.closest('.modal'); // Find the closest parent modal
  
          if (modal && modal.length) {
            modal.modal('show'); // Open the modal if it exists
  
            // Calculate the scroll position to the section within the modal
            const paddingTop = 50; // Adjust this value if needed
            const sectionTop = targetSection.offset().top - modal.find('.modal-content').offset().top - paddingTop;
  
            // Smooth scroll to the section within the modal
            modal.find('.modal-body').animate({
              scrollTop: sectionTop
            }, 800);
          }
        }
      }
    }
  
    // Call scrollToSectionFromHash on hash change and page load
    $(window).on('hashchange', scrollToSectionFromHash);
    scrollToSectionFromHash();
  });
  