const navbar = document.querySelector("header");

function updatePadding() {
    if (navbar) {
        const navbarHeight = navbar.offsetHeight;

        document.body.style.paddingTop = `${navbarHeight}px`;
        document.documentElement.style.scrollPaddingTop = `${navbarHeight}px`;
    }
}

updatePadding();

window.addEventListener("resize", updatePadding);

const navbarObserver = new MutationObserver(updatePadding);

if (navbar) {
    navbarObserver.observe(navbar, { attributes: true, childList: true, subtree: true });
}
