"use strict";
function playGame(gameId) {
    if (gameId === 'Game1') {
        window.location.href = 'Game1.html';
    }
}
// Make function globally available
window.playGame = playGame;
