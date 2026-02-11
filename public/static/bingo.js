document.addEventListener('DOMContentLoaded', function () {

    var infoBtn = document.getElementById('infoBtn');
    if (infoBtn) {
        new bootstrap.Tooltip(infoBtn, {
            title: 'Information',
            placement: 'bottom',
            trigger: 'hover'
        });
    }

    const startBtn = document.querySelector('.bingo-button');
    const stopBtn = document.querySelector('.stop-button');
    const resumeBtn = document.querySelector('.resume-button');
    const display = document.querySelector('.bingo-card');
    const soundBtn = document.querySelector('#soundBtn');
    const adjustBtn = document.querySelector('#adjustBtn');
    const bgBtn = document.querySelector('#chanBtn');
    const bgUpload = document.getElementById('bgUpload');

    let manualNextBtn = null;
    let usedNumbers = new Set();
    let autoInterval = null;
    let autoSpeed = 2000;
    let ttsEnabled = true;
    let gameStarted = false;

    function speak(text) {
        if (!ttsEnabled) return;

        speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);

        utter.rate = 1.25;
        utter.pitch = 1.0;

        setTimeout(() => {
            speechSynthesis.speak(utter);
        }, 1);
    }


    function nextNumber() {
        if (usedNumbers.size >= 75) {
            display.textContent = "All numbers used!";
            speak("All numbers used");
            return;
        }
        let num;
        do {
            num = Math.floor(Math.random() * 75) + 1;
        } while (usedNumbers.has(num));
        usedNumbers.add(num);
        display.textContent = num;
        speak(num.toString());
    }

    function startAuto() {
        stopAuto();
        autoInterval = setInterval(nextNumber, autoSpeed);
    }

    function stopAuto() {
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = null;
    }

    soundBtn.addEventListener('click', () => {
        ttsEnabled = !ttsEnabled;
        const icon = soundBtn.querySelector('i');
        const tooltip = bootstrap.Tooltip.getInstance(soundBtn);
        if (ttsEnabled) {
            icon.classList.remove('bi-volume-mute');
            icon.classList.add('bi-volume-up');
            soundBtn.setAttribute('data-bs-title', 'Toggle TTS Off');
            tooltip && tooltip.setContent({ '.tooltip-inner': 'Toggle TTS Off' });
        } else {
            icon.classList.remove('bi-volume-up');
            icon.classList.add('bi-volume-mute');
            soundBtn.setAttribute('data-bs-title', 'Toggle TTS On');
            tooltip && tooltip.setContent({ '.tooltip-inner': 'Toggle TTS On' });
        }
    });

    bgBtn.addEventListener('click', () => {
        document.getElementById('bgUpload').click();
    });

    bgUpload.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            document.body.style.backgroundImage = `url('${e.target.result}')`;
        };
        reader.readAsDataURL(file);
    });

    adjustBtn.addEventListener('click', () => {
        showAdjustMenu();
    });

    function showAdjustMenu() {
        const menu = document.createElement('div');
        menu.className = "position-absolute top-50 start-50 translate-middle bg-dark p-4 rounded shadow text-white";
        menu.style.zIndex = 2000;
        menu.innerHTML = `
            <h5 class="mb-3">Counting Options</h5>
            <label class="form-label">Speed (ms):</label>
            <select id="speedSelect" class="form-select mb-3">
                <option value="1000">1 second</option>
                <option value="2000" selected>2 seconds</option>
                <option value="3000">3 seconds</option>
                <option value="5000">5 seconds</option>
                <option value="10000">10 seconds</option>
            </select>
            <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="manualMode">
                <label class="form-check-label">Manual Mode</label>
            </div>
            <button class="btn btn-primary w-100 mb-2" id="applySettings">Apply</button>
            <button class="btn btn-secondary w-100" id="closeSettings">Close</button>
        `;
        document.body.appendChild(menu);
        document.getElementById('closeSettings').onclick = () => menu.remove();
        document.getElementById('applySettings').onclick = () => {
            autoSpeed = parseInt(document.getElementById('speedSelect').value, 10);
            const manual = document.getElementById('manualMode').checked;
            menu.remove();
            if (!gameStarted) return;
            if (manual) {
                stopAuto();
                enableManualButton();

                stopBtn.classList.add('d-none');
                resumeBtn.classList.add('d-none');
            } else {
                disableManualButton();
                startAuto();

                resumeBtn.classList.add('d-none');
                stopBtn.classList.remove('d-none');
            }

        };
    }

    function enableManualButton() {
        if (!manualNextBtn) {
            manualNextBtn = document.createElement('button');
            manualNextBtn.className = "btn btn-secondary position-absolute top-50 start-75 translate-middle-y ms-5";
            manualNextBtn.textContent = "Next";
            manualNextBtn.onclick = nextNumber;
            document.body.appendChild(manualNextBtn);
        }
    }

    function disableManualButton() {
        if (manualNextBtn) {
            manualNextBtn.remove();
            manualNextBtn = null;
        }
    }

    startBtn.addEventListener('click', () => {
        gameStarted = true;
        startBtn.classList.add('d-none');
        stopBtn.classList.remove('d-none');
        display.classList.remove('d-none');
        nextNumber();
        startAuto();
    });

    stopBtn.addEventListener('click', () => {
        stopAuto();
        disableManualButton();
        speak("Stopped");

        stopBtn.classList.add('d-none');
        resumeBtn.classList.remove('d-none');
    });

    resumeBtn.addEventListener('click', () => {
        startAuto();
        speak("Resuming");

        resumeBtn.classList.add('d-none');
        stopBtn.classList.remove('d-none');
    });

});
