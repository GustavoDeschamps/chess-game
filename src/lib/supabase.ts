import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your Supabase credentials.",
  );
}

export const supabase = createClient(url ?? "", anonKey ?? "");

export type GameRow = {
  id: string;
  user_id: string;
  pgn: string;
  result: "white_win" | "black_win" | "draw" | "in_progress";
  difficulty: number;
  created_at: string;
  completed_at: string | null;
  reviewed: boolean;
};

export type CoachMessageRow = {
  id: string;
  game_id: string;
  move_number: number;
  fen: string;
  commentary: string;
  created_at: string;
};
