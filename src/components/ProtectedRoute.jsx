import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  let activeUser = user;

  if (!activeUser) {
    try {
      activeUser = JSON.parse(localStorage.getItem("auth_user") || "null");
    } catch {
      activeUser = null;
    }
  }

  if (loading) return null;
  if (!activeUser) return <Navigate to="/login" replace />;

  const normalizedRole = (activeUser.role || "")
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
