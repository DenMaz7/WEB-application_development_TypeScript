import { ChessPiece, PieceColor, Position } from "./pieces.js";
export interface BotMove {
    from: Position;
    to: Position;
    score: number;
}
export declare class ChessBot {
    private readonly PIECE_VALUES;
    getBestMove(board: (ChessPiece | null)[][], botColor: PieceColor): BotMove | null;
    private getAllPossibleMoves;
    private isLegalMove;
    private evaluateMove;
    private evaluatePosition;
    private evaluatePawnPosition;
    private evaluateKnightPosition;
    private evaluateBishopPosition;
    private evaluateRookPosition;
    private evaluateQueenPosition;
    private evaluateKingPosition;
}
//# sourceMappingURL=bot.d.ts.map