$(document).ready(function() {
  function openModalFromHash() {
    const hash = window.location.hash;
    if (hash !== '') {
      const modal = $(hash);
      if (modal.length && modal.hasClass('modal') && !modal.hasClass('show')) {
        $('.modal').modal('hide');
        $('body').addClass('modal-open');
        modal.modal('show');
      }
    }
  }

  $(window).on('hashchange', function() {
    if ($('.modal.show').length === 0) {
      openModalFromHash();
    }
  });

  if ($('.modal.show').length === 0) {
    openModalFromHash();
  }

  $(document).on('click', 'a[href^="#"]', function(e) {
    const hash = $(this).attr('href');
    const modal = $(hash);

    if (modal.length && modal.hasClass('modal') && modal.hasClass('show')) {
      e.preventDefault();
    } else if (modal.length && modal.hasClass('modal') && !modal.hasClass('show')) {
      e.preventDefault();
      window.location.hash = hash;
    } else if (!modal.length || !modal.hasClass('modal')) {
      window.location.hash = '';
    }
  });

  $(document).on('shown.bs.modal', '.modal', function() {
    $('body').addClass('modal-open');
  });

  $(document).on('hidden.bs.modal', '.modal', function() {
    $('body').removeClass('modal-open');
  });
});
