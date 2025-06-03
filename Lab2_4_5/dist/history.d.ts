export interface GameRecord {
    id: string;
    startTime: Date;
    endTime: Date;
    gameMode: "local" | "bot";
    moveCount: number;
    result: "white-wins" | "black-wins" | "draw" | "ongoing";
    duration: number;
}
export declare class GameHistory {
    private readonly STORAGE_KEY;
    private games;
    constructor();
    saveGame(gameData: {
        startTime: Date;
        endTime: Date;
        gameMode: "local" | "bot";
        moveCount: number;
        result: "white-wins" | "black-wins" | "draw" | "ongoing";
    }): Promise<void>;
    displayHistory(): Promise<void>;
    private loadGames;
    private saveGames;
    private generateGameId;
    private formatDate;
    private formatDuration;
    private formatResult;
    getGameStats(): {
        totalGames: number;
        whiteWins: number;
        blackWins: number;
        draws: number;
        localGames: number;
        botGames: number;
    };
    clearHistory(): void;
}
//# sourceMappingURL=history.d.ts.map