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

          if (document.getElementById(targetId)) {
            const paddingTop = 150; // 150px
            const currentSectionTop = $('.collapse.show').offset().top;
            const targetSectionTop = accordion.offset().top - paddingTop;
            const scrollDifference = targetSectionTop - currentSectionTop;

            $('html, body').animate({
              scrollTop: $(window).scrollTop() + scrollDifference
            }, 800);
          }
        }
      }
    }
  }

  $(window).on('hashchange', openAccordionFromHash);
  openAccordionFromHash();
});
