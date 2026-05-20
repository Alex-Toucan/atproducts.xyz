function adjustDropdowns() {
    const isMobile = window.innerWidth < 992;

    document.querySelectorAll("#bd-theme").forEach(d => {
        if (isMobile) {
            d.setAttribute("data-bs-placement", "top-start");
          } else {
            d.setAttribute("data-bs-placement", "bottom-start");
        }
    });
}

window.addEventListener("resize", adjustDropdowns);
adjustDropdowns();