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
    // Initialize the active button
    let activeYear = 1;
    updateTimeline(activeYear);

    // Add click event handlers to timeline buttons
    for (let i = 1; i <= 4; i++) {
        $(`#history-${i}`).click(function() {
            if (i !== activeYear) {
                updateTimeline(i);
            }
        });
    }

    // Function to update the timeline based on the selected year
    function updateTimeline(year) {
        // Remove the "active" class and change to "btn-primary" class from all buttons
        for (let i = 1; i <= 4; i++) {
            $(`#history-${i}`).removeClass("active btn-primary").addClass("btn-secondary");
        }

        // Add the "active" class and change to "btn-primary" class to the selected button
        $(`#history-${year}`).addClass("active btn-primary").removeClass("btn-secondary");

        // Update the progress bar width
        const progressBarWidth = (year - 1) * 33.33333333;
        $("#history-progress").css("width", `${progressBarWidth}%`);

        // Update the active year
        activeYear = year;
    }
});
