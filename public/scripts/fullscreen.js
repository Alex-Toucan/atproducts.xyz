$('#fullScreenBtn').on('click', function() {
    let elem = $('#full-screen')[0];
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }
});

// Select the first ruffle-object on the page
const ruffleEl = document.querySelector("ruffle-object");

// Add the id
if (ruffleEl) {
  ruffleEl.id = "full-screen";
}