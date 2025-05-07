const navbar = document.querySelector("header");
const collapseElement = document.querySelector(".navbar-collapse");

function updatePadding() {
    if (navbar) {
        requestAnimationFrame(() => {
            const navbarHeight = navbar.offsetHeight;
            const additionalPadding = 8;
            
            document.body.style.paddingTop = `${navbarHeight}px`;
            document.documentElement.style.scrollPaddingTop = `${navbarHeight + additionalPadding}px`;
        });
    }
}

updatePadding();

let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => requestAnimationFrame(updatePadding), 100);
});

if (collapseElement) {
    collapseElement.addEventListener("shown.bs.collapse", updatePadding);
    collapseElement.addEventListener("hidden.bs.collapse", updatePadding);
}

if (navbar) {
    const navbarObserver = new MutationObserver(updatePadding);
    navbarObserver.observe(navbar, { attributes: true, childList: true, subtree: true });
}
