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

      // Prevent links within this modal from closing it if their ID doesn't match any modal IDs
      var modalLinks = targetElement.querySelectorAll('a');
      modalLinks.forEach(link => {
        link.addEventListener('click', function(event) {
          var linkId = event.target.getAttribute('id');
          var isModalId = document.getElementById(linkId);

          if (!isModalId || !isModalId.classList.contains('modal')) {
            event.preventDefault();
            event.stopPropagation();
          }
        });
      });
    } else {
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

      // Prevent links within this modal from closing it if their ID doesn't match any modal IDs
      var modalLinks = targetElement.querySelectorAll('a');
      modalLinks.forEach(link => {
        link.addEventListener('click', function(event) {
          var linkId = event.target.getAttribute('id');
          var isModalId = document.getElementById(linkId);

          if (!isModalId || !isModalId.classList.contains('modal')) {
            event.preventDefault();
            event.stopPropagation();
          }
        });
      });
    }
  }
};
