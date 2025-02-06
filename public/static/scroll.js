(function ($) {
  "use strict";
  $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
              $('.back-to-top').css('display', 'block');
          } else {
              $('.back-to-top').fadeIn('slow');
          }
      } else {
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
              $('.back-to-top').css('display', 'none');
          } else {
              $('.back-to-top').fadeOut('slow');
          }
      }
  });

  $('.back-to-top').click(function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          $('html, body').scrollTop(0);
      } else {
          $('html, body').animate({scrollTop: 0}, 500, 'easeInOutExpo');
      }
      return false;
  });

})(jQuery);
