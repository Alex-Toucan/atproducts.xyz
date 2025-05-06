const navbar = document.querySelector("header");

function updatePadding() {
    if (navbar) {
        requestAnimationFrame(() => {
            const navbarHeight = navbar.offsetHeight;
            document.body.style.paddingTop = `${navbarHeight}px`;
            document.documentElement.style.scrollPaddingTop = `${navbarHeight}px`;
        });
    }
}

updatePadding();

let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updatePadding, 100);
});

const navbarObserver = new MutationObserver(updatePadding);

if (navbar) {
    navbarObserver.observe(navbar, { attributes: true, childList: true, subtree: true });
}
