document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded, starting MutationObserver…");

  const observer = new MutationObserver((mutations, obs) => {
    console.log("MutationObserver triggered:", mutations);

    const ruffleObj = document.querySelector("ruffle-object");
    if (ruffleObj) {
      console.log("Found <ruffle-object>:", ruffleObj);

      // Add the id
      ruffleObj.id = "full-screen";
      console.log("Assigned id='full-screen' to ruffle-object");

      // Access the shadow DOM and add class to #container
      if (ruffleObj.shadowRoot) {
        console.log("ShadowRoot detected on ruffle-object");
        const container = ruffleObj.shadowRoot.querySelector("#container");
        if (container) {
          console.log("Found #container inside shadowRoot:", container);
          container.classList.add("rounded-2");
          console.log("Added class 'rounded-2' to #container");
        } else {
          console.log("No #container found yet inside shadowRoot");
        }
      } else {
        console.log("ruffle-object has no shadowRoot");
      }

      // Stop observing once we've done our job
      obs.disconnect();
      console.log("Observer disconnected after applying changes");
    } else {
      console.log("No <ruffle-object> found yet");
    }
  });

  // Observe the whole document for added nodes
  observer.observe(document.body, { childList: true, subtree: true });
  console.log("Observer set to watch document.body");
});
