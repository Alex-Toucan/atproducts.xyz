window.onload = function() {
  // Function to check if the hash matches any modal and open it
  function openModalFromHash() {
    const hash = window.location.hash;
    const modal = document.querySelector(hash);
    if (modal && modal.classList.contains('modal')) {
      $('.modal').modal('hide'); // Close any open modal
      $('body').addClass('modal-open');
      $(hash).modal('show');
    }
  }

  // Event listener for hash changes
  window.addEventListener('hashchange', openModalFromHash);

  // Open modal on page load if hash present
  openModalFromHash();

  // Handle clicks on links within modals
  $('.modal').on('click', 'a[href^="#"]', function(e) {
    const hash = $(this).attr('href');
    const targetModal = $(hash);
    if (targetModal.length && targetModal.hasClass('modal')) {
      e.preventDefault();
      window.location.hash = hash;
    }
  });

  // Handle case when ID in URL doesn't match a modal
  $(document).on('click', 'a[href^="#"]', function() {
    const hash = $(this).attr('href');
    const modal = $(hash);
    if (!modal.length || !modal.hasClass('modal')) {
      window.location.hash = ''; // Clear hash to close modal
    }
  });
};
