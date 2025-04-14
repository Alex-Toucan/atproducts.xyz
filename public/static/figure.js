const history = document.querySelector("#history");
const figure = document.querySelector("#history figure");
const paragraph = document.querySelector("#history p");

if (history && figure && paragraph) {
    // Calculate the new height
    const figureHeight = figure.offsetHeight;
    const paragraphHeight = paragraph.offsetHeight;
    const historyHeight = history.offsetHeight;

    const newMinHeight = historyHeight + (figureHeight - paragraphHeight);

    // Apply the calculated height to #history
    history.style.minHeight = `${newMinHeight}px`;
} else {
    console.error("Unable to find one or more required elements.");
}