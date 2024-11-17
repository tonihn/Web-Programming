namespace Game2 {
    const canvas = document.getElementById('snake-game') as HTMLCanvasElement;
    const snakeCtx = canvas.getContext('2d')!;
    const boxSize = 20;
    const rows = canvas.height / boxSize;
    const cols = canvas.width / boxSize;

    let snake: { x: number; y: number }[] = [{ x: 5, y: 5 }];
    let direction: { x: number; y: number } = { x: 1, y: 0 };
    let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    let score = 0;
    let gameInterval: any;

    export function goHome(): void {
        window.location.href = "Homepage.html";
    }

    function drawSnake(): void {
        snakeCtx.fillStyle = 'lime';
        snake.forEach(segment => {
            snakeCtx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
        });
    }

    function drawFood(): void {
        snakeCtx.fillStyle = 'red';
        snakeCtx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);
    }

    function updateGame(): void {
        const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        if (newHead.x < 0 || newHead.y < 0 || newHead.x >= cols || newHead.y >= rows ||
            snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            endGame();
            return;
        }

        if (newHead.x === food.x && newHead.y === food.y) {
            score++;
            document.getElementById('score-display')!.textContent = `Score: ${score}`;
            food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
        } else {
            snake.pop();
        }

        snake.unshift(newHead);
    }

    function drawGame(): void {
        snakeCtx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        drawFood();
    }

    function endGame(): void {
        clearInterval(gameInterval);
        showNamePopup();
    }

    function showNamePopup(): void {
        const popup = document.getElementById("name-popup")!;
        popup.classList.remove("hidden");
    }

    export function confirmName(): void {
        const playerName = (document.getElementById("player-name") as HTMLInputElement).value || "Unbekannt";

        const scores = JSON.parse(localStorage.getItem("snakeScores") || "[]");
        scores.push({ name: playerName, score: score });
        scores.sort((a: { score: number }, b: { score: number }) => b.score - a.score);
        localStorage.setItem("snakeScores", JSON.stringify(scores));

        displayLeaderboard(scores);
        document.getElementById("name-popup")!.classList.add("hidden");
        showEndPopup();
    }

    function showEndPopup(): void {
        const popup = document.getElementById("game-end-popup")!;
        popup.classList.remove("hidden");
    }

    function displayLeaderboard(scores: { name: string, score: number }[] = JSON.parse(localStorage.getItem("snakeScores") || "[]")): void {
        const scoreList = document.getElementById("score-list")!;
        scoreList.innerHTML = "";
        scores.forEach((score, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${index + 1}. ${score.name} - ${score.score} Punkte`;
            scoreList.appendChild(listItem);
        });
    }

    export function resetScoreboard(): void {
        localStorage.removeItem("snakeScores");
        displayLeaderboard();
    }

    export function playAgain(): void {
        window.location.reload();
    }

    export function startGame(): void {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp': if (direction.y === 0) direction = { x: 0, y: -1 }; break;
                case 'ArrowDown': if (direction.y === 0) direction = { x: 0, y: 1 }; break;
                case 'ArrowLeft': if (direction.x === 0) direction = { x: -1, y: 0 }; break;
                case 'ArrowRight': if (direction.x === 0) direction = { x: 1, y: 0 }; break;
            }
        });

        gameInterval = setInterval(() => {
            updateGame();
            drawGame();
        }, 100);

        displayLeaderboard();
    }
}

(window as any).Game2 = Game2;
