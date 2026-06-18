document.addEventListener('DOMContentLoaded', function() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach(el => new window.bootstrap.Tooltip(el));

  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
  popoverTriggerList.forEach(el => new window.bootstrap.Popover(el));

  const popoverDismiss = document.querySelector('.popover-dismiss');
  if (popoverDismiss) {
    new window.bootstrap.Popover(popoverDismiss, { trigger: 'focus' });
  }
});