// Event listener for close buttons within modals
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal-close')) {
    var openModal = document.querySelector('.modal.show');
    if (openModal) {
      var modalInstance = bootstrap.Modal.getInstance(openModal);
      modalInstance.hide();

      // Remove 'modal-open' class when a modal is closed via close button
      document.body.classList.remove('modal-open');
    }
  }
});

// Your existing code for handling hash changes
window.addEventListener('hashchange', function() {
  var openModal = document.querySelector('.modal.show');
  if (openModal) {
    var modalInstance = bootstrap.Modal.getInstance(openModal);
    modalInstance.hide();
  }

  var hash = window.location.hash;
  if (hash) {
    var id = hash.substring(1);
    var targetElement = document.getElementById(id);
    if (targetElement && targetElement.classList.contains('modal')) {
      var modal = new bootstrap.Modal(targetElement);
      modal.show();
      document.body.classList.add('modal-open');
    }
  } else {
    document.body.classList.remove('modal-open');
  }
});

// Your existing code for initial check on page load
window.onload = function() {
  var hash = window.location.hash;
  if (hash) {
    var id = hash.substring(1);
    var targetElement = document.getElementById(id);
    if (targetElement && targetElement.classList.contains('modal')) {
      var modal = new bootstrap.Modal(targetElement);
      modal.show();
      document.body.classList.add('modal-open');
    }
  }
};
