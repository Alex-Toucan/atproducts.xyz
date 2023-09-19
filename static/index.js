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

// Get references to the progress bar and buttons
const progressBar = document.getElementById('history-progress');
const buttons = document.querySelectorAll('[id^=history-]');

// Add a click event listener to each button
buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    // Calculate the width for the progress bar based on the button index
    const width = (index / (buttons.length - 1)) * 100;
    
    // Update the progress bar width and aria-valuenow attribute
    progressBar.style.width = width + '%';
    progressBar.setAttribute('aria-valuenow', width);
    
    // Update the active button styling
    buttons.forEach((btn, btnIndex) => {
      if (btnIndex <= index) {
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-secondary');
      } else {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
      }
    });
  });
});
