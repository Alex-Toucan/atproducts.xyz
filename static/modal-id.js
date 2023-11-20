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

      // Prevent links within the modal from closing it
      var modalLinks = targetElement.querySelectorAll('a');
      modalLinks.forEach(link => {
        link.addEventListener('click', function(event) {
          event.stopPropagation(); // Prevent the click event from bubbling up
        });
      });
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

      var modalLinks = targetElement.querySelectorAll('a');
      modalLinks.forEach(link => {
        link.addEventListener('click', function(event) {
          event.stopPropagation(); // Prevent the click event from bubbling up
        });
      });
    }
  }
};
