import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Play from "@/pages/Play";
import Review from "@/pages/Review";
import { useAuth } from "@/lib/auth";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Navigate to="/play" replace />} />
        <Route path="/play" element={<Play />} />
        <Route path="/review/:gameId?" element={<Review />} />
      </Route>
      <Route path="*" element={<Navigate to="/play" replace />} />
    </Routes>
  );
}
