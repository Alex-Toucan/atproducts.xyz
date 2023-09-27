var playButton = document.querySelector(".playButton");
var pauseButton = document.querySelector(".pauseButton");
var nextButton = document.querySelector(".carousel-control-next");
var previousButton = document.querySelector(".carousel-control-prev");
var carouselMain = document.querySelector(".carousel-main");
var slidebtn = document.querySelectorAll(".slidebtn");

$(function () {
    $(carouselMain).carousel({
        pause: "false",
			  cycle: "true",
			  interval: 10000
    });
    
    $(playButton).click(function () {
        $(carouselMain).carousel('cycle');
    });
    $(pauseButton).click(function () {
        $(carouselMain).carousel('pause');
    });
	
		$(nextButton).click(handleButton);
    $(previousButton).click(handleButton);
    $(slidebtn).click(handleButton);
	
    function handleButton() {
        playButton.checked = true;
			  pauseButton.checked = false;
    };
});

$(document).ready(function() {
    // Initialize the active button and set btn-primary for past years
    let activeYear = 1;

    updateTimeline(activeYear);

    // Add click event handlers to timeline buttons
    for (let i = 1; i <= 4; i++) {
        $(`#history-${i}`).click(function() {
            if (i == activeYear) return;

            updateTimeline(i);
        });

        // Add keydown event listener for arrow keys when button is focused
        $(`#history-${i}`).on('keydown', function(e) {
            if (e.key === "ArrowLeft" && i > 1) {
                updateTimeline(i - 1);
            } else if (e.key === "ArrowRight" && i < 4) {
                updateTimeline(i + 1);
            }
        });
    }

    // Function to update the timeline based on the selected year
    function updateTimeline(year) {
        // Remove the "active" class from all buttons
        for (let i = 1; i <= 4; i++) {
            $(`#history-${i}`).toggleClass("active", i == year).toggleClass("btn-secondary", i > year).toggleClass("btn-primary", i <= year);
        }

        // Update the progress bar width
        const progressBarWidth = (year - 1) * 33.33333333;
        $("#history-progress").css("width", `${progressBarWidth}%`);

        // Update the active year
        activeYear = year;
    }
});
