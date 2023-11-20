window.addEventListener('hashchange', function() {
  // Close any open modal if present
  var openModal = document.querySelector('.modal.show');
  if (openModal) {
    var modalInstance = bootstrap.Modal.getInstance(openModal);
    modalInstance.hide();
  }

  // Get the updated hash value from the URL
  var hash = window.location.hash;

  // Check if the hash exists
  if (hash) {
    // Extract the ID from the hash
    var id = hash.substring(1); // Remove the '#' symbol

    // Find the element by the extracted ID
    var targetElement = document.getElementById(id);

    // Check if the element exists and if it's a modal
    if (targetElement && targetElement.classList.contains('modal')) {
      // Show the modal
      var modal = new bootstrap.Modal(targetElement);
      modal.show();

      // Add 'modal-open' class to the body tag
      document.body.classList.add('modal-open');
    }
  } else {
    // Remove 'modal-open' class from the body tag if no hash is present
    document.body.classList.remove('modal-open');
  }
});

// Initial check on page load
window.onload = function() {
  var hash = window.location.hash;
  if (hash) {
    var id = hash.substring(1);
    var targetElement = document.getElementById(id);
    if (targetElement && targetElement.classList.contains('modal')) {
      var modal = new bootstrap.Modal(targetElement);
      modal.show();

      // Add 'modal-open' class to the body tag on initial load
      document.body.classList.add('modal-open');
    }
  }
};
