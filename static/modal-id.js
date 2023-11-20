window.onload = function() {
    // Function to check if the current URL contains a modal ID
    function checkModalIdInURL() {
        let url = window.location.href;
        let modalId = url.split('#')[1]; // Get the modal ID from the URL
        
        if (modalId) {
            let modalElement = document.getElementById(modalId);

            if (modalElement && modalElement.classList.contains('modal')) {
                let openModal = document.querySelector('.modal.show');
                if (openModal) {
                    openModal.classList.remove('show'); // Close the current open modal
                    document.body.classList.remove('modal-open'); // Remove class from body
                }

                modalElement.classList.add('show'); // Show the new modal
                document.body.classList.add('modal-open'); // Add class to body

                // Get all links inside the modal
                let modalLinks = modalElement.querySelectorAll('a');
                modalLinks.forEach(link => {
                    // Add an event listener to prevent link clicks from closing the modal
                    link.addEventListener('click', function(event) {
                        event.stopPropagation(); // Prevent the click event from bubbling up
                    });
                });
            }
        }
    }

    // Function to check the modal on hashchange event
    function checkModalOnHashChange() {
        checkModalIdInURL();
    }

    // Check if there's a modal ID in the URL when the page loads
    checkModalIdInURL();

    // Handle hash changes to check the modal
    window.addEventListener('hashchange', checkModalOnHashChange);
};
