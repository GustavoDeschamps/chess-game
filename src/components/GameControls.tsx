import { Flag, RotateCcw } from "lucide-react";

type Props = {
  onNewGame: () => void;
  onResign: () => void;
  canResign: boolean;
};

export default function GameControls({ onNewGame, onResign, canResign }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onNewGame}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-walnut-800 text-cream-50 text-sm font-medium hover:bg-walnut-900 transition-colors"
      >
        <RotateCcw size={16} />
        New game
      </button>
      <button
        type="button"
        onClick={onResign}
        disabled={!canResign}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-cream-100 text-walnut-800 text-sm font-medium ring-1 ring-walnut-700/20 hover:bg-cream-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Flag size={16} />
        Resign
      </button>
    </div>
  );
}
