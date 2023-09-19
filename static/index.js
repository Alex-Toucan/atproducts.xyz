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
    for (let i = 1; i <= 4; i++) {
        if (i <= activeYear) {
            $(`#history-${i}`).addClass("btn-primary").removeClass("btn-secondary");
        } else {
            $(`#history-${i}`).addClass("btn-secondary").removeClass("btn-primary");
        }
    }
    updateTimeline(activeYear);

    // Add click event handlers to timeline buttons
    for (let i = 1; i <= 4; i++) {
        $(`#history-${i}`).click(function() {
            if (i == activeYear) return;

            if (i < activeYear) {
                // Clicking on years behind the active year, remove btn-primary
                for (let j = i + 1; j <= activeYear; j++) {
                    $(`#history-${j}`).removeClass("btn-primary").addClass("btn-secondary");
                }
            } else {
                // Clicking on a future year, remove btn-secondary
                for (let j = activeYear + 1; j <= i; j++) {
                    $(`#history-${j}`).removeClass("btn-secondary").addClass("btn-primary");
                }
            }
            
            updateTimeline(i);
        });
    }

    // Function to update the timeline based on the selected year
    function updateTimeline(year) {
        // Remove the "active" class from all buttons
        for (let i = 1; i <= 4; i++) {
            $(`#history-${i}`).removeClass("active");
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
