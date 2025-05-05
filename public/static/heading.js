function updatePadding() {
    const navbar = document.querySelector(".navbar");

    if (navbar) {
        const navbarHeight = navbar.offsetHeight;

        document.body.style.paddingTop = `${navbarHeight}px`;
        document.documentElement.style.scrollPaddingTop = `${navbarHeight}px`;
    }
}

updatePadding();

window.addEventListener("resize", updatePadding);

const navbarObserver = new MutationObserver(updatePadding);
const navbar = document.querySelector(".navbar");

if (navbar) {
    navbarObserver.observe(navbar, { attributes: true, childList: true, subtree: true });
}
