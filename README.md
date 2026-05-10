# Chess Coach

A chess web app where you play against a Stockfish bot and get coached on every move by Claude. The coaching curriculum lives in `SKILL.md` so the same content powers both the in-app coach and a standalone Claude Desktop skill.

Working codename: **Misty Tulip**.

## v1 scaffold (this commit)

- Vite + React 19 + TypeScript + Tailwind v4
- Supabase auth (email magic link) + games schema
- `react-chessboard` + `chess.js` — play vs yourself in the browser, persists completed games to Supabase
- Routes: `/login`, `/play`, `/review`

**Not yet wired up** (next steps): Stockfish bot, Claude post-game review, marble piece art, deploy to Cloudflare Pages.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up Supabase**

   Create a project at [supabase.com](https://supabase.com), then run `supabase-schema.sql` in the SQL Editor.

3. **Configure env vars**

   ```bash
   cp .env.example .env
   # fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from Project Settings → API
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173). Sign in with email magic link, play a game.

## Project layout

```
src/
├── components/      Layout, Board, MoveList, GameControls
├── hooks/           useChessGame — wraps chess.js
├── lib/             supabase client, auth context
└── pages/           Login, Play, Review
supabase-schema.sql  games + coach_messages tables with RLS
```

## Plan & roadmap

Full plan at `~/.claude/plans/i-wanted-to-builld-misty-tulip.md`. v1 ships: play vs Stockfish bot + post-game Claude review. v2: Lichess game import, tactic puzzles. v3: structured lessons.
