// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import LandingPage    from "./pages/LandingPage";
import UserDashboard  from "./pages/UserDashboard";
import CreateRequest  from "./pages/CreateRequest";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* ── Public ────────────────────────────────── */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ── User (protected) ──────────────────────── */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/create"
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <CreateRequest />
          </ProtectedRoute>
        }
      />

      {/* ── Admin (protected) ─────────────────────── */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ── Fallback ──────────────────────────────── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;