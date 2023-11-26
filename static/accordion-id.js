$(document).ready(function() {
  // Initialize all elements as collapsible
  $('.accordion').accordion({
    collapsible: true,
    active: false,
    heightStyle: 'content', // Adjusts the height based on content
    activate: function(event, ui) {
      // When an accordion element is clicked, update the hash
      const activeId = ui.newHeader.attr('id');
      if (activeId) {
        window.location.hash = `#${activeId}`;
      }
    }
  });

  function openElementFromHash() {
    const hash = window.location.hash;
    if (hash !== '') {
      const elementId = hash.substr(1);
      $(`#${elementId}`).accordion('option', 'active', 0); // Open the element based on hash
    }
  }

  openElementFromHash();

  $(window).on('hashchange', openElementFromHash);

  // Trigger element based on user input
  $('#openElementBtn').on('click', function() {
    const userInput = $('#inputId').val();
    if (userInput !== '') {
      // Close all elements
      $('.accordion').accordion('option', 'active', false);
      // Open the selected element
      $(`#${userInput}`).accordion('option', 'active', 0);
    }
  });
});
