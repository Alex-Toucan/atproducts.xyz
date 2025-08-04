function adjustDropdowns() {
const isMobile = window.innerWidth < 992;

document.querySelectorAll(".subdropdown").forEach(d => {
    if (isMobile) {
    d.classList.remove("dropend");
    d.classList.add("dropdown");
    } else {
    d.classList.remove("dropdown");
    d.classList.add("dropend");
    }
});

document.querySelectorAll(".color-dropdown").forEach(d => {
    if (isMobile) {
    d.classList.remove("dropdown");
    d.classList.add("dropup");
    } else {
    d.classList.remove("dropup");
    d.classList.add("dropdown");
    }
});
}

window.addEventListener("resize", adjustDropdowns);
adjustDropdowns();

function positionDropdownMenus() {
    // Select all .dropdown-toggle elements that are NOT inside .subdropdown
    const toggles = document.querySelectorAll('.dropdown-toggle:not(.subdropdown .dropdown-toggle)');

    toggles.forEach(dropdownToggle => {
        // Find the corresponding .dropdown-menu sibling
        const dropdownMenu = dropdownToggle.parentElement.querySelector('.dropdown-menu');
        if (!dropdownMenu) return;

        if (window.innerWidth > 992) {
            const toggleRect = dropdownToggle.getBoundingClientRect();
            const absoluteLeft = toggleRect.left + window.scrollX;

            dropdownMenu.style.position = 'absolute';
            dropdownMenu.style.left = `${absoluteLeft}px`;
            dropdownMenu.style.top = `${toggleRect.bottom + window.scrollY}px`;
            dropdownMenu.style.minWidth = `${toggleRect.width}px`;
            dropdownMenu.style.transform = 'none';
        } else {
            dropdownMenu.style.position = '';
            dropdownMenu.style.left = '';
            dropdownMenu.style.top = '';
            dropdownMenu.style.minWidth = '';
            dropdownMenu.style.transform = '';
        }
    });
}

// Run on load and resize
window.addEventListener('DOMContentLoaded', positionDropdownMenus);
window.addEventListener('resize', positionDropdownMenus);