// src/pages/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputBase,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AddCircleOutline,
  Brightness4,
  Brightness7,
  Dashboard,
  ErrorOutline,
  HelpOutline,
  Logout,
  Menu as MenuIcon,
  NotificationsNone,
  PendingActions,
  Search,
  Settings,
  TaskAlt,
  WarningAmber,
  History,
  ChevronLeft,
  ListAlt,
  Person as PersonIcon,
} from "@mui/icons-material";
import { sampleRequests } from "../data/mockRequests";
import { useThemeMode } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";

const NAV_ITEMS = [
  { label: "Dashboard", icon: <Dashboard fontSize="small" /> },
  { label: "Pending Approvals", icon: <PendingActions fontSize="small" /> },
  { label: "All Requests", icon: <ListAlt fontSize="small" /> },
  { label: "Workflow Management", icon: <TaskAlt fontSize="small" /> },
  { label: "SLA Management", icon: <WarningAmber fontSize="small" /> },
  { label: "User Management", icon: <PersonIcon fontSize="small" /> },
  { label: "Reports / Analytics", icon: <Dashboard fontSize="small" /> },
  { label: "Audit Logs", icon: <History fontSize="small" /> },
];

const STATUS_CONFIG = {
  Pending: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", icon: <PendingActions fontSize="small" /> },
  Approved: { color: "#22C55E", bg: "rgba(34,197,94,0.12)", icon: <TaskAlt fontSize="small" /> },
  Rejected: { color: "#EF4444", bg: "rgba(239,68,68,0.12)", icon: <ErrorOutline fontSize="small" /> },
  Escalated: { color: "#EAB308", bg: "rgba(234,179,8,0.14)", icon: <WarningAmber fontSize="small" /> },
};

const QUICK_SHORTCUTS = [
  { label: "IT Access", chip: "Access" },
  { label: "Hardware Request", chip: "Hardware" },
  { label: "Compliance Request", chip: "Compliance" },
];

function formatRelativeHours(hours) {
  if (hours <= 0) return "Due now";
  if (hours < 1) return "<1h";
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = Math.floor(hours / 24);
  const rem = Math.round(hours % 24);
  return `${days}d ${rem}h`;
}

function useRequestAnalytics(requests) {
  const now = useMemo(() => new Date(), []);

  const stats = useMemo(() => {
    const totals = { total: requests.length, Pending: 0, Approved: 0, Rejected: 0, Escalated: 0 };
    requests.forEach((r) => {
      totals[r.status] = (totals[r.status] || 0) + 1;
    });
    return totals;
  }, [requests]);

  const slaRisks = useMemo(
    () =>
      requests
        .map((r) => {
          const due = new Date(r.createdAt);
          due.setHours(due.getHours() + r.slaHours);
          const remaining = Math.max(0, (due.getTime() - now.getTime()) / 36e5);
          return { ...r, remaining };
        })
        .filter((r) => r.status === "Pending" || r.remaining < 24)
        .sort((a, b) => a.remaining - b.remaining),
    [requests, now]
  );

  const timeline = useMemo(() => {
    const items = [];
    requests.forEach((r) =>
      r.timeline?.forEach((t) => {
        items.push({ ...t, requestId: r.id });
      })
    );
    return items.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);
  }, [requests]);

  return { stats, slaRisks, timeline };
}

function Sidebar({ collapsed, onToggle, onLogout }) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: collapsed ? 86 : 264,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.22s ease",
        zIndex: 1200,
        overflow: "hidden",
      }}
    >
      <Box sx={{ px: collapsed ? 2 : 3, pt: 3, pb: 2, display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ opacity: collapsed ? 0 : 1, transition: "opacity 0.22s ease" }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: "linear-gradient(135deg, #6366F1, #22D3EE)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Dashboard sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight={800} letterSpacing="-0.02em">
            RequestHub
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onToggle} sx={{ bgcolor: "action.hover", borderRadius: 2 }}>
          {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeft fontSize="small" />}
        </IconButton>
      </Box>

      <List sx={{ flex: 1, px: 1, overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.label}
            selected={item.label === "Dashboard"}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              px: collapsed ? 1 : 2,
              justifyContent: collapsed ? "center" : "flex-start",
              color: item.label === "Dashboard" ? "primary.contrastText" : "text.secondary",
              bgcolor: item.label === "Dashboard" ? "primary.main" : "transparent",
              "&:hover": {
                bgcolor: item.label === "Dashboard" ? "primary.main" : "action.hover",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 1.5,
                color: item.label === "Dashboard" ? "primary.contrastText" : "text.secondary",
                display: "grid",
                placeItems: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700 }} />}
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <Box sx={{ px: collapsed ? 1.5 : 2.5, py: 2, display: "grid", rowGap: 1 }}>
        <Button variant="outlined" startIcon={<Settings fontSize="small" />} sx={{ display: collapsed ? "none" : "inline-flex" }}>
          Settings
        </Button>
        <Button variant="text" color="inherit" startIcon={<Logout fontSize="small" />} sx={{ justifyContent: collapsed ? "center" : "flex-start" }} onClick={onLogout}>
          Logout
        </Button>
      </Box>
    </Paper>
  );
}

function Header({ onMenuClick }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode, toggleMode } = useThemeMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);

  return (
    <Paper
      elevation={0}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
        px: { xs: 2, md: 3 },
        py: 1.5,
        backgroundColor: "background.paper",
        backdropFilter: "blur(10px)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {isMobile && (
            <IconButton onClick={onMenuClick} size="small" sx={{ borderRadius: 2, bgcolor: "action.hover" }}>
              <MenuIcon />
            </IconButton>
          )}
          <Paper
            variant="outlined"
            sx={{
              px: 2,
              py: 0.4,
              borderRadius: 2,
              backgroundColor: mode === "light" ? "#fff" : "rgba(255,255,255,0.04)",
              minWidth: 260,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Search sx={{ color: "text.secondary", fontSize: 20 }} />
              <InputBase placeholder="Search requests, people, teams..." sx={{ flex: 1 }} />
              <Chip label="⌘ K" size="small" variant="outlined" sx={{ fontSize: "0.75rem", height: 24, borderRadius: 1.2 }} />
            </Stack>
          </Paper>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Tooltip title="Theme">
            <IconButton onClick={toggleMode} sx={{ borderRadius: 2, bgcolor: "action.hover" }}>
              {mode === "light" ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton sx={{ borderRadius: 2, bgcolor: "action.hover" }}>
              <Badge color="warning" variant="dot">
                <NotificationsNone />
              </Badge>
            </IconButton>
          </Tooltip>

          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              cursor: "pointer",
              border: (t) => `2px solid ${t.palette.background.paper}`,
            }}
            onClick={(e) => setAnchor(e.currentTarget)}
          >
            {(user?.email || "A").charAt(0).toUpperCase()}
          </Avatar>
          <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} keepMounted>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
    </Paper>
  );
}

function StatCard({ label, value, color, icon, trend }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.2,
        borderRadius: 3,
        border: (t) => `1px solid ${t.palette.divider}`,
        background: (t) => (t.palette.mode === "light" ? "#fff" : "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))"),
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">
            {value}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={trend} size="small" sx={{ bgcolor: "rgba(34,197,94,0.12)", color: "#16A34A", fontWeight: 700 }} />
            <Typography variant="caption" color="text.secondary">
              vs last week
            </Typography>
          </Stack>
        </Stack>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            backgroundColor: color,
            color: "#fff",
            boxShadow: `0 10px 30px ${color}30`,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
}

function StatusChip({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        fontWeight: 700,
        borderRadius: 1.5,
      }}
      icon={cfg.icon}
    />
  );
}

export default function AdminDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [requests, setRequests] = useState(sampleRequests);
  const [filters, setFilters] = useState({ status: "ALL", urgency: "ALL", type: "ALL", q: "" });
  const [actionState, setActionState] = useState({ loading: false, comment: "", assignee: "" });
  const [collapsed, setCollapsed] = useState(false);
  const [workflowStages, setWorkflowStages] = useState([
    { name: "Manager", approver: "manager@example.com", slaHours: 12 },
    { name: "IT Team", approver: "it@example.com", slaHours: 24 },
    { name: "Compliance", approver: "compliance@example.com", slaHours: 48 },
    { name: "Security", approver: "security@example.com", slaHours: 24 },
  ]);
  const [userDraft, setUserDraft] = useState({ email: "", role: "EMPLOYEE" });
  const [requestTypes, setRequestTypes] = useState(["IT Access", "Hardware Request", "Software Installation", "Compliance Approval", "Security Access"]);
  const [newType, setNewType] = useState("");
  const { stats, slaRisks, timeline } = useRequestAnalytics(requests);
  const chartBg = theme.palette.mode === "light" ? "#E5E7EB" : "rgba(255,255,255,0.06)";

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/admin/requests", {
        params: {
          status: filters.status !== "ALL" ? filters.status : undefined,
          urgency: filters.urgency !== "ALL" ? filters.urgency : undefined,
          type: filters.type !== "ALL" ? filters.type : undefined,
          search: filters.q || undefined,
        },
      });
      setRequests(res.data || sampleRequests);
    } catch (err) {
      console.warn("Falling back to mock requests", err);
      setRequests(sampleRequests);
    }
  };

  const handleDecision = async (id, decision) => {
    setActionState((s) => ({ ...s, loading: true }));
    try {
      await API.post(`/admin/requests/${id}/decision`, {
        decision,
        comment: actionState.comment,
        assignee: actionState.assignee || undefined,
      });
      fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setActionState((s) => ({ ...s, loading: false, comment: "" }));
    }
  };

  const saveWorkflowConfig = async () => {
    try {
      await API.post("/admin/workflows", { stages: workflowStages });
    } catch (err) {
      console.error(err);
    }
  };

  const createUser = async () => {
    if (!userDraft.email) return;
    try {
      await API.post("/admin/users", userDraft);
      setUserDraft({ email: "", role: "EMPLOYEE" });
    } catch (err) {
      console.error(err);
    }
  };

  const addRequestType = async (value) => {
    if (!value) return;
    const updated = [...requestTypes, value];
    setRequestTypes(updated);
    setNewType("");
    try {
      await API.post("/admin/request-types", { types: updated });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = filters.status === "ALL" || req.status === filters.status;
    const matchesUrgency = filters.urgency === "ALL" || req.urgency?.toUpperCase() === filters.urgency;
    const matchesType = filters.type === "ALL" || req.type === filters.type;
    const matchesSearch = !filters.q || req.title.toLowerCase().includes(filters.q.toLowerCase()) || req.requester?.toLowerCase().includes(filters.q.toLowerCase());
    return matchesStatus && matchesUrgency && matchesType && matchesSearch;
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "background.default", minHeight: "100vh", overflowX: "hidden" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} onLogout={handleLogout} />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          ml: collapsed ? 86 : 264,
          transition: "margin-left 0.22s ease",
          backgroundImage:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle at 10% 20%, rgba(99,102,241,0.08), transparent 35%), radial-gradient(circle at 85% 10%, rgba(45,212,191,0.08), transparent 32%)"
              : "radial-gradient(circle at 12% 18%, rgba(99,102,241,0.08), transparent 30%), radial-gradient(circle at 80% 8%, rgba(16,185,129,0.08), transparent 28%)",
        }}
      >
        <Header onMenuClick={() => setCollapsed((p) => !p)} />

        <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} mb={3}>
            <Box>
              <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">
                Employee Requests
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track approvals, SLA risk, and activity across internal requests.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<History />} color="inherit">
                Activity Log
              </Button>
              <Button variant="contained" startIcon={<AddCircleOutline />}>
                Submit New Request
              </Button>
            </Stack>
          </Stack>

          {/* Stats */}
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12, lg: 15 }} mb={3}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StatCard label="Total Requests" value={stats.total} color="#6366F1" icon={<Dashboard />} trend="+8%" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StatCard label="Pending" value={stats.Pending} color="#F59E0B" icon={<PendingActions />} trend="+3%" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StatCard label="Approved" value={stats.Approved} color="#22C55E" icon={<TaskAlt />} trend="+5%" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StatCard label="Rejected" value={stats.Rejected} color="#EF4444" icon={<ErrorOutline />} trend="-1%" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StatCard label="SLA Alerts" value={slaRisks.length} color="#EAB308" icon={<WarningAmber />} trend="+2%" />
            </Grid>
          </Grid>

          {/* Quick actions */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: (t) => `1px solid ${t.palette.divider}`,
              mb: 3,
              background: theme.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.04)",
            }}
          >
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} alignItems={{ md: "center" }}>
              <Stack spacing={0.5}>
                <Typography variant="h6" fontWeight={800}>
                  Quick Actions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Launch common requests in one click.
                </Typography>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button variant="contained" startIcon={<AddCircleOutline />} sx={{ minWidth: 200 }}>
                  Submit New Request
                </Button>
                {QUICK_SHORTCUTS.map((item) => (
                  <Button key={item.label} variant="outlined" color="inherit" sx={{ minWidth: 160 }}>
                    {item.label}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Paper>

          <Grid container spacing={2} mb={2}>
            {/* Recent requests table */}
            <Grid item xs={12} lg={8}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: (t) => `1px solid ${t.palette.divider}`,
                  background: theme.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.04)",
                }}
              >
                <Stack spacing={1.5} mb={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={800}>
                      Recent Requests
                    </Typography>
                    <Button size="small" variant="outlined" color="inherit" onClick={fetchRequests}>
                      Refresh
                    </Button>
                  </Stack>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
                    <InputBase
                      placeholder="Search title or requester"
                      value={filters.q}
                      onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                      sx={{
                        px: 1.5,
                        py: 0.8,
                        border: (t) => `1px solid ${t.palette.divider}`,
                        borderRadius: 2,
                        flex: 1,
                        backgroundColor: theme.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.04)",
                      }}
                    />
                    {["status", "urgency", "type"].map((key) => (
                      <select
                        key={key}
                        value={filters[key]}
                        onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: `1px solid ${theme.palette.divider}`,
                          background: theme.palette.mode === "light" ? "#fff" : "#0f172a",
                          color: theme.palette.text.primary,
                          minWidth: 120,
                        }}
                      >
                        <option value="ALL">All {key}</option>
                        {key === "status" && ["Pending", "Approved", "Rejected", "Escalated"].map((v) => (
                          <option value={v} key={v}>{v}</option>
                        ))}
                        {key === "urgency" && ["HIGH", "MEDIUM", "LOW"].map((v) => (
                          <option value={v} key={v}>{v}</option>
                        ))}
                        {key === "type" && Array.from(new Set(requests.map((r) => r.type))).map((v) => (
                          <option value={v} key={v}>{v}</option>
                        ))}
                      </select>
                    ))}
                  </Stack>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
                    <InputBase
                      placeholder="Add comment for next action"
                      value={actionState.comment}
                      onChange={(e) => setActionState((s) => ({ ...s, comment: e.target.value }))}
                      sx={{
                        px: 1.5,
                        py: 0.8,
                        border: (t) => `1px solid ${t.palette.divider}`,
                        borderRadius: 2,
                        flex: 1,
                        backgroundColor: theme.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.04)",
                      }}
                    />
                    <InputBase
                      placeholder="Reassign to (email)"
                      value={actionState.assignee}
                      onChange={(e) => setActionState((s) => ({ ...s, assignee: e.target.value }))}
                      sx={{
                        px: 1.5,
                        py: 0.8,
                        border: (t) => `1px solid ${t.palette.divider}`,
                        borderRadius: 2,
                        minWidth: 220,
                        backgroundColor: theme.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.04)",
                      }}
                    />
                  </Stack>
                </Stack>

                <Box sx={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", minWidth: 920, borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Request Title", "Request Type", "Priority", "Status", "Current Stage", "SLA Remaining", "Created", "Actions"].map((col) => (
                          <th
                            key={col}
                            style={{
                              textAlign: "left",
                              padding: "10px 8px",
                              fontSize: "0.8rem",
                              color: theme.palette.text.secondary,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((req) => {
                        const slaRemainingHours = (() => {
                          const due = new Date(req.createdAt);
                          due.setHours(due.getHours() + req.slaHours);
                          return Math.max(0, (due.getTime() - Date.now()) / 36e5);
                        })();
                        return (
                          <tr key={req.id} style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <td style={{ padding: "12px 8px", fontWeight: 700 }}>{req.title}</td>
                            <td style={{ padding: "12px 8px" }}>
                              <Chip label={req.type} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1.5 }} />
                            </td>
                            <td style={{ padding: "12px 8px" }}>
                              <Chip
                                label={req.priority}
                                size="small"
                                sx={{
                                  borderRadius: 1.5,
                                  bgcolor: req.priority === "High" ? "rgba(239,68,68,0.12)" : "rgba(99,102,241,0.12)",
                                  color: req.priority === "High" ? "#DC2626" : "#4338CA",
                                  fontWeight: 700,
                                }}
                              />
                            </td>
                            <td style={{ padding: "12px 8px" }}>
                              <StatusChip status={req.status} />
                            </td>
                            <td style={{ padding: "12px 8px", color: theme.palette.text.secondary }}>{req.stage}</td>
                            <td style={{ padding: "12px 8px" }}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.min(100, (1 - Math.min(1, slaRemainingHours / Math.max(1, req.slaHours))) * 100)}
                                  sx={{
                                    width: 90,
                                    height: 6,
                                    borderRadius: 999,
                                    backgroundColor: chartBg,
                                    "& .MuiLinearProgress-bar": {
                                      background: slaRemainingHours < 8 ? "#EF4444" : slaRemainingHours < 24 ? "#F59E0B" : "#22C55E",
                                    },
                                  }}
                                />
                                <Typography variant="caption" color={slaRemainingHours < 8 ? "#EF4444" : slaRemainingHours < 24 ? "#F59E0B" : "text.secondary"}>
                                  {formatRelativeHours(slaRemainingHours)}
                                </Typography>
                              </Stack>
                            </td>
                            <td style={{ padding: "12px 8px", color: theme.palette.text.secondary }}>
                              {new Date(req.createdAt).toLocaleDateString()}
                            </td>
                            <td style={{ padding: "12px 8px" }}>
                              <Stack direction="row" spacing={0.5}>
                                <Button size="small" variant="outlined" onClick={() => handleDecision(req.id, "APPROVED")} disabled={actionState.loading}>
                                  Approve
                                </Button>
                                <Button size="small" color="error" variant="outlined" onClick={() => handleDecision(req.id, "REJECTED")} disabled={actionState.loading}>
                                  Reject
                                </Button>
                                <Button size="small" color="warning" variant="outlined" onClick={() => handleDecision(req.id, "ESCALATED")} disabled={actionState.loading}>
                                  Escalate
                                </Button>
                                <Button size="small" variant="text" onClick={() => handleDecision(req.id, "REASSIGN")} disabled={actionState.loading}>
                                  Reassign
                                </Button>
                              </Stack>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Box>
              </Paper>
            </Grid>

            {/* Timeline and SLA cards */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={2}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: (t) => `1px solid ${t.palette.divider}`,
                    background: theme.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.04)",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={800}>
                      Request Journey
                    </Typography>
                    <Chip label="Live" color="success" size="small" />
                  </Stack>

                  <Stack spacing={2.25}>
                    {timeline.map((item) => (
                      <Stack key={item.id} direction="row" spacing={1.5} alignItems="flex-start">
                        <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>{item.actor.charAt(0)}</Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={700} sx={{ lineHeight: 1.2 }}>
                            {item.actor} • {item.role}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {new Date(item.time).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.primary" }}>
                            {item.action}: {item.comment}
                          </Typography>
                          <Divider sx={{ my: 1.25 }} />
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: (t) => `1px solid ${t.palette.divider}`,
                    background: theme.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.04)",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={800}>
                      SLA Indicators
                    </Typography>
                    <Chip label={`${slaRisks.length} at risk`} color="warning" size="small" />
                  </Stack>

                  <Stack spacing={1.75}>
                    {slaRisks.map((r) => {
                      const severity = r.remaining < 8 ? "#EF4444" : "#F59E0B";
                      return (
                        <Stack
                          key={r.id}
                          direction="row"
                          alignItems="center"
                          spacing={1.25}
                          sx={{
                            p: 1.25,
                            borderRadius: 2,
                            border: (t) => `1px solid ${t.palette.divider}`,
                            backgroundColor: theme.palette.mode === "light" ? "rgba(254,240,138,0.18)" : "rgba(251,191,36,0.12)",
                          }}
                        >
                          <WarningAmber sx={{ color: severity }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight={700} lineHeight={1.2}>
                              {r.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Stage: {r.stage} • {r.requester}
                            </Typography>
                          </Box>
                          <Chip
                            label={formatRelativeHours(r.remaining)}
                            size="small"
                            sx={{ bgcolor: "rgba(0,0,0,0.04)", color: severity, fontWeight: 700, borderRadius: 1.5 }}
                          />
                        </Stack>
                      );
                    })}
                    {!slaRisks.length && (
                      <Typography variant="body2" color="text.secondary">
                        All requests are within SLA.
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>

          {/* Admin controls */}
          <Grid container spacing={2} mt={1} mb={4}>
            <Grid item xs={12} md={6} lg={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: (t) => `1px solid ${t.palette.divider}`,
                  background: theme.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.04)",
                  height: "100%",
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={800}>
                    Workflow Management
                  </Typography>
                  <Button size="small" variant="outlined" onClick={saveWorkflowConfig}>
                    Save
                  </Button>
                </Stack>
                <Stack spacing={1.5}>
                  {workflowStages.map((stage, idx) => (
                    <Stack key={stage.name} direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" width={24} color="text.secondary">
                        {idx + 1}.
                      </Typography>
                      <InputBase
                        value={stage.name}
                        onChange={(e) =>
                          setWorkflowStages((arr) =>
                            arr.map((s, i) => (i === idx ? { ...s, name: e.target.value } : s))
                          )
                        }
                        sx={{ px: 1, py: 0.8, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1.5, flex: 1 }}
                      />
                      <InputBase
                        value={stage.approver}
                        onChange={(e) =>
                          setWorkflowStages((arr) =>
                            arr.map((s, i) => (i === idx ? { ...s, approver: e.target.value } : s))
                          )
                        }
                        placeholder="Approver email"
                        sx={{ px: 1, py: 0.8, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1.5, flex: 1 }}
                      />
                      <InputBase
                        value={stage.slaHours}
                        onChange={(e) =>
                          setWorkflowStages((arr) =>
                            arr.map((s, i) => (i === idx ? { ...s, slaHours: Number(e.target.value) || 0 } : s))
                          )
                        }
                        type="number"
                        sx={{ width: 90, px: 1, py: 0.8, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1.5 }}
                        placeholder="SLA h"
                      />
                    </Stack>
                  ))}
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<AddCircleOutline />}
                    onClick={() => setWorkflowStages((arr) => [...arr, { name: "New Stage", approver: "", slaHours: 12 }])}
                  >
                    Add Stage
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: (t) => `1px solid ${t.palette.divider}`,
                  background: theme.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.04)",
                  height: "100%",
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={800}>
                    User Management
                  </Typography>
                  <Chip label="EMPLOYEE / APPROVER / ADMIN" size="small" />
                </Stack>
                <Stack spacing={1.5}>
                  <InputBase
                    placeholder="user@email.com"
                    value={userDraft.email}
                    onChange={(e) => setUserDraft((u) => ({ ...u, email: e.target.value }))}
                    sx={{ px: 1, py: 0.8, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1.5 }}
                  />
                  <select
                    value={userDraft.role}
                    onChange={(e) => setUserDraft((u) => ({ ...u, role: e.target.value }))}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: `1px solid ${theme.palette.divider}`,
                      background: theme.palette.mode === "light" ? "#fff" : "#0f172a",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {["EMPLOYEE", "APPROVER", "ADMIN"].map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={createUser}>
                      Create User
                    </Button>
                    <Button variant="outlined" color="inherit">
                      Deactivate
                    </Button>
                  </Stack>
                  <Divider />
                  <Typography variant="body2" color="text.secondary">
                    Manage approver assignments and deactivate stale accounts.
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: (t) => `1px solid ${t.palette.divider}`,
                  background: theme.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.04)",
                  height: "100%",
                }}
              >
                <Typography variant="h6" fontWeight={800} mb={2}>
                  Request Types & SLA
                </Typography>
                <Stack spacing={1.2}>
                  {requestTypes.map((type) => (
                    <Stack key={type} direction="row" spacing={1} alignItems="center">
                      <Chip label={type} size="small" color="primary" variant="outlined" />
                      <Button size="small" variant="text" color="inherit">
                        Configure Workflow
                      </Button>
                    </Stack>
                  ))}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <InputBase
                      placeholder="Add request type"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addRequestType(newType);
                        }
                      }}
                      sx={{ px: 1, py: 0.8, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1.5, flex: 1 }}
                    />
                    <Button variant="outlined" size="small" onClick={() => addRequestType(newType)}>
                      Add
                    </Button>
                  </Stack>
                  <Divider />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WarningAmber color="warning" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Track SLA breaches and overdue items. Escalations trigger notifications.
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
