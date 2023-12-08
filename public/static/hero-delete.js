// Function to remove elements based on condition
function removeElements() {
  // Remove empty dropdown items
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  dropdownItems.forEach((item) => {
    if (!item.textContent.trim()) {
      item.remove();
    }
  });

  // Remove undefined icon elements
  const iconLinks = document.querySelectorAll('.link-hero.fs-7');
  iconLinks.forEach((link) => {
    const iconText = link.querySelector('i').className;
    if (iconText.includes('undefined')) {
      link.remove();
    }
  });
}

// Call the function when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  removeElements();
});
