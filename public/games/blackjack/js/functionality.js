let tempCards = [];
let burnCard;
localStorage.setItem("cards", JSON.stringify(cards));
const originalCards = cards;
//SPLIT CARDS
let splitActive = false;
let confirmations = [];
let splitArr = [0, 0];
let playerTotal0 = 0;
let playerTotal1 = 0;
let splitCards0 = [];
let splitCards1 = [];
/*START DEALER VARIABLES*/
let dealerCards = [];
let dealerHTML = "";
let dealerTotal = 0;
/*START PLAYER VARIABLES*/
let playerCards = [];
let playerHTML = "";
let playerTotal = 0;
/*DOES NOT RESET AT DEAL*/
let playerMoney = 500;
if (localStorage.getItem("balance") && Number(localStorage.getItem("balance"))) {
    playerMoney = Number(localStorage.getItem("balance"));
}
document.querySelector("#playerMoney").innerHTML = playerMoney;
let bet = 0;
function setPlayerMoney(passPlayerMoney) {
    playerMoney = passPlayerMoney;
    document.getElementById("playerMoney").innerHTML = passPlayerMoney;
    document.querySelector("#playerMoney").innerHTML = passPlayerMoney;/*SAFARI BUG NEEDS BOTH*/
    localStorage.setItem("balance", passPlayerMoney);
}

/*END DOES NOT RESET AT DEAL*/
function enableBts() {
    /*forEach was not working*/
    document.querySelector("[alt='hit-split0']").disabled = false;
    document.querySelector("[alt='stay-split0']").disabled = false;
    document.querySelector("[alt='hit-split1']").disabled = false;
    document.querySelector("[alt='stay-split1']").disabled = false;
}

function showAlert(status, message, type) {
    document.getElementById("playBts").classList.add("hide");
    if (message === "default") {
        document.getElementById("status").classList.add("hide");
        document.getElementById("status").classList.remove("alert-danger");
        document.getElementById("status").classList.remove("alert-success");
    } else {
        document.getElementById("message").innerHTML = message;
        document.getElementById("status").classList.remove("hide");
        document.getElementById("status").classList.add(type);
        [].forEach.call(document.querySelectorAll('.dealAmt'), function (e) {
            e.disabled = false;
        });
    }
    if (status !== "split") {
        if (status === "win") {
            ckHighScore();

            if (document.querySelector("#status.alert-info")) {
                document.querySelector("#status").classList.remove("alert-info");
            }

            playerMoney = (playerMoney + bet);
            playSound(winSound);
        }
        if (status === "black-jack") {
            if (document.querySelector("#status.alert-info")) {
                document.querySelector("#status").classList.remove("alert-info");
            }
            playerMoney = (playerMoney + (bet * 1.5));
            playSound(winSound);
        }
        if (status === "lose") {
            playerMoney = (playerMoney - bet);
            playSound(lossSound);
        }
        setPlayerMoney(playerMoney);
    } else {
        setPlayerMoney(playerMoney);
    }
    document.querySelector("button[alt='split']").disabled = false;
    document.querySelector("button[alt='doubleD']").disabled = false;
    document.getElementById("splitPlayBts").classList.add("hide");
    let splitArr = [0, 0];
    enableBts();
    ckHighScore();
    return false;
}

function checkAces(cardObj) {
    let aces = [];
    let tempTotal = 0;
    for (let i = 0; i < cardObj.length; i++) {
        tempTotal = tempTotal + Number(cardObj[i].value);
        if (cardObj[i].title.indexOf("ace-") !== -1) {
            aces.push(10);
        }
    }
    for (let j = 0; j < aces.length; j++) {
        while (tempTotal > 21 && aces[j] === 10) {
            tempTotal = (tempTotal - 10);
            aces[j] = 0;
        }
    }
    return tempTotal;
}

function removeCards(dealerCards, playerCards) {
    tempCards = [];
    for (let i = 0; i < cards.length; i++) {
        if (dealerCards.indexOf(cards[i]) === -1 && playerCards.indexOf(cards[i]) === -1 && cards[i].title !== burnCard.title) {
            tempCards.push(cards[i]);
        }
    }
    cards = tempCards;
}

function ckInsurance(card1, card2) {
    setPlayerMoney(playerMoney - 5);
    if ((card1 + card2) === 21) {
        document.querySelector("[data-dealer='0']").classList.remove("hiddenDealerCard");
        document.querySelector("[data-dealer='0']").classList.add(dealerCards[0].title);
        document.getElementById("dealerTotal").innerHTML = "DEALER HAS 21. Good job insuring.";
        showAlert("insured", "DEALER HAS 21! Good thing you are insured.", "alert-danger");
    } else {
        document.getElementById("dealerTotal").innerHTML = "Dealer DOES NOT have 21. Let's play. Dealer has " + card2 + " showing.";
    }
}




function deal(playerBet) {
    if (playerBet === "any") {
        playerBet = Number(document.querySelector("[name='anyAmount']").value);
        document.getElementById("betAny").setAttribute("alt", playerBet);
        document.querySelector("[name='anyAmount']").value = "";
    }
    toggle("");
    enableBts();
    splitActive = false;
    splitCards0 = [];
    splitCards1 = [];
    confirmations = [];
    document.querySelector("#split0").innerHTML = "";
    document.querySelector("#split1").innerHTML = "";
    [].forEach.call(document.querySelectorAll('.dealAmt'), function (e) {
        e.classList.remove('active');
        e.disabled = true;
    });
    cards = JSON.parse(localStorage.getItem("cards"));
    document.querySelector(".dealAmt[alt='" + playerBet + "']").classList.add("active");
    bet = playerBet;
    document.getElementById("betTarget").innerHTML = "Bet: $" + bet;
    /*START RESET*/
    /*START DEALER VARIABLES*/
    dealerCards = [];
    dealerHTML = "";
    dealerTotal = 0;
    /*START PLAYER VARIABLES*/
    playerCards = [];
    playerHTML = "";
    playerTotal = 0;
    showAlert("default", "default", "hide");
    document.getElementById("playerTotal").innerHTML = playerTotal;
    document.getElementById("dealerTotal").innerHTML = dealerTotal;
    document.getElementById("dealerCards").innerHTML = "";
    document.getElementById("playerCards").innerHTML = "";
    document.getElementById("playerTotal").classList.add("hide");
    document.getElementById("dealerTotal").classList.add("hide");
    /*END RESET*/
    let randNumsArr = [];
    for (let i = 0; i < cards.length; i++) {
        while (randNumsArr.length < 6) {/*we burn the first card*/
            let newNum = cards[Math.floor(Math.random() * cards.length)];
            if (randNumsArr.indexOf(newNum) === -1) {
                randNumsArr.push(newNum);
            }
        }
    }
    burnCard = randNumsArr[0],
        dealerCards = [randNumsArr[1], randNumsArr[3]],
        playerCards = [randNumsArr[2], randNumsArr[4]];
    removeCards(dealerCards, playerCards);
    for (let i = 0; i < 2; i++) {
        if (i === 0) {
            dealerHTML = dealerHTML + "<div data-dealer='" + i + "' class='card  hiddenDealerCard'></div>";
        } else {
            dealerHTML = dealerHTML + "<div data-dealer='" + i + "' class='card " + dealerCards[i].title + "'></div>";
        }
        dealerTotal = dealerCards[1].value;
        if (dealerCards[1].value === 10 || dealerCards[1].value === 11) {
            console.log("Do you want insurance?");
            document.getElementById("dealerTotal").innerHTML = dealerTotal + " - Do you want $5 insurance? <a href='#' onClick='ckInsurance(" + [dealerCards[0].value, dealerCards[1].value] + ")'>YES</a>";
        } else {
            document.getElementById("dealerTotal").innerHTML = dealerTotal;
        }

    }
    for (let i = 0; i < 2; i++) {
        playerHTML = playerHTML + "<div data-player='" + i + "' class='card " + playerCards[i].title + "'></div>";
    }
    playerTotal = (Number(playerCards[0].value) + Number(playerCards[1].value));
    if (playerTotal === 22) {
        playerTotal = 12
    }
    if (playerTotal === 21) {
        document.getElementById("playBts").classList.add("hide");
        showAlert("black-jack", "BLACK JACK! ", "alert-success");
        document.getElementById("dealerTotal").innerHTML = dealerTotal;
    } else {
        document.getElementById("playBts").classList.remove("hide");
    }
    document.getElementById("playerTotal").innerHTML = playerTotal;
    document.getElementById("dealerCards").innerHTML = dealerHTML;
    document.getElementById("playerCards").innerHTML = playerHTML;
    document.getElementById("playerTotal").classList.remove("hide");
    document.getElementById("dealerTotal").classList.remove("hide");
}

function stay(whichHand) {    //START STAY()
    if (confirmations.indexOf(whichHand) === -1 && splitActive === true) {
        confirmations.push(whichHand);
        document.querySelector("[alt='hit-" + whichHand + "']").disabled = true;
        document.querySelector("[alt='stay-" + whichHand + "']").disabled = true;
    }
    if (confirmations.length === 2 || splitActive === false) {
        let tempMessage = "DEFAULT";
        showAlert("default", "DEFAULT", "hide");
        dealerHTML = "";
        for (let i = 0; i < dealerCards.length; i++) {
            dealerHTML = dealerHTML + "<div data-dealer='" + i + "' class='card " + dealerCards[i].title + "'></div>";
        }
        document.getElementById("dealerCards").innerHTML = dealerHTML;
        document.getElementById("dealerTotal").innerHTML = dealerTotal;
        document.querySelector("#playBts").classList.add("hide");
        dealerTotal = 0;
        for (let i = 0; i < dealerCards.length; i++) {
            dealerTotal = (Number(dealerTotal) + Number(dealerCards[i].value));
        }
        document.querySelector("#dealerTotal").innerHTML = dealerTotal;
    }

    function addcard() {
        //  tempCards = [];
        let randomNum = Math.floor(Math.random() * cards.length);
        dealerCards.push(cards[randomNum]);
        dealerHTML = dealerHTML + "<div data-dealer='" + dealerCards.length + "' class='card " + cards[randomNum].title + "'></div>";
        document.getElementById("dealerCards").innerHTML = dealerHTML;
        dealerTotal = (Number(dealerTotal) + Number(cards[randomNum].value));
        document.getElementById("dealerTotal").innerHTML = dealerTotal;
        removeCards(dealerCards, playerCards);
        dealerTotal = checkAces(dealerCards);
    }
    if (splitActive === true && confirmations.length === 2) {

        let splitArr = [Number(playerTotal0), Number(playerTotal1)];
        dealerTotal = checkAces(dealerCards);
        while (dealerTotal <= 16 && dealerTotal <= 21) {
            addcard();
        }
        let splitMessage = "";
        if (splitCards0.length === 2 && splitArr[0] === 21) {
            playerMoney = (playerMoney + (bet * .5));
        }
        if (splitCards1.length === 2 && splitArr[1] === 21) {
            playerMoney = (playerMoney + (bet * .5));
        }
        if (dealerTotal > 21 && splitArr[0] <= 21 && splitArr[1] <= 21) {
            showAlert("split", "YOU WON. DEALER BUSTED!", "alert-success");
            playerMoney = (playerMoney + bet + bet);
        }
        if (dealerTotal > 21 && splitArr[0] > 21 && splitArr[1] <= 21) {/*you broke even playerMoney stays the same*/
            showAlert("split", "YOU BUSTED HAND ONE THEN WON HAND 2. DEALER BUSTED!", "alert-success");
        }
        if (dealerTotal > 21 && splitArr[0] <= 21 && splitArr[1] > 21) {/*you broke even playerMoney stays the same*/
            showAlert("split", "YOU WON HAND ONE THEN BUSTED HAND 2. DEALER BUSTED!", "alert-success");
        }

        if (dealerTotal <= 21) {
            for (let i = 0; i < splitArr.length; i++) {
                if (dealerTotal < splitArr[i] && splitArr[i] <= 21) {
                    playerMoney = (playerMoney + bet);
                    splitMessage = splitMessage + "YOU WON HAND " + (i + 1) + ". ";
                }
                if (dealerTotal > splitArr[i] || splitArr[i] > 21) {
                    playerMoney = (playerMoney - bet);
                    splitMessage = splitMessage + "YOU LOST HAND " + (i + 1) + ". ";
                }
                if (dealerTotal === splitArr[i] && splitArr[i] <= 21) {
                    splitMessage = splitMessage + "YOU PUSHED HAND " + (i + 1) + ". ";
                }

            }
            showAlert("split", splitMessage, "alert-primary");
        }
        else if (splitArr[0] > 21 && splitArr[1] > 21 && splitMessage.length === 0) {
            showAlert("split", "YOU BUSTED BOTH HANDS!", "alert-danger");
            bet = bet + bet;
            playerMoney = (playerMoney - bet);
        }
        setPlayerMoney(playerMoney);

    }
    if (splitActive === false) {
        dealerTotal = Number(checkAces(dealerCards));
        while (dealerTotal <= 16 && dealerTotal <= 21) {
            addcard();
        }
        if (dealerTotal > 21) {
            if (dealerTotal < 17) {
                addcard();
            }
            if (dealerTotal > 21) {
                showAlert("win", "DEALER BUSTED. YOU WON!", "alert-success");
            }
        }
        if (dealerTotal <= 21 && dealerTotal > playerTotal) {
            showAlert("lose", "DEALER WON!", "alert-danger");
        }
        if (dealerTotal <= 21 && dealerTotal < playerTotal) {
            showAlert("win", "YOU WON!", "alert-success");
        }
        if (dealerTotal <= 21 && dealerTotal === playerTotal) {
            showAlert("default", "PUSH!", "alert-info");
        }
        document.getElementById("dealerTotal").innerHTML = dealerTotal;
    }//end if/else
}

function hit(whichHand) {
    playSound(hitSound);
    document.getElementById("dealerTotal").innerHTML = dealerTotal;
    document.querySelector("button[alt='split']").disabled = true;
    document.querySelector("button[alt='doubleD']").disabled = true;
    if (splitActive === false) {
        let randomNum = Math.floor(Math.random() * cards.length);
        playerCards.push(cards[randomNum]);
        playerHTML = playerHTML + "<div data-player='" + playerCards.length + "' class='card " + cards[randomNum].title + "'></div>";
        document.getElementById("playerCards").innerHTML = playerHTML;
        playerTotal = (Number(playerTotal) + Number(cards[randomNum].value));
        document.getElementById("playerTotal").innerHTML = playerTotal;
        removeCards(dealerCards, playerCards);
        playerTotal = checkAces(playerCards);

        if (playerTotal > 21) {
            document.getElementById("playerTotal").innerHTML = playerTotal;
            showAlert("lose", "YOU BUSTED. DEALER WON!", "alert-danger");
        } else {
            if (whichHand === "oneHitOnly") {
                stay("default");
            }
            document.getElementById("playerTotal").innerHTML = playerTotal;
        }

    } else {
        if (whichHand === "startSplit") {
            const tempNum0 = Math.floor(Math.random() * cards.length);
            const tempNum1 = Math.floor(Math.random() * cards.length);
            let preHTML0 = document.getElementById("split0").innerHTML;
            document.getElementById("split0").innerHTML = preHTML0 + "<div data-player='1' class='card " + cards[tempNum0].title + "'></div>";
            splitCards0.push(cards[tempNum0]);
            playerTotal0 = playerCards[0].value + Number(cards[tempNum0].value);
            playerTotal0 = checkAces([playerCards[0], cards[tempNum0]]);
            let preHTML1 = document.getElementById("split1").innerHTML;
            document.getElementById("split1").innerHTML = preHTML1 + "<div data-player='1' class='card " + cards[tempNum1].title + "'></div>";
            playerTotal1 = playerCards[1].value + Number(cards[tempNum1].value);
            playerTotal1 = checkAces([playerCards[1], cards[tempNum1]]);
            splitCards1.push(cards[tempNum1]);
            document.getElementById("playerTotal").innerHTML = playerTotal0 + " - " + playerTotal1;
        }
        //NEXT MOVE FOR SPLIT
        if (whichHand === "split0") {
            let split0Html = document.getElementById("split0").innerHTML
            const tempRandomCard = Math.floor(Math.random() * cards.length);
            let tempNew = split0Html + "<div data-player='1' class='card " + cards[tempRandomCard].title + "'></div>";
            splitCards0.push(cards[tempRandomCard]);
            document.getElementById("split0").innerHTML = tempNew;
            playerTotal0 = checkAces(splitCards0);
            removeCards(dealerCards, splitCards0);
            splitArr[0] = playerTotal0;
            document.getElementById("playerTotal").innerHTML = playerTotal0 + " - " + playerTotal1;
            if (playerTotal0 > 21) {
                document.querySelector("[alt='hit-split0']").disabled = true;
                stay('split0');
            }
            splitArr[0] = checkAces(splitCards0);
        }
        if (whichHand === "split1") {
            let split1Html = document.getElementById("split1").innerHTML
            const tempRandomCard = Math.floor(Math.random() * cards.length);
            let tepNew = split1Html + "<div data-player='1' class='card " + cards[tempRandomCard].title + "'></div>";
            splitCards1.push(cards[tempRandomCard]);
            document.getElementById("split1").innerHTML = tepNew;
            playerTotal1 = checkAces(splitCards1);
            removeCards(dealerCards, splitCards1);
            splitArr[1] = playerTotal1;
            document.getElementById("playerTotal").innerHTML = playerTotal0 + " - " + playerTotal1;
            if (playerTotal1 > 21) {
                document.querySelector("[alt='hit-split1']").disabled = true;
                stay('split1');
            }
            splitArr[0] = checkAces(splitCards0);
        }
    }
}

function split() {
    enableBts();
    splitActive = true;
    document.getElementById("playerCards").innerHTML = "";
    document.getElementById("playBts").classList.add("hide");
    document.getElementById("splitPlayBts").classList.remove("hide");
    document.getElementById("split0").innerHTML = "<div data-player='0' class='card " + playerCards[0].title + "'></div>";
    splitCards0.push(playerCards[0])
    document.getElementById("split1").innerHTML = "<div data-player='0' class='card " + playerCards[1].title + "'></div>";
    splitCards1.push(playerCards[1])
    hit("startSplit");
}

function doubleD() {
    bet = bet + bet;
    hit("oneHitOnly");
}
