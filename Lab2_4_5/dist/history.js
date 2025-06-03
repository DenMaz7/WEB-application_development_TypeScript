export class GameHistory {
    constructor() {
        this.STORAGE_KEY = "chess_game_history";
        this.games = [];
        this.loadGames();
    }
    async saveGame(gameData) {
        const duration = Math.floor((gameData.endTime.getTime() - gameData.startTime.getTime()) / 1000);
        const gameRecord = {
            id: this.generateGameId(),
            startTime: gameData.startTime,
            endTime: gameData.endTime,
            gameMode: gameData.gameMode,
            moveCount: gameData.moveCount,
            result: gameData.result,
            duration,
        };
        this.games.unshift(gameRecord); // Додаємо на початок масиву
        // Обмежуємо кількість збережених ігор (останні 50)
        if (this.games.length > 50) {
            this.games = this.games.slice(0, 50);
        }
        await this.saveGames();
        console.log("🎮 Гру збережено в історії");
    }
    async displayHistory() {
        const historyContainer = document.getElementById("history-container");
        if (!historyContainer)
            return;
        if (this.games.length === 0) {
            historyContainer.innerHTML = `
                <div style="text-align: center; color: #666; padding: 40px;">
                    <h3>📝 Історія порожня</h3>
                    <p>Зіграйте першу партію, щоб побачити історію тут!</p>
                </div>
            `;
            return;
        }
        let historyHTML = '<h3 style="margin-bottom: 20px; color: #4a5568;">📜 Останні партії</h3>';
        this.games.forEach((game, index) => {
            const gameNumber = this.games.length - index;
            const startTimeStr = this.formatDate(game.startTime);
            const durationStr = this.formatDuration(game.duration);
            const resultStr = this.formatResult(game.result);
            const modeStr = game.gameMode === "local" ? "👥 Локальна гра" : "🤖 Гра проти бота";
            historyHTML += `
                <div class="history-item">
                    <div class="history-date">
                        🎮 Партія #${gameNumber} • ${startTimeStr}
                    </div>
                    <div class="history-details">
                        <div style="margin: 8px 0;">
                            <strong>Режим:</strong> ${modeStr}
                        </div>
                        <div style="margin: 8px 0;">
                            <strong>Результат:</strong> ${resultStr}
                        </div>
                        <div style="margin: 8px 0;">
                            <strong>Ходів зроблено:</strong> ${game.moveCount}
                        </div>
                        <div style="margin: 8px 0;">
                            <strong>Тривалість:</strong> ${durationStr}
                        </div>
                    </div>
                </div>
            `;
        });
        historyContainer.innerHTML = historyHTML;
    }
    loadGames() {
        try {
            const storedGames = localStorage.getItem(this.STORAGE_KEY);
            if (storedGames) {
                const parsedGames = JSON.parse(storedGames);
                this.games = parsedGames.map((game) => ({
                    ...game,
                    startTime: new Date(game.startTime),
                    endTime: new Date(game.endTime),
                }));
            }
        }
        catch (error) {
            console.warn("Помилка завантаження історії:", error);
            this.games = [];
        }
    }
    async saveGames() {
        try {
            const gamesData = this.games.map((game) => ({
                ...game,
                startTime: game.startTime.toISOString(),
                endTime: game.endTime.toISOString(),
            }));
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gamesData));
        }
        catch (error) {
            console.error("Помилка збереження історії:", error);
        }
    }
    generateGameId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    formatDate(date) {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffMinutes < 1) {
            return "щойно";
        }
        else if (diffMinutes < 60) {
            return `${diffMinutes} хв тому`;
        }
        else if (diffHours < 24) {
            return `${diffHours} год тому`;
        }
        else if (diffDays < 7) {
            return `${diffDays} д тому`;
        }
        else {
            return date.toLocaleDateString("uk-UA", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        }
    }
    formatDuration(seconds) {
        if (seconds < 60) {
            return `${seconds} сек`;
        }
        else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return remainingSeconds > 0
                ? `${minutes} хв ${remainingSeconds} сек`
                : `${minutes} хв`;
        }
        else {
            const hours = Math.floor(seconds / 3600);
            const remainingMinutes = Math.floor((seconds % 3600) / 60);
            return remainingMinutes > 0
                ? `${hours} год ${remainingMinutes} хв`
                : `${hours} год`;
        }
    }
    formatResult(result) {
        switch (result) {
            case "white-wins":
                return "🏆 Перемога білих";
            case "black-wins":
                return "🏆 Перемога чорних";
            case "draw":
                return "🤝 Нічия";
            case "ongoing":
                return "⏳ Гра триває";
            default:
                return "❓ Невідомий результат";
        }
    }
    getGameStats() {
        const stats = {
            totalGames: this.games.length,
            whiteWins: 0,
            blackWins: 0,
            draws: 0,
            localGames: 0,
            botGames: 0,
        };
        this.games.forEach((game) => {
            switch (game.result) {
                case "white-wins":
                    stats.whiteWins++;
                    break;
                case "black-wins":
                    stats.blackWins++;
                    break;
                case "draw":
                    stats.draws++;
                    break;
            }
            if (game.gameMode === "local") {
                stats.localGames++;
            }
            else {
                stats.botGames++;
            }
        });
        return stats;
    }
    clearHistory() {
        this.games = [];
        this.saveGames();
        console.log("🗑️ Історію очищено");
    }
}
//# sourceMappingURL=history.js.map