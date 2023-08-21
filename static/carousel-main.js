$(function () {
    $('.carousel-main').carousel({
        pause: "false"
    });

    $('.playButton').click(function () {
        $('.carousel-main').carousel('cycle');
    });
    $('.pauseButton').click(function () {
        $('.carousel-main').carousel('pause');
    });
});
