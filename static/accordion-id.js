$(document).ready(function() {
  function openAccordionFromHash() {
    const hash = decodeURIComponent(window.location.hash); // Decode the hash

    if (hash && hash.startsWith('#')) {
      const targetId = hash.substring(1); // Remove '#' from the hash

      const accordion = $('#' + targetId); // Use the ID directly
      console.log('Accordion:', accordion);

      if (accordion.length && accordion.hasClass('collapse')) {
        if (!accordion.hasClass('show')) {
          $('.collapse.show').collapse('hide');
          accordion.collapse('show');
          const element = document.getElementById(targetId);
          console.log('Element:', element);

          // Scroll to the element with padding and animation
          if (element) {
            const paddingTop = 150; // 150px
            const targetOffset = $(element).offset().top;
            const scrollPosition = targetOffset - $(window).scrollTop();
            const adjustedScroll = scrollPosition - paddingTop;
            const finalScroll = $(window).scrollTop() + adjustedScroll;
            
            $('html, body').animate({
              scrollTop: finalScroll
            }, 800);
          }
        }
      }
    }
  }

  $(window).on('hashchange', openAccordionFromHash);
  openAccordionFromHash();
});
