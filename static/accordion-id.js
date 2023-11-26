$(document).ready(function() {
  // Function to check if the hash matches any accordion and open it
  function openAccordionFromHash() {
    const hash = window.location.hash;
    if (hash !== '') {
      const accordion = $(hash);
      if (accordion.length && accordion.hasClass('collapse')) {
        if (!accordion.hasClass('show')) {
          $('.collapse.show').collapse('hide'); // Hide any open accordion
          accordion.collapse('show');
          const $heading = $('[href="' + hash + '"]');
          if ($heading.length) {
            $heading.removeClass('collapsed').attr('aria-expanded', 'true');
            const offset = $heading.offset().top - 100;
            $('html, body').animate({ scrollTop: offset }, 'slow');
          }
        }
      }
    }
  }

  // Event listener for hash changes to open accordion
  $(window).on('hashchange', openAccordionFromHash);

  // Open accordion on page load if hash present
  openAccordionFromHash();

  // Handle clicks on accordion headers and URL hash changes
  $(document).on('click', '.accordion-button', function() {
    const $heading = $(this);
    if ($heading.length) {
      $heading.removeClass('collapsed').attr('aria-expanded', 'true');
      const offset = $heading.offset().top - 100;
      $('html, body').animate({ scrollTop: offset }, 'slow');
    }
  });

  // Scroll to accordion item when page scrolls above 100px
  $(window).on('scroll', function() {
    const accordionItem = $('.accordion-item');
    if (accordionItem.length) {
      const accordionOffset = accordionItem.offset().top - 100; // Adjust the offset as needed
      if ($(window).scrollTop() > 100 && $(window).scrollTop() < accordionOffset) {
        $('html, body').scrollTop(accordionOffset);
      }
    }
  });

  // Reset padding-right for .navbar when accordion is fully shown
  $(document).on('shown.bs.collapse', '.collapse', function() {
    // ... (existing actions after accordion shown remains unchanged)
  });

  // Detect user-initiated scroll and handle interruption
  let lastScrollTop = 0;
  $(window).on('scroll', function() {
    const st = $(this).scrollTop();
    if (st > lastScrollTop) {
      $('html, body').stop();
    }
    lastScrollTop = st <= 0 ? 0 : st;
  });
});
