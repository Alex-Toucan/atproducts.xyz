$(document).ready(function() {
  function openAccordionFromHash() {
    const hash = decodeURIComponent(window.location.hash);

    if (hash && hash.startsWith('#')) {
      const targetId = hash.substring(1);
      const accordion = $('#' + targetId);

      if (accordion.length && accordion.prop('tagName').toLowerCase() === 'details') {

        const groupName = accordion.attr('name');
        if (groupName) {
          $(`details[name="${groupName}"]`).each(function () {
            if (this !== accordion[0]) {
              $(this).removeAttr('open');
            }
          });
        }

        accordion.attr('open', '');

        const element = document.getElementById(targetId);
        if (element) {
          const paddingTop = 150;
          const sectionTop = accordion.offset().top - paddingTop;

          $('html, body').animate({
            scrollTop: sectionTop
          }, 800);
        }
      }
    }
  }

  $(window).on('hashchange', openAccordionFromHash);
  openAccordionFromHash();
});
