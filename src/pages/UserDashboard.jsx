// src/pages/UserDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useThemeMode } from "../context/ThemeContext";
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
  HelpOutline,
  ListAlt,
  Menu as MenuIcon,
  NotificationsNone,
  PendingActions,
  Search,
  ChevronLeft,
  TaskAlt,
  ErrorOutline,
  WarningAmber,
  History,
  Person,
  Logout,
  CheckCircle,
} from "@mui/icons-material";
import { computeRequestSlaRemainingHours, computeSlaRemainingHours, mapRequestDto } from "../utils/requestUtils";
import { useUnreadNotificationsCount } from "../hooks/useNotifications";


const SIDEBAR_WIDTH = 264;
const SIDEBAR_COLLAPSED = 86;


const NAV_ITEMS = [
  { label: "Dashboard", path: "/user/dashboard", icon: <Dashboard fontSize="small" /> },
  { label: "Submit Request", path: "/user/create", icon: <AddCircleOutline fontSize="small" /> },
  { label: "My Requests", path: "/user/requests", icon: <ListAlt fontSize="small" /> },
  { label: "My Approvals", path: "/user/approvals", icon: <CheckCircle fontSize="small" /> },
  { label: "Help / Support", path: "/help", icon: <HelpOutline fontSize="small" /> },
];


const STATUS_CONFIG = {
  Pending: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  Approved: { color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
  Rejected: { color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  Escalated: { color: "#EAB308", bg: "rgba(234,179,8,0.14)" },
};






function formatRelativeHours(hours) {
  if (hours <= 0) return "Due now";
  if (hours < 1) return "<1h";
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = Math.floor(hours / 24);
  const rem = Math.round(hours % 24);
  return `${days}d ${rem}h`;
}


function Sidebar({ collapsed, isMobile, onToggle, onLogout, onNavigate, activePath }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const idleColor = isDark ? "#E6EEF9" : "#334155";
  const activeColor = isDark ? "#F8FBFF" : "#0f172a";
  const activeIconColor = isDark ? "#22D3EE" : "#0f172a";
  const activeBg = isDark ? "#123447" : "#dbeafe";
  const hoverBg = isDark ? "rgba(255,255,255,0.08)" : "action.hover";

  return (
    <Paper
      elevation={0}
      sx={{
        width: isMobile ? (collapsed ? 0 : SIDEBAR_WIDTH) : collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH,
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
        transform: isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
        transitionProperty: "width, transform",
      }}
    >
      <Box
        sx={{
          px: 2,
          pt: 3,
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          sx={{
            opacity: collapsed ? 0 : 1,
            transition: "opacity 0.22s ease",
            display: collapsed ? "none" : "flex",
          }}
        >
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
        <IconButton
          size="small"
          onClick={onToggle}
          sx={{ bgcolor: "action.hover", borderRadius: 2, width: 34, height: 34, flexShrink: 0 }}
        >
          {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeft fontSize="small" />}
        </IconButton>
      </Box>


      <List sx={{ flex: 1, minHeight: 0, px: 1, overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.label}
            selected={activePath === item.path}
            onClick={() => onNavigate(item.path)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              px: collapsed ? 1 : 2,
              justifyContent: collapsed ? "center" : "flex-start",
              color: activePath === item.path ? activeColor : idleColor,
              bgcolor: activePath === item.path ? activeBg : "transparent",
              border: activePath === item.path
                ? (isDark ? "1px solid rgba(103, 232, 249, 0.32)" : "1px solid #bfdbfe")
                : "1px solid transparent",
              fontWeight: activePath === item.path ? 700 : 600,
              boxShadow: activePath === item.path && isDark ? "0 10px 24px rgba(0, 0, 0, 0.28)" : "none",
              "&:hover": {
                bgcolor: activePath === item.path ? activeBg : hoverBg,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 1.5,
                color: activePath === item.path ? activeIconColor : idleColor,
                display: "grid",
                placeItems: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: activePath === item.path ? 700 : 600 }} />}
          </ListItemButton>
        ))}
      </List>


      <Divider />


      <Box sx={{ px: 2, py: 2, mt: "auto", display: "grid", rowGap: 1 }}>
        {!collapsed ? (
          <>
            <Button
              variant="text"
              color="inherit"
              startIcon={<Person fontSize="small" />}
              sx={{ justifyContent: "flex-start", fontWeight: 700 }}
              onClick={() => onNavigate("/user/profile")}
            >
              Profile
            </Button>
            <Button
              variant="text"
              color="inherit"
              startIcon={<Logout fontSize="small" />}
              sx={{ justifyContent: "flex-start", fontWeight: 700 }}
              onClick={onLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <Stack direction="column" spacing={1} alignItems="center">
            <Tooltip title="Profile" placement="right">
              <IconButton size="small" onClick={() => onNavigate("/user/profile")} sx={{ bgcolor: "action.hover" }}>
                <Person fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout" placement="right">
              <IconButton size="small" onClick={onLogout} sx={{ bgcolor: "action.hover" }}>
                <Logout fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
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
  const { unreadCount } = useUnreadNotificationsCount(user?.id);
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
              <Chip label="Cmd K" size="small" variant="outlined" sx={{ fontSize: "0.75rem", height: 24, borderRadius: 1.2 }} />
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
            <IconButton
              sx={{ borderRadius: 2, bgcolor: "action.hover" }}
              onClick={() => navigate("/user/notifications")}
            >
              <Badge color="error" badgeContent={unreadCount} invisible={unreadCount === 0}>
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
            {(user?.email || "U").charAt(0).toUpperCase()}
          </Avatar>
          <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} keepMounted>
            <MenuItem
              onClick={() => {
                setAnchor(null);
                navigate("/user/profile");
              }}
            >
              Profile
            </MenuItem>
            <MenuItem onClick={() => setAnchor(null)}>Settings</MenuItem>
            <MenuItem
              onClick={() => {
                setAnchor(null);
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
    />
  );
}


const formatLabel = (value) => {
  if (!value) return "";
  const text = value.toString().replace(/_/g, " ").toLowerCase();
  return text.replace(/\b\w/g, (c) => c.toUpperCase());
};


function StatCard({ label, value, color, icon, trend }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.2,
        borderRadius: 0,
        border: (t) => `1px solid ${t.palette.divider}`,
        height: "100%",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">
            {value}
          </Typography>
          <Chip label={trend} size="small" sx={{ bgcolor: "rgba(34,197,94,0.12)", color: "#16A34A", fontWeight: 700, width: "fit-content" }} />
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
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
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
          const remaining = r.status === "Pending"
            ? r.slaDeadline
              ? computeSlaRemainingHours(r.slaDeadline)
              : Math.max(0, (new Date(r.createdAt).getTime() + r.slaHours * 3600 * 1000 - now.getTime()) / 36e5)
            : null;
          return { ...r, remaining };
        })
        .filter((r) => r.status === "Pending" || (r.remaining != null && r.remaining < 24))
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


export default function UserDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [collapsed, setCollapsed] = useState(false);
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({ status: "ALL", urgency: "ALL", type: "ALL", q: "" });
  const [sortBy, setSortBy] = useState("created_desc");
  const REQUEST_TYPES = ["IT", "LEAVE", "EXPENSE", "PURCHASE", "ACCESS"];


  useEffect(() => {
    API.get("/user/requests")
      .then((res) => setRequests(res.data || []))
      .catch((err) => {
        console.error(err);
      });
  }, []);


  const normalizedRequests = requests.map((req) => ({
    ...mapRequestDto(req),
    timeline: req.timeline || req.journey || [],
  }));


  const filteredRequests = normalizedRequests.filter((req) => {
    const matchesStatus = filters.status === "ALL" || req.status === filters.status;
    const matchesUrgency = filters.urgency === "ALL" || req.urgency?.toUpperCase() === filters.urgency;
    const matchesType = filters.type === "ALL" || req.type === filters.type;
    const matchesSearch =
      !filters.q ||
      req.title?.toLowerCase().includes(filters.q.toLowerCase()) ||
      req.requester?.toLowerCase().includes(filters.q.toLowerCase());
    return matchesStatus && matchesUrgency && matchesType && matchesSearch;
  });


  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortBy === "created_asc") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "priority") return (b.urgency || "").localeCompare(a.urgency || "");
    if (sortBy === "sla") {
      const aSla = computeRequestSlaRemainingHours(a.slaDeadline, a.status);
      const bSla = computeRequestSlaRemainingHours(b.slaDeadline, b.status);
      return (aSla ?? Infinity) - (bSla ?? Infinity);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });


  const { stats, slaRisks, timeline } = useRequestAnalytics(normalizedRequests);
  const chartBg = theme.palette.mode === "light" ? "#E5E7EB" : "rgba(255,255,255,0.06)";


  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  const sidebarWidth = isMobile ? 0 : (collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH);
  const tableHeaderColor = theme.palette.mode === "light" ? "#475569" : "#D7E2F1";
  const tableMutedColor = theme.palette.mode === "light" ? theme.palette.text.secondary : "#B9C7DB";
  const highPriorityBg = theme.palette.mode === "light" ? "rgba(239,68,68,0.12)" : "rgba(248,113,113,0.18)";
  const highPriorityColor = theme.palette.mode === "light" ? "#DC2626" : "#FECACA";
  const mediumPriorityBg = theme.palette.mode === "light" ? "rgba(99,102,241,0.12)" : "rgba(129,140,248,0.18)";
  const mediumPriorityColor = theme.palette.mode === "light" ? "#4338CA" : "#C7D2FE";
  const riskChipBg = theme.palette.mode === "light" ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.08)";


  const handleNavigate = (path) => {
    navigate(path);
  };


  return (
    <Box sx={{ display: "flex", backgroundColor: "background.default", minHeight: "100vh", overflowX: "hidden" }}>
      <Sidebar
        collapsed={collapsed}
        isMobile={isMobile}
        onToggle={() => setCollapsed((p) => !p)}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        activePath={location.pathname}
      />


      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          ml: { xs: 0, md: `${sidebarWidth}px` },
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
                My Requests
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track approvals, SLA risk, and activity across your requests.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<History />} color="inherit">
                Activity
              </Button>
              <Button variant="contained" startIcon={<AddCircleOutline />} onClick={() => navigate("/user/create")}>
                Submit New Request
              </Button>
            </Stack>
          </Stack>


          {/* Stats */}
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12, lg: 15 }} mb={3} alignItems="stretch">
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StatCard label="Total Requests" value={stats.total} color="#6366F1" icon={<Dashboard />} trend="+6%" />
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
         


          <Grid container spacing={2} mb={2}>
            {/* Recent requests table */}
            <Grid item xs={12} lg={8}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
                <Stack spacing={1.5} mb={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={800}>
                      Recent Requests
                    </Typography>
                    <Button size="small" variant="outlined" color="inherit">
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
                        {key === "type" && REQUEST_TYPES.map((v) => (
                          <option value={v} key={v}>{v}</option>
                        ))}
                      </select>
                    ))}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: `1px solid ${theme.palette.divider}`,
                        background: theme.palette.mode === "light" ? "#fff" : "#0f172a",
                        color: theme.palette.text.primary,
                        minWidth: 140,
                      }}
                    >
                      <option value="created_desc">Newest</option>
                      <option value="created_asc">Oldest</option>
                      <option value="priority">Priority</option>
                      <option value="sla">SLA (Soonest)</option>
                    </select>
                  </Stack>
                </Stack>


                <Box sx={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", minWidth: 920, borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Request Title", "Request Type", "Priority", "Status", "Current Stage", "SLA Remaining", "Created"].map((col) => (
                          <th
                            key={col}
                            style={{
                              textAlign: "left",
                              padding: "10px 8px",
                              fontSize: "0.8rem",
                              color: tableHeaderColor,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              fontWeight: 700,
                            }}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                    {sortedRequests.map((req) => {
                      const slaRemainingHours = computeRequestSlaRemainingHours(req.slaDeadline, req.status);
                      return (
                          <tr
                            key={req.id}
                            style={{ borderBottom: `1px solid ${theme.palette.divider}`, cursor: "pointer" }}
                            onClick={() => navigate(`/requests/${req.id}`)}
                          >
                            <td style={{ padding: "12px 8px", fontWeight: 700 }}>
                              {req.title}
                            </td>
                            <td style={{ padding: "12px 8px" }}>
                              <Chip label={formatLabel(req.type)} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1.5 }} />
                            </td>
                            <td style={{ padding: "12px 8px" }}>
                              <Chip
                                label={formatLabel(req.priority)}
                                size="small"
                                sx={{
                                  borderRadius: 1.5,
                                  bgcolor: req.priority === "High" ? highPriorityBg : mediumPriorityBg,
                                  color: req.priority === "High" ? highPriorityColor : mediumPriorityColor,
                                  fontWeight: 700,
                                }}
                              />
                            </td>
                            <td style={{ padding: "12px 8px" }}>
                              <StatusChip status={req.status} />
                            </td>
                            <td style={{ padding: "12px 8px", color: tableMutedColor }}>{req.stage}</td>
                            <td style={{ padding: "12px 8px" }}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <LinearProgress
                                  variant="determinate"
                                  value={
                                    slaRemainingHours == null
                                      ? 0
                                      : Math.min(100, (1 - Math.min(1, slaRemainingHours / Math.max(1, req.slaHours))) * 100)
                                  }
                                  sx={{
                                    width: 90,
                                    height: 6,
                                    borderRadius: 999,
                                    backgroundColor: chartBg,
                                    "& .MuiLinearProgress-bar": {
                                      background: typeof slaRemainingHours === "number"
                                        ? slaRemainingHours < 8
                                          ? "#EF4444"
                                          : slaRemainingHours < 24
                                          ? "#F59E0B"
                                          : "#22C55E"
                                        : theme.palette.action.disabledBackground,
                                    },
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color={
                                    typeof slaRemainingHours === "number"
                                      ? slaRemainingHours < 8
                                        ? "#EF4444"
                                        : slaRemainingHours < 24
                                        ? "#F59E0B"
                                        : "text.secondary"
                                      : "text.secondary"
                                  }
                                >
                                  {slaRemainingHours == null ? "—" : formatRelativeHours(slaRemainingHours)}
                                </Typography>
                              </Stack>
                            </td>
                            <td style={{ padding: "12px 8px", color: theme.palette.text.secondary }}>
                              {new Date(req.createdAt).toLocaleDateString()}
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
              <Stack spacing={2} alignItems="stretch">
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}`, minHeight: 280, height: "100%" }}>
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
                            <Typography variant="body2" sx={{ color: tableMutedColor }}>
                              Stage: {r.stage} • {r.requester}
                            </Typography>
                          </Box>
                          <Chip label={formatRelativeHours(r.remaining)} size="small" sx={{ bgcolor: riskChipBg, color: severity, fontWeight: 700, borderRadius: 1.5 }} />
                        </Stack>
                      );
                    })}
                    {!slaRisks.length && (
                      <Typography variant="body2" sx={{ color: tableMutedColor }}>
                        All requests are within SLA.
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

