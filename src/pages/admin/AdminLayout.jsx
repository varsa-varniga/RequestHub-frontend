// src/pages/admin/AdminLayout.jsx
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputBase,
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
  Dashboard,
  PendingActions,
  ListAlt,
  TaskAlt,
  WarningAmber,
  History,
  Menu as MenuIcon,
  ChevronLeft,
  NotificationsNone,
  Brightness4,
  Brightness7,
  Logout,
  Settings,
  Person as PersonIcon,
  Search,
} from "@mui/icons-material";
import { useThemeMode } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { AdminDataProvider } from "../../context/AdminDataContext";
import { useUnreadNotificationsCount } from "../../hooks/useNotifications";


const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <Dashboard fontSize="small" /> },
  { label: "Pending Approvals", path: "/admin/pending-approvals", icon: <PendingActions fontSize="small" /> },
  { label: "All Requests", path: "/admin/requests", icon: <ListAlt fontSize="small" /> },
  { label: "Workflow Management", path: "/admin/workflows", icon: <TaskAlt fontSize="small" /> },
  { label: "SLA Management", path: "/admin/sla", icon: <WarningAmber fontSize="small" /> },
  { label: "User Management", path: "/admin/users", icon: <PersonIcon fontSize="small" /> },
 
];


function Sidebar({ collapsed, onToggle, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();


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
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              px: collapsed ? 1 : 2,
              justifyContent: collapsed ? "center" : "flex-start",
              color: location.pathname === item.path ? "primary.contrastText" : "text.secondary",
              bgcolor: location.pathname === item.path ? "primary.main" : "transparent",
              "&:hover": {
                bgcolor: location.pathname === item.path ? "primary.main" : "action.hover",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 1.5,
                color: location.pathname === item.path ? "primary.contrastText" : "text.secondary",
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


      <Box sx={{ px: 2, py: 2, mt: "auto", display: "grid", rowGap: 1 }}>
        {!collapsed ? (
          <>
            <Button
              variant="text"
              color="inherit"
              startIcon={<PersonIcon fontSize="small" />}
              sx={{ justifyContent: "flex-start" }}
              onClick={() => navigate("/admin/profile")}
            >
              Profile
            </Button>


            <Button
              variant="text"
              color="inherit"
              startIcon={<Logout fontSize="small" />}
              sx={{ justifyContent: "flex-start" }}
              onClick={onLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <Stack direction="column" spacing={1} alignItems="center">
            <Tooltip title="Profile" placement="right">
              <IconButton size="small" onClick={() => navigate("/admin/profile")} sx={{ bgcolor: "action.hover" }}>
                <PersonIcon fontSize="small" />
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
            <IconButton
              sx={{ borderRadius: 2, bgcolor: "action.hover" }}
              onClick={() => navigate("/admin/notifications")}
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
            {(user?.email || "A").charAt(0).toUpperCase()}
          </Avatar>
          <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} keepMounted>
            <MenuItem
              onClick={() => {
                setAnchor(null);
                navigate("/admin/profile");
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


export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));


  return (
    <AdminDataProvider>
      <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", overflowX: "hidden" }}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} onLogout={logout} />
        <Box
          sx={{
            minWidth: 0,
            pl: isDesktop ? (collapsed ? "86px" : "264px") : 0,
            transition: "padding-left 0.22s ease",
            backgroundImage:
              "radial-gradient(circle at 10% 20%, rgba(99,102,241,0.08), transparent 35%), radial-gradient(circle at 85% 10%, rgba(45,212,191,0.08), transparent 32%)",
          }}
        >
          <Header onMenuClick={() => setCollapsed((p) => !p)} />
          <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </AdminDataProvider>
  );
}
