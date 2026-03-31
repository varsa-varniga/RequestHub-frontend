// src/pages/ProfilePage.jsx
// React + MUI v5 — Full Profile Page
// Requires: @mui/material, @mui/icons-material, @emotion/react, @emotion/styled

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  Tune as TuneIcon,
  VerifiedUser as VerifiedUserIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Logout as LogoutIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Shield as ShieldIcon,
} from "@mui/icons-material";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import API from "../api/api";
import { useThemeMode } from "../context/ThemeContext";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const EMPTY_USER = { id: "", name: "", email: "", role: "USER", active: true };

const MOCK_USER = {
  id: "u-1002",
  name: "Samantha Lee",
  email: "samantha.lee@requesthub.io",
  role: "USER",
  active: true,
  createdAt: "January 12, 2024",
  emailVerified: true,
  lastLogin: "Today, 09:41 AM",
  lastPasswordChange: "14 days ago",
  activeSessions: 2,
};

// ─── Shared sx helpers ───────────────────────────────────────────────────────

const cardSx = (theme) => ({
  p: { xs: 2.5, sm: 3.5 },
  borderRadius: "18px",
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 2px 12px rgba(0,0,0,.35)"
      : "0 1px 4px rgba(0,0,0,.06), 0 4px 20px rgba(0,0,0,.05)",
  transition: "border-color .2s, box-shadow .2s",
  "&:hover": {
    borderColor: "primary.main",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 24px rgba(0,0,0,.5)"
        : "0 4px 24px rgba(0,0,0,.10)",
  },
});

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      mb={2.5}
      pb={2}
      sx={{ borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Box
        sx={{
          width: 36, height: 36, borderRadius: "10px",
          bgcolor: "primary.main",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 18, color: "#fff" }} />
      </Box>
      <Box>
        <Typography variant="subtitle1" fontWeight={800} lineHeight={1.2} letterSpacing="-.01em">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

function MetaPill({ icon: Icon, label }) {
  return (
    <Box
      sx={{
        display: "inline-flex", alignItems: "center", gap: 0.75,
        px: 1.25, py: 0.6, borderRadius: "8px",
        bgcolor: "action.hover", border: "1px solid", borderColor: "divider",
      }}
    >
      <Icon sx={{ fontSize: 13, color: "text.secondary" }} />
      <Typography variant="caption" color="text.secondary" fontWeight={500}>
        {label}
      </Typography>
    </Box>
  );
}

function FieldLabel({ children }) {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      fontWeight={700}
      letterSpacing=".05em"
      textTransform="uppercase"
      display="block"
      mb={0.75}
    >
      {children}
    </Typography>
  );
}

function PasswordStrengthBar({ password }) {
  const getStrength = (pw) => {
    if (!pw) return { score: 0, label: "", color: "grey.300" };
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    const levels = [
      { label: "Weak",   color: "error.main"  },
      { label: "Fair",   color: "warning.main" },
      { label: "Good",   color: "info.main"    },
      { label: "Strong", color: "success.main" },
    ];
    return { score: s, ...(levels[s - 1] || { label: "", color: "grey.400" }) };
  };

  const { score, label, color } = getStrength(password);
  if (!password) return null;

  return (
    <Box mt={0.75}>
      <Stack direction="row" spacing={0.5} mb={0.5}>
        {[1, 2, 3, 4].map((i) => (
          <Box
            key={i}
            sx={{
              flex: 1, height: 3, borderRadius: 4,
              bgcolor: i <= score ? color : "divider",
              transition: "background-color .3s",
            }}
          />
        ))}
      </Stack>
      <Typography variant="caption" sx={{ color, fontWeight: 700 }}>
        {label}
      </Typography>
    </Box>
  );
}

function PrefRow({ title, subtitle, checked, onChange }) {
  return (
    <Box
      sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        py: 1.75,
        borderBottom: "1px solid", borderColor: "divider",
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Box>
        <Typography variant="body2" fontWeight={700}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
      </Box>
      <Switch checked={checked} onChange={onChange} size="small" />
    </Box>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { mode, toggleMode } = useThemeMode();

  const [user, setUser]   = useState(EMPTY_USER);
  const [draft, setDraft] = useState(EMPTY_USER);
  const [loading, setLoading] = useState(false);

  // Edit profile state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [nameError, setNameError] = useState("");

  // Password state
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwErrors, setPwErrors] = useState({});

  // Preferences
  const [notifications, setNotifications] = useState(true);
  const [emailDigest, setEmailDigest]     = useState(false);

  // Toast
  const [toast, setToast] = useState({ open: false, type: "success", text: "" });
  const notify = useCallback((text, type = "success") => setToast({ open: true, type, text }), []);

  // ── Fetch ──
  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res  = await API.get("/auth/me");
      const data = { ...MOCK_USER, ...res.data };
      setUser(data); setDraft(data); setEditName(data.name);
    } catch {
      setUser(MOCK_USER); setDraft(MOCK_USER); setEditName(MOCK_USER.name);
      notify("Using mock profile data (API unavailable).", "warning");
    } finally {
      setLoading(false);
    }
  };

  // ── Avatar initials & completion ──
  const initials = useMemo(() => {
    const seed  = draft.name || draft.email || "U";
    const parts = seed.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : seed.slice(0, 2).toUpperCase();
  }, [draft.name, draft.email]);

  const completionPct = useMemo(() => {
    let s = 0;
    if (draft.name)          s += 25;
    if (draft.email)         s += 25;
    if (draft.emailVerified) s += 25;
    if (draft.id)            s += 25;
    return s;
  }, [draft]);

  // ── Edit handlers ──
  const handleEditToggle = () => {
    if (!editing) {
      setEditName(draft.name); setNameError(""); setEditing(true);
    } else {
      if (!editName.trim()) { setNameError("Name cannot be empty."); return; }
      setDraft((p) => ({ ...p, name: editName.trim() }));
      setEditing(false); setNameError("");
      notify("Profile updated successfully!");
    }
  };

  // ── Password handler ──
  const handlePasswordUpdate = () => {
    const errs = {};
    if (!passwordForm.current)                    errs.current = "Current password is required.";
    if (!passwordForm.next || passwordForm.next.length < 8) errs.next = "Must be at least 8 characters.";
    if (passwordForm.next !== passwordForm.confirm) errs.confirm = "Passwords do not match.";
    setPwErrors(errs);
    if (Object.keys(errs).length) return;
    setPasswordForm({ current: "", next: "", confirm: "" });
    setPwErrors({});
    notify("Password updated successfully!");
  };

  const pwToggle = (field) => setShowPw((p) => ({ ...p, [field]: !p[field] }));

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <DashboardLayout showSearch={false}>
      <Box sx={{ maxWidth: 980, mx: "auto", width: "100%" }}>
        <Stack spacing={3}>

          {/* ── Page Title ── */}
          <Box
            display="flex"
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography variant="h4" fontWeight={800} letterSpacing="-.03em">
                Account Settings
              </Typography>
              <Typography color="text.secondary" variant="body2" mt={0.5}>
                Manage your profile, security, and preferences.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={() => notify("You have been logged out.", "info")}
              sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700 }}
            >
              Logout
            </Button>
          </Box>

          {/* ══ PROFILE HEADER ══ */}
          <Paper elevation={0} sx={cardSx}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5} pb={2} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
              <Typography variant="subtitle1" fontWeight={800} letterSpacing="-.01em">
                Profile Overview
              </Typography>
              <Button
                variant={editing ? "contained" : "outlined"}
                size="small"
                startIcon={editing ? <SaveIcon /> : <EditIcon />}
                onClick={handleEditToggle}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 700,
                  ...(editing
                    ? { background: "linear-gradient(135deg,#2563eb,#0ea5e9)", boxShadow: "0 3px 10px rgba(37,99,235,.25)" }
                    : {}),
                }}
              >
                {editing ? "Save" : "Edit"}
              </Button>
            </Box>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              alignItems={{ xs: "center", sm: "flex-start" }}
            >
              {/* Avatar */}
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Avatar
                  sx={{
                    width: 88, height: 88,
                    background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                    fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-.02em",
                    boxShadow: "0 6px 20px rgba(37,99,235,.28)",
                  }}
                >
                  {initials}
                </Avatar>
                {draft.active && (
                  <Box
                    sx={{
                      position: "absolute", bottom: 4, right: 4,
                      width: 14, height: 14, borderRadius: "50%",
                      bgcolor: "success.main",
                      border: "2.5px solid", borderColor: "background.paper",
                    }}
                  />
                )}
              </Box>

              {/* Identity */}
              <Box flex={1} textAlign={{ xs: "center", sm: "left" }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "center", sm: "center" }}
                  spacing={1}
                  mb={0.5}
                >
                  {editing ? (
                    <TextField
                      value={editName}
                      onChange={(e) => { setEditName(e.target.value); setNameError(""); }}
                      size="small"
                      error={Boolean(nameError)}
                      helperText={nameError}
                      placeholder="Full name"
                      InputProps={{ sx: { borderRadius: "10px", fontWeight: 700 } }}
                      sx={{ minWidth: { xs: "100%", sm: 240 } }}
                    />
                  ) : (
                    <Typography variant="h5" fontWeight={800} letterSpacing="-.025em">
                      {draft.name || "Unnamed User"}
                    </Typography>
                  )}
                  {draft.emailVerified && (
                    <Tooltip title="Email verified">
                      <CheckCircleIcon sx={{ color: "success.main", fontSize: 20 }} />
                    </Tooltip>
                  )}
                </Stack>

                <Typography
                  variant="body2" color="text.secondary" mb={1.5}
                  sx={{ fontFamily: "monospace", fontSize: ".82rem" }}
                >
                  {draft.email}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent={{ xs: "center", sm: "flex-start" }}>
                  <Chip
                    label={draft.role} color="primary" size="small"
                    sx={{ fontWeight: 800, borderRadius: "8px", fontSize: ".68rem", letterSpacing: ".04em" }}
                  />
                  <Chip
                    icon={<CheckCircleIcon sx={{ fontSize: "13px !important" }} />}
                    label={draft.active ? "Active" : "Inactive"}
                    color={draft.active ? "success" : "default"}
                    size="small" variant="outlined"
                    sx={{ fontWeight: 700, borderRadius: "8px", fontSize: ".68rem" }}
                  />
                  <Chip
                    label={`ID: ${draft.id || "—"}`}
                    size="small" variant="outlined"
                    sx={{
                      fontWeight: 500, borderRadius: "8px", fontSize: ".68rem",
                      color: "text.secondary", fontFamily: "monospace", borderColor: "divider",
                    }}
                  />
                </Stack>
              </Box>
            </Stack>

            {/* Completion bar */}
            <Box mt={3} pt={2.5} sx={{ borderTop: "1px solid", borderColor: "divider" }}>
              <Box display="flex" justifyContent="space-between" mb={0.75}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Profile Completion
                </Typography>
                <Typography variant="caption" fontWeight={800} color="primary.main">
                  {completionPct}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={completionPct}
                sx={{
                  height: 6, borderRadius: 4, bgcolor: "action.hover",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    background: "linear-gradient(90deg, #2563eb, #0ea5e9)",
                  },
                }}
              />
              {completionPct < 100 && (
                <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                  Add a profile photo and phone number to reach 100%
                </Typography>
              )}
            </Box>
          </Paper>

          {/* ══ SECURITY ══ */}
          <Grid container spacing={2.5} alignItems="stretch">
            <Grid item xs={12} md={12}>
              <Paper elevation={0} sx={cardSx}>
                <SectionHeader
                  icon={LockIcon}
                  title="Security Settings"
                  subtitle="Update your password"
                />

                {/* Meta pills */}
                <Stack direction="row" spacing={1} flexWrap="wrap" mb={2.5}>
                  <MetaPill icon={AccessTimeIcon} label={`Last login: ${draft.lastLogin || "N/A"}`} />
                  <MetaPill icon={ShieldIcon}     label={`Password: ${draft.lastPasswordChange || "N/A"}`} />
                </Stack>

                <Stack spacing={2}>
                  {/* Current password */}
                  <Box>
                    <FieldLabel>Current Password</FieldLabel>
                    <TextField
                      type={showPw.current ? "text" : "password"}
                      value={passwordForm.current}
                      onChange={(e) => { setPasswordForm((p) => ({ ...p, current: e.target.value })); setPwErrors((e2) => ({ ...e2, current: "" })); }}
                      size="small" fullWidth
                      error={Boolean(pwErrors.current)}
                      helperText={pwErrors.current}
                      placeholder="Enter current password"
                      InputProps={{
                        sx: { borderRadius: "10px" },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => pwToggle("current")} edge="end">
                              {showPw.current ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {/* New password + strength */}
                  <Box>
                    <FieldLabel>New Password</FieldLabel>
                    <TextField
                      type={showPw.next ? "text" : "password"}
                      value={passwordForm.next}
                      onChange={(e) => { setPasswordForm((p) => ({ ...p, next: e.target.value })); setPwErrors((e2) => ({ ...e2, next: "" })); }}
                      size="small" fullWidth
                      error={Boolean(pwErrors.next)}
                      helperText={pwErrors.next}
                      placeholder="Min. 8 characters"
                      InputProps={{
                        sx: { borderRadius: "10px" },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => pwToggle("next")} edge="end">
                              {showPw.next ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <PasswordStrengthBar password={passwordForm.next} />
                  </Box>

                  {/* Confirm password */}
                  <Box>
                    <FieldLabel>Confirm Password</FieldLabel>
                    <TextField
                      type={showPw.confirm ? "text" : "password"}
                      value={passwordForm.confirm}
                      onChange={(e) => { setPasswordForm((p) => ({ ...p, confirm: e.target.value })); setPwErrors((e2) => ({ ...e2, confirm: "" })); }}
                      size="small" fullWidth
                      error={Boolean(pwErrors.confirm)}
                      helperText={
                        pwErrors.confirm ||
                        (passwordForm.confirm && passwordForm.confirm === passwordForm.next
                          ? "✓ Passwords match"
                          : "")
                      }
                      FormHelperTextProps={{
                        sx: {
                          color: !pwErrors.confirm && passwordForm.confirm && passwordForm.confirm === passwordForm.next
                            ? "success.main"
                            : "error.main",
                        },
                      }}
                      placeholder="Repeat new password"
                      InputProps={{
                        sx: { borderRadius: "10px" },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => pwToggle("confirm")} edge="end">
                              {showPw.confirm ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Stack>

                <Box mt={2.5}>
                  <Button
                    variant="contained" fullWidth
                    startIcon={<ShieldIcon />}
                    onClick={handlePasswordUpdate}
                    disabled={loading}
                    sx={{
                      borderRadius: "10px", textTransform: "none", fontWeight: 700, py: 1.2,
                      background: "linear-gradient(135deg,#2563eb,#0ea5e9)",
                      boxShadow: "0 3px 12px rgba(37,99,235,.3)",
                      "&:hover": {
                        background: "linear-gradient(135deg,#1d4ed8,#0284c7)",
                        boxShadow: "0 5px 18px rgba(37,99,235,.4)",
                      },
                    }}
                  >
                    Update Password
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* ══ PREFERENCES ══ */}
          <Paper elevation={0} sx={cardSx}>
            <SectionHeader
              icon={TuneIcon}
              title="Preferences"
              subtitle="Personalize your dashboard experience"
            />
            <PrefRow
              title="Dark Mode"
              subtitle="Switch between light and dark interface theme"
              checked={mode === "dark"}
              onChange={toggleMode}
            />
            <PrefRow
              title="Ticket Update Notifications"
              subtitle="Receive alerts when your tickets change status"
              checked={notifications}
              onChange={(e) => {
                setNotifications(e.target.checked);
                notify(e.target.checked ? "Notifications enabled." : "Notifications disabled.", "info");
              }}
            />
            <PrefRow
              title="Weekly Email Digest"
              subtitle="Summary of open and resolved tickets every Monday"
              checked={emailDigest}
              onChange={(e) => {
                setEmailDigest(e.target.checked);
                notify("Email digest preference saved.", "info");
              }}
            />
          </Paper>

          {/* ══ ACCOUNT METADATA ══ */}
          <Paper elevation={0} sx={cardSx}>
            <SectionHeader
              icon={VerifiedUserIcon}
              title="Account Metadata"
              subtitle="Read-only system information"
            />

            <Grid container>
              {[
                { label: "Account Created",    value: draft.createdAt || "Jan 12, 2024" },
                { label: "Email Verification", chip: <Chip icon={<CheckCircleIcon />} label="Verified" color="success" size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: "8px", fontSize: ".68rem" }} /> },
                { label: "User ID",            value: draft.id, mono: true },
                { label: "Active Sessions",    value: `${draft.activeSessions || 2} devices` },
                { label: "Two-Factor Auth",    chip: <Chip icon={<WarningIcon />} label="Not Enabled" color="warning" size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: "8px", fontSize: ".68rem" }} /> },
                { label: "API Access",         chip: <Chip label="Disabled" size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: "8px", fontSize: ".68rem", color: "text.secondary", borderColor: "divider" }} /> },
              ].map(({ label, value, mono, chip }, i) => (
                <Grid item xs={12} sm={6} key={label}>
                  <Box
                    sx={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      py: 1.5,
                      px: { sm: i % 2 === 1 ? 2 : 0 },
                      borderBottom: "1px solid", borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="caption" color="text.secondary"
                      fontWeight={700} letterSpacing=".05em" textTransform="uppercase"
                    >
                      {label}
                    </Typography>
                    {chip || (
                      <Typography
                        variant="body2" fontWeight={700}
                        sx={mono ? { fontFamily: "monospace", fontSize: ".78rem" } : {}}
                      >
                        {value}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

        </Stack>
      </Box>

      {/* ── Toast ── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.type}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          variant="filled"
          sx={{ borderRadius: "12px", fontWeight: 600 }}
        >
          {toast.text}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
