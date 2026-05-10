import { useEffect, useRef } from "react";
import Board from "@/components/Board";
import MoveList from "@/components/MoveList";
import GameControls from "@/components/GameControls";
import { useChessGame } from "@/hooks/useChessGame";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function Play() {
  const game = useChessGame();
  const { session } = useAuth();
  const persistedGameIdRef = useRef<string | null>(null);

  const onDrop = (from: string, to: string) => game.makeMove(from, to);

  const onResign = () => {
    if (!confirm("Resign this game?")) return;
    game.resign(game.turn === "w" ? "white" : "black");
  };

  useEffect(() => {
    if (game.status === "in_progress") return;
    if (!session) return;
    if (persistedGameIdRef.current) return;

    const result =
      game.status === "checkmate" || game.status === "resigned"
        ? game.winner === "white"
          ? "white_win"
          : "black_win"
        : "draw";

    void (async () => {
      const { data, error } = await supabase
        .schema("chess")
        .from("games")
        .insert({
          user_id: session.user.id,
          pgn: game.pgn,
          result,
          difficulty: 5,
          completed_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (error) {
        console.error("Failed to save game", error);
        return;
      }
      persistedGameIdRef.current = data.id;
    })();
  }, [game.status, game.winner, game.pgn, session]);

  const onNewGame = () => {
    game.reset();
    persistedGameIdRef.current = null;
  };

  const turnLabel = game.turn === "w" ? "White to move" : "Black to move";
  const statusLabel = (() => {
    if (game.status === "checkmate")
      return `Checkmate — ${game.winner === "white" ? "White" : "Black"} wins`;
    if (game.status === "stalemate") return "Stalemate";
    if (game.status === "draw") return "Draw";
    if (game.status === "resigned")
      return `${game.winner === "white" ? "White" : "Black"} wins by resignation`;
    return game.inCheck ? `${turnLabel} — in check` : turnLabel;
  })();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-2xl font-serif text-walnut-900">{statusLabel}</h2>
        <p className="text-xs italic text-walnut-700/60">
          v1 scaffold · play vs yourself · bot coming soon
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem] gap-6">
        <div className="space-y-4">
          <Board fen={game.fen} onPieceDrop={onDrop} />
          <GameControls
            onNewGame={onNewGame}
            onResign={onResign}
            canResign={game.status === "in_progress" && game.history.length > 0}
          />
        </div>
        <MoveList history={game.history} />
      </div>
    </div>
  );
}
