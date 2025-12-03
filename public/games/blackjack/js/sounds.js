let audio = false;
const hitSound = 'sounds/static_sounds_swish.m4a';
const winSound = 'sounds/static_sounds_cash.mp3';
const lossSound = 'sounds/static_sounds_aww.mp3';
function playSound(whichSound) {
    if (audio === true) {
        document.getElementById('audio').innerHTML = "<audio autoplay><source src='" + whichSound + "'></audio>";
    } else {
        document.getElementById('audio').innerHTML = "";
    }
}

function updateAudio() {
    if (audio === false) {
        audio = true;
        document.querySelector("i[data-sound]").dataset.sound = true;
    } else {
        audio = false;
        document.querySelector("i[data-sound]").dataset.sound = false;
    }
}
