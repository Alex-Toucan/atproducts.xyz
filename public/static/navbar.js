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
    const toggles = document.querySelectorAll('.dropdown-toggle:not(.subdropdown .dropdown-toggle)');

    toggles.forEach(dropdownToggle => {
        const dropdownMenu = dropdownToggle.parentElement.querySelector('.dropdown-menu');
        if (!dropdownMenu) return;

        if (window.innerWidth > 992) {
            dropdownMenu.style.visibility = 'hidden';
            dropdownMenu.style.display = 'block';

            const toggleRect = dropdownToggle.getBoundingClientRect();
            const menuWidth = dropdownMenu.offsetWidth;
            const menuHeight = dropdownMenu.offsetHeight;

            let left = toggleRect.left + window.scrollX;
            let top = toggleRect.bottom + window.scrollY;

            const buffer = 12;
            const viewportRight = window.scrollX + window.innerWidth;
            const viewportBottom = window.scrollY + window.innerHeight;

            if (left + menuWidth + buffer > viewportRight) {
                left = toggleRect.right - menuWidth + window.scrollX;
                if (left + menuWidth + buffer > viewportRight) {
                    left = viewportRight - menuWidth - buffer;
                }
                if (left < buffer) left = buffer;
            }

            if (top + menuHeight + buffer > viewportBottom) {
                top = toggleRect.top - menuHeight + window.scrollY;
                if (top < buffer) top = buffer;
            }

            dropdownMenu.style.position = 'absolute';
            dropdownMenu.style.left = `${left}px`;
            dropdownMenu.style.top = `${top}px`;
            dropdownMenu.style.minWidth = `${toggleRect.width}px`;
            dropdownMenu.style.width = `${menuWidth}px`;
            dropdownMenu.style.height = `${menuHeight}px`;
            dropdownMenu.style.transform = 'none';
            dropdownMenu.style.padding = '8px 12px';

            dropdownMenu.style.display = '';
            dropdownMenu.style.visibility = '';
        } else {
            dropdownMenu.style.position = '';
            dropdownMenu.style.left = '';
            dropdownMenu.style.top = '';
            dropdownMenu.style.minWidth = '';
            dropdownMenu.style.width = '';
            dropdownMenu.style.height = '';
            dropdownMenu.style.transform = '';
            dropdownMenu.style.padding = '';
        }
    });
}

window.addEventListener('DOMContentLoaded', positionDropdownMenus);
window.addEventListener('resize', positionDropdownMenus);
window.addEventListener('pageshow', positionDropdownMenus);