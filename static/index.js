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

$(document).ready(function () {
  // Initialize the active button and set btn-primary for past years
  let activeYear = 1;

  updateTimeline(activeYear);

  // Add click event handlers to timeline buttons
  for (let i = 1; i <= 4; i++) {
    $(`#history-${i}`).click(function () {
      if (i == activeYear) return;

      updateTimeline(i);
    });
  }

  // Add keyboard event listeners for arrow keys
  $(document).keydown(function (e) {
    if (e.which === 37 || e.which === 39) {
      // Left or Right arrow key
      e.preventDefault(); // Prevent scrolling on arrow key press
      const direction = e.which === 37 ? -1 : 1;
      navigateTimeline(direction);
    }
  });

  // Add keyboard event listener for tab key
  $(document).keydown(function (e) {
    if (e.which === 9) {
      // Tab key
      $(document).on('keyup.tab', function (e) {
        if (e.which === 9) {
          e.preventDefault(); // Prevent default tab behavior
          navigateTimeline(1);
          $(document).off('keyup.tab'); // Remove the event listener after handling the tab key
        }
      });
    }
  });

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

  // Function to navigate the timeline using arrow keys
  function navigateTimeline(direction) {
    const newYear = Math.min(Math.max(activeYear + direction, 1), 4);
    if (newYear !== activeYear) {
      updateTimeline(newYear);
    }
  }
});
