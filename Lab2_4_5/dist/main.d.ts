import { Router } from './router.js';
import { ChessGame } from './board.js';
import { GameHistory } from './history.js';
declare global {
    interface Window {
        router: Router;
        game: ChessGame;
        gameHistory: GameHistory;
    }
}
declare class App {
    private router;
    private game;
    private gameHistory;
    constructor();
    private init;
    private setupEventListeners;
    private showMainMenu;
    private startLocalGame;
    private startBotGame;
    private showHistory;
    private hideAllPages;
    private showPage;
}
export { App };
//# sourceMappingURL=main.d.ts.map