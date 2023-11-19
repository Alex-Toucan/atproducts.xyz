// Function to check the hash and show dynamic content in the modal
function checkHashForModal() {
  var hash = window.location.hash.substring(1);

  if (hash !== '') {
    $('#modalTitle').text("Modal Title for ID: " + hash); // Set the modal title
    $('#modalContent').text("Dynamic content for ID: " + hash); // Set the modal content
    $('#dynamicModal').modal('show'); // Show the modal
  }
}

// Run the function when the page loads
$(document).ready(function() {
  checkHashForModal();

  // Check for hash changes
  $(window).on('hashchange', function() {
    checkHashForModal();
  });
});
