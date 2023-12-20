$(document).ready(function() {
    function openScrollspyFromHash() {
      const hash = decodeURIComponent(window.location.hash); // Decode the hash
  
      if (hash && hash.startsWith('#')) {
        const targetId = hash.substring(1); // Remove '#' from the hash
  
        const scrollspy = $('#' + targetId); // Use the ID directly
        const modal = scrollspy.closest('.modal'); // Find the closest parent modal
  
        if (modal && modal.length) {
          modal.modal('show'); // Open the modal if it exists
        }
      }
    }
  
    $(window).on('hashchange', openScrollspyFromHash);
    openScrollspyFromHash();
  });
  