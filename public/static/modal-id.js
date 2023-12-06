$(document).ready(function() {
  // Function to check if the hash matches any modal and open it
  function openModalFromHash() {
    const hash = window.location.hash;
    if (hash !== '') {
      const modal = $(hash);
      if (modal.length && modal.hasClass('modal') && !modal.hasClass('show')) {
        $('.modal').modal('hide'); // Close any open modal
        $('body').addClass('modal-open').css('padding-right', '0!important');
        $('.navbar').css('padding-right', '0!important'); // Adjust padding-right for .navbar
        modal.modal('show');
      }
    }
  }

  // Event listener for hash changes
  $(window).on('hashchange', openModalFromHash);

  // Open modal on page load if hash present
  openModalFromHash();

  // Handle clicks on links within modals and URL hash changes
  $(document).on('click', 'a[href^="#"]', function(e) {
    const hash = $(this).attr('href');
    const modal = $(hash);
    if (modal.length && modal.hasClass('modal') && modal.hasClass('show')) {
      e.preventDefault();
    } else if (modal.length && modal.hasClass('modal') && !modal.hasClass('show')) {
      e.preventDefault();
      window.location.hash = hash;
    } else {
      window.location.hash = ''; // Clear hash to close modal
    }
  });

  // Add modal-open class to body and adjust padding-right for .navbar when modal is shown
  $(document).on('shown.bs.modal', '.modal', function() {
    $('body').addClass('modal-open').css('padding-right', '0!important');
    $('.navbar').css('padding-right', '0!important');
  });

  // Remove modal-open class from body and reset padding-right for .navbar when modal is hidden
  $(document).on('hidden.bs.modal', '.modal', function() {
    $('body').removeClass('modal-open').css('padding-right', '');
    $('.navbar').css('padding-right', '');
  });
});
