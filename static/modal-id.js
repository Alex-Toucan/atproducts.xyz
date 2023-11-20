window.onload = function() {
  // Function to check if the hash matches any modal and open it
  function openModalFromHash() {
    const hash = window.location.hash;
    if (hash !== '') {
      const modal = document.querySelector(hash);
      if (modal && modal.classList.contains('modal')) {
        $('.modal').modal('hide'); // Close any open modal
        $('body').addClass('modal-open');
        $(hash).modal('show');
      }
    }
  }

  // Event listener for hash changes
  window.addEventListener('hashchange', openModalFromHash);

  // Open modal on page load if hash present
  openModalFromHash();

  // Handle clicks on links within modals and URL hash changes
  $(document).on('click', 'a[href^="#"]', function(e) {
    const hash = $(this).attr('href');
    const modal = $(hash);

    if (modal.length && modal.hasClass('modal')) {
      e.preventDefault();
      window.location.hash = hash;
    } else if (!modal.length || !modal.hasClass('modal')) {
      window.location.hash = ''; // Clear hash to close modal
    }
  });
};
