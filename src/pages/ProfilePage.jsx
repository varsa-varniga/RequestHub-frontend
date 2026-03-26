// src/pages/ProfilePage.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import API from "../api/api";
import { useThemeMode } from "../context/ThemeContext";

const EMPTY_USER = {
  id: "",
  name: "",
  email: "",
  role: "EMPLOYEE",
  active: true,
};

const MOCK_USER = {
  id: "u-1002",
  name: "Samantha Lee",
  email: "samantha.lee@requesthub.io",
  role: "EMPLOYEE",
  active: true,
};

export default function ProfilePage() {
  const { mode, toggleMode } = useThemeMode();
  const [user, setUser] = useState(EMPTY_USER);
  const [draft, setDraft] = useState(EMPTY_USER);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "success", text: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const cardSx = {
    p: 3,
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#fff",
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/users/me");
      const data = res.data || EMPTY_USER;
      setUser(data);
      setDraft(data);
    } catch (err) {
      setUser(MOCK_USER);
      setDraft(MOCK_USER);
      setMessage({ type: "error", text: "Using mock profile data (API unavailable)." });
    } finally {
      setLoading(false);
    }
  };

  const initials = useMemo(() => {
    if (!draft.name && !draft.email) return "U";
    const seed = draft.name || draft.email;
    return seed.slice(0, 2).toUpperCase();
  }, [draft.email, draft.name]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setDraft(user);
    setEditMode(false);
  };

  const handleSave = async () => {
    if (!draft.name.trim()) {
      setMessage({ type: "error", text: "Name is required." });
      return;
    }
    setLoading(true);
    try {
      const res = await API.put("/api/users/me", { name: draft.name });
      const updated = res.data || { ...user, name: draft.name };
      setUser(updated);
      setDraft(updated);
      setEditMode(false);
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setMessage({ type: "error", text: "Profile update failed." });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "All password fields are required." });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    setPasswordLoading(true);
    try {
      await API.put("/api/users/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage({ type: "success", text: "Password updated successfully." });
    } catch (err) {
      setMessage({ type: "error", text: "Password update failed." });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout showSearch={false}>
      <Stack spacing={3} sx={{ width: "100%" }}>
        <Box>
          <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">
            Profile
          </Typography>
          <Typography color="text.secondary">
            Manage your account information, security, and preferences.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={cardSx}
            >
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      bgcolor: "primary.main",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                    }}
                  >
                    {initials}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={800}>
                      {draft.name || "Unnamed User"}
                    </Typography>
                    <Typography color="text.secondary">{draft.email || "user@example.com"}</Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Chip label={draft.role || "EMPLOYEE"} color="primary" size="small" />
                      <Chip
                        label={draft.active ? "Active" : "Inactive"}
                        color={draft.active ? "success" : "default"}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                </Stack>

                <Divider />

                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                  Personal Information
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                    gap: 2.5,
                  }}
                >
                    <TextField
                      label="Name"
                      value={draft.name}
                      onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                      fullWidth
                      disabled={!editMode}
                    />
                    <TextField label="Email" value={draft.email} fullWidth disabled />
                    <TextField label="Role" value={draft.role} fullWidth disabled />
                    <TextField label="Account Status" value={draft.active ? "Active" : "Inactive"} fullWidth disabled />
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="flex-end">
                  {!editMode && (
                    <Button variant="outlined" onClick={handleEdit}>
                      Edit Profile
                    </Button>
                  )}
                  {editMode && (
                    <>
                      <Button variant="text" color="inherit" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button variant="contained" onClick={handleSave} disabled={loading}>
                        Save Changes
                      </Button>
                    </>
                  )}
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{ ...cardSx, height: "100%" }}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    Security
                  </Typography>
                  <Typography color="text.secondary">
                    Change your password to keep your account secure.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                    gap: 2.5,
                  }}
                >
                    <TextField
                      label="Current Password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      fullWidth
                    />
                    <TextField
                      label="New Password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                      fullWidth
                    />
                    <TextField
                      label="Confirm Password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      fullWidth
                    />
                </Box>
                <Stack direction="row" justifyContent="flex-end">
                  <Button variant="contained" onClick={handlePasswordChange} disabled={passwordLoading}>
                    Update Password
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{ ...cardSx, height: "100%" }}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    Preferences
                  </Typography>
                  <Typography color="text.secondary">
                    Personalize the dashboard experience.
                  </Typography>
                </Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography fontWeight={700}>Theme</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Toggle between light and dark mode.
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={<Switch checked={mode === "dark"} onChange={toggleMode} />}
                    label={mode === "dark" ? "Dark" : "Light"}
                    labelPlacement="start"
                    sx={{ ml: 0 }}
                  />
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>

      <Snackbar
        open={Boolean(message.text)}
        autoHideDuration={4000}
        onClose={() => setMessage({ type: "success", text: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={message.type} onClose={() => setMessage({ type: "success", text: "" })} variant="filled">
          {message.text}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
