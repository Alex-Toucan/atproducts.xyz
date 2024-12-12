// Carousel play/pause
var playButton = document.querySelector(".playButton");
var pauseButton = document.querySelector(".pauseButton");
var nextButton = document.querySelector(".carousel-control-next");
var previousButton = document.querySelector(".carousel-control-prev");
var carouselMain = document.querySelector(".carousel-main");
var slidebtn = document.querySelectorAll(".slidebtn");

$(function () {
    $(carouselMain).carousel({
        pause: "false",
	ride: "true"
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

// History Tabs
$(document).ready(function() {
  // Initialize the active button and set btn-primary for past years
  let activeYear = 1;
  const yearButtons = $("#history-buttons button");
  const totalYears = yearButtons.length;

  updateTimeline(activeYear);

  // Add click event handlers to timeline buttons
  yearButtons.each((index, button) => {
    $(button).click(() => updateTimeline(index + 1));
  });

  const debounce = 500;
  let isDebounced = false;
  let debounceTimeout;

  document.addEventListener("keydown", event => {
    if (isDebounced) return;
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
    if (event.code != "ArrowLeft" && event.code != "ArrowRight") return;
    if (!debounceTimeout) return;
    debounceTimeout = clearTimeout(debounceTimeout);
    isDebounced = false;
  });

  // Function to update the timeline based on the selected year
  function updateTimeline(year) {
    // Make sure year is within the min and max
    year = Math.min(Math.max(year, 1), totalYears);
    if (year == activeYear) return;

    // Remove the "active" class from all buttons and update classes
    yearButtons.each((index, button) => {
      $(button).toggleClass("active", index + 1 == year)
        .toggleClass("btn-secondary", index + 1 > year)
        .toggleClass("btn-primary", index + 1 <= year);
      $(`#history-${index + 1}-pane`).toggleClass("active", index + 1 == year).removeClass("show");
    });

    setTimeout(() => {
      $(`#history-${year}-pane`).addClass("show");
    }, 50);

    // Update the progress bar width
    const progressBarWidth = (year - 1) * (100 / (totalYears - 1));
    $("#history-progress").css("width", `${progressBarWidth}%`);

    // Update the active year
    activeYear = year;
  }
});
