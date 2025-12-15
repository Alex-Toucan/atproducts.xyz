/*FOOTER DATE*/
const idNum = "AIzaSyBxvGBPN_lRhoYskabk_lZ5FAo4GIowU6I"
const today = new Date();
let highScore = 0;
if (localStorage.getItem("highScore", highScore)) {
    highScore = Number(localStorage.getItem("highScore", highScore));
}

function ckHighScore() {
    let currentBalance = Number(localStorage.getItem("balance"));
    let highScore = Number(localStorage.getItem("highScore"));
    if (currentBalance > highScore) {
        localStorage.setItem("highScore", currentBalance);
        highScore = currentBalance;
    }
    document.getElementById("highScoreTarget").innerHTML = "Your High Score: $" + highScore;
}
if (document.getElementById("highScoreTarget")) {
    ckHighScore();
}

document.getElementById("year").innerHTML = "<i><small><a href='https://web-presence.biz/?src=web-presence-games#contact' class='text-primary' target='_bank'><i class='fas fa-paper-plane'></i> Contact me.</a></small></i>";

/*GAME LINKS*/
let url = window.location;
let gaParam = "";
if (url.toString().indexOf("exclude") !== -1) {
    gaParam = "exclude=true&";
}
const gameLinks = [
    { link: "https://aaronrs2002.github.io/black-jack/?" + gaParam, game: "21" },
    { link: "https://aaronrs2002.github.io/texas-holdem/?" + gaParam, game: "Poker" },
    { link: "https://aaronrs2002.github.io/bingo/?" + gaParam, game: "Bingo" },
    { link: "https://aaronrs2002.github.io/javascript-slot-machine/?" + gaParam, game: "Slots" },
    { link: "https://aaronrs2002.github.io/word-game/?" + gaParam, game: "WordFun" }
];

function navigateGames(selected) {
    let balance = 500;
    if (localStorage.getItem("balance")) {
        balance = localStorage.getItem("balance");
    }
    window.location.href = gameLinks[selected].link + "balance=" + balance + "&";
}

function setGameLinks() {
    let gameHTML = "";
    for (let i = 0; i < gameLinks.length; i++) {
        let active = "";
        let hrefStr = gameLinks[i].game.toLowerCase();
        let color = "warning";
        if (hrefStr === "21") hrefStr = "black-jack";
        if (hrefStr === "wordfun") hrefStr = "word-";
        if (hrefStr === "slots") hrefStr = "javascript-slot-machine";
        if (url.toString().indexOf("poker") !== -1 && gameLinks[i].game === "Poker") {
            active = "active";
            color = "primary";
        }
        if (url.toString().indexOf("texas-holdem") !== -1 && gameLinks[i].game == "Poker") {
            active = "active";
            color = "primary";
        }
        if (url.toString().indexOf(hrefStr) !== -1) {
            active = "active";
            color = "primary";
        }
        gameHTML = gameHTML + "<button onClick='javascript:navigateGames(" + i + ")' class='btn btn-" + color + " " + active + "'>" + gameLinks[i].game + "</button>";
    }

    if (document.querySelector("#gameLinks")) {
        document.querySelector("#gameLinks").innerHTML = gameHTML;
    }
}
setGameLinks();

/*START NAVIGATING ANIMATION*/
function tadaRollover(element) {
    document.querySelector("[data-tada='" + element + "']").classList.add("tada");
}
function tadaRollout(element) {
    document.querySelector("[data-tada='" + element + "']").classList.remove("tada");
}

/*START SOCIAL MEDIA*/
const socialMedia = [
    { link: "https://www.linkedin.com/in/aaronrs2002", theClass: "fab fa-linkedin", title: "My Linkedin Profile" },
    { link: "https://github.com/aaronrs2002", theClass: "fab fa-github", title: "My Open Source Library" },
    { link: "https://www.youtube.com/@web-presence-developer", theClass: "fab fa-youtube", title: "Learn how to write web applications!" },
    { link: "https://www.instagram.com/aaronrs2002/", theClass: "fab fa-instagram", title: "Payoff from a multimedia degree." },
    { link: "https://aaronrs2002.github.io/task-master/?", theClass: "fas fa-network-wired", title: "Networked serverless web apps for Workflow Management and Accounting" },
    { link: "https://aaronrs2002.github.io/rss-aggregator/?", theClass: "fas fa-rss-square", title: "Free News Aggregator. Grab any public RSS feed and display it here without advertising and without your boss tracking you." }
];

let socialHTML = "";
for (let i = 0; i < socialMedia.length; i++) {
    socialHTML = socialHTML + `<a class="p-2 text-primary"  href="${socialMedia[i].link + (socialMedia[i].link.indexOf("?") !== -1 ? gaParam : "")
        }" target="_blank" title="${socialMedia[i].title}" ><i class="${socialMedia[i].theClass
        } animated"  onmouseover="javascript:tadaRollover('${socialMedia[i].theClass
        }')" onmouseout="javascript:tadaRollout('${socialMedia[i].theClass
        }')" data-tada="${socialMedia[i].theClass
        }"></i></a>`;
}
document.querySelector("#socialList").innerHTML = socialHTML;

/*START GLOBAL ALERT*/
function globalAlert(alertLevel, message) {
    document.getElementById("globalAlert").classList.remove("hide");
    document.getElementById("globalAlert").classList.add(alertLevel);
    document.getElementById("globalAlert").classList.add("animated");
    document.getElementById("globalAlert").innerHTML = message;

    setTimeout(function () {
        document.getElementById("globalAlert").classList.add("hide");
        document.getElementById("globalAlert").classList.remove(alertLevel);
    }, 5000);
}

function focusOnField(whichField) {
    document.querySelector("[name='" + whichField + "']").focus();
}

/*START GLOBAL ANY BET AMOUNT key up*/
function updateBetAny() {
    let anyNum = document.querySelector("[name='anyAmount']").value;
    if (anyNum < 0) {
        globalAlert("alert-warning", "Bet with a number above zero.");
        document.querySelector("[name='anyAmount']").value = anyNum.replaceAll("-", "");
        return false;
    }
    document.getElementById("betAny").setAttribute("alt", anyNum);
}

/*START GLOBAL TOGGLE FUNCTION*/
function toggle(element) {
    [].forEach.call(document.querySelectorAll("[data-toggle]"), function (e) {
        e.classList.add("hide");
    });

    [].forEach.call(document.querySelectorAll("[data-toggle='" + element + "']"), function (e) {
        e.classList.remove("hide");
    });
}
/*END GLOBAL TOGGLE FUNCTION*/
