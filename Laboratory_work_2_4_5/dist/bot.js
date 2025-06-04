// bot.ts - логіка бота
import { PieceLogic } from "./pieces.js";
export class ChessBot {
    constructor() {
        this.PIECE_VALUES = {
            pawn: 1,
            knight: 3,
            bishop: 3,
            rook: 5,
            queen: 9,
            king: 100,
        };
    }
    getBestMove(board, botColor) {
        const possibleMoves = this.getAllPossibleMoves(board, botColor);
        if (possibleMoves.length === 0) {
            return null;
        }
        // Оцінюємо всі можливі ходи
        const evaluatedMoves = possibleMoves.map((move) => ({
            ...move,
            score: this.evaluateMove(board, move, botColor),
        }));
        // Сортуємо ходи за оцінкою (від найкращого до найгіршого)
        evaluatedMoves.sort((a, b) => b.score - a.score);
        // Додаємо трохи рандомності до найкращих ходів
        const bestScore = evaluatedMoves[0].score;
        const goodMoves = evaluatedMoves.filter((move) => move.score >= bestScore - 0.5);
        const randomIndex = Math.floor(Math.random() * goodMoves.length);
        return goodMoves[randomIndex];
    }
    getAllPossibleMoves(board, color) {
        const moves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece.color === color) {
                    const piecePosition = { row, col };
                    const possibleMoves = PieceLogic.getPossibleMoves(board, piecePosition);
                    for (const targetPosition of possibleMoves) {
                        // Перевіряємо чи хід не залишає короля під шахом
                        if (this.isLegalMove(board, piecePosition, targetPosition, color)) {
                            moves.push({
                                from: piecePosition,
                                to: targetPosition,
                                score: 0,
                            });
                        }
                    }
                }
            }
        }
        return moves;
    }
    isLegalMove(board, from, to, color) {
        const piece = board[from.row][from.col];
        const capturedPiece = board[to.row][to.col];
        if (!piece)
            return false;
        // Симулюємо хід
        board[to.row][to.col] = piece;
        board[from.row][from.col] = null;
        // Перевіряємо чи король під шахом
        const kingInCheck = PieceLogic.isKingInCheck(board, color);
        // Відновлюємо дошку
        board[from.row][from.col] = piece;
        board[to.row][to.col] = capturedPiece;
        return !kingInCheck;
    }
    evaluateMove(board, move, botColor) {
        let score = 0;
        const piece = board[move.from.row][move.from.col];
        const targetPiece = board[move.to.row][move.to.col];
        if (!piece)
            return score;
        // Оцінка за взяття фігури
        if (targetPiece) {
            score += this.PIECE_VALUES[targetPiece.type];
            // Бонус за взяття більш цінною фігурою менш цінну
            if (this.PIECE_VALUES[piece.type] < this.PIECE_VALUES[targetPiece.type]) {
                score += 0.5;
            }
        }
        // Симулюємо хід для додаткової оцінки
        const originalPiece = board[move.to.row][move.to.col];
        board[move.to.row][move.to.col] = piece;
        board[move.from.row][move.from.col] = null;
        // Оцінка позиції
        score += this.evaluatePosition(board, move.to, piece, botColor);
        // Перевіряємо чи даємо шах противнику
        const opponentColor = botColor === "white" ? "black" : "white";
        if (PieceLogic.isKingInCheck(board, opponentColor)) {
            score += 2;
            // Великий бонус за мат
            if (PieceLogic.isCheckmate(board, opponentColor)) {
                score += 100;
            }
        }
        // Перевіряємо чи не підставляємо свого короля під шах
        if (PieceLogic.isKingInCheck(board, botColor)) {
            score -= 10;
        }
        // Відновлюємо дошку
        board[move.from.row][move.from.col] = piece;
        board[move.to.row][move.to.col] = originalPiece;
        return score;
    }
    evaluatePosition(board, position, piece, botColor) {
        let score = 0;
        // Позиційні бонуси для різних фігур
        switch (piece.type) {
            case "pawn":
                score += this.evaluatePawnPosition(position, botColor);
                break;
            case "knight":
                score += this.evaluateKnightPosition(position);
                break;
            case "bishop":
                score += this.evaluateBishopPosition(position);
                break;
            case "rook":
                score += this.evaluateRookPosition(board, position);
                break;
            case "queen":
                score += this.evaluateQueenPosition(position);
                break;
            case "king":
                score += this.evaluateKingPosition(position, botColor);
                break;
        }
        return score;
    }
    evaluatePawnPosition(position, color) {
        let score = 0;
        // Пішаки в центрі краще
        const centerCols = [3, 4];
        if (centerCols.includes(position.col)) {
            score += 0.2;
        }
        // Пішаки, що просунулися вперед
        const advancement = color === "black" ? position.row - 1 : 6 - position.row;
        score += advancement * 0.1;
        return score;
    }
    evaluateKnightPosition(position) {
        // Коні краще в центрі
        const distanceFromCenter = Math.abs(3.5 - position.row) + Math.abs(3.5 - position.col);
        return (7 - distanceFromCenter) * 0.1;
    }
    evaluateBishopPosition(position) {
        // Слони краще на довгих діагоналях
        let score = 0;
        // Центральні поля краще
        const distanceFromCenter = Math.abs(3.5 - position.row) + Math.abs(3.5 - position.col);
        score += (7 - distanceFromCenter) * 0.05;
        return score;
    }
    evaluateRookPosition(board, position) {
        let score = 0;
        // Тури краще на відкритих лініях
        let openFile = true;
        let openRank = true;
        // Перевіряємо вертикаль
        for (let row = 0; row < 8; row++) {
            if (row !== position.row && board[row][position.col]) {
                openFile = false;
                break;
            }
        }
        // Перевіряємо горизонталь
        for (let col = 0; col < 8; col++) {
            if (col !== position.col && board[position.row][col]) {
                openRank = false;
                break;
            }
        }
        if (openFile)
            score += 0.3;
        if (openRank)
            score += 0.3;
        return score;
    }
    evaluateQueenPosition(position) {
        // Королева краще не дуже рано виходити
        let score = 0;
        // Невеликий штраф за ранній вихід королеви
        if (position.row === 0 || position.row === 7) {
            score -= 0.1;
        }
        return score;
    }
    evaluateKingPosition(position, color) {
        let score = 0;
        // На початку гри король краще в безпеці (на задніх рядах)
        const backRank = color === "black" ? 0 : 7;
        if (position.row === backRank) {
            score += 0.2;
        }
        // Король краще в кутку для безпеки
        if (position.col <= 2 || position.col >= 5) {
            score += 0.1;
        }
        return score;
    }
}
//# sourceMappingURL=bot.js.map