// board.ts - логіка дошки
import { PieceLogic, } from "./pieces.js";
import { ChessBot } from "./bot.js";
import { GameHistory } from "./history.js";
export class ChessGame {
    constructor() {
        this.board = [];
        this.currentPlayer = "white";
        this.selectedPosition = null;
        this.gameMode = "local";
        this.gameResult = "ongoing";
        this.moveHistory = [];
        this.gameStartTime = new Date();
        this.bot = new ChessBot();
        this.gameHistory = new GameHistory();
        this.initializeBoard();
        this.createBoardHTML();
    }
    startGame(mode) {
        this.gameMode = mode;
        this.gameResult = "ongoing";
        this.currentPlayer = "white";
        this.selectedPosition = null;
        this.moveHistory = [];
        this.gameStartTime = new Date();
        this.initializeBoard();
        this.createBoardHTML();
        this.updateUI();
        console.log(`🎮 Гра розпочата в режимі: ${mode}`);
    }
    newGame() {
        this.startGame(this.gameMode);
    }
    initializeBoard() {
        // Створюємо пусту дошку 8x8
        this.board = Array(8)
            .fill(null)
            .map(() => Array(8).fill(null));
        // Розставляємо білі фігури
        this.board[7] = [
            { type: "rook", color: "white" },
            { type: "knight", color: "white" },
            { type: "bishop", color: "white" },
            { type: "queen", color: "white" },
            { type: "king", color: "white" },
            { type: "bishop", color: "white" },
            { type: "knight", color: "white" },
            { type: "rook", color: "white" },
        ];
        // Білі пішаки
        for (let col = 0; col < 8; col++) {
            this.board[6][col] = { type: "pawn", color: "white" };
        }
        // Чорні пішаки
        for (let col = 0; col < 8; col++) {
            this.board[1][col] = { type: "pawn", color: "black" };
        }
        // Розставляємо чорні фігури
        this.board[0] = [
            { type: "rook", color: "black" },
            { type: "knight", color: "black" },
            { type: "bishop", color: "black" },
            { type: "queen", color: "black" },
            { type: "king", color: "black" },
            { type: "bishop", color: "black" },
            { type: "knight", color: "black" },
            { type: "rook", color: "black" },
        ];
    }
    createBoardHTML() {
        const boardElement = document.getElementById("chess-board");
        if (!boardElement)
            return;
        boardElement.innerHTML = "";
        for (let row = 0; row < 8; row++) {
            const tr = document.createElement("tr");
            for (let col = 0; col < 8; col++) {
                const td = document.createElement("td");
                td.dataset.row = row.toString();
                td.dataset.col = col.toString();
                // Альтернуючі кольори клітинок
                const isWhiteSquare = (row + col) % 2 === 0;
                td.className = isWhiteSquare ? "white-square" : "black-square";
                // Додаємо обробник кліку
                td.addEventListener("click", (e) => this.handleSquareClick(e));
                tr.appendChild(td);
            }
            boardElement.appendChild(tr);
        }
        this.updateBoardDisplay();
    }
    updateBoardDisplay() {
        const boardElement = document.getElementById("chess-board");
        if (!boardElement)
            return;
        const cells = boardElement.querySelectorAll("td");
        cells.forEach((cell) => {
            const row = parseInt(cell.getAttribute("data-row") || "0");
            const col = parseInt(cell.getAttribute("data-col") || "0");
            const piece = this.board[row][col];
            // Очищуємо вміст клітинки
            cell.textContent = "";
            // Додаємо фігуру якщо вона є
            if (piece) {
                cell.textContent = PieceLogic.getPieceUnicode(piece);
            }
            // Видаляємо всі класи стилізації
            cell.classList.remove("selected", "possible-move");
            // Встановлюємо базовий колір клітинки
            const isWhiteSquare = (row + col) % 2 === 0;
            cell.className = isWhiteSquare ? "white-square" : "black-square";
        });
        // Підсвічуємо вибрану фігуру
        if (this.selectedPosition) {
            const selectedCell = this.getCellElement(this.selectedPosition.row, this.selectedPosition.col);
            if (selectedCell) {
                selectedCell.classList.add("selected");
            }
            // Підсвічуємо можливі ходи
            const possibleMoves = PieceLogic.getPossibleMoves(this.board, this.selectedPosition);
            possibleMoves.forEach((move) => {
                const cell = this.getCellElement(move.row, move.col);
                if (cell) {
                    cell.classList.add("possible-move");
                }
            });
        }
    }
    getCellElement(row, col) {
        return document.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
    }
    handleSquareClick(event) {
        if (this.gameResult !== "ongoing")
            return;
        const target = event.target;
        const row = parseInt(target.getAttribute("data-row") || "0");
        const col = parseInt(target.getAttribute("data-col") || "0");
        const clickedPosition = { row, col };
        // Якщо в режимі гри проти бота і хід чорних - ігноруємо кліки
        if (this.gameMode === "bot" && this.currentPlayer === "black") {
            return;
        }
        if (this.selectedPosition) {
            // Якщо клікнули на вже вибрану фігуру - скасовуємо вибір
            if (this.selectedPosition.row === row &&
                this.selectedPosition.col === col) {
                this.selectedPosition = null;
                this.updateBoardDisplay();
                return;
            }
            // Спробуємо зробити хід
            if (this.makeMove(this.selectedPosition, clickedPosition)) {
                this.selectedPosition = null;
                this.switchPlayer();
                this.updateUI();
                this.checkGameEnd();
                // Якщо гра проти бота і хід чорних
                if (this.gameMode === "bot" &&
                    this.currentPlayer === "black" &&
                    this.gameResult === "ongoing") {
                    setTimeout(() => this.makeBotMove(), 500);
                }
            }
            else {
                // Якщо хід неможливий, але клікнули на свою фігуру - вибираємо її
                const clickedPiece = this.board[row][col];
                if (clickedPiece && clickedPiece.color === this.currentPlayer) {
                    this.selectedPosition = clickedPosition;
                    this.updateBoardDisplay();
                }
                else {
                    this.selectedPosition = null;
                    this.updateBoardDisplay();
                }
            }
        }
        else {
            // Вибираємо фігуру якщо вона належить поточному гравцю
            const piece = this.board[row][col];
            if (piece && piece.color === this.currentPlayer) {
                this.selectedPosition = clickedPosition;
                this.updateBoardDisplay();
            }
        }
    }
    makeMove(from, to) {
        if (!PieceLogic.isValidMove(this.board, from, to)) {
            return false;
        }
        const piece = this.board[from.row][from.col];
        const capturedPiece = this.board[to.row][to.col];
        if (!piece)
            return false;
        // Симулюємо хід для перевірки шаху
        this.board[to.row][to.col] = piece;
        this.board[from.row][from.col] = null;
        // Перевіряємо чи не залишається король під шахом після ходу
        const kingInCheck = PieceLogic.isKingInCheck(this.board, this.currentPlayer);
        if (kingInCheck) {
            // Відновлюємо дошку
            this.board[from.row][from.col] = piece;
            this.board[to.row][to.col] = capturedPiece;
            return false;
        }
        // Хід валідний - зберігаємо його
        const move = {
            from,
            to,
            piece,
            capturedPiece: capturedPiece || undefined,
        };
        this.moveHistory.push(move);
        piece.hasMoved = true;
        this.updateBoardDisplay();
        return true;
    }
    makeBotMove() {
        if (this.currentPlayer !== "black" || this.gameResult !== "ongoing")
            return;
        const botMove = this.bot.getBestMove(this.board, "black");
        if (botMove) {
            if (this.makeMove(botMove.from, botMove.to)) {
                this.selectedPosition = null;
                this.switchPlayer();
                this.updateUI();
                this.checkGameEnd();
            }
        }
    }
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
    }
    updateUI() {
        const currentPlayerElement = document.getElementById("current-player");
        if (currentPlayerElement) {
            const playerText = this.currentPlayer === "white" ? "Хід білих" : "Хід чорних";
            currentPlayerElement.textContent = playerText;
        }
        const gameStatusElement = document.getElementById("game-status");
        if (gameStatusElement) {
            if (this.gameResult === "ongoing") {
                gameStatusElement.classList.add("hidden");
            }
            else {
                gameStatusElement.classList.remove("hidden");
                let statusText = "";
                switch (this.gameResult) {
                    case "white-wins":
                        statusText = "🏆 Білі перемогли!";
                        gameStatusElement.classList.add("winner");
                        break;
                    case "black-wins":
                        statusText = "🏆 Чорні перемогли!";
                        gameStatusElement.classList.add("winner");
                        break;
                    case "draw":
                        statusText = "🤝 Нічия!";
                        break;
                }
                gameStatusElement.textContent = statusText;
            }
        }
    }
    checkGameEnd() {
        const opponentColor = this.currentPlayer;
        // Перевіряємо мат
        if (PieceLogic.isCheckmate(this.board, opponentColor)) {
            this.gameResult = opponentColor === "white" ? "black-wins" : "white-wins";
            this.endGame();
            return;
        }
        // Перевіряємо чи король під шахом
        if (PieceLogic.isKingInCheck(this.board, opponentColor)) {
            console.log(`Шах ${opponentColor === "white" ? "білим" : "чорним"}!`);
        }
        // Можна додати перевірку на пат та інші умови нічиї
    }
    async endGame() {
        console.log(`🎮 Гра завершена: ${this.gameResult}`);
        // Зберігаємо результати гри
        const gameData = {
            startTime: this.gameStartTime,
            gameMode: this.gameMode,
            moveCount: this.moveHistory.length,
            result: this.gameResult,
            endTime: new Date(),
        };
        await this.gameHistory.saveGame(gameData);
        this.updateUI();
    }
}
//# sourceMappingURL=board.js.map