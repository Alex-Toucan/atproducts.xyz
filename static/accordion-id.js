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

          const currentSection = $('.collapse.show');
          const targetSection = accordion;

          if (currentSection.length && targetSection.length) {
            const paddingTop = 150; // 150px
            const currentSectionTop = currentSection.offset().top || 0;
            const targetSectionTop = targetSection.offset().top - paddingTop;
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
