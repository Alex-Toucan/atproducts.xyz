var playButtons = document.querySelectorAll(".playButton");
var pauseButtons = document.querySelectorAll(".pauseButton");
var nextButtons = document.querySelectorAll(".carousel-control-next");
var previousButtons = document.querySelectorAll(".carousel-control-prev");
var carouselMains = document.querySelectorAll(".carousel-main");
var slidebtns = document.querySelectorAll(".slidebtn");

$(function () {
    // Initialize each carousel-main individually
    $(".carousel-main").each(function () {
        $(this).carousel({
            pause: false,
            ride: true
        });
    });

    // Attach handlers for each carousel and its controls
    carouselMains.forEach(function(carousel, idx) {
        var $carousel = $(carousel);
        var playButton = playButtons[idx] || playButtons[0];
        var pauseButton = pauseButtons[idx] || pauseButtons[0];
        var nextButton = nextButtons[idx] || nextButtons[0];
        var previousButton = previousButtons[idx] || previousButtons[0];
        var slidebtn = slidebtns[idx] || slidebtns[0];

        if (playButton) {
            $(playButton).click(function () {
                $carousel.carousel('cycle');
                playButton.checked = true;
                if (pauseButton) pauseButton.checked = false;
            });
        }
        if (pauseButton) {
            $(pauseButton).click(function () {
                $carousel.carousel('pause');
                pauseButton.checked = true;
                if (playButton) playButton.checked = false;
            });
        }
        if (nextButton) {
            $(nextButton).click(function () {
                $carousel.carousel('next');
                if (playButton) playButton.checked = true;
                if (pauseButton) pauseButton.checked = false;
            });
        }
        if (previousButton) {
            $(previousButton).click(function () {
                $carousel.carousel('prev');
                if (playButton) playButton.checked = true;
                if (pauseButton) pauseButton.checked = false;
            });
        }
        if (slidebtn) {
            $(slidebtn).click(function () {
                if (playButton) playButton.checked = true;
                if (pauseButton) pauseButton.checked = false;
            });
        }
    });
});

$(document).ready(function() {
    // Initialize the active button and set btn-primary for past years
    let activeYear = 1;

    updateTimeline(activeYear);
    // Add click event handlers to timeline buttons
    for (let i = 1; i <= 5; i++) $(`#history-${i}`).click(() => updateTimeline(i));
    const debounce = 500;
    let isDebounced = false;
    let debounceTimeout;
    document.addEventListener("keydown", event => {
        if(isDebounced) return;
        switch (event.code) {
            case "ArrowLeft":
                updateTimeline(activeYear - 1);
                break;
        
            case "ArrowRight":
                updateTimeline(activeYear + 1);
                break;
            default:
                return;
        }
        isDebounced = true;
        debounceTimeout = setTimeout(() => isDebounced = false, debounce);
    });
    document.addEventListener("keyup", event => {
        if(event.code != "ArrowLeft" && event.code != "ArrowRight") return;
        if(!debounceTimeout) return;
        debounceTimeout = clearTimeout(debounceTimeout);
        isDebounced = false;
    });
    // Function to update the timeline based on the selected year
    function updateTimeline(year) {
        // Make sure year is within the min and max
        year = Math.min(Math.max(year, 1), 5);
        if(year == activeYear) return;
        // Remove the "active" class from all buttons
        for (let i = 1; i <= 5; i++) {
            $(`#history-${i}`).toggleClass("active", i == year).toggleClass("btn-secondary", i > year).toggleClass("btn-primary", i <= year);
            $(`#history-${i}-pane`).toggleClass("active", i == year).removeClass("show");
        }
        setTimeout(() => {
            $(`#history-${year}-pane`).addClass("show");  
        }, 50);
        // Update the progress bar width
        const progressBarWidth = (year - 1) * 25;
        $("#history-progress").css("width", `${progressBarWidth}%`);
        // Update the active year
        activeYear = year;
    }
});
