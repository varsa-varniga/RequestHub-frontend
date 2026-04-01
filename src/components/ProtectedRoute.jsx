import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const normalizedRole = (user.role || "")
    .toString()
    .toUpperCase()
    .replace(/^ROLE_/, "");
  const normalizedAllowed = allowedRoles.map((r) =>
    (r || "").toString().toUpperCase().replace(/^ROLE_/, "")
  );

  // Check if user's role is allowed
  if (normalizedAllowed.length && !normalizedAllowed.includes(normalizedRole)) {
    return <Navigate to="/login" replace />; // or show "not authorized"
  }

  return children;
}
