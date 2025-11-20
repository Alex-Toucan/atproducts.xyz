<script>
document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver((mutations, obs) => {
    const ruffleObj = document.querySelector("ruffle-object");
    if (ruffleObj) {
      // Add the id to the ruffle-object itself
      ruffleObj.id = "full-screen";

      // Target the outer #container (not inside ruffle-object)
      const container = document.querySelector("#container");
      if (container) {
        container.classList.add("rounded-2");
      }

      // Stop observing once we've done our job
      obs.disconnect();
    }
  });

  // Observe the whole document for added nodes
  observer.observe(document.body, { childList: true, subtree: true });
});
</script>
