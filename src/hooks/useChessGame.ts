import { useCallback, useMemo, useRef, useState } from "react";
import { Chess, type Move } from "chess.js";

export type GameStatus =
  | "in_progress"
  | "checkmate"
  | "stalemate"
  | "draw"
  | "resigned";

export type ChessGameApi = {
  fen: string;
  pgn: string;
  history: Move[];
  turn: "w" | "b";
  inCheck: boolean;
  status: GameStatus;
  winner: "white" | "black" | null;
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  reset: () => void;
  resign: (loser: "white" | "black") => void;
};

export function useChessGame(): ChessGameApi {
  const gameRef = useRef(new Chess());
  const [, force] = useState(0);
  const [status, setStatus] = useState<GameStatus>("in_progress");
  const [winner, setWinner] = useState<"white" | "black" | null>(null);

  const refresh = useCallback(() => force((n) => n + 1), []);

  const computeStatus = useCallback((g: Chess): { s: GameStatus; w: typeof winner } => {
    if (g.isCheckmate()) {
      return { s: "checkmate", w: g.turn() === "w" ? "black" : "white" };
    }
    if (g.isStalemate()) return { s: "stalemate", w: null };
    if (g.isDraw() || g.isThreefoldRepetition() || g.isInsufficientMaterial()) {
      return { s: "draw", w: null };
    }
    return { s: "in_progress", w: null };
  }, []);

  const makeMove = useCallback(
    (from: string, to: string, promotion = "q") => {
      const g = gameRef.current;
      try {
        const move = g.move({ from, to, promotion });
        if (!move) return false;
        const next = computeStatus(g);
        setStatus(next.s);
        setWinner(next.w);
        refresh();
        return true;
      } catch {
        return false;
      }
    },
    [computeStatus, refresh],
  );

  const reset = useCallback(() => {
    gameRef.current = new Chess();
    setStatus("in_progress");
    setWinner(null);
    refresh();
  }, [refresh]);

  const resign = useCallback(
    (loser: "white" | "black") => {
      setStatus("resigned");
      setWinner(loser === "white" ? "black" : "white");
      refresh();
    },
    [refresh],
  );

  const api = useMemo<ChessGameApi>(() => {
    const g = gameRef.current;
    return {
      fen: g.fen(),
      pgn: g.pgn(),
      history: g.history({ verbose: true }) as Move[],
      turn: g.turn(),
      inCheck: g.inCheck(),
      status,
      winner,
      makeMove,
      reset,
      resign,
    };
  }, [makeMove, reset, resign, status, winner]);

  return api;
}
