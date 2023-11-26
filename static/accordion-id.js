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

          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            console.log('Scrolled to element');
          }
        }
      }
    }
  }

  $(window).on('hashchange', openAccordionFromHash);
  openAccordionFromHash();

  $(document).on('click', '.accordion-button', function() {
    const $heading = $(this);
    const hash = $heading.attr('id');
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Modified scrolling function for class .scrollTo
  $(".scrollTo").on('click', function (e) {
    e.preventDefault();
    var targetId = $(this).data('target'); // Assuming the target ID is stored in a data attribute
    
    if (targetId) {
      var targetElement = $('#' + targetId);
      if (targetElement.length) {
        $('html, body').animate({
          scrollTop: targetElement.offset().top
        }, 2000);
      }
    }
  });
});
