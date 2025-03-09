$(document).ready(function () {
  function cleanAndCopyCode() {
      const parentContainer = $(this).closest('.bg-dark-subtle');
      const codeElement = parentContainer.find('code');
      if (codeElement.length) {
          const htmlCode = codeElement.html();
          const cleanedCode = htmlCode.replace(/<span.*?>|<\/span>/g, '');

          navigator.clipboard.writeText(cleanedCode).then(() => {
              const clipboardIcon = $(this);

              const tooltip = bootstrap.Tooltip.getInstance(this);

              tooltip.setContent({ '.tooltip-inner': 'Copied!' });

              clipboardIcon.removeClass('bi-clipboard').addClass('bi-check2');

              setTimeout(() => {
                  tooltip.setContent({ '.tooltip-inner': 'Copy to Clipboard' });
                  clipboardIcon.removeClass('bi-check2').addClass('bi-clipboard');
              }, 2000);
          });
      }
  }

  $('.bi-clipboard').on('click', cleanAndCopyCode);
  $('[data-bs-toggle="tooltip"]').tooltip();
});
