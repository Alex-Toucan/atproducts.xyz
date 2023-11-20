window.onload = function() {
  // Function to open the modal if the URL contains a modal ID
  function openModalFromURL() {
    const hash = window.location.hash.substring(1); // Get the hash from the URL

    const modal = document.getElementById(hash); // Find the modal by ID
    if (modal && $(modal).hasClass('modal')) {
      const $modal = $(`#${hash}`);

      if (!$modal.hasClass('show')) {
        $modal.modal('show'); // Show the modal
      }
    }
  }

  // Function to close any currently open modal
  function closeModal() {
    $('.modal').modal('hide'); // Hide any open modal
  }

  // Function to handle scrolling and update the URL hash for non-modal IDs
  function handleScroll() {
    const sections = document.querySelectorAll('[id]:not(.modal)'); // Select all non-modal sections with an ID
    const scrollPosition = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 50; // Adjust scroll position as needed

      if (scrollPosition >= sectionTop) {
        const hash = section.getAttribute('id');
        if (hash !== window.location.hash.substring(1)) {
          history.replaceState(null, null, `#${hash}`); // Update the URL hash without triggering hashchange
        }
      }
    });
  }

  // Event listener for hash changes to open the modal
  window.addEventListener('hashchange', function() {
    closeModal(); // Close any open modal before opening a new one
    openModalFromURL(); // Open the modal from the URL hash
  });

  // Event listener for scroll to update URL for non-modal IDs
  window.addEventListener('scroll', handleScroll);

  openModalFromURL(); // Call the function when the page loads
};
