"use strict";
function playGame(gameId) {
    if (gameId === 'Game1') {
        window.location.href = 'Game1.html';
    }
}
// Funktion global verfügbar machen
window.playGame = playGame;
