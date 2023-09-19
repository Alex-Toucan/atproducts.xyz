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

const progressBar = document.getElementById('history-progress');
const buttons = document.querySelectorAll('[id^=history-]');

buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const width = (index / (buttons.length - 1)) * 100;
      
    progressBar.style.width = width + '%';
    progressBar.setAttribute('aria-valuenow', width);
      
    buttons.forEach((btn) => {
      btn.classList.remove('btn-primary', 'btn-secondary');
      if (btn === button) {
        btn.classList.add(index < 2 ? 'btn-primary' : 'btn-secondary');
      }
    });
  });
});
