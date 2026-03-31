// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import LandingPage    from "./pages/LandingPage";
import UserDashboard  from "./pages/UserDashboard";
import CreateRequest  from "./pages/CreateRequest";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/Dashboard";
import AdminAllRequests from "./pages/admin/AllRequests";
import AdminPendingApprovals from "./pages/admin/PendingApprovals";
import AdminWorkflowManagement from "./pages/admin/WorkflowManagement";
import AdminSlaManagement from "./pages/admin/SlaManagement";
import AdminUserManagement from "./pages/admin/UserManagement";
import AdminReportsAnalytics from "./pages/admin/ReportsAnalytics";
import AdminAuditLogs from "./pages/admin/AuditLogs";
import AdminProfile from "./pages/admin/Profile";
import ProfilePage from "./pages/ProfilePage";
import HelpSupportPage from "./pages/HelpSupportPage";
import MyRequestsPage from "./pages/MyRequestsPage";
import RequestJourneyPage from "./pages/RequestJourneyPage";
import UserApprovals from "./pages/UserApprovals";
import TicketDetails from "./pages/TicketDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import GlobalStyles from "./wrapper/GlobalStyles";

function App() {
  return (
    <>
      <GlobalStyles />
      <Routes>
      {/* ── Public ────────────────────────────────── */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ── User (protected) ──────────────────────── */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={["USER", "MANAGER", "IT", "COMPLIANCE"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/create"
        element={
          <ProtectedRoute allowedRoles={["USER", "MANAGER", "IT", "COMPLIANCE"]}>
            <CreateRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/requests"
        element={
          <ProtectedRoute allowedRoles={["USER", "MANAGER", "IT", "COMPLIANCE"]}>
            <MyRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/requests/:id"
        element={
          <ProtectedRoute allowedRoles={["USER", "MANAGER", "IT", "COMPLIANCE"]}>
            <RequestJourneyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/:id"
        element={
          <ProtectedRoute allowedRoles={["USER", "MANAGER", "IT", "COMPLIANCE", "ADMIN"]}>
            <TicketDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/approvals"
        element={
          <ProtectedRoute allowedRoles={["USER", "MANAGER", "IT", "COMPLIANCE"]}>
            <UserApprovals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute allowedRoles={["USER", "MANAGER", "IT", "COMPLIANCE"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN", "MANAGER", "IT", "COMPLIANCE"]}>
            <HelpSupportPage />
          </ProtectedRoute>
        }
      />

      {/* ── Admin (protected) ─────────────────────── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="pending-approvals" element={<AdminPendingApprovals />} />
        <Route path="requests" element={<AdminAllRequests />} />
        <Route path="workflows" element={<AdminWorkflowManagement />} />
        <Route path="sla" element={<AdminSlaManagement />} />
        <Route path="users" element={<AdminUserManagement />} />
        <Route path="reports" element={<AdminReportsAnalytics />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* ── Fallback ──────────────────────────────── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </>
  );
}

export default App;
