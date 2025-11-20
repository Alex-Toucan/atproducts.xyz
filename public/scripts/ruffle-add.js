document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver((mutations, obs) => {
    const ruffleObj = document.querySelector("ruffle-object");
    if (ruffleObj) {
      // Add the id
      ruffleObj.id = "full-screen";

      // Apply border-radius to #container inside it
      const container = ruffleObj.querySelector("#container");
      if (container) {
        container.style.borderRadius = ".375rem";
      }

      // Stop observing once we've done our job
      obs.disconnect();
    }
  });

  // Observe the whole document for added nodes
  observer.observe(document.body, { childList: true, subtree: true });
});