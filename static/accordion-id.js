$(document).ready(function() {
  function openAccordionFromHash() {
    const hash = decodeURIComponent(window.location.hash); // Decode the hash

    if (hash && hash.startsWith('#')) {
      const targetId = hash.substring(1); // Remove '#' from the hash

      const accordion = $('#' + targetId); // Use the ID directly

      if (accordion.length && accordion.hasClass('collapse')) {
        if (!accordion.hasClass('show')) {
          $('.collapse.show').collapse('hide');
          accordion.collapse('show');
          const element = document.getElementById(targetId);

          // Scroll to the element with padding and animation
          if (element) {
            const paddingTop = 150; // 150px
            const targetOffset = $(element).offset().top - paddingTop;
            $('html, body').animate({
              scrollTop: targetOffset
            }, 800);
          }
        }
      }
    }
  }

  $(window).on('hashchange', openAccordionFromHash);
  openAccordionFromHash();
});
