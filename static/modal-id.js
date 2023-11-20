window.addEventListener('hashchange', function() {
  var hash = window.location.hash;

  var openModal = document.querySelector('.modal.show');
  if (openModal) {
    var modalInstance = bootstrap.Modal.getInstance(openModal);
    modalInstance.hide();
  }

  if (hash) {
    var id = hash.substring(1);
    var targetElement = document.getElementById(id);

    if (targetElement && targetElement.classList.contains('modal')) {
      var modal = new bootstrap.Modal(targetElement);
      modal.show();
      document.body.classList.add('modal-open');
    } else {
      // If the hash doesn't match any modal IDs, maintain the current modal state
      // This ensures it doesn't interfere with other modals
      var modalToKeepOpen = document.querySelector('.modal.show');
      if (modalToKeepOpen) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    }
  } else {
    document.body.classList.remove('modal-open');
  }
});

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

// Prevent links within modals from closing them
document.querySelectorAll('.modal a').forEach(link => {
  link.addEventListener('click', function(event) {
    event.stopPropagation(); // Prevent the click event from bubbling up
  });
});
