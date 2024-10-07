// Anzahl der Wörter, die von der API abgerufen werden sollen
const wordCount = 1; // Du kannst dies ändern, um mehr Wörter zu laden
const apiUrl = `https://random-word-api.herokuapp.com/word?number=${wordCount}`;

let chosenWord;
let guessedLetters = [];
let wrongGuesses = 0;
const maxWrongGuesses = 11;

// Verknüpfe die HTML-Elemente
const wordContainer = document.getElementById('word-container');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');
const hangmanCanvas = document.getElementById('hangman');
const ctx = hangmanCanvas.getContext('2d');

// Erstelle die Tasten für die Buchstaben
const alphabet = "abcdefghijklmnopqrstuvwxyzäöüß".split("");
alphabet.forEach(letter => {
    const button = document.createElement("button");
    button.textContent = letter;
    button.addEventListener("click", () => handleGuess(letter));
    keyboard.appendChild(button);
});

// Funktion zum Abrufen des Wortes von der API
async function fetchWord() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        chosenWord = data[0].toLowerCase(); // Wähle das erste Wort und wandle es in Kleinbuchstaben um
        console.log("Das Wort zum Erraten ist: ", chosenWord); // Nur zur Kontrolle
        displayWord();
    } catch (error) {
        console.error("Fehler beim Abrufen des Wortes:", error);
        message.textContent = "Fehler beim Laden des Wortes. Bitte lade die Seite neu.";
    }
}

// Zeige das Wort mit Platzhaltern an
function displayWord() {
    wordContainer.innerHTML = chosenWord.split("").map(letter =>
        guessedLetters.includes(letter) ? letter : "_"
    ).join(" ");
}

// Verarbeite den Buchstabenversuch
function handleGuess(letter) {
    if (guessedLetters.includes(letter)) return; // Verhindere doppelte Versuche
    
    guessedLetters.push(letter);

    if (chosenWord.includes(letter)) {
        displayWord();
        checkWin();
    } else {
        wrongGuesses++;
        drawHangman();
        checkLose();
    }
}

// Prüfe, ob der Spieler gewonnen hat
function checkWin() {
    if (chosenWord.split("").every(letter => guessedLetters.includes(letter))) {
        message.textContent = "Yeah! You won!";
        disableKeyboard();
    }
}

// Prüfe, ob der Spieler verloren hat
function checkLose() {
    if (wrongGuesses >= maxWrongGuesses) {
        message.textContent = `Dadum. You lost. The word would have been: ${chosenWord}`;
        disableKeyboard();
    }
}

// Zeichne das Galgenmännchen
function drawHangman() {
    switch (wrongGuesses) {
        case 1: // Hügel
            ctx.beginPath();
            ctx.arc(100,150,20,Math.PI,Math.PI*2);
            ctx.stroke();
            break;
        case 2: // Galgenvertikal
            ctx.moveTo(100,50);
            ctx.lineTo(100, 130);
            ctx.stroke();
            break;
        case 3: // Galgenhorizontal
            ctx.moveTo(100,50);
            ctx.lineTo(150,50);
            ctx.stroke();
            break;
        case 4: // Galgenstütze
            ctx.moveTo(100,70);
            ctx.lineTo(120,50);
            ctx.stroke();
            break;
        case 5: // Seil
            ctx.moveTo(150,60);
            ctx.lineTo(150,50);
            ctx.stroke();
            break;
        case 6: // Kopf
            ctx.beginPath();
            ctx.arc(150,70,10,0,2*Math.PI); 
            ctx.stroke();
            break;
        case 7: // Körper
            ctx.moveTo(150,80);
            ctx.lineTo(150,115);
            ctx.stroke();
            break;
        case 8: // linker Arm
            ctx.moveTo(150, 90);
            ctx.lineTo(130, 95);
            ctx.stroke();
            break;
        case 9: // rechter Arm
            ctx.moveTo(150, 90);
            ctx.lineTo(170, 95);
            ctx.stroke();
            break;
        case 10: // linkes Bein
            ctx.moveTo(150, 115);
            ctx.lineTo(135, 140);
            ctx.stroke();
            break;
        case 11: // rechtes Bein
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

// Initialisiere das Spiel und rufe das Wort ab
fetchWord();
