namespace Game1 {
    const wordCount: number = 1;
    const apiUrl: string = `https://random-word-api.herokuapp.com/word?number=${wordCount}`;

    let chosenWord: string;
    let guessedLetters: string[] = [];
    let wrongGuesses: number = 0;
    const maxWrongGuesses: number = 11;

    let startTime: number;
    let timerInterval: any;

    const wordContainer = document.getElementById('word-container') as HTMLDivElement;
    const keyboard = document.getElementById('keyboard') as HTMLDivElement;
    const message = document.getElementById('message') as HTMLDivElement;
    const hangmanCanvas = document.getElementById('hangman') as HTMLCanvasElement;
    const ctx = hangmanCanvas.getContext('2d') as CanvasRenderingContext2D;

    const namePopup = document.getElementById("name-popup") as HTMLDivElement;
    const endPopup = document.getElementById("game-end-popup") as HTMLDivElement;

    function startTimer(): void {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            document.getElementById("timer-value")!.textContent = `${elapsedTime}`;
        }, 1000);
    }

    function stopTimer(): number {
        clearInterval(timerInterval);
        return Math.floor((Date.now() - startTime) / 1000);
    }

    function createKeyboard(): void {
        const alphabet: string[] = "abcdefghijklmnopqrstuvwxyz".split("");
        keyboard.innerHTML = ""; 
        alphabet.forEach(letter => {
            const button = document.createElement("button");
            button.textContent = letter;
            button.classList.add("letter-button");
            button.addEventListener("click", () => handleGuess(button, letter));
            keyboard.appendChild(button);
        });
    }

    async function fetchWord(): Promise<void> {
        try {
            const response = await fetch(apiUrl);
            const data: string[] = await response.json();
            chosenWord = data[0].toLowerCase();
            console.log("The word to guess is: ", chosenWord);
            displayWord();
        } catch (error) {
            console.error("Error with API:", error);
            if (message) message.textContent = "Error with API. Please reload page.";
        }
    }

    function displayWord(): void {
        wordContainer.innerHTML = chosenWord.split("").map(letter =>
            guessedLetters.includes(letter) ? letter : "_"
        ).join(" ");
    }

    function handleGuess(button: HTMLButtonElement, letter: string): void {
        if (guessedLetters.includes(letter)) return;

        guessedLetters.push(letter);
        button.disabled = true;
        button.classList.add("used");

        if (chosenWord.includes(letter)) {
            displayWord();
            checkWin();
        } else {
            wrongGuesses++;
            drawHangman();
            checkLose();
        }
    }

    function checkWin(): void {
        if (chosenWord.split("").every(letter => guessedLetters.includes(letter))) {
            stopTimer();
            disableKeyboard();
            showNamePopup();
        }
    }

    function checkLose(): void {
        if (wrongGuesses >= maxWrongGuesses) {
            stopTimer();
            showEndPopup(false);
            disableKeyboard();
        }
    }

    function showNamePopup(): void {
        namePopup.classList.remove("hidden");
    }

    function showEndPopup(won: boolean): void {
        const status = document.getElementById("game-end-status")!;
        status.textContent = won ? "Yeah! You won!" : `Dadum. You lost. Das Wort war: ${chosenWord}`;
        endPopup.classList.remove("hidden");
    }

    function hidePopups(): void {
        namePopup.classList.add("hidden");
        endPopup.classList.add("hidden");
    }

    function displayLeaderboard(scores: { name: string, time: number }[] = JSON.parse(localStorage.getItem("hangmanScores") || "[]")): void {
        const scoreList = document.getElementById("score-list")!;
        scoreList.innerHTML = "";
        scores.forEach((score, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${index + 1}. ${score.name} - ${score.time} Sekunden`;
            scoreList.appendChild(listItem);
        });
    }

    export function resetScoreboard(): void {
        localStorage.removeItem("hangmanScores");
        displayLeaderboard();
    }

    export function confirmName(): void {
        const playerName = (document.getElementById("player-name") as HTMLInputElement).value || "Unknown";
        const scoreTime = stopTimer();

        const scores = JSON.parse(localStorage.getItem("hangmanScores") || "[]");
        scores.push({ name: playerName, time: scoreTime });
        scores.sort((a: { time: number }, b: { time: number }) => a.time - b.time);
        localStorage.setItem("hangmanScores", JSON.stringify(scores));

        displayLeaderboard(scores);
        namePopup.classList.add("hidden");
        showEndPopup(true);
    }

    export function playAgain(): void {
        window.location.reload();
    }

    export function goHome(): void {
        window.location.href = "Homepage.html";
    }

    function drawHangman(): void {
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

    function disableKeyboard(): void {
        const buttons = document.querySelectorAll('#keyboard button') as NodeListOf<HTMLButtonElement>;
        buttons.forEach(button => button.disabled = true);
    }

    export function startGame(): void {
        hidePopups(); 
        createKeyboard();
        fetchWord();
        startTimer();
        displayLeaderboard();
    }
}

(window as any).Game1 = Game1;
