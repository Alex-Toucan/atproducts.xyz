$(document).ready(function() {
  // Remove empty dropdown items
  $('.dropdown-item').each(function() {
    if (!$(this).text().trim()) {
      $(this).remove();
    }
  });

  // Remove undefined icon elements
  $('.link-hero.fs-7').each(function() {
    const iconClass = $(this).find('i').attr('class');
    if (iconClass.includes('bi-undefined')) {
      $(this).remove();
    }
  });
});
