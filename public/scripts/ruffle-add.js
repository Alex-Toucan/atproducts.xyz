document.addEventListener("DOMContentLoaded", () => {
  // Apply to any existing ruffle-object immediately
  document.querySelectorAll("ruffle-object").forEach(tweakRuffleObject);

  // Watch for ruffle-object elements injected later
  const rootObserver = new MutationObserver(() => {
    document.querySelectorAll("ruffle-object").forEach(tweakRuffleObject);
  });
  rootObserver.observe(document.body, { childList: true, subtree: true });

  function tweakRuffleObject(el) {
    // Add id once
    if (!el.id) el.id = "full-screen";

    const findContainer = () =>
      el.querySelector(".container") ||
      (el.shadowRoot && el.shadowRoot.querySelector(".container"));

    const applyRadius = (node) => {
      node.style.borderRadius = ".375rem";
    };

    const container = findContainer();
    if (container) {
      applyRadius(container);
      return;
    }

    // If container isn't there yet, observe inside the element (and its shadowRoot if present)
    const innerObserver = new MutationObserver(() => {
      const c = findContainer();
      if (c) {
        applyRadius(c);
        innerObserver.disconnect();
      }
    });

    innerObserver.observe(el, { childList: true, subtree: true });
    if (el.shadowRoot) {
      innerObserver.observe(el.shadowRoot, { childList: true, subtree: true });
    }
  }
});
