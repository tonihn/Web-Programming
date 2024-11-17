"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Game1;
(function (Game1) {
    const wordCount = 1;
    const apiUrl = `https://random-word-api.herokuapp.com/word?number=${wordCount}`;
    let chosenWord;
    let guessedLetters = [];
    let wrongGuesses = 0;
    const maxWrongGuesses = 11;
    let startTime;
    let timerInterval;
    const wordContainer = document.getElementById('word-container');
    const keyboard = document.getElementById('keyboard');
    const message = document.getElementById('message');
    const hangmanCanvas = document.getElementById('hangman');
    const ctx = hangmanCanvas.getContext('2d');
    const namePopup = document.getElementById("name-popup");
    const endPopup = document.getElementById("game-end-popup");
    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            document.getElementById("timer-value").textContent = `${elapsedTime}`;
        }, 1000);
    }
    function stopTimer() {
        clearInterval(timerInterval);
        return Math.floor((Date.now() - startTime) / 1000);
    }
    function createKeyboard() {
        const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
        keyboard.innerHTML = "";
        alphabet.forEach(letter => {
            const button = document.createElement("button");
            button.textContent = letter;
            button.classList.add("letter-button");
            button.addEventListener("click", () => handleGuess(button, letter));
            keyboard.appendChild(button);
        });
    }
    function fetchWord() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(apiUrl);
                const data = yield response.json();
                chosenWord = data[0].toLowerCase();
                console.log("The word to guess is: ", chosenWord);
                displayWord();
            }
            catch (error) {
                console.error("Error with API:", error);
                if (message)
                    message.textContent = "Error with API. Please reload page.";
            }
        });
    }
    function displayWord() {
        wordContainer.innerHTML = chosenWord.split("").map(letter => guessedLetters.includes(letter) ? letter : "_").join(" ");
    }
    function handleGuess(button, letter) {
        if (guessedLetters.includes(letter))
            return;
        guessedLetters.push(letter);
        button.disabled = true;
        button.classList.add("used");
        if (chosenWord.includes(letter)) {
            displayWord();
            checkWin();
        }
        else {
            wrongGuesses++;
            drawHangman();
            checkLose();
        }
    }
    function checkWin() {
        if (chosenWord.split("").every(letter => guessedLetters.includes(letter))) {
            stopTimer();
            disableKeyboard();
            showNamePopup();
        }
    }
    function checkLose() {
        if (wrongGuesses >= maxWrongGuesses) {
            stopTimer();
            showEndPopup(false);
            disableKeyboard();
        }
    }
    function showNamePopup() {
        namePopup.classList.remove("hidden");
    }
    function showEndPopup(won) {
        const status = document.getElementById("game-end-status");
        status.textContent = won ? "Yeah! You won!" : `Dadum. You lost. Das Wort war: ${chosenWord}`;
        endPopup.classList.remove("hidden");
    }
    function hidePopups() {
        namePopup.classList.add("hidden");
        endPopup.classList.add("hidden");
    }
    function displayLeaderboard(scores = JSON.parse(localStorage.getItem("hangmanScores") || "[]")) {
        const scoreList = document.getElementById("score-list");
        scoreList.innerHTML = "";
        scores.forEach((score, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${index + 1}. ${score.name} - ${score.time} Sekunden`;
            scoreList.appendChild(listItem);
        });
    }
    function resetScoreboard() {
        localStorage.removeItem("hangmanScores");
        displayLeaderboard();
    }
    Game1.resetScoreboard = resetScoreboard;
    function confirmName() {
        const playerName = document.getElementById("player-name").value || "Unbekannt";
        const scoreTime = stopTimer();
        const scores = JSON.parse(localStorage.getItem("hangmanScores") || "[]");
        scores.push({ name: playerName, time: scoreTime });
        scores.sort((a, b) => a.time - b.time);
        localStorage.setItem("hangmanScores", JSON.stringify(scores));
        displayLeaderboard(scores);
        namePopup.classList.add("hidden");
        showEndPopup(true);
    }
    Game1.confirmName = confirmName;
    function playAgain() {
        window.location.reload();
    }
    Game1.playAgain = playAgain;
    function goHome() {
        window.location.href = "Homepage.html";
    }
    Game1.goHome = goHome;
    function drawHangman() {
        switch (wrongGuesses) {
            case 1:
                ctx.beginPath();
                ctx.arc(100, 150, 20, Math.PI, Math.PI * 2);
                ctx.stroke();
                break;
            case 2:
                ctx.moveTo(100, 50);
                ctx.lineTo(100, 130);
                ctx.stroke();
                break;
            case 3:
                ctx.moveTo(100, 50);
                ctx.lineTo(150, 50);
                ctx.stroke();
                break;
            case 4:
                ctx.moveTo(100, 70);
                ctx.lineTo(120, 50);
                ctx.stroke();
                break;
            case 5:
                ctx.moveTo(150, 60);
                ctx.lineTo(150, 50);
                ctx.stroke();
                break;
            case 6:
                ctx.beginPath();
                ctx.arc(150, 70, 10, 0, 2 * Math.PI);
                ctx.stroke();
                break;
            case 7:
                ctx.moveTo(150, 80);
                ctx.lineTo(150, 115);
                ctx.stroke();
                break;
            case 8:
                ctx.moveTo(150, 90);
                ctx.lineTo(130, 95);
                ctx.stroke();
                break;
            case 9:
                ctx.moveTo(150, 90);
                ctx.lineTo(170, 95);
                ctx.stroke();
                break;
            case 10:
                ctx.moveTo(150, 115);
                ctx.lineTo(135, 140);
                ctx.stroke();
                break;
            case 11:
                ctx.moveTo(150, 115);
                ctx.lineTo(165, 140);
                ctx.stroke();
                break;
        }
    }
    function disableKeyboard() {
        const buttons = document.querySelectorAll('#keyboard button');
        buttons.forEach(button => button.disabled = true);
    }
    function startGame() {
        hidePopups();
        createKeyboard();
        fetchWord();
        startTimer();
        displayLeaderboard();
    }
    Game1.startGame = startGame;
})(Game1 || (Game1 = {}));
window.Game1 = Game1;
