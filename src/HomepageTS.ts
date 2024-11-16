function playGame(gameId: string): void {
    if (gameId === 'Game1') {
        window.location.href = 'Game1.html';
    }
}

// Make function globally available
(window as any).playGame = playGame;
