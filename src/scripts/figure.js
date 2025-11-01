const history = document.querySelector("#history");
const figure = document.querySelector("#history figure");
const heading = document.querySelector("#history h2");
const paragraph = document.querySelector("#history p");

function adjustHistoryHeight() {
  if (!history || !figure || !heading || !paragraph) {
    console.error("Unable to find one or more required elements.");
    return;
  }

  const isWide = window.matchMedia("(min-width: 767.98px)").matches;
  if (isWide) {
    history.style.minHeight = "";

    const figureHeight = figure.offsetHeight;
    const headingHeight = heading.offsetHeight;
    const paragraphHeight = paragraph.offsetHeight;

    const targetHeight = Math.max(
      figureHeight,
      headingHeight + paragraphHeight,
      figureHeight + headingHeight
    );
    history.style.minHeight = `${targetHeight}px`;
  } else {
    history.style.minHeight = "";
  }
}

function debounce(fn, wait = 100) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

adjustHistoryHeight();
window.addEventListener("resize", debounce(adjustHistoryHeight, 100));