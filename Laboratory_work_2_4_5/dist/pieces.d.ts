export type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
export type PieceColor = "white" | "black";
export interface ChessPiece {
    type: PieceType;
    color: PieceColor;
    hasMoved?: boolean;
}
export interface Position {
    row: number;
    col: number;
}
export interface Move {
    from: Position;
    to: Position;
    piece: ChessPiece;
    capturedPiece?: ChessPiece;
}
export declare class PieceLogic {
    static readonly PIECE_UNICODE: Record<PieceColor, Record<PieceType, string>>;
    static getPieceUnicode(piece: ChessPiece): string;
    static isValidMove(board: (ChessPiece | null)[][], from: Position, to: Position): boolean;
    private static isValidPieceMove;
    private static isValidPawnMove;
    private static isValidRookMove;
    private static isValidKnightMove;
    private static isValidBishopMove;
    private static isValidQueenMove;
    private static isValidKingMove;
    private static isPathClear;
    static getPossibleMoves(board: (ChessPiece | null)[][], position: Position): Position[];
    static isKingInCheck(board: (ChessPiece | null)[][], kingColor: PieceColor): boolean;
    static isCheckmate(board: (ChessPiece | null)[][], kingColor: PieceColor): boolean;
}
//# sourceMappingURL=pieces.d.ts.map