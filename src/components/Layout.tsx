import { Link, NavLink, Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Layout() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-walnut-700/15 bg-cream-100/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link to="/play" className="flex items-baseline gap-2">
            <span className="text-2xl font-serif font-semibold text-walnut-800">
              Chess Coach
            </span>
            <span className="text-xs text-walnut-700/60 italic">study room</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <NavLink
              to="/play"
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? "text-walnut-900 font-medium"
                    : "text-walnut-700/70 hover:text-walnut-900"
                }`
              }
            >
              Play
            </NavLink>
            <NavLink
              to="/review"
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? "text-walnut-900 font-medium"
                    : "text-walnut-700/70 hover:text-walnut-900"
                }`
              }
            >
              Review
            </NavLink>
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex items-center gap-1.5 text-walnut-700/70 hover:text-walnut-900 transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
