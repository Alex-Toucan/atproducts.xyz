  // Function to toggle accordion based on ID
  function toggleAccordion(id) {
    const accordion = document.getElementById(id);
    if (!accordion) return;

    const allAccordions = document.querySelectorAll('.accordion');
    allAccordions.forEach(item => {
      if (item.id === id) {
        item.classList.toggle('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Scroll to the accordion if it's not in a modal
    if (!isInModal(accordion)) {
      accordion.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Function to check if the accordion is inside a modal
  function isInModal(element) {
    while (element) {
      if (element.classList.contains('modal')) {
        return true;
      }
      element = element.parentElement;
    }
    return false;
  }

  // Handle opening accordion based on URL hash (assuming hash corresponds to accordion ID)
  window.onload = function () {
    const hash = window.location.hash.substring(1); // get the hash excluding the '#'
    if (hash) {
      toggleAccordion(hash);
    }
  };
