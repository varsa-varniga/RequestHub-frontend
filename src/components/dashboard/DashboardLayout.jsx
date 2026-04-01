// src/components/dashboard/DashboardLayout.jsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
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
  ChevronLeft,
  Dashboard as DashboardIcon,
  HelpOutline as HelpIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  NotificationsNone as NotificationsIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  ListAlt as ListAltIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useThemeMode } from "../../context/ThemeContext";
import { useUnreadNotificationsCount } from "../../hooks/useNotifications";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/user/dashboard", icon: <DashboardIcon fontSize="small" /> },
  { label: "Submit Request", path: "/user/create", icon: <AddCircleOutlineIcon fontSize="small" /> },
  { label: "My Requests", path: "/user/requests", icon: <ListAltIcon fontSize="small" /> },
  { label: "My Approvals", path: "/user/approvals", icon: <CheckCircleIcon fontSize="small" /> },
  { label: "Profile", path: "/user/profile", icon: <PersonIcon fontSize="small" /> },
  { label: "Help / Support", path: "/help", icon: <HelpIcon fontSize="small" /> },
];

const DRAWER_WIDTH_OPEN = 240;
const DRAWER_WIDTH_COLLAPSED = 88;

function NavItem({ item, selected, collapsed, onClick }) {
  return (
    <ListItemButton
      onClick={onClick}
      selected={selected}
      sx={{
        borderRadius: 1,
        py: 1.5,
        mb: 0.5,
        height: 40,
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        px: collapsed ? 1.5 : 2,
        bgcolor: selected ? "#e8f0ff" : "transparent",
        color: selected ? "#2563eb" : "#475569",
        fontWeight: selected ? 500 : 400,
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: selected ? "#e8f0ff" : "#f1f5f9",
          transform: "translateX(2px)",
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: collapsed ? 0 : 1.5,
          justifyContent: "center",
          color: selected ? "#2563eb" : "#475569",
        }}
      >
        {item.icon}
      </ListItemIcon>
      {!collapsed && <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500, fontSize: "0.95rem" }} />}
    </ListItemButton>
  );
}

function Sidebar({ collapsed, onToggle, onNavigate, activePath, onLogout, userName, userEmail }) {
  const initials = useMemo(() => {
    if (!userName && !userEmail) return "U";
    const seed = userName || userEmail;
    return seed.charAt(0).toUpperCase();
  }, [userEmail, userName]);

  return (
    <Paper
      elevation={0}
      sx={{
        width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_OPEN,
        height: "100vh",
        minHeight: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "width 0.2s ease",
        zIndex: 1200,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            opacity: collapsed ? 0 : 1,
            transition: "opacity 0.2s",
            display: collapsed ? "none" : "flex",
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: "linear-gradient(135deg, rgba(0,229,255,0.85), rgba(124,58,237,0.85))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DashboardIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
            RequestHub
          </Typography>
        </Stack>
        <IconButton
          size="small"
          onClick={onToggle}
          sx={{
            borderRadius: 2,
            bgcolor: "action.hover",
            width: 34,
            height: 34,
          }}
        >
          {collapsed ? <MenuIcon /> : <ChevronLeft />}
        </IconButton>
      </Box>

      <Divider sx={{ my: 1, borderColor: "divider" }} />

      <Box sx={{ flex: 1, minHeight: 0, px: 1.5, overflowY: "auto" }}>
        <List disablePadding>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              selected={activePath === item.path}
              collapsed={collapsed}
              onClick={() => onNavigate(item.path)}
            />
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: "divider" }} />

      <Box sx={{ px: 2, py: 2, mt: "auto", borderTop: "1px solid #e5e7eb" }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ opacity: collapsed ? 0 : 1, transition: "opacity 0.2s", display: collapsed ? "none" : "flex" }}>
          <Avatar sx={{ width: 38, height: 38, bgcolor: "primary.main" }}>{initials}</Avatar>
          <Box>
            <Typography variant="body2" fontWeight={700} color="text.primary">
              {userName || userEmail || "Employee"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {userEmail || "user@example.com"}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent={collapsed ? "center" : "space-between"} mt={2} spacing={1}>
          <Tooltip title="Profile">
            <IconButton size="small" onClick={() => onNavigate("/user/profile")}> 
              <PersonIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton size="small" onClick={onLogout}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Paper>
  );
}

function Topbar({ onOpenSidebar, showSearch, showMenu }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { mode, toggleMode } = useThemeMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useUnreadNotificationsCount(user?.id);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const displayName = user?.email?.split("@")[0] || "Employee";

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        width: "100%",
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: "background.default",
        backdropFilter: "blur(12px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 2 },
          py: 1.5,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {isSmall && (
            <IconButton
              onClick={onOpenSidebar}
              sx={{ borderRadius: 2, bgcolor: "action.hover" }}
              aria-label="Open navigation"
            >
              <MenuIcon />
            </IconButton>
          )}

          {showSearch && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                bgcolor: "action.hover",
                minWidth: 220,
              }}
            >
              <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              <InputBase
                placeholder="Search requests"
                sx={{ flex: 1, fontSize: 14, color: "text.primary" }}
                inputProps={{ "aria-label": "search" }}
              />
            </Box>
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.25}>
          <IconButton
            size="small"
            sx={{ bgcolor: "action.hover" }}
            onClick={toggleMode}
            aria-label="Toggle theme"
          >
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton
            size="small"
            sx={{ bgcolor: "action.hover" }}
            aria-label="Notifications"
            onClick={() => navigate("/user/notifications")}
          >
            <Badge badgeContent={unreadCount} color="error" invisible={unreadCount === 0}>
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            size="small"
            onClick={handleOpenMenu}
            sx={{ bgcolor: "action.hover" }}
            aria-label="User menu"
          >
            <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main" }}>
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleCloseMenu}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleCloseMenu}>
              <ListItemIcon>
                <HelpIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                logout();
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Box>
    </Box>
  );
}

export default function DashboardLayout({ children, showSearch = true, contentSx }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigate = (path) => {
    navigate(path);
    if (!isDesktop) setMobileOpen(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "background.default" }}>
      <Box
        component="nav"
        sx={{
          width: { md: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_OPEN },
          flexShrink: 0,
          display: { xs: "none", md: "block" },
        }}
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((p) => !p)}
          onNavigate={handleNavigate}
          activePath={location.pathname}
          onLogout={logout}
          userName={user?.email?.split("@")[0]}
          userEmail={user?.email}
        />
      </Box>

      {/* Mobile drawer */}
      <Box component="nav" sx={{ display: { xs: "block", md: "none" } }}>
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH_OPEN,
            },
          }}
        >
          <Sidebar
            collapsed={false}
            onToggle={() => setMobileOpen(false)}
            onNavigate={handleNavigate}
            activePath={location.pathname}
            onLogout={logout}
            userName={user?.email?.split("@")[0]}
            userEmail={user?.email}
          />
        </Drawer>
      </Box>

      <Box sx={{ flexGrow: 1, ml: { md: collapsed ? `${DRAWER_WIDTH_COLLAPSED}px` : `${DRAWER_WIDTH_OPEN}px` }, minWidth: 0 }}>
        <Topbar onOpenSidebar={() => setMobileOpen(true)} showSearch={showSearch} showMenu={collapsed} />
        <Box sx={{ px: 2, py: 3, maxWidth: 1200, mx: 0, ...contentSx }}>{children}</Box>
      </Box>
    </Box>
  );
}
