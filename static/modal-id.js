window.onload = function() {
    // Function to check if the current URL contains a modal ID
    function checkModalIdInURL() {
        let url = window.location.href;
        let modalId = url.split('#')[1]; // Get the modal ID from the URL
        
        if (modalId) {
            let modalElement = document.getElementById(modalId);

            if (modalElement && modalElement.classList.contains('modal')) {
                let openModal = document.querySelector('.modal.show');
                if (openModal) {
                    openModal.classList.remove('show'); // Close the current open modal
                    document.body.classList.remove('modal-open'); // Remove class from body
                }

                modalElement.classList.add('show'); // Show the new modal
                document.body.classList.add('modal-open'); // Add class to body

                // Prevent links within the modal from closing it
                let modalLinks = modalElement.querySelectorAll('a');
                modalLinks.forEach(link => {
                    link.addEventListener('click', function(event) {
                        event.stopPropagation();
                    });
                });
            }
        }
    }

    // Function to handle hash change events
    window.addEventListener('hashchange', function() {
        checkModalIdInURL();
    });

    // Check if there's a modal ID in the URL when the page loads
    checkModalIdInURL();
};
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
