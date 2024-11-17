"use strict";
function playGame(gameId) {
    if (gameId === 'Game1') {
        window.location.href = 'Game1.html';
    }
    else if (gameId === 'Game2') {
        window.location.href = 'Game2.html';
    }
}
window.playGame = playGame;
