$(document).ready(function() {
  // Remove empty dropdown items
  $('.dropdown-item').each(function() {
    if (!$(this).text().trim()) {
      $(this).remove();
    }
  });

  // Remove link-hero elements with no href attribute
  $('.link-hero.fs-7').each(function() {
    const href = $(this).attr('href');
    if (!href) {
      $(this).remove();
    }
  });
});
