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
// Anzahl der Wörter, die von der API abgerufen werden sollen
const wordCount = 1;
const apiUrl = `https://random-word-api.herokuapp.com/word?number=${wordCount}`;
let chosenWord;
let guessedLetters = [];
let wrongGuesses = 0;
const maxWrongGuesses = 11;
let startTime;
let timerInterval;
// Verknüpfe die HTML-Elemente
const wordContainer = document.getElementById('word-container');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');
const hangmanCanvas = document.getElementById('hangman');
const ctx = hangmanCanvas.getContext('2d');
// Timer starten und in der oberen Ecke anzeigen
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById("timer-value").textContent = `${elapsedTime}`;
    }, 1000);
}
// Timer stoppen
function stopTimer() {
    clearInterval(timerInterval);
    return Math.floor((Date.now() - startTime) / 1000);
}
// Erstelle die Tasten für die Buchstaben
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
alphabet.forEach(letter => {
    const button = document.createElement("button");
    button.textContent = letter;
    button.classList.add("letter-button");
    button.addEventListener("click", () => handleGuess(button, letter));
    keyboard.appendChild(button);
});
// Funktion zum Abrufen des Wortes von der API
function fetchWord() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(apiUrl);
            const data = yield response.json();
            chosenWord = data[0].toLowerCase();
            console.log("Das Wort zum Erraten ist: ", chosenWord);
            displayWord();
        }
        catch (error) {
            console.error("Fehler beim Abrufen des Wortes:", error);
            if (message)
                message.textContent = "Fehler beim Laden des Wortes. Bitte lade die Seite neu.";
        }
    });
}
// Zeige das Wort mit Platzhaltern an
function displayWord() {
    wordContainer.innerHTML = chosenWord.split("").map(letter => guessedLetters.includes(letter) ? letter : "_").join(" ");
}
// Verarbeite den Buchstabenversuch
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
// Gewinn/Verlust prüfen und Namensabfrage bei Gewinn starten
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
// Popup für die Namensabfrage (nur bei Gewinn)
function showNamePopup() {
    const popup = document.getElementById("name-popup");
    popup.classList.remove("hidden");
}
// Popup für Spielende anzeigen (ohne Namensabfrage)
function showEndPopup(won) {
    const popup = document.getElementById("game-end-popup");
    popup.classList.remove("hidden");
    const status = document.getElementById("game-end-status");
    status.textContent = won ? "Yeah! You won!" : `Dadum. You lost. Das Wort war: ${chosenWord}`;
}
// Spielstand speichern, wenn der Name eingegeben wurde
function confirmName() {
    const playerName = document.getElementById("player-name").value || "Unbekannt";
    const scoreTime = stopTimer();
    const scores = JSON.parse(localStorage.getItem("hangmanScores") || "[]");
    scores.push({ name: playerName, time: scoreTime });
    scores.sort((a, b) => a.time - b.time);
    localStorage.setItem("hangmanScores", JSON.stringify(scores));
    displayLeaderboard(scores);
    document.getElementById("name-popup").classList.add("hidden");
    showEndPopup(true);
}
// Bestenliste anzeigen
function displayLeaderboard(scores = JSON.parse(localStorage.getItem("hangmanScores") || "[]")) {
    const scoreList = document.getElementById("score-list");
    scoreList.innerHTML = "";
    scores.forEach((score, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${index + 1}. ${score.name} - ${score.time} Sekunden`;
        scoreList.appendChild(listItem);
    });
}
// Zurücksetzen der Bestenliste
function resetScoreboard() {
    localStorage.removeItem("hangmanScores");
    displayLeaderboard();
}
// Zurück zur Startseite
function goHome() {
    window.location.href = "Homepage.html";
}
// Spiel neu starten
function playAgain() {
    window.location.reload();
}
// Zeichne das Galgenmännchen
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
// Deaktiviere die Tasten nach Spielende
function disableKeyboard() {
    const buttons = document.querySelectorAll('#keyboard button');
    buttons.forEach(button => button.disabled = true);
}
// Initialisiere das Spiel und starte den Timer
fetchWord();
startTimer();
displayLeaderboard();
