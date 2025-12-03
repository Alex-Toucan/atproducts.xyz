
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

/*START THEMES*/
const themesList = ["Spacelab", "United", "Slate", "Cerulean", "Darkly", "Litera", "Materia", "Sandstone", "Superhero", "Cosmo", "Flatly", "Lumen", "Minty", "Simplex", "Solar", "Cyborg", "Journal", "Lux", "Pulse", "Sketchy", "Yeti", "Morph", "Quartz", "Vapor", "Zephyr"];
let chosenTheme;
let url = window.location;
let themeVal = {};
let themeOptions = "<option value='default'>Select Theme</option>";
let gaParam = "";
if (url.toString().indexOf("exclude") !== -1) {
    gaParam = "exclude=true&";
}
const gameLinks = [{ link: "https://aaronrs2002.github.io/black-jack/?" + gaParam + "theme=", game: "21" }, { link: "https://aaronrs2002.github.io/texas-holdem/?" + gaParam + "theme=", game: "Poker" },
{ link: "https://aaronrs2002.github.io/bingo/?" + gaParam + "theme=", game: "Bingo" },
{ link: "https://aaronrs2002.github.io/javascript-slot-machine/?" + gaParam + "theme=", game: "Slots" }, { link: "https://aaronrs2002.github.io/word-game/?" + gaParam + "theme=", game: "WordFun" }];

for (let i = 0; i < themesList.length; i++) {
    themeOptions = themeOptions + "<option value='" + themesList[i].toLocaleLowerCase() + "'>Theme: <span class='capitalize'>" + themesList[i] + "</span></option>";
}
document.getElementById("themes").innerHTML = themeOptions;

function changeTheme() {
    let gaParam = "";
    if (url.toString().indexOf("exclude") !== -1) {
        gaParam = "exclude=true";
    }
    let whichTheme = document.getElementById("themes").value;
    if (whichTheme === "default") {
        return false;
    } else {
        // document.getElementById("themedStyle").setAttribute("href", "https://bootswatch.com/5/" + whichTheme + "/bootstrap.css");
        chosenTheme = whichTheme.replace("https://bootswatch.com/5/", "").replace("/bootstrap.css");
        localStorage.setItem("theme", chosenTheme);
        //setGameLinks(chosenTheme);
        //  window.location = "?" + gaParam + "&theme=" + chosenTheme + "&balance=" + localStorage.getItem("balance") + "&";
        window.location = "?" + gaParam + "&theme=" + chosenTheme + "&";
    }

}
/*SPLIT PARAMS*/
(url + "?")
    .split("?")[1]
    .split("&")
    .forEach(function (pair) {
        pair = (pair + "=").split("=").map(decodeURIComponent);
        if (pair[0].length) {
            themeVal[pair[0]] = pair[1];
            if (pair[0] === "theme") {

                const themeFromUrl = "https://bootswatch.com/5/" + pair[1] + "/bootstrap.css";

                document.getElementById("themedStyle").setAttribute("href", themeFromUrl);
                localStorage.setItem("theme", pair[1]);
            }
            if (pair[0] === "balance") {
                localStorage.setItem("balance", pair[1].replace("#", ""));

            }

            if (pair[0] === "ytkey") {
                localStorage.setItem("ytkey", pair[1].replace("#", ""));

            }
        }
    });
let tempTheme = localStorage.getItem("theme");
if (localStorage.getItem("theme")) {

    let needAddress = "https://bootswatch.com/5/";
    if (localStorage.getItem("theme").indexOf("boot") !== -1) {
        needAddress = "";
    }
    setGameLinks(localStorage.getItem("theme"));

    if (tempTheme.indexOf("bootstrap.css") !== -1) {
        tempTheme = tempTheme.replace("/bootstrap.css", "");
    }

    document.getElementById("themedStyle").setAttribute("href", needAddress + tempTheme + "/bootstrap.css");
} else {
    setGameLinks("spacelab");
    localStorage.setItem("theme", "spacelab");
}
document.querySelector("#themes option:first-child").innerHTML = "Selected theme: " + tempTheme;
//END THEMES



function navigateGames(selected) {
    let balance = 500;
    let setTheme = "united";
    if (localStorage.getItem("theme")) {
        setTheme = localStorage.getItem("theme");
    }
    if (localStorage.getItem("balance")) {
        balance = localStorage.getItem("balance");
    }
    // window.location.href = gameLinks[selected].link + setTheme + "&balance=" + balance + "&";
    window.location.href = gameLinks[selected].link + setTheme + "&";
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

/*START NAVIGATING ANIMATION*/
function tadaRollover(element) {

    document
        .querySelector("[data-tada='" + element + "']")
        .classList.add("tada");
}
function tadaRollout(element) {
    document
        .querySelector("[data-tada='" + element + "']")
        .classList.remove("tada");
}


//START SOCIAL MEDIA
const socialMedia = [
    { link: "https://www.linkedin.com/in/aaronrs2002", theClass: "fab fa-linkedin", title: "My Linkedin Profile" },
    { link: "https://github.com/aaronrs2002", theClass: "fab fa-github", title: "My Open Source Library" },
    { link: "https://www.youtube.com/@web-presence-developer", theClass: "fab fa-youtube", title: "Learn how to write web applications!" },
    { link: "https://www.instagram.com/aaronrs2002/", theClass: "fab fa-instagram", title: "Payoff from a multimedia degree." },
    { link: "https://aaronrs2002.github.io/task-master/?", theClass: "fas fa-network-wired", title: "Networked serverless web apps for Workflow Management and Accounting" },
    { link: "    https://aaronrs2002.github.io/rss-aggregator/?", theClass: "fas fa-rss-square", title: "Free News Aggregator. Grab any public RSS feed and display it here without advertising and without your boss tracking you." },

    //{ link: "mailto:aaron@web-presence.biz", theClass: "far fa-paper-plane" }
    //    { title: "ticket management and accounting software by: Aaron Smith ", target: "_blank", url: "https://aaronrs2002.github.io/task-master/", iconClass: "fas fa-network-wired" },
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

//START GLOBAL ALERT
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

/*START GLOBAL ANY BET AMOUNT key up */
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