function playGame(gameId: string): void {
    if (gameId === 'Game1') {
        window.location.href = 'Game1.html';
    }
}

// Funktion global verfügbar machen
(window as any).playGame = playGame;
