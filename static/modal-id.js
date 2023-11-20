window.onload = function() {
  // Function to open the modal if the URL contains a modal ID
  function openModalFromURL() {
    const hash = window.location.hash.substring(1); // Get the hash from the URL
    const modal = document.getElementById(hash); // Find the modal by ID

    if (modal) {
      $('body').addClass('modal-open'); // Add the modal-open class to the body
      $(`#${hash}`).modal('show'); // Show the modal
    }
  }

  // Event listener for hash changes to open the modal
  window.addEventListener('hashchange', openModalFromURL);

  openModalFromURL(); // Call the function when the page loads

  // Function to prevent closing modal when clicking on ID links within the modal
  function preventModalCloseOnInternalLinks() {
    $('.modal').on('click', 'a[href^="#"]', function(e) {
      const hash = $(this).attr('href').substring(1); // Get the href hash value
      const target = document.getElementById(hash); // Find the element by ID

      if (!$(target).closest('.modal').length) {
        e.preventDefault(); // Prevent the default link behavior
        window.location.hash = hash; // Change the URL hash without closing the modal
      }
    });
  }

  preventModalCloseOnInternalLinks(); // Call the function to prevent modal close on internal links
};
