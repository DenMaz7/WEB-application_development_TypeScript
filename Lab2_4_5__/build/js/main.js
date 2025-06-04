"use strict";
class BattleshipGame {
    constructor() {
        this.BOARD_SIZE = 10;
        this.SHIPS = [
            { size: 4, count: 1 }, // Лінкор
            { size: 3, count: 2 }, // Крейсери
            { size: 2, count: 3 }, // Есмінці
            { size: 1, count: 4 }, // Катери
        ];
        this.JSON_FILE_PATH = 'game-history.json';
        this.gameMode = "menu";
        this.currentPlayer = "player1";
        this.isPlacingShips = false;
        this.placingPlayer = "player1";
        this.placingShipIndex = 0;
        this.isHorizontal = true;
        this.player1Board = [];
        this.player2Board = [];
        this.player1Ships = [];
        this.player2Ships = [];
        this.winner = null;
        this.message = "Оберіть режим гри";
        // Стан для розумного бота
        this.botTargetQueue = [];
        this.botLastHit = null;
        // Статистика гри
        this.gameStartTime = null;
        this.movesCount = 0;
        this.gameHistory = [];
        this.initializeDOM();
        this.setupEventListeners();
        this.initializeBoards();
        this.loadGameHistory();
        this.renderGameHistory();
    }
    initializeDOM() {
        this.menuElement = this.getElementById("menu");
        this.gameElement = this.getElementById("game");
        this.messageElement = this.getElementById("game-message");
        this.shipControlsElement = this.getElementById("ship-controls");
        this.orientationTextElement = this.getElementById("orientation-text");
        this.shipSizeElement = this.getElementById("ship-size");
        this.player1BoardElement = this.getElementById("player1-board");
        this.player2BoardElement = this.getElementById("player2-board");
        this.player1TitleElement = this.getElementById("player1-title");
        this.player2TitleElement = this.getElementById("player2-title");
        this.winnerPanelElement = this.getElementById("winner-panel");
        this.winnerMessageElement = this.getElementById("winner-message");
        this.gameHistoryElement = this.getElementById("game-history");
    }
    getElementById(id) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element with id "${id}" not found`);
        }
        return element;
    }
    setupEventListeners() {
        this.getElementById("pvp-btn").addEventListener("click", () => this.initializeGame("pvp"));
        this.getElementById("pve-btn").addEventListener("click", () => this.initializeGame("pve"));
        this.getElementById("menu-btn").addEventListener("click", () => this.showMenu());
        this.getElementById("new-game-btn").addEventListener("click", () => this.showMenu());
        this.getElementById("rotate-btn").addEventListener("click", () => this.toggleOrientation());
        this.getElementById("clear-history-btn").addEventListener("click", () => this.clearGameHistory());
    }
    initializeBoards() {
        this.player1Board = this.createEmptyBoard();
        this.player2Board = this.createEmptyBoard();
    }
    createEmptyBoard() {
        return Array(this.BOARD_SIZE)
            .fill(null)
            .map(() => Array(this.BOARD_SIZE)
            .fill(null)
            .map(() => ({ state: "empty" })));
    }
    createShipsList() {
        let shipId = 0;
        const ships = [];
        this.SHIPS.forEach((shipType) => {
            for (let i = 0; i < shipType.count; i++) {
                ships.push({
                    id: shipId++,
                    size: shipType.size,
                    hits: 0,
                    sunk: false,
                    positions: [],
                });
            }
        });
        return ships;
    }
    // Методи роботи з JSON файлом
    async loadGameHistory() {
        try {
            console.log('Завантаження історії ігор з JSON...');
            // Спробуємо завантажити існуючий файл
            const response = await fetch(this.JSON_FILE_PATH);
            if (response.ok) {
                const data = await response.json();
                if (data && Array.isArray(data.games)) {
                    this.gameHistory = data.games;
                    console.log(`Історію завантажено: ${this.gameHistory.length} записів`);
                }
                else {
                    console.warn('Некоректний формат JSON, створюємо нову історію');
                    this.gameHistory = [];
                    await this.createInitialHistoryFile();
                }
            }
            else if (response.status === 404) {
                console.log('Файл історії не знайдено, створюємо новий');
                this.gameHistory = [];
                await this.createInitialHistoryFile();
            }
            else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        catch (error) {
            console.error('Помилка завантаження історії:', error);
            this.gameHistory = [];
            await this.createInitialHistoryFile();
        }
    }
    async createInitialHistoryFile() {
        try {
            const initialData = {
                games: [],
                lastUpdated: new Date().toISOString()
            };
            await this.saveGameHistoryToFile(initialData);
            console.log('Початковий файл історії створено');
        }
        catch (error) {
            console.error('Не вдалося створити початковий файл:', error);
        }
    }
    async saveGameHistory() {
        try {
            const historyData = {
                games: this.gameHistory,
                lastUpdated: new Date().toISOString()
            };
            await this.saveGameHistoryToFile(historyData);
            console.log(`Історію збережено: ${this.gameHistory.length} записів`);
        }
        catch (error) {
            console.error('Помилка збереження історії:', error);
        }
    }
    async saveGameHistoryToFile(data) {
        // В реальному застосунку тут би був API запит на сервер
        // Для демонстрації створюємо blob і пропонуємо завантажити
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        // Створюємо URL для blob
        const url = URL.createObjectURL(blob);
        // Створюємо тимчасове посилання для завантаження
        const tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.download = this.JSON_FILE_PATH;
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        // Очищуємо URL
        URL.revokeObjectURL(url);
        console.log('Файл історії готовий до завантаження');
    }
    async addGameRecord(winner) {
        if (!this.gameStartTime)
            return;
        const endTime = new Date();
        const duration = this.formatDuration(endTime.getTime() - this.gameStartTime.getTime());
        const winnerName = this.getWinnerName(winner);
        const record = {
            id: Date.now().toString(),
            date: this.gameStartTime.toLocaleDateString("uk-UA"),
            time: this.gameStartTime.toLocaleTimeString("uk-UA", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            mode: this.gameMode === "pve" ? "PvE" : "PvP",
            winner: winnerName,
            moves: this.movesCount,
            duration: duration,
        };
        this.gameHistory.unshift(record);
        // Обмежуємо історію до 50 записів
        if (this.gameHistory.length > 50) {
            this.gameHistory = this.gameHistory.slice(0, 50);
        }
        // Зберігаємо в JSON файл
        await this.saveGameHistory();
        // Оновлюємо відображення
        this.renderGameHistory();
    }
    getWinnerName(winner) {
        switch (winner) {
            case "player1":
                return "Гравець 1";
            case "bot":
                return "Бот";
            case "player2":
                return "Гравець 2";
            default:
                return "Невідомо";
        }
    }
    async clearGameHistory() {
        const confirmMessage = `Ви впевнені, що хочете очистити всю історію ігор? 
Буде видалено ${this.gameHistory.length} записів.`;
        if (confirm(confirmMessage)) {
            this.gameHistory = [];
            await this.saveGameHistory();
            this.renderGameHistory();
            console.log('Історію ігор очищено користувачем');
        }
    }
    // Метод для ручного завантаження JSON файлу
    setupFileUpload() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files?.[0];
            if (file) {
                try {
                    const text = await file.text();
                    const data = JSON.parse(text);
                    if (data && Array.isArray(data.games)) {
                        this.gameHistory = data.games;
                        this.renderGameHistory();
                        console.log(`Історію завантажено з файлу: ${this.gameHistory.length} записів`);
                    }
                    else {
                        alert('Некоректний формат файлу історії');
                    }
                }
                catch (error) {
                    console.error('Помилка читання файлу:', error);
                    alert('Помилка при завантаженні файлу історії');
                }
            }
        });
        document.body.appendChild(fileInput);
        // Додаємо кнопку для завантаження файлу
        const uploadButton = document.createElement('button');
        uploadButton.textContent = '📁 Завантажити історію';
        uploadButton.className = 'upload-history-btn';
        uploadButton.addEventListener('click', () => fileInput.click());
        const historyHeader = document.createElement('div');
        historyHeader.className = 'history-header-controls';
        historyHeader.appendChild(uploadButton);
        this.gameHistoryElement.parentNode?.insertBefore(historyHeader, this.gameHistoryElement);
    }
    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes > 0) {
            return `${minutes}хв ${remainingSeconds}с`;
        }
        return `${remainingSeconds}с`;
    }
    renderGameHistory() {
        if (this.gameHistory.length === 0) {
            this.gameHistoryElement.innerHTML =
                '<p class="no-history">📊 Історія ігор порожня</p>';
            return;
        }
        const historyHTML = this.gameHistory
            .slice(0, 10)
            .map((record) => `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-date">📅 ${record.date}</span>
                    <span class="history-time">🕐 ${record.time}</span>
                    <span class="history-mode">${record.mode === "PvE" ? "🤖" : "👥"} ${record.mode}</span>
                </div>
                <div class="history-details">
                    <span class="history-winner">🏆 ${record.winner}</span>
                    <span class="history-moves">🎯 ${record.moves} ходів</span>
                    <span class="history-duration">⏱️ ${record.duration}</span>
                </div>
            </div>
        `)
            .join("");
        this.gameHistoryElement.innerHTML = historyHTML;
    }
    showMenu() {
        this.gameMode = "menu";
        this.menuElement.style.display = "flex";
        this.gameElement.style.display = "none";
        this.winnerPanelElement.style.display = "none";
        this.renderGameHistory(); // Оновлюємо історію при поверненні в меню
    }
    initializeGame(mode) {
        this.gameMode = mode;
        this.currentPlayer = "player1";
        this.winner = null;
        this.isPlacingShips = true;
        this.placingPlayer = "player1";
        this.placingShipIndex = 0;
        this.isHorizontal = true;
        // Скидання статистики
        this.gameStartTime = null;
        this.movesCount = 0;
        // Очищення стану бота
        this.botTargetQueue = [];
        this.botLastHit = null;
        // Очищення дошок
        this.player1Board = this.createEmptyBoard();
        this.player2Board = this.createEmptyBoard();
        this.player1Ships = [];
        this.player2Ships = [];
        // Оновлення UI
        this.menuElement.style.display = "none";
        this.gameElement.style.display = "block";
        this.winnerPanelElement.style.display = "none";
        this.shipControlsElement.style.display = "block";
        if (mode === "pve") {
            this.message = "Розмістіть свої кораблі";
            this.player1TitleElement.textContent = "🛡️ Ваша дошка";
            this.player2TitleElement.textContent = "🤖 Дошка бота";
        }
        else {
            this.message = "Гравець 1: розмістіть свої кораблі";
            this.player1TitleElement.textContent = "👤 Гравець 1";
            this.player2TitleElement.textContent = "👤 Гравець 2";
        }
        this.updateUI();
        this.renderBoards();
    }
    toggleOrientation() {
        this.isHorizontal = !this.isHorizontal;
        this.updateUI();
    }
    updateUI() {
        this.messageElement.textContent = this.message;
        this.orientationTextElement.textContent = this.isHorizontal
            ? "Горизонтальна ↔️"
            : "Вертикальна ↕️";
        if (this.isPlacingShips) {
            const shipsList = this.createShipsList();
            const currentShip = shipsList[this.placingShipIndex];
            if (currentShip) {
                this.shipSizeElement.textContent = currentShip.size.toString();
            }
        }
    }
    renderBoards() {
        this.renderBoard(this.player1BoardElement, this.player1Board, true, "player1");
        this.renderBoard(this.player2BoardElement, this.player2Board, false, "player2");
    }
    renderBoard(boardElement, board, isOwnBoard, targetPlayer) {
        boardElement.innerHTML = "";
        for (let row = 0; row < this.BOARD_SIZE; row++) {
            for (let col = 0; col < this.BOARD_SIZE; col++) {
                const cell = document.createElement("button");
                cell.className = "board-cell";
                cell.dataset.row = row.toString();
                cell.dataset.col = col.toString();
                this.setCellAppearance(cell, board[row][col], isOwnBoard);
                cell.addEventListener("click", () => {
                    if (this.isPlacingShips && isOwnBoard) {
                        this.placeShip(row, col);
                    }
                    else if (!isOwnBoard && !this.winner && !this.isPlacingShips) {
                        this.makeShot(row, col, targetPlayer);
                    }
                });
                // Додавання класів для ховер ефектів
                if (this.isPlacingShips && isOwnBoard) {
                    cell.classList.add("placing");
                }
                else if (!isOwnBoard && !this.winner && !this.isPlacingShips) {
                    cell.classList.add("targeting");
                }
                boardElement.appendChild(cell);
            }
        }
    }
    setCellAppearance(cellElement, cell, isOwnBoard) {
        // Очищення всіх класів стану
        cellElement.classList.remove("cell-empty", "cell-ship", "cell-hit", "cell-miss", "cell-sunk", "own-board", "enemy-board");
        switch (cell.state) {
            case "ship":
                if (isOwnBoard) {
                    cellElement.classList.add("cell-ship");
                    cellElement.classList.add("own-board");
                    cellElement.textContent = "🚢";
                }
                else {
                    // Для ворожої дошки кораблі виглядають як пусті клітини
                    cellElement.classList.add("cell-empty");
                    cellElement.textContent = "";
                }
                break;
            case "hit":
                cellElement.classList.add("cell-hit");
                cellElement.textContent = "💥";
                break;
            case "miss":
                cellElement.classList.add("cell-miss");
                cellElement.textContent = "💧";
                break;
            case "sunk":
                cellElement.classList.add("cell-sunk");
                cellElement.textContent = "☠️";
                break;
            default:
                cellElement.classList.add("cell-empty");
                cellElement.textContent = "";
        }
    }
    canPlaceShip(board, row, col, size, horizontal) {
        if (horizontal) {
            if (col + size > this.BOARD_SIZE)
                return false;
            for (let i = 0; i < size; i++) {
                if (board[row][col + i].state === "ship")
                    return false;
                // Перевірка навколишніх клітин
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const newRow = row + dr;
                        const newCol = col + i + dc;
                        if (newRow >= 0 &&
                            newRow < this.BOARD_SIZE &&
                            newCol >= 0 &&
                            newCol < this.BOARD_SIZE) {
                            if (board[newRow][newCol].state === "ship")
                                return false;
                        }
                    }
                }
            }
        }
        else {
            if (row + size > this.BOARD_SIZE)
                return false;
            for (let i = 0; i < size; i++) {
                if (board[row + i][col].state === "ship")
                    return false;
                // Перевірка навколишніх клітин
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const newRow = row + i + dr;
                        const newCol = col + dc;
                        if (newRow >= 0 &&
                            newRow < this.BOARD_SIZE &&
                            newCol >= 0 &&
                            newCol < this.BOARD_SIZE) {
                            if (board[newRow][newCol].state === "ship")
                                return false;
                        }
                    }
                }
            }
        }
        return true;
    }
    placeShip(row, col) {
        if (!this.isPlacingShips)
            return;
        const shipsList = this.createShipsList();
        const currentShip = shipsList[this.placingShipIndex];
        const currentBoard = this.placingPlayer === "player1" ? this.player1Board : this.player2Board;
        if (!this.canPlaceShip(currentBoard, row, col, currentShip.size, this.isHorizontal)) {
            this.message = "Неможливо розмістити корабель тут!";
            this.updateUI();
            return;
        }
        // Створення нової дошки з розміщеним кораблем
        const positions = [];
        for (let i = 0; i < currentShip.size; i++) {
            const newRow = this.isHorizontal ? row : row + i;
            const newCol = this.isHorizontal ? col + i : col;
            currentBoard[newRow][newCol] = { state: "ship", shipId: currentShip.id };
            positions.push({ row: newRow, col: newCol });
        }
        const newShip = {
            ...currentShip,
            positions,
        };
        if (this.placingPlayer === "player1") {
            this.player1Ships.push(newShip);
        }
        else {
            this.player2Ships.push(newShip);
        }
        // Перехід до наступного корабля
        if (this.placingShipIndex < shipsList.length - 1) {
            this.placingShipIndex++;
            const nextShip = shipsList[this.placingShipIndex];
            this.message = `${this.placingPlayer === "player1" ? "Гравець 1" : "Гравець 2"}: розмістіть корабель розміром ${nextShip.size}`;
        }
        else {
            // Всі кораблі розміщені для поточного гравця
            if (this.gameMode === "pvp" && this.placingPlayer === "player1") {
                // Переключення на другого гравця
                this.placingPlayer = "player2";
                this.placingShipIndex = 0;
                this.message = "Гравець 2: розмістіть свої кораблі";
            }
            else if (this.gameMode === "pve" && this.placingPlayer === "player1") {
                // Автоматичне розміщення кораблів для бота
                this.placeBotsShips();
            }
            else {
                // Початок гри
                this.startGame();
            }
        }
        this.updateUI();
        this.renderBoards();
    }
    placeBotsShips() {
        this.player2Board = this.createEmptyBoard();
        this.player2Ships = [];
        const shipsList = this.createShipsList();
        shipsList.forEach((ship) => {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 100) {
                const row = Math.floor(Math.random() * this.BOARD_SIZE);
                const col = Math.floor(Math.random() * this.BOARD_SIZE);
                const horizontal = Math.random() < 0.5;
                if (this.canPlaceShip(this.player2Board, row, col, ship.size, horizontal)) {
                    const positions = [];
                    for (let i = 0; i < ship.size; i++) {
                        const newRow = horizontal ? row : row + i;
                        const newCol = horizontal ? col + i : col;
                        this.player2Board[newRow][newCol] = {
                            state: "ship",
                            shipId: ship.id,
                        };
                        positions.push({ row: newRow, col: newCol });
                    }
                    this.player2Ships.push({
                        ...ship,
                        positions,
                    });
                    placed = true;
                }
                attempts++;
            }
        });
        this.startGame();
    }
    startGame() {
        this.isPlacingShips = false;
        this.currentPlayer = "player1";
        this.message = "Гра почалася! Хід гравця 1";
        this.shipControlsElement.style.display = "none";
        this.gameStartTime = new Date(); // Початок відліку часу
        this.movesCount = 0;
        this.updateUI();
        this.renderBoards();
    }
    async makeShot(row, col, targetPlayer) {
        if (this.winner || this.isPlacingShips)
            return;
        if (this.gameMode === "pvp" && targetPlayer === this.currentPlayer)
            return;
        if (this.gameMode === "pve" &&
            this.currentPlayer === "player1" &&
            targetPlayer === "player1")
            return;
        const targetBoard = targetPlayer === "player1" ? this.player1Board : this.player2Board;
        const targetShips = targetPlayer === "player1" ? this.player1Ships : this.player2Ships;
        if (targetBoard[row][col].state === "hit" ||
            targetBoard[row][col].state === "miss") {
            this.message = "Ви вже стріляли сюди!";
            this.updateUI();
            return;
        }
        // Збільшуємо лічильник ходів
        this.movesCount++;
        let wasHit = false;
        if (targetBoard[row][col].state === "ship") {
            // Влучання
            wasHit = true;
            targetBoard[row][col].state = "hit";
            const shipId = targetBoard[row][col].shipId;
            const ship = targetShips.find((s) => s.id === shipId);
            if (ship) {
                ship.hits++;
                if (ship.hits === ship.size) {
                    // Корабель затонув
                    ship.sunk = true;
                    ship.positions.forEach((pos) => {
                        targetBoard[pos.row][pos.col].state = "sunk";
                    });
                    this.message = `${this.currentPlayer === "player1"
                        ? "Гравець 1"
                        : this.gameMode === "pve"
                            ? "Ви"
                            : "Гравець 2"} потопив корабель!`;
                }
                else {
                    this.message = `${this.currentPlayer === "player1"
                        ? "Гравець 1"
                        : this.gameMode === "pve"
                            ? "Ви"
                            : "Гравець 2"} влучив!`;
                }
            }
        }
        else {
            // Промах
            targetBoard[row][col].state = "miss";
            this.message = `${this.currentPlayer === "player1"
                ? "Гравець 1"
                : this.gameMode === "pve"
                    ? "Ви"
                    : "Гравець 2"} промахнувся!`;
        }
        // Перевірка на перемогу
        if (targetShips.every((ship) => ship.sunk)) {
            const winnerPlayer = targetPlayer === "player1"
                ? this.gameMode === "pve"
                    ? "bot"
                    : "player2"
                : "player1";
            this.winner = winnerPlayer;
            this.message = `${this.getWinnerName(winnerPlayer)} переміг!`;
            this.winnerMessageElement.textContent = `🎉 ${this.getWinnerName(winnerPlayer)} переміг! 🎉`;
            this.winnerPanelElement.style.display = "block";
            // Додаємо запис в історію
            await this.addGameRecord(winnerPlayer);
            this.updateUI();
            this.renderBoards();
            return;
        }
        // Зміна ходу
        if (!wasHit) {
            if (this.gameMode === "pvp") {
                this.currentPlayer =
                    this.currentPlayer === "player1" ? "player2" : "player1";
            }
            else if (this.gameMode === "pve") {
                this.currentPlayer =
                    this.currentPlayer === "player1" ? "bot" : "player1";
            }
        }
        this.updateUI();
        this.renderBoards();
        // Хід бота
        if (this.currentPlayer === "bot") {
            setTimeout(() => this.botMove(), 1200);
        }
    }
    botMove() {
        if (this.currentPlayer !== "bot" || this.winner || this.isPlacingShips)
            return;
        let row, col;
        // Якщо є цілі в черзі, стріляємо по них
        if (this.botTargetQueue.length > 0) {
            const target = this.botTargetQueue.shift();
            row = target.row;
            col = target.col;
        }
        else {
            // Випадковий постріл
            let attempts = 0;
            do {
                row = Math.floor(Math.random() * this.BOARD_SIZE);
                col = Math.floor(Math.random() * this.BOARD_SIZE);
                attempts++;
            } while ((this.player1Board[row][col].state === "hit" ||
                this.player1Board[row][col].state === "miss") &&
                attempts < 100);
        }
        const wasHit = this.player1Board[row][col].state === "ship";
        this.makeShot(row, col, "player1");
        // Якщо влучили, додаємо сусідні клітини до черги
        if (wasHit) {
            this.botLastHit = { row, col };
            const directions = [
                { dr: -1, dc: 0 }, // вгору
                { dr: 1, dc: 0 }, // вниз
                { dr: 0, dc: -1 }, // вліво
                { dr: 0, dc: 1 }, // вправо
            ];
            const newTargets = [];
            directions.forEach(({ dr, dc }) => {
                const newRow = row + dr;
                const newCol = col + dc;
                if (newRow >= 0 &&
                    newRow < this.BOARD_SIZE &&
                    newCol >= 0 &&
                    newCol < this.BOARD_SIZE &&
                    this.player1Board[newRow][newCol].state === "empty") {
                    newTargets.push({ row: newRow, col: newCol });
                }
            });
            this.botTargetQueue.push(...newTargets);
        }
    }
}
// Ініціалізація гри після завантаження DOM
document.addEventListener("DOMContentLoaded", () => {
    new BattleshipGame();
});
