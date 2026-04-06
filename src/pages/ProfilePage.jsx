import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Lock,
  Palette,
  PersonOutline,
  NotificationsActive,
  Save,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import API from "../api/api";
import { useThemeMode } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const EMPTY_USER = {
  id: "",
  name: "",
  email: "",
  role: "USER",
  active: true,
  phone: "",
  department: "General",
  roleNumber: "",
  createdAt: "",
  emailVerified: false,
  lastLogin: "",
  lastPasswordChange: "",
  activeSessions: 0,
};

const MOCK_USER = {
  id: "u-1002",
  name: "Samantha Lee",
  email: "samantha.lee@requesthub.io",
  role: "USER",
  active: true,
  phone: "+91 9876543210",
  department: "General",
  roleNumber: "135",
  createdAt: "January 12, 2024",
  emailVerified: true,
  lastLogin: "Today, 09:41 AM",
  lastPasswordChange: "14 days ago",
  activeSessions: 2,
};

const SECTION_ITEMS = [
  { key: "profile", label: "Profile Info", icon: PersonOutline },
  { key: "password", label: "Change Password", icon: Lock },
  { key: "notifications", label: "Notification Preferences", icon: NotificationsActive },
  { key: "appearance", label: "Appearance", icon: Palette },
];

function getShellStyles(theme) {
  const isDark = theme.palette.mode === "dark";

  return {
    pageBg: isDark
      ? "linear-gradient(180deg, #0f172a 0%, #111b32 100%)"
      : "linear-gradient(180deg, #f6f8fc 0%, #eef3fb 100%)",
    sideBg: isDark ? "rgba(30, 41, 59, 0.82)" : "rgba(255, 255, 255, 0.9)",
    panelBg: isDark ? "rgba(30, 41, 59, 0.9)" : "rgba(255, 255, 255, 0.96)",
    fieldBg: isDark ? "#223049" : "#f8fafc",
    activeBg: isDark ? "#294777" : "#dbeafe",
    idleBg: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(15, 23, 42, 0.03)",
    border: isDark ? "rgba(148, 163, 184, 0.18)" : "rgba(148, 163, 184, 0.22)",
    muted: isDark ? "#C7D4E8" : "#475569",
    shadow: isDark ? "0 24px 60px rgba(2, 6, 23, 0.38)" : "0 24px 60px rgba(15, 23, 42, 0.12)",
  };
}

function SectionButton({ item, active, onClick }) {
  const theme = useTheme();
  const styles = getShellStyles(theme);
  const Icon = item.icon;

  return (
    <Button
      fullWidth
      onClick={onClick}
      startIcon={<Icon fontSize="small" />}
      sx={{
        justifyContent: "flex-start",
        px: 2,
        py: 1.5,
        borderRadius: "14px",
        color: active ? (theme.palette.mode === "dark" ? "#FFFFFF" : "#0f172a") : "text.primary",
        bgcolor: active ? styles.activeBg : styles.idleBg,
        border: active ? (theme.palette.mode === "dark" ? "1px solid rgba(191, 219, 254, 0.85)" : "1px solid #93c5fd") : `1px solid ${styles.border}`,
        fontSize: "0.94rem",
        fontWeight: active ? 700 : 600,
        textTransform: "none",
        boxShadow: active ? (theme.palette.mode === "dark" ? "0 8px 24px rgba(15, 23, 42, 0.35)" : "0 10px 24px rgba(59, 130, 246, 0.12)") : "none",
        gap: 1,
        whiteSpace: "nowrap",
        "& .MuiButton-startIcon": {
          marginRight: 0,
          marginLeft: 0,
          flexShrink: 0,
          color: active ? (theme.palette.mode === "dark" ? "#22D3EE" : "#1d4ed8") : "inherit",
        },
        "&:hover": {
          bgcolor: active ? styles.activeBg : styles.idleBg,
        },
      }}
    >
      {item.label}
    </Button>
  );
}

function ProfileFields({ draft, editing, onChange, initials }) {
  const theme = useTheme();
  const styles = getShellStyles(theme);

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: styles.fieldBg,
      borderRadius: "14px",
      fontWeight: 600,
    },
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "180px minmax(0, 1fr)" },
        gap: { xs: 3, md: 4 },
        alignItems: "start",
      }}
    >
      <Box>
        <Typography fontSize="0.85rem" color={styles.muted} mb={1.25}>
          Profile Photo
        </Typography>
        <Paper
          elevation={0}
          sx={{
            width: 128,
            height: 128,
            borderRadius: "20px",
            bgcolor: styles.fieldBg,
            border: `1px solid ${styles.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            sx={{
              width: 88,
              height: 88,
              bgcolor: "primary.main",
              color: "#fff",
              fontSize: "2rem",
              fontWeight: 800,
            }}
          >
            {initials}
          </Avatar>
        </Paper>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 2.25,
        }}
      >
        <Box sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}>
            <Typography fontSize="0.92rem" fontWeight={700} color="text.primary" mb={0.9}>
              Full Name
            </Typography>
            <TextField
              fullWidth
              value={draft.name}
              onChange={(e) => onChange("name", e.target.value)}
              disabled={!editing}
              sx={fieldSx}
            />
        </Box>

        <Box sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}>
            <Typography fontSize="0.92rem" fontWeight={700} color="text.primary" mb={0.9}>
              Email
            </Typography>
            <TextField
              fullWidth
              value={draft.email}
              onChange={(e) => onChange("email", e.target.value)}
              disabled={!editing}
              sx={fieldSx}
            />
        </Box>

        <Box>
            <Typography fontSize="0.92rem" fontWeight={700} color="text.primary" mb={0.9}>
              Phone Number
            </Typography>
            <TextField
              fullWidth
              value={draft.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              disabled={!editing}
              placeholder="+91 1234567890"
              sx={fieldSx}
            />
        </Box>

        <Box>
            <Typography fontSize="0.92rem" fontWeight={700} color="text.primary" mb={0.9}>
              Department
            </Typography>
            <TextField
              select
              fullWidth
              value={draft.department}
              onChange={(e) => onChange("department", e.target.value)}
              disabled={!editing}
              sx={fieldSx}
            >
              {["General", "Operations", "IT", "Compliance", "Finance"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
        </Box>

        <Box>
            <Typography fontSize="0.92rem" fontWeight={700} color="text.primary" mb={0.9}>
              Role
            </Typography>
            <TextField fullWidth value={draft.role} disabled sx={fieldSx} />
        </Box>

        <Box>
            <Typography fontSize="0.92rem" fontWeight={700} color="text.primary" mb={0.9}>
              Role Number / ID
            </Typography>
            <TextField
              fullWidth
              value={draft.roleNumber}
              onChange={(e) => onChange("roleNumber", e.target.value)}
              disabled={!editing}
              sx={fieldSx}
            />
        </Box>
      </Box>
    </Box>
  );
}

function NotificationRows({ values, onToggle }) {
  const theme = useTheme();
  const styles = getShellStyles(theme);

  const rows = [
    { key: "notifications", title: "Ticket Update Notifications", subtitle: "Receive alerts when your request status changes" },
    { key: "emailDigest", title: "Weekly Email Digest", subtitle: "Get a summary of open and resolved requests" },
  ];

  return (
    <Stack divider={<Divider sx={{ borderColor: styles.border }} />}>
      {rows.map((row) => (
        <Box key={row.key} sx={{ py: 0.95, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.25 }}>
          <Box>
            <Typography fontWeight={700}>{row.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {row.subtitle}
            </Typography>
          </Box>
          <Checkbox
            checked={values[row.key]}
            onChange={(e) => onToggle(row.key, e.target.checked)}
            sx={{
              color: "primary.main",
              p: 0.25,
              ml: 1,
              "&.Mui-checked": { color: "primary.main" },
            }}
          />
        </Box>
      ))}
    </Stack>
  );
}

function AppearanceFields({ selectedTheme, fontSize, onThemeChange, onFontSizeChange }) {
  const theme = useTheme();
  const styles = getShellStyles(theme);

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: styles.fieldBg,
      borderRadius: "14px",
      fontWeight: 600,
    },
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        columnGap: { xs: 0, md: 4 },
        rowGap: 2,
        alignItems: "start",
      }}
    >
      <Box>
        <Typography fontSize="0.92rem" fontWeight={700} color="text.primary" mb={0.9}>
          Theme
        </Typography>
        <TextField select fullWidth value={selectedTheme} onChange={(e) => onThemeChange(e.target.value)} sx={fieldSx}>
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
        </TextField>
      </Box>
      <Box>
        <Typography fontSize="0.92rem" fontWeight={700} color="text.primary" mb={0.9}>
          Font Size
        </Typography>
        <TextField select fullWidth value={fontSize} onChange={(e) => onFontSizeChange(e.target.value)} sx={fieldSx}>
          <MenuItem value="small">Small</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="large">Large</MenuItem>
        </TextField>
      </Box>
    </Box>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = getShellStyles(theme);
  const { mode, toggleMode } = useThemeMode();
  const { user: authUser } = useAuth();

  const [activeSection, setActiveSection] = useState("profile");
  const [draft, setDraft] = useState(EMPTY_USER);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwErrors, setPwErrors] = useState({});
  const [notifications, setNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(mode);
  const [fontSize, setFontSize] = useState("medium");
  const [toast, setToast] = useState({ open: false, type: "success", text: "" });

  const notify = useCallback((text, type = "success") => setToast({ open: true, type, text }), []);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    setSelectedTheme(mode);
  }, [mode]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get("/auth/me");
      const nextUser = {
        ...MOCK_USER,
        ...res.data,
        phone: res.data?.phone || MOCK_USER.phone,
        department: res.data?.department || MOCK_USER.department,
        roleNumber: res.data?.roleNumber || String(res.data?.id || MOCK_USER.roleNumber).replace(/^[A-Za-z-]+/, "") || MOCK_USER.roleNumber,
      };
      setDraft(nextUser);
    } catch {
      setDraft(MOCK_USER);
      notify("Using mock profile data because the profile API is unavailable.", "warning");
    } finally {
      setLoading(false);
    }
  };

  const initials = useMemo(() => {
    const seed = draft.name || draft.email || "U";
    const parts = seed.trim().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : seed.slice(0, 2).toUpperCase();
  }, [draft.name, draft.email]);

  const handleDraftChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    if (!draft.name.trim()) {
      notify("Name cannot be empty.", "error");
      return;
    }
    setEditing(false);
    notify("Profile updated successfully.");
  };

  const handlePasswordUpdate = async () => {
    const nextErrors = {};
    if (!passwordForm.current) nextErrors.current = "Current password is required.";
    if (!passwordForm.next || passwordForm.next.length < 8) nextErrors.next = "Password must be at least 8 characters.";
    if (passwordForm.next !== passwordForm.confirm) nextErrors.confirm = "Passwords do not match.";
    setPwErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const targetId = authUser?.id || draft?.id;
    if (!targetId) {
      notify("Unable to update password because the user id was not found.", "error");
      return;
    }

    setPwLoading(true);
    try {
      await API.post(`/users/${targetId}/change-password`, {
        oldPassword: passwordForm.current,
        newPassword: passwordForm.next,
      });
      const nextUser = { ...draft, lastPasswordChange: "Just now" };
      setDraft(nextUser);
      setPasswordForm({ current: "", next: "", confirm: "" });
      setPwErrors({});
      notify("Password updated successfully.");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Password update failed.";
      notify(message, "error");
    } finally {
      setPwLoading(false);
    }
  };

  const handleAppearanceSave = () => {
    if (selectedTheme !== mode) {
      toggleMode();
    }
    notify(`Appearance settings saved. Font size preference: ${fontSize}.`);
  };

  const actionBySection = {
    profile: (
      <Button
        variant={editing ? "contained" : "outlined"}
        startIcon={editing ? <Save /> : <Edit />}
        onClick={editing ? handleSaveProfile : () => setEditing(true)}
        sx={{ borderRadius: "14px", px: 2.25, fontWeight: 700, textTransform: "none" }}
      >
        {editing ? "Save" : "Edit"}
      </Button>
    ),
    password: (
      <Button
        variant="contained"
        onClick={handlePasswordUpdate}
        disabled={loading || pwLoading}
        sx={{ borderRadius: "14px", px: 2.25, fontWeight: 700, textTransform: "none" }}
      >
        Update Password
      </Button>
    ),
    notifications: (
      <Button
        variant="contained"
        onClick={() => notify("Notification preferences saved.")}
        sx={{ borderRadius: "14px", px: 2.25, fontWeight: 700, textTransform: "none" }}
      >
        Save Preferences
      </Button>
    ),
    appearance: (
      <Button
        variant="contained"
        onClick={handleAppearanceSave}
        sx={{ borderRadius: "14px", px: 2.25, fontWeight: 700, textTransform: "none" }}
      >
        Save Settings
      </Button>
    ),
  };

  const panelMinHeight = activeSection === "profile" ? 520 : activeSection === "password" ? 360 : 220;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: styles.pageBg,
        p: { xs: 2, md: 3.5 },
      }}
    >
      <Stack spacing={3}>
        <Box display="flex" alignItems={{ xs: "flex-start", md: "center" }} justifyContent="space-between" gap={2} flexWrap="wrap">
          <Box>
            <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">
              User Profile
            </Typography>
            <Typography color={styles.muted} variant="body1" mt={0.6}>
              Manage your account securely
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: "16px",
              px: 2.2,
              py: 1.1,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: styles.shadow,
            }}
          >
            Back
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "320px minmax(0, 1fr)" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 1.8,
                borderRadius: "20px",
                bgcolor: styles.sideBg,
                border: `1px solid ${styles.border}`,
                boxShadow: styles.shadow,
                backdropFilter: "blur(16px)",
                maxWidth: 300,
              }}
            >
              <Stack spacing={1.2}>
                {SECTION_ITEMS.map((item) => (
                  <SectionButton
                    key={item.key}
                    item={item}
                    active={activeSection === item.key}
                    onClick={() => setActiveSection(item.key)}
                  />
                ))}
              </Stack>
            </Paper>
          </Box>

          <Box>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "24px",
                bgcolor: styles.panelBg,
                border: `1px solid ${styles.border}`,
                boxShadow: styles.shadow,
                overflow: "hidden",
                backdropFilter: "blur(16px)",
                minHeight: panelMinHeight,
              }}
            >
              <Box
                sx={{
                  px: { xs: 2, md: 3 },
                  py: 2.2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  borderBottom: `1px solid ${styles.border}`,
                }}
              >
                <Typography variant="h6" fontWeight={800}>
                  {SECTION_ITEMS.find((item) => item.key === activeSection)?.label}
                </Typography>
                {actionBySection[activeSection]}
              </Box>

              <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.25 } }}>
                {activeSection === "profile" && (
                  <Stack spacing={3.2}>
                    <ProfileFields draft={draft} editing={editing} onChange={handleDraftChange} initials={initials} />
                  </Stack>
                )}

                {activeSection === "password" && (
                  <Stack spacing={2.2}>
                    {[
                      { key: "current", label: "Current Password", placeholder: "Enter current password" },
                      { key: "next", label: "New Password", placeholder: "Enter new password" },
                      { key: "confirm", label: "Confirm New Password", placeholder: "Confirm new password" },
                    ].map((field) => (
                      <Box key={field.key}>
                        <Typography fontSize="0.92rem" fontWeight={700} color="text.primary" mb={0.9}>
                          {field.label}
                        </Typography>
                        <TextField
                          fullWidth
                          type={showPw[field.key] ? "text" : "password"}
                          value={passwordForm[field.key]}
                          onChange={(e) => {
                            setPasswordForm((prev) => ({ ...prev, [field.key]: e.target.value }));
                            setPwErrors((prev) => ({ ...prev, [field.key]: "" }));
                          }}
                          error={Boolean(pwErrors[field.key])}
                          helperText={pwErrors[field.key] || " "}
                          placeholder={field.placeholder}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: styles.fieldBg,
                              borderRadius: "14px",
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPw((prev) => ({ ...prev, [field.key]: !prev[field.key] }))}>
                                  {showPw[field.key] ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    ))}

                    <Typography variant="body2" color={styles.muted}>
                      Password policy: minimum 8 characters, include at least 1 number and 1 special character.
                    </Typography>
                  </Stack>
                )}

                {activeSection === "notifications" && (
                  <NotificationRows
                    values={{ notifications, emailDigest }}
                    onToggle={(key, checked) => {
                      if (key === "notifications") setNotifications(checked);
                      if (key === "emailDigest") setEmailDigest(checked);
                    }}
                  />
                )}

                {activeSection === "appearance" && (
                  <AppearanceFields
                    selectedTheme={selectedTheme}
                    fontSize={fontSize}
                    onThemeChange={setSelectedTheme}
                    onFontSizeChange={setFontSize}
                  />
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Stack>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          variant="filled"
          sx={{ borderRadius: "12px", fontWeight: 600 }}
        >
          {toast.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
