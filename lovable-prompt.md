# Lovable Prompt — Chess Coach App (v1 scaffold)

Paste the block below into Lovable as a fresh project. It scaffolds steps 1–2 + 5 of the plan (Vite + React + Tailwind + Supabase + auth + react-chessboard play-vs-self). Stockfish, the Coach Edge Function, and the marble piece art come **after** Lovable, by hand, since Lovable struggles with Web Workers and CORS headers.

---

## The prompt

```
Build a chess coaching web app called "Chess Coach" (working codename: Misty Tulip). Stack: Vite + React + TypeScript + Tailwind + Supabase. Make it a PWA (manifest + service worker, installable on iOS/Android).

Visual aesthetic: warm, calm, "study room" feel. Cream/ivory background, dark walnut wood accents, soft drop shadows. NOT cartoonish, NOT neon. Think a classical chess club, not a video game UI. Use a serif headline font (Cormorant Garamond or Playfair Display) and a clean sans-serif body font (Inter).

Use these exact libraries:
- react-chessboard (for the board UI)
- chess.js (for move validation and game state)
- @supabase/supabase-js (auth + database)
- react-router-dom (routing)
- lucide-react (icons)

Pages:
1. /login — Supabase email magic link auth. Single centered card with logo + email field.
2. /play — Logged-in users land here. Full chess board centered, move list to the right, "New Game" / "Resign" buttons below the board. For now, allow play-vs-self (both colors playable from the same browser) — we'll add a bot in a later step. Use react-chessboard with default piece set for now (we'll swap to marble pieces later). Show whose turn it is, last move in algebraic notation, and check/checkmate state.
3. /review — Placeholder page that reads "Post-game review with Coach (coming soon)" — we'll build this after the bot is wired up.

Routing:
- Unauthenticated users hitting any route → redirect to /login
- After login → redirect to /play
- Top nav with "Play" / "Review" links and a sign-out button

Supabase schema (write a migration):
- `games` table: id (uuid pk), user_id (uuid fk to auth.users), pgn (text), result (text: 'white_win' | 'black_win' | 'draw' | 'in_progress'), difficulty (int, default 5, range 1-10), created_at (timestamptz default now()), completed_at (timestamptz nullable), reviewed (boolean default false)
- `coach_messages` table: id (uuid pk), game_id (uuid fk to games), move_number (int), fen (text), commentary (text), created_at (timestamptz default now())
- RLS: users can only read/write their own games and the coach_messages for their own games.

Persistence behavior on /play:
- When a game ends (checkmate, stalemate, or resignation), insert a row into `games` with the final PGN
- During play, debounce-save the in-progress PGN every 5 moves so a refresh doesn't lose progress

Code style:
- TypeScript everywhere, strict mode
- Prefer functional components with hooks
- Keep the chess game state in a single `useChessGame` custom hook that wraps a chess.js instance and exposes { fen, pgn, moves, makeMove, reset, status }
- Tailwind for all styling, no separate CSS files except a global theme file with the cream/walnut palette

Out of scope for this first scaffold (do NOT include):
- Stockfish or any chess engine integration
- Coach commentary / AI features
- Lichess integration
- Custom marble piece art (just use react-chessboard defaults)

When done, the app should let me sign in, play a full game against myself, and have the final PGN persist to Supabase.
```

---

## What to do after Lovable finishes

1. Clone the generated repo locally next to `Sudoku/` and `Chess/` (Lovable will give you a GitHub URL).
2. Verify the app runs: sign in, play a game, check the row appears in the Supabase `games` table.
3. Come back here. Next steps we'll do by hand:
   - Add `stockfish.wasm` in a Web Worker → bot mode at chosen difficulty
   - Add the marble piece set (custom SVG/PNG art via `customPieces` prop)
   - Build the Supabase `/coach` Edge Function
   - Write `SKILL.md` (we can start this in parallel right now while Lovable runs)
   - Add `_headers` for Cloudflare Pages COOP/COEP
   - Deploy

## Why this prompt is shaped the way it is

- **Locked library choices** so Lovable doesn't pick alternatives and we have to retrofit later.
- **No engine, no AI** in v1 scaffold — Lovable's track record with Web Workers and WASM is poor; we'll add Stockfish manually with full control over the worker setup.
- **Default pieces** so we don't waste a Lovable round on visual polish before the logic works. Marble pieces are a 30-min job once we have the asset files.
- **Schema upfront** so the data model is locked from day one — `coach_messages` keyed by `game_id` + `move_number` lets us cache Claude commentary indefinitely and never re-bill the API for the same review.
