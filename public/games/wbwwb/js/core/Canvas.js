// canvas.js
(function(global){
  const ASPECT_RATIO = 16 / 9;

  function calculateCanvasSize() {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    let width, height;

    if (windowWidth / windowHeight > ASPECT_RATIO) {
      // Window too wide → fit height
      height = windowHeight;
      width = Math.floor(height * ASPECT_RATIO);
    } else {
      // Window too tall → fit width
      width = windowWidth;
      height = Math.floor(width / ASPECT_RATIO);
    }

    return { width, height };
  }

  // Expose globally
  global.calculateCanvasSize = calculateCanvasSize;
})(window);
