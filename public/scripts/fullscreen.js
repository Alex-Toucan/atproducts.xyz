$('#fullScreenBtn').on('click', function() {
    let elem = $('#full-screen')[0];
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }
});