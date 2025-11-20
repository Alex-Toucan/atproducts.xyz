document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver((mutations, obs) => {
    const ruffleObj = document.querySelector("ruffle-object");
    if (ruffleObj) {
      // Add the id
      ruffleObj.id = "full-screen";

      // Access the shadow DOM and add class to #container
      if (ruffleObj.shadowRoot) {
        const container = ruffleObj.shadowRoot.querySelector("#container");
        if (container) {
          container.classList.add("rounded-2");
        }
      }

      // Stop observing once we've done our job
      obs.disconnect();
    }
  });

  // Observe the whole document for added nodes
  observer.observe(document.body, { childList: true, subtree: true });
});
