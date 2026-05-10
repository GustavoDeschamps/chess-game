-- ============================================
-- CHESS COACH — SUPABASE SCHEMA
-- Run this in: Supabase Dashboard → SQL Editor
--
-- Creates a `chess` schema and the chess tables inside it.
-- Safe to run in a project that already hosts other apps in
-- their own schemas (e.g. `sudoku`, `public`).
--
-- After running, expose the `chess` schema in:
--   Project Settings → Data API → Settings → Exposed schemas
-- ============================================

create schema if not exists chess;

-- ----------------------------------------
-- GAMES
-- One row per completed (or in-progress) game
-- ----------------------------------------
create table chess.games (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  pgn           text not null,
  result        text not null check (result in ('white_win', 'black_win', 'draw', 'in_progress')),
  difficulty    integer not null default 5 check (difficulty between 1 and 10),
  created_at    timestamptz not null default now(),
  completed_at  timestamptz,
  reviewed      boolean not null default false
);

-- ----------------------------------------
-- COACH MESSAGES
-- Cached Claude commentary keyed by (game_id, move_number)
-- so we never re-bill the API for the same review
-- ----------------------------------------
create table chess.coach_messages (
  id           uuid default gen_random_uuid() primary key,
  game_id      uuid references chess.games(id) on delete cascade not null,
  move_number  integer not null,
  fen          text not null,
  commentary   text not null,
  created_at   timestamptz not null default now(),
  unique(game_id, move_number)
);

-- ============================================
-- INDEXES
-- ============================================
create index on chess.games(user_id, created_at desc);
create index on chess.games(user_id) where reviewed = false;
create index on chess.coach_messages(game_id, move_number);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- GAMES: users can only see/modify their own
alter table chess.games enable row level security;
create policy "Users view own games"
  on chess.games for select using (auth.uid() = user_id);
create policy "Users insert own games"
  on chess.games for insert with check (auth.uid() = user_id);
create policy "Users update own games"
  on chess.games for update using (auth.uid() = user_id);
create policy "Users delete own games"
  on chess.games for delete using (auth.uid() = user_id);

-- COACH MESSAGES: users can only see/insert messages for games they own
alter table chess.coach_messages enable row level security;
create policy "Users view coach messages for own games"
  on chess.coach_messages for select using (
    exists (
      select 1 from chess.games
      where chess.games.id = chess.coach_messages.game_id
        and chess.games.user_id = auth.uid()
    )
  );
create policy "Users insert coach messages for own games"
  on chess.coach_messages for insert with check (
    exists (
      select 1 from chess.games
      where chess.games.id = chess.coach_messages.game_id
        and chess.games.user_id = auth.uid()
    )
  );
