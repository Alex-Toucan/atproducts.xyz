$(document).ready(function() {
  // Function to check if the hash matches any modal and open it
  function openModalFromHash() {
    const hash = window.location.hash;
    if (hash !== '') {
      const modal = $(hash);
      if (modal.length && modal.hasClass('modal') && !modal.hasClass('show')) {
        $('.modal').modal('hide'); // Close any open modal
        $('body').addClass('modal-open');
        modal.modal('show');
      }
    }
  }

  // Event listener for hash changes
  $(window).on('hashchange', function() {
    if ($('.modal.show').length === 0) {
      openModalFromHash();
    }
  });

  // Open modal on page load if hash present
  if ($('.modal.show').length === 0) {
    openModalFromHash();
  }

  // Handle clicks on links within modals and URL hash changes
  $(document).on('click', 'a[href^="#"]', function(e) {
    const hash = $(this).attr('href');
    const modal = $(hash);

    if (modal.length && modal.hasClass('modal') && modal.hasClass('show')) {
      e.preventDefault();
    } else if (modal.length && modal.hasClass('modal') && !modal.hasClass('show')) {
      e.preventDefault();
      window.location.hash = hash;
    } else if (!modal.length || !modal.hasClass('modal')) {
      window.location.hash = ''; // Clear hash to close modal
    }
  });

  // Add modal-open class to body when modal is shown
  $(document).on('shown.bs.modal', '.modal', function() {
    $('body').addClass('modal-open');
  });

  // Remove modal-open class from body when modal is hidden
  $(document).on('hidden.bs.modal', '.modal', function() {
    $('body').removeClass('modal-open');
  });
});
