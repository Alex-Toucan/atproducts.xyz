$(document).ready(function() {
  function openAccordionFromHash() {
    const hash = window.location.hash;
    console.log('Hash:', hash);

    if (hash !== '') {
      const accordion = $(hash);
      console.log('Accordion:', accordion);

      if (accordion.length && accordion.hasClass('collapse')) {
        if (!accordion.hasClass('show')) {
          $('.collapse.show').collapse('hide');
          accordion.collapse('show');
          const element = document.getElementById(hash.substring(1));
          console.log('Element:', element);

          // Scroll to the element with animation
          if (element) {
            $('html, body').animate({
              scrollTop: $(element).offset().top
            }, 800);
          }
        }
      }
    }
  }

  $(window).on('hashchange', openAccordionFromHash);
  openAccordionFromHash();
});
