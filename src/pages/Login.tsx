import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return null;
  if (session) return <Navigate to="/play" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/play` },
    });
    setSending(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-cream-50">
      <div className="w-full max-w-sm rounded-lg bg-cream-100 ring-1 ring-walnut-700/10 shadow-lg p-8">
        <h1 className="text-3xl font-serif text-walnut-900 mb-1">Chess Coach</h1>
        <p className="text-sm text-walnut-700/70 mb-6 italic">study room</p>

        {sent ? (
          <div className="space-y-3">
            <p className="text-walnut-900">Check your email.</p>
            <p className="text-sm text-walnut-700/70">
              We sent a magic link to <span className="font-medium">{email}</span>.
              Click it to sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="block text-sm text-walnut-700/80 mb-1.5">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-cream-50 ring-1 ring-walnut-700/20 focus:ring-2 focus:ring-walnut-700/40 outline-none text-walnut-900"
                placeholder="you@example.com"
              />
            </label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={sending}
              className="w-full px-4 py-2 rounded-md bg-walnut-800 text-cream-50 font-medium hover:bg-walnut-900 transition-colors disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send magic link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
