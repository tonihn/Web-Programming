"use strict";
var Game2;
(function (Game2) {
    const canvas = document.getElementById('snake-game');
    const snakeCtx = canvas.getContext('2d');
    const boxSize = 20;
    const rows = canvas.height / boxSize;
    const cols = canvas.width / boxSize;
    let snake = [{ x: 5, y: 5 }];
    let direction = { x: 1, y: 0 };
    let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    let score = 0;
    let gameInterval;
    function goHome() {
        window.location.href = "Homepage.html";
    }
    Game2.goHome = goHome;
    function drawSnake() {
        snakeCtx.fillStyle = 'lime';
        snake.forEach(segment => {
            snakeCtx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
        });
    }
    function drawFood() {
        snakeCtx.fillStyle = 'red';
        snakeCtx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);
    }
    function updateGame() {
        const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        if (newHead.x < 0 || newHead.y < 0 || newHead.x >= cols || newHead.y >= rows ||
            snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            endGame();
            return;
        }
        if (newHead.x === food.x && newHead.y === food.y) {
            score++;
            document.getElementById('score-display').textContent = `Score: ${score}`;
            food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
        }
        else {
            snake.pop();
        }
        snake.unshift(newHead);
    }
    function drawGame() {
        snakeCtx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        drawFood();
    }
    function endGame() {
        clearInterval(gameInterval);
        showNamePopup();
    }
    function showNamePopup() {
        const popup = document.getElementById("name-popup");
        popup.classList.remove("hidden");
    }
    function confirmName() {
        const playerName = document.getElementById("player-name").value || "Unbekannt";
        const scores = JSON.parse(localStorage.getItem("snakeScores") || "[]");
        scores.push({ name: playerName, score: score });
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem("snakeScores", JSON.stringify(scores));
        displayLeaderboard(scores);
        document.getElementById("name-popup").classList.add("hidden");
        showEndPopup();
    }
    Game2.confirmName = confirmName;
    function showEndPopup() {
        const popup = document.getElementById("game-end-popup");
        popup.classList.remove("hidden");
    }
    function displayLeaderboard(scores = JSON.parse(localStorage.getItem("snakeScores") || "[]")) {
        const scoreList = document.getElementById("score-list");
        scoreList.innerHTML = "";
        scores.forEach((score, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${index + 1}. ${score.name} - ${score.score} Punkte`;
            scoreList.appendChild(listItem);
        });
    }
    function resetScoreboard() {
        localStorage.removeItem("snakeScores");
        displayLeaderboard();
    }
    Game2.resetScoreboard = resetScoreboard;
    function playAgain() {
        window.location.reload();
    }
    Game2.playAgain = playAgain;
    function startGame() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    if (direction.y === 0)
                        direction = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                    if (direction.y === 0)
                        direction = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                    if (direction.x === 0)
                        direction = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                    if (direction.x === 0)
                        direction = { x: 1, y: 0 };
                    break;
            }
        });
        gameInterval = setInterval(() => {
            updateGame();
            drawGame();
        }, 100);
        displayLeaderboard();
    }
    Game2.startGame = startGame;
})(Game2 || (Game2 = {}));
window.Game2 = Game2;
