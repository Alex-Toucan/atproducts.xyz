localStorage.setItem("completeCards", JSON.stringify(cards));
const handHeirarchy = ["high-card", "pair", "two-pairs", "three-of-a-kind", "straight", "flush", "full-house", "four-of-a-kind", "straight-flush", "royal-flush"];
const cardHeirarchy = ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"];
const suitArr = ["diamonds", "hearts", "clubs", "spades"];
let usedCardsArr = [];
let player0Obj;
let player1Obj;
let player2Obj;
let player3Obj;
let activeRound = 1;
let bestHandIndex = 0;
let resultList = [0, 0, 0, 0];
let compareCards = [0, 0, 0, 0];
let replaceAttempts = 0;
let playerCardsInvolved = "";
let playerHighCard = "";
let topHand;
let countingIterations = 0;

/*DOES NOT RESET AT DEAL*/
let betPaid = false;
let playerMoney = 500;
if (localStorage.getItem("balance") && Number(localStorage.getItem("balance"))) {
    playerMoney = Number(localStorage.getItem("balance"));
}
document.querySelector("#playerMoney").innerHTML = playerMoney;
let bet = 0;
function setPlayerMoney(passPlayerMoney) {
    playerMoney = passPlayerMoney;
    playerMoney = Math.round(playerMoney);
    document.getElementById("playerMoney").innerHTML = passPlayerMoney;
    document.querySelector("#playerMoney").innerHTML = passPlayerMoney;/*SAFARI BUG NEEDS BOTH*/
    localStorage.setItem("balance", passPlayerMoney);
    ckHighScore();
}
function enablePlayBts() {
    [].forEach.call(document.querySelectorAll('.dealAmt'), function (e) {
        e.disabled = false;
    });
}
function showAlert(status, message, player) {
    if (message.indexOf("It's a draw so far. Replace") === -1) {
        document.getElementById("foldBt").classList.add("hide");
    }
    if (replaceAttempts === 5 || document.querySelector(".alert-success[data-player='0']") !== null) {
        enablePlayBts();
    }
    if (message.indexOf("You won $") !== -1) {
        if (betPaid === false) {
            if (activeRound === 1 && countingIterations === 3) {
                playerMoney = playerMoney + bet;
            }
            if (activeRound === 2) {
                playerMoney = playerMoney + bet;
            }
            setPlayerMoney(playerMoney);
            betPaid = true;
        }
        //enablePlayBts();
        [].forEach.call(document.querySelectorAll(".card span.badge"), function (e) {
            e.classList.add("hide");
        });
    }
    document.getElementById("status").classList.remove("alert-success");
    document.getElementById("status").classList.remove("alert-danger");
    document.getElementById("status").classList.remove("hide");
    document.getElementById("status").classList.add(status);
    document.getElementById("message").innerHTML = message;
    return false;

}

function evaluateHand(iteration) {
    countingIterations = iteration;
    if (replaceAttempts === 0) {/*trying to fix a bug that keeps these hiiden*/
        [].forEach.call(document.querySelectorAll("span.badge[data-replace]"), function (e) {
            e.classList.remove("hide");
        });
    }
    bestHandIndex = 0;
    let cardsInvolved = "";
    let cardIndexes = [];
    const playersHands = [player0Obj, player1Obj, player2Obj, player3Obj]
    const cardsArr = [playersHands[iteration][0], playersHands[iteration][1], playersHands[iteration][2], playersHands[iteration][3], playersHands[iteration][4]];
    let highCard;
    let flush = false;
    let straight = false;
    let spades = 0;
    let hearts = 0;
    let diamonds = 0;
    let clubs = 0;
    let two = 0;
    let three = 0;
    let four = 0;
    let five = 0;
    let six = 0;
    let seven = 0;
    let eight = 0;
    let nine = 0;
    let ten = 0;
    let jack = 0;
    let queen = 0;
    let king = 0;
    let ace = 0;
    for (let i = 0; i < cardsArr.length; i++) {
        cardIndexes.push(cardHeirarchy.indexOf(cardsArr[i].value));
        if (cardsArr[i].value === "ace") {
            cardIndexes.push(-1);/*aces need representation for a straight ace to 4 concept. -1 will work because 2 is represented as 0. this is just used for determining a straight*/
        }
        if (cardsArr[i].value === "two") {
            two = two + 1;
        }
        if (cardsArr[i].value === "three") {
            three = three + 1;
        }
        if (cardsArr[i].value === "four") {
            four = four + 1;
        }
        if (cardsArr[i].value === "five") {
            five = five + 1;
        }
        if (cardsArr[i].value === "six") {
            six = six + 1;
        }
        if (cardsArr[i].value === "seven") {
            seven = seven + 1;
        }
        if (cardsArr[i].value === "eight") {
            eight = eight + 1;
        }
        if (cardsArr[i].value === "nine") {
            nine = nine + 1;
        }
        if (cardsArr[i].value === "ten") {
            ten = ten + 1;
        }
        if (cardsArr[i].value === "jack") {
            jack = jack + 1;
        }
        if (cardsArr[i].value === "queen") {
            queen = queen + 1;
        }
        if (cardsArr[i].value === "king") {
            king = king + 1;
        }
        if (cardsArr[i].value === "ace") {
            ace = ace + 1;
        }
        if (cardsArr[i].suit === "spades") {  /*determine same suits*/
            spades = spades + 1;
        }
        if (cardsArr[i].suit === "hearts") {
            hearts = hearts + 1;
        }
        if (cardsArr[i].suit === "diamonds") {
            diamonds = diamonds + 1;
        }
        if (cardsArr[i].suit === "clubs") {
            clubs = clubs + 1;
        }
    }
    if (spades === 5 || hearts === 5 || diamonds === 5 || clubs === 5) {    /*DETERMINE A flush*/
        flush = true;
        if (bestHandIndex < 5) {
            bestHandIndex = 5;
        }
    }
    cardIndexes = cardIndexes.sort(((a, b) => a - b));
    var results = [];
    for (var i = 0; i < cardIndexes.length; i++) {    /*DETERMINE A STRIGHT*/
        if (cardIndexes[i + 1] == cardIndexes[i] + 1 && cardIndexes[i + 2] == cardIndexes[i] + 2 && cardIndexes[i + 3] == cardIndexes[i] + 3 && cardIndexes[i + 4] == cardIndexes[i] + 4) {
            results.push(i);
            compareCards[iteration] = i;
            while (cardIndexes[i] + 1 == cardIndexes[i + 1])
                i++;
        }
    }
    if (results.length > 0) {
        if (bestHandIndex < 4) {
            bestHandIndex = 4;
            straight = true;
        }

    }
    let valueArr = [two, three, four, five, six, seven, eight, nine, ten, jack, queen, king, ace]; /*Determine matching values*/
    let pairQty = 0;
    let tripleQty = 0;
    for (let i = 0; i < valueArr.length; i++) {
        if (valueArr[i] > 0) {/*determine highest card*/
            highCard = cardHeirarchy[i];
            compareCards[iteration] = i;
        }
        if (valueArr[i] === 2) {
            if (bestHandIndex < 1) {
                bestHandIndex = 1;
            }
            pairQty = pairQty + 1;
            cardsInvolved = cardsInvolved + " - " + cardHeirarchy[i] + "s";
        }
        if (valueArr[i] == 3) {
            if (bestHandIndex < 3) {
                bestHandIndex = 3;
            }
            tripleQty = tripleQty + 1;
            cardsInvolved = cardsInvolved + " - " + cardHeirarchy[valueArr.lastIndexOf(3)] + "s";
        }
        if (valueArr[i] == 4) {
            if (bestHandIndex < 7) {
                bestHandIndex = 7;
            }
            cardsInvolved = cardsInvolved + " - " + cardHeirarchy[valueArr.lastIndexOf(4)] + "s";
        }
    }
    if (valueArr.indexOf(2) !== -1) {
        compareCards[iteration] = valueArr.lastIndexOf(2);
    }
    if (valueArr.indexOf(3) !== -1) {
        compareCards[iteration] = valueArr.lastIndexOf(3);
    }
    if (valueArr.indexOf(4) !== -1) {
        compareCards[iteration] = valueArr.lastIndexOf(4);
    }
    if (pairQty == 2) { /*checking for 2 pair*/
        if (bestHandIndex < 2) {
            bestHandIndex = 2;
        }
    }
    if (pairQty == 1 && tripleQty == 1) {    /*checking for full house*/
        if (bestHandIndex < 6) {
            bestHandIndex = 6;
        }
    }
    if (flush === true && straight === true) {/*checking for straight flush*/
        if (bestHandIndex < 8) {
            bestHandIndex = 8;
        }
    }
    if (flush === true && straight === true && valueArr[Number(valueArr.length) - 1] > 0) {  /*checking for royal flush (valueArr[Number(valueArr.length) - 1] is an ace)*/
        if (bestHandIndex < 9) {
            bestHandIndex = 9;
        }
    }
    resultList[Number(iteration)] = bestHandIndex;
    const playersDetails = ["playerHandDetails", "playerTwoHandDetails", "playerThreeHandDetails", "playerFourHandDetails"];
    document.getElementById(playersDetails[iteration]).classList.remove("hide");
    let HighCardMessage = "";
    if (handHeirarchy[resultList[Number(iteration)]] === "high-card") {
        HighCardMessage = " <small><i>(" + highCard + " is player " + (iteration + 1) + "'s highest card)</i></small>";
    }
    if (iteration === 0) {
        playerCardsInvolved = cardsInvolved;
        playerHighCard = highCard;

        document.getElementById(playersDetails[iteration]).innerHTML = "You have: " + handHeirarchy[resultList[Number(iteration)]] + "  " + cardsInvolved + HighCardMessage;
    } else {
        document.getElementById(playersDetails[iteration]).innerHTML = "<i class='fas fa-user'></i> " + handHeirarchy[resultList[Number(iteration)]] + "  " + cardsInvolved + HighCardMessage;
    }
    document.getElementById(playersDetails[iteration]).classList.remove("hide");
    if (iteration === 0) {
        resultList[0] = Number(bestHandIndex);
    }
    if (iteration === 3 || activeRound === 2) {
        let winningHand = Math.max(...resultList);
        topHand = resultList.indexOf(winningHand);
        /*we only want to count the winning cards of the wnning hand*/
        for (let i = 0; i < resultList.length; i++) {
            if (resultList[i] !== winningHand) {
                compareCards[i] = -1;
            }
        }
        let winningCard = Math.max(...compareCards);
        /*start how many times number in array*/
        function getOccurrence(resultList, value) {
            var count = 0;
            resultList.forEach((v) => (v === value && count++));
            return count;
        }
        if (getOccurrence(resultList, winningHand) > 1 && iteration === 3) {
            if (getOccurrence(compareCards, winningCard) === 1) {
                winningCard = Math.max(...compareCards);
                topHand = compareCards.indexOf(winningCard);
            }
        }
        [].forEach.call(document.querySelectorAll(".alert[data-player]"), function (e) {
            e.classList.add("alert-info");
            e.classList.remove("alert-success");
        });
        if (getOccurrence(compareCards, winningCard) > 1) {
            if (replaceAttempts === 5 && compareCards[0] === winningCard) {
                showAlert("alert-danger", "It's a draw. Place your bet.");
                return false;
            }
            if (replaceAttempts !== 5 && compareCards[0] === winningCard) {
                document.getElementById("foldBt").classList.remove("hide");
                showAlert("alert-danger", "It's a draw so far. Replace some of your cards to get the win.<br/>Each card replacement ups your bet by 1/5th");
                return false;
            }
        }
        if (replaceAttempts === 5 && compareCards[0] !== winningCard) {
            playerMoney = playerMoney - bet;
            setPlayerMoney(playerMoney);
            bet = Math.round(bet);
            document.querySelector("[data-player='" + compareCards.indexOf(winningCard) + "']").classList.remove("alert-info");
            document.querySelector("[data-player='" + compareCards.indexOf(winningCard) + "']").classList.add("alert-success");
            showAlert("alert-danger", "All out of chances. You lost $" + bet, iteration);
            return false;
        }
        if (replaceAttempts === 5 && compareCards[0] === winningCard) {
            if (activeRound === 2) {
                document.querySelector("[data-player='0']").classList.remove("alert-info");
                document.querySelector("[data-player='0']").classList.add("alert-success");
                showAlert("alert-success", "You just barely won $" + bet, iteration);
                return false;
            }
        }
        if (compareCards[0] === winningCard) {
            document.querySelector("[data-player='0']").classList.remove("alert-info");
            document.querySelector("[data-player='0']").classList.add("alert-success");
            showAlert("alert-success", "You won $" + bet + " with " + handHeirarchy[resultList[0]] + "  " + playerCardsInvolved + " <small><i>(" + playerHighCard + " is your highest card)</i></small>", iteration);
        } else {
            document.querySelector("[data-player='" + compareCards.indexOf(winningCard) + "']").classList.remove("alert-info");
            document.querySelector("[data-player='" + compareCards.indexOf(winningCard) + "']").classList.add("alert-success");
            let handToBeat = document.querySelector(".alert-success[data-player]").innerHTML.substring(document.querySelector(".alert-success[data-player]").innerHTML.indexOf(">") + 1, document.querySelector(".alert-success[data-player]").innerHTML.length);
            if (replaceAttempts !== 5) {
                showAlert("alert-danger", "You're down. Replace some cards to win.<br/>Hand to beat: " + handToBeat + "<br/>Each card replacement ups your bet by 1/5th", iteration);
                document.getElementById("foldBt").classList.remove("hide");
            }
        }
    }
}

function clear() {
    document.getElementById("playerHandDetails").classList.add("hide");
    document.getElementById("playerTwoHandDetails").classList.add("hide");
    document.getElementById("playerThreeHandDetails").classList.add("hide");
    document.getElementById("playerFourHandDetails").classList.add("hide");
    document.getElementById("playerFourCards").innerHTML = "";
    document.getElementById("playerThreeCards").innerHTML = "";
    document.getElementById("playerTwoCards").innerHTML = "";
    document.getElementById("playerCards").innerHTML = "";
    document.getElementById("status").classList.add("hide");
}

function fold() {
    enablePlayBts();
    playerMoney = playerMoney - bet;
    setPlayerMoney(playerMoney);
    bet = Math.round(bet);
    [].forEach.call(document.querySelectorAll('.dealAmt'), function (e) {
        e.disabled = false;
    });
    showAlert("alert-danger", "Folded.", 0);
    document.getElementById("betTarget").innerHTML = "Folded. You lost $" + bet + ". Place your bet.";
    clear();
    window.location = "#";
}

function generate(activeCards) {
    return Math.floor(Math.random() * activeCards.length);
}

function play(playerBet) {
    if (playerBet === "any") {
        playerBet = Number(document.querySelector("[name='anyAmount']").value);
        document.getElementById("betAny").setAttribute("alt", playerBet);
        document.querySelector("[name='anyAmount']").value = "";
    }
    toggle("");





    topHand;
    document.getElementById("foldBt").classList.add("hide");
    window.location = "#playerCards";
    activeRound = 1;
    countingIterations = 0;
    replaceAttempts = 0;
    betPaid = false;
    [].forEach.call(document.querySelectorAll('.dealAmt'), function (e) {
        e.disabled = true;
    });
    clear();
    bet = playerBet;
    bet = Math.round(bet);
    document.getElementById("betTarget").innerHTML = "Bet $" + bet;
    [].forEach.call(document.querySelectorAll(".alert[data-player]"), function (e) {
        e.classList.add("alert-info");
        e.classList.remove("alert-success");
    });
    bestHandIndex = 0;
    cards = JSON.parse(localStorage.getItem("completeCards"));
    let activeCards = cards;
    usedCardsArr = [];
    function generatePlayer(iteration) {
        cardsInvolved = "";
        let playersCards = [];
        let playerCardsHTML = "";
        while (playersCards.length < 5) {
            let genNumber = generate(activeCards);
            if (usedCardsArr.indexOf(activeCards[genNumber].title) === -1) {
                if (iteration !== 0) {
                    playerCardsHTML = playerCardsHTML + "<div class='card " + activeCards[genNumber].title + "' ></div>";
                } else {
                    playerCardsHTML = playerCardsHTML + `<div class='card ${activeCards[genNumber].title}' ><span class='badge text-bg-success pointer d-flex justify-content-center' data-replace='${playersCards.length}'
                    onClick='javascript:replace("${activeCards[genNumber].title}",${Number(playersCards.length)})'>Replace</span></div>`;
                }
                playersCards.push(cards[genNumber].title);
                usedCardsArr.push(cards[genNumber].title);
            }
        }
        let handObj = [];
        for (let i = 0; i < playersCards.length; i++) {
            handObj.push({
                suit: playersCards[i].substring(playersCards[i].indexOf("-") + 1, playersCards[i].length),
                value: playersCards[i].substring(0, playersCards[i].indexOf("-"))
            });
        }
        /*ace - 4 straight example: player1Obj = [{ "suit": "clubs", "value": "two" }, { "suit": "diamonds", "value": "three" }, { "suit": "hearts", "value": "ace" }, { "suit": "diamonds", "value": "five" }, { "suit": "diamonds", "value": "four" }];*/
        if (iteration === 0) {
            document.getElementById("playerCards").innerHTML = playerCardsHTML;
            player0Obj = handObj;
            [].forEach.call(document.querySelectorAll("span.badge[data-replace]"), function (e) {
                e.classList.remove("hide");
            });
        }
        if (iteration === 1) {
            document.getElementById("playerTwoCards").innerHTML = playerCardsHTML;
            player1Obj = handObj;
        }
        if (iteration === 2) {
            document.getElementById("playerThreeCards").innerHTML = playerCardsHTML;
            player2Obj = handObj;
        }
        if (iteration === 3) {
            document.getElementById("playerFourCards").innerHTML = playerCardsHTML;
            player3Obj = handObj;
        }
        evaluateHand(iteration);
    }

    for (let i = 0; i < 4; i++) {
        generatePlayer(i);
    }
}

function replace(cardTitle, cardNum) {
    let oneFithBet = bet / 5;
    bet = bet + oneFithBet;
    bet = Math.round(bet);
    document.getElementById("betTarget").innerHTML = "Bet $" + bet;
    replaceAttempts = replaceAttempts + 1;
    document.querySelector("span[data-replace='" + cardNum + "']").classList.add("hide");
    document.getElementById("playerHandDetails").classList.remove("alert-success");
    document.getElementById("playerHandDetails").classList.add("alert-info");
    activeRound = 2;
    let tempHand = player0Obj;
    let availableCards = [];
    const allCards = JSON.parse(localStorage.getItem("completeCards"));
    for (let i = 0; i < allCards.length; i++) {
        if (usedCardsArr.indexOf(allCards[i].title) === -1) {
            availableCards.push(allCards[i].title);
        }
    }
    const newNum = generate(availableCards);
    for (let i = 0; i < tempHand.length; i++) {
        if (tempHand[i].value + "-" + tempHand[i].suit === cardTitle) {
            tempHand[i] = {
                suit: availableCards[newNum].substring(availableCards[newNum].indexOf("-") + 1, availableCards[newNum].length),
                value: availableCards[newNum].substring(0, availableCards[newNum].indexOf("-"))
            }
            usedCardsArr.push(availableCards[newNum])
            document.querySelector("." + cardTitle).classList.add(availableCards[newNum]);
            document.querySelector("." + cardTitle).classList.remove(cardTitle);
        }
    }
    let tempAvailable = [];
    for (let i = 0; i < availableCards.length; i++) {
        if (i !== Number(newNum)) {
            tempAvailable.push(availableCards[i]);
        }
    }
    availableCards = tempAvailable;
    evaluateHand(0);
    player0Obj = tempHand;

    //window.location.href = "#status";
    if (replaceAttempts !== 5) {
        let currentMessage = document.getElementById("message").innerHTML;
        playerMoney = Number(localStorage.getItem("balance"));
        document.getElementById("message").innerHTML = "<span class='badge bg-info text-dark'>Current balance: $" + playerMoney + "</span><span class='badge bg-info text-dark'> Bet: $" + bet + "</span><br/>" + currentMessage;
    }
}


/*https://www.telegraph.co.uk/betting/casino-guides/poker/hand-rankings-chart-cheat-sheet/*/

/*royal-flush: five consecutive cards of the same suit in order of value from 10 through to ace*/

/*straight-flush: Any five cards of sequential values in the same suit that’s not a royal flush is a straight flush.*/

/*four-of-a-kind: he same card in all four suits.*/

/*full-house: A hand comprising the same value card in three different suits (three of a kind) and a separate pair of the same rank card in two different suits. 
When more than one player has a full house the winning hand is the one with the higher or highest value three of a kind.*/

/*flush: Five cards of the same suit in any order whatsoever*/

/*straight: Five cards of sequential numerical value composed of more than one suit.*/

/*three-of-a-kind: A poker hand containing three cards of the same rank in three different suits. */

/*two-pairs: Two different sets of two cards of matching rank*/

/*pair: A pair of cards of the same rank in different suits*/

/*high-card: The highest card in the hand */