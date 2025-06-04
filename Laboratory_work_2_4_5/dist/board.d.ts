export type GameMode = "local" | "bot";
export type GameResult = "white-wins" | "black-wins" | "draw" | "ongoing";
export declare class ChessGame {
    private board;
    private currentPlayer;
    private selectedPosition;
    private gameMode;
    private gameResult;
    private moveHistory;
    private gameStartTime;
    private bot;
    private gameHistory;
    constructor();
    startGame(mode: GameMode): void;
    newGame(): void;
    private initializeBoard;
    private createBoardHTML;
    private updateBoardDisplay;
    private getCellElement;
    private handleSquareClick;
    private makeMove;
    private makeBotMove;
    private switchPlayer;
    private updateUI;
    private checkGameEnd;
    private endGame;
}
//# sourceMappingURL=board.d.ts.map