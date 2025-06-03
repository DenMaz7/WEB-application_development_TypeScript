export class PieceLogic {
    static getPieceUnicode(piece) {
        return this.PIECE_UNICODE[piece.color][piece.type];
    }
    static isValidMove(board, from, to) {
        const piece = board[from.row][from.col];
        if (!piece)
            return false;
        // Перевіряємо чи ціль не виходить за межі дошки
        if (to.row < 0 || to.row > 7 || to.col < 0 || to.col > 7) {
            return false;
        }
        // Перевіряємо чи не рухаємо фігуру на поле з фігурою того ж кольору
        const targetPiece = board[to.row][to.col];
        if (targetPiece && targetPiece.color === piece.color) {
            return false;
        }
        // Перевіряємо можливість ходу для конкретної фігури
        return this.isValidPieceMove(board, piece, from, to);
    }
    static isValidPieceMove(board, piece, from, to) {
        const rowDiff = to.row - from.row;
        const colDiff = to.col - from.col;
        const absRowDiff = Math.abs(rowDiff);
        const absColDiff = Math.abs(colDiff);
        switch (piece.type) {
            case "pawn":
                return this.isValidPawnMove(board, piece, from, to, rowDiff, colDiff);
            case "rook":
                return this.isValidRookMove(board, from, to, rowDiff, colDiff);
            case "knight":
                return this.isValidKnightMove(absRowDiff, absColDiff);
            case "bishop":
                return this.isValidBishopMove(board, from, to, rowDiff, colDiff, absRowDiff, absColDiff);
            case "queen":
                return this.isValidQueenMove(board, from, to, rowDiff, colDiff, absRowDiff, absColDiff);
            case "king":
                return this.isValidKingMove(absRowDiff, absColDiff);
            default:
                return false;
        }
    }
    static isValidPawnMove(board, piece, from, to, rowDiff, colDiff) {
        const direction = piece.color === "white" ? -1 : 1;
        const startRow = piece.color === "white" ? 6 : 1;
        const targetPiece = board[to.row][to.col];
        // Рух вперед на одну клітинку
        if (colDiff === 0 && rowDiff === direction && !targetPiece) {
            return true;
        }
        // Рух вперед на дві клітинки з початкової позиції
        if (colDiff === 0 &&
            rowDiff === 2 * direction &&
            from.row === startRow &&
            !targetPiece) {
            return true;
        }
        // Взяття по діагоналі
        if (Math.abs(colDiff) === 1 &&
            rowDiff === direction &&
            targetPiece &&
            targetPiece.color !== piece.color) {
            return true;
        }
        return false;
    }
    static isValidRookMove(board, from, to, rowDiff, colDiff) {
        // Тура рухається горизонтально або вертикально
        if (rowDiff !== 0 && colDiff !== 0)
            return false;
        return this.isPathClear(board, from, to);
    }
    static isValidKnightMove(absRowDiff, absColDiff) {
        // Кінь рухається буквою "Г"
        return ((absRowDiff === 2 && absColDiff === 1) ||
            (absRowDiff === 1 && absColDiff === 2));
    }
    static isValidBishopMove(board, from, to, rowDiff, colDiff, absRowDiff, absColDiff) {
        // Слон рухається по діагоналі
        if (absRowDiff !== absColDiff)
            return false;
        return this.isPathClear(board, from, to);
    }
    static isValidQueenMove(board, from, to, rowDiff, colDiff, absRowDiff, absColDiff) {
        // Королева рухається як тура або слон
        const isRookMove = rowDiff === 0 || colDiff === 0;
        const isBishopMove = absRowDiff === absColDiff;
        if (!isRookMove && !isBishopMove)
            return false;
        return this.isPathClear(board, from, to);
    }
    static isValidKingMove(absRowDiff, absColDiff) {
        // Король рухається на одну клітинку в будь-якому напрямку
        return (absRowDiff <= 1 && absColDiff <= 1 && (absRowDiff > 0 || absColDiff > 0));
    }
    static isPathClear(board, from, to) {
        const rowStep = from.row === to.row ? 0 : to.row - from.row > 0 ? 1 : -1;
        const colStep = from.col === to.col ? 0 : to.col - from.col > 0 ? 1 : -1;
        let currentRow = from.row + rowStep;
        let currentCol = from.col + colStep;
        while (currentRow !== to.row || currentCol !== to.col) {
            if (board[currentRow][currentCol] !== null) {
                return false;
            }
            currentRow += rowStep;
            currentCol += colStep;
        }
        return true;
    }
    static getPossibleMoves(board, position) {
        const moves = [];
        const piece = board[position.row][position.col];
        if (!piece)
            return moves;
        // Перевіряємо всі можливі позиції на дошці
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const targetPosition = { row, col };
                if (this.isValidMove(board, position, targetPosition)) {
                    moves.push(targetPosition);
                }
            }
        }
        return moves;
    }
    static isKingInCheck(board, kingColor) {
        // Знаходимо короля
        let kingPosition = null;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece.type === "king" && piece.color === kingColor) {
                    kingPosition = { row, col };
                    break;
                }
            }
            if (kingPosition)
                break;
        }
        if (!kingPosition)
            return false;
        // Перевіряємо чи якась фігура противника може атакувати короля
        const opponentColor = kingColor === "white" ? "black" : "white";
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece.color === opponentColor) {
                    if (this.isValidMove(board, { row, col }, kingPosition)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    static isCheckmate(board, kingColor) {
        // Спочатку перевіряємо чи король під шахом
        if (!this.isKingInCheck(board, kingColor)) {
            return false;
        }
        // Перевіряємо чи є можливі ходи для виходу з шаху
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece.color === kingColor) {
                    const possibleMoves = this.getPossibleMoves(board, { row, col });
                    for (const move of possibleMoves) {
                        // Симулюємо хід
                        const originalPiece = board[move.row][move.col];
                        board[move.row][move.col] = piece;
                        board[row][col] = null;
                        // Перевіряємо чи король все ще під шахом
                        const stillInCheck = this.isKingInCheck(board, kingColor);
                        // Відновлюємо дошку
                        board[row][col] = piece;
                        board[move.row][move.col] = originalPiece;
                        if (!stillInCheck) {
                            return false; // Знайдено хід для виходу з шаху
                        }
                    }
                }
            }
        }
        return true; // Мат
    }
}
// Unicode символи для шахових фігур
PieceLogic.PIECE_UNICODE = {
    white: {
        king: "♔",
        queen: "♕",
        rook: "♖",
        bishop: "♗",
        knight: "♘",
        pawn: "♙",
    },
    black: {
        king: "♚",
        queen: "♛",
        rook: "♜",
        bishop: "♝",
        knight: "♞",
        pawn: "♟",
    },
};
//# sourceMappingURL=main.js.map