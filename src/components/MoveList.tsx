import type { Move } from "chess.js";

type Props = {
  history: Move[];
};

export default function MoveList({ history }: Props) {
  const pairs: { num: number; white?: string; black?: string }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      num: i / 2 + 1,
      white: history[i]?.san,
      black: history[i + 1]?.san,
    });
  }

  return (
    <div className="rounded-md bg-cream-100 ring-1 ring-walnut-700/10 p-4 h-full max-h-[560px] overflow-y-auto">
      <h3 className="text-sm font-medium uppercase tracking-wider text-walnut-700/70 mb-3">
        Moves
      </h3>
      {pairs.length === 0 ? (
        <p className="text-sm text-walnut-700/50 italic">No moves yet</p>
      ) : (
        <ol className="space-y-1 font-sans text-sm">
          {pairs.map((p) => (
            <li key={p.num} className="grid grid-cols-[2rem_1fr_1fr] gap-2">
              <span className="text-walnut-700/50 tabular-nums">{p.num}.</span>
              <span className="text-walnut-900">{p.white ?? ""}</span>
              <span className="text-walnut-900">{p.black ?? ""}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
