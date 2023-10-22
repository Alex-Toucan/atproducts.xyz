
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

$(function () {
    // Initialize the active button and set btn-primary for past years
    let activeYear = 1;

    updateTimeline(activeYear);

    let isDebounced = false;
    let debounceTimeout;

    // Add click event handlers to timeline buttons
    for (let i = 1; i <= 4; i++) {
        $(`#history-${i}`).click(() => {
            if (!isDebounced) {
                updateTimeline(i);
                debounceEvent();
            }
        });
    }

    document.addEventListener("keydown", event => {
        if (!isDebounced) {
            switch (event.code) {
                case "ArrowLeft":
                    updateTimeline(activeYear - 1);
                    break;
                
                case "ArrowRight":
                    updateTimeline(activeYear + 1);
                    break;
            }
            debounceEvent();
        }
    });

    function debounceEvent() {
        isDebounced = true;
        debounceTimeout = setTimeout(() => {
            isDebounced = false;
        }, 500); // Adjust the debounce time as needed
    }

    // Function to update the timeline based on the selected year
    function updateTimeline(year) {
        // Make sure year is within the min and max
        year = Math.min(Math.max(year, 1), 4);

        if (year === activeYear) return;

        // Remove the "active" class from all buttons
        for (let i = 1; i <= 4; i++) {
            $(`#history-${i}`).toggleClass("active", i === year).toggleClass("btn-secondary", i > year).toggleClass("btn-primary", i <= year);
            $(`#history-${i}-pane`).toggleClass("active", i === year).removeClass("show");
        }

        setTimeout(() => {
            $(`#history-${year}-pane`).addClass("show");  
        }, 50);

        // Update the progress bar width
        const progressBarWidth = (year - 1) * 33.33333333;
        $("#history-progress").css("width", `${progressBarWidth}%`);

        // Update the active year
        activeYear = year;
    }
});
