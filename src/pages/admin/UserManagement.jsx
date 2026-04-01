// src/pages/admin/UserManagement.jsx
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import API from "../../api/api";
import { useAdminData } from "../../context/AdminDataContext";

export default function UserManagement() {
  const [userDraft, setUserDraft] = useState({ name: "", email: "", password: "", role: "USER" });
  const { users, refreshUsers } = useAdminData();
  const [savingId, setSavingId] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "success", text: "" });
  const [filters, setFilters] = useState({ query: "", role: "ALL", active: "ALL" });

  const notify = (text, type = "success") => setToast({ open: true, type, text });

  const createUser = async () => {
    if (!userDraft.email || !userDraft.password) return;
    try {
      await API.post("/users", userDraft);
      setUserDraft({ name: "", email: "", password: "", role: "USER" });
      notify("User created successfully.");
      refreshUsers();
    } catch (err) {
      console.error(err);
      notify("Failed to create user.", "error");
    }
  };

  const updateUserRole = async (userId, role) => {
    setSavingId(userId);
    try {
      console.log("Updating user role", { userId, role });
      await API.put(`/users/${userId}`, { role });
      notify("Role updated.");
      refreshUsers();
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.response?.data || err?.message;
      notify(`Failed to update role${status ? ` (${status})` : ""}: ${msg || "Unknown error"}`, "error");
    } finally {
      setSavingId(null);
    }
  };

  const deleteUser = async (userId) => {
    setSavingId(userId);
    try {
      await API.delete(`/users/${userId}`);
      notify("User deleted.");
      refreshUsers();
    } catch (err) {
      console.error(err);
      notify("Failed to delete user.", "error");
    } finally {
      setSavingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const q = filters.query.trim().toLowerCase();
    const matchesQuery = !q
      || (user.name || "").toLowerCase().includes(q)
      || (user.email || "").toLowerCase().includes(q);
    const matchesRole = filters.role === "ALL" || (user.role || "USER") === filters.role;
    const isActive = user.active !== undefined ? Boolean(user.active) : true;
    const matchesActive =
      filters.active === "ALL"
      || (filters.active === "ACTIVE" && isActive)
      || (filters.active === "INACTIVE" && !isActive);
    return matchesQuery && matchesRole && matchesActive;
  });

  return (
    <>
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={800}>
            User Management
          </Typography>
          
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            border: (t) => `1px solid ${t.palette.divider}`,
            backgroundColor: (t) => (t.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.02)"),
          }}
        >
          <Typography fontWeight={700} mb={1.5}>
            Create New User
          </Typography>
          <Stack spacing={1.5}>
            <InputBase
              placeholder="Full name"
              value={userDraft.name}
              onChange={(e) => setUserDraft((u) => ({ ...u, name: e.target.value }))}
              sx={{ px: 1, py: 0.8, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1.5 }}
            />
            <InputBase
              placeholder="user@email.com"
              value={userDraft.email}
              onChange={(e) => setUserDraft((u) => ({ ...u, email: e.target.value }))}
              sx={{ px: 1, py: 0.8, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1.5 }}
            />
            <InputBase
              placeholder="Temporary password"
              type="password"
              value={userDraft.password}
              onChange={(e) => setUserDraft((u) => ({ ...u, password: e.target.value }))}
              sx={{ px: 1, py: 0.8, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1.5 }}
            />
            <Select
              value={userDraft.role}
              onChange={(e) => setUserDraft((u) => ({ ...u, role: e.target.value }))}
              size="small"
            >
              {["USER", "ADMIN", "MANAGER", "IT", "COMPLIANCE", "HR", "ACCOUNTS_PAYABLE"].map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={createUser}>
                Create User
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography fontWeight={700}>
            Registered Users
          </Typography>
          <Chip label={`${filteredUsers.length}`} size="small" />
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1} mb={1.5}>
          <InputBase
            placeholder="Search by name or email"
            value={filters.query}
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            sx={{ px: 1, py: 0.8, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1.5, flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="role-filter">Role</InputLabel>
            <Select
              labelId="role-filter"
              label="Role"
              value={filters.role}
              onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))}
            >
              {["ALL", "USER", "ADMIN", "MANAGER", "IT", "COMPLIANCE", "HR", "ACCOUNTS_PAYABLE"].map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="active-filter">Status</InputLabel>
            <Select
              labelId="active-filter"
              label="Status"
              value={filters.active}
              onChange={(e) => setFilters((prev) => ({ ...prev, active: e.target.value }))}
            >
              {["ALL", "ACTIVE", "INACTIVE"].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack spacing={1}>
          {filteredUsers.map((user) => (
            <Paper
              key={user.id}
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: (t) => `1px solid ${t.palette.divider}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography fontWeight={700}>{user.name || "User"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Select
                  value={user.role ?? "USER"}
                  size="small"
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                >
                  {["USER", "ADMIN", "MANAGER", "IT", "COMPLIANCE", "HR", "ACCOUNTS_PAYABLE"].map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => deleteUser(user.id)}
                  disabled={savingId === user.id}
                >
                  {savingId === user.id ? "Deleting..." : "Delete"}
                </Button>
              </Stack>
            </Paper>
          ))}
          {!users.length && (
            <Typography variant="body2" color="text.secondary">
              No users available. Create one above.
            </Typography>
          )}
          {!!users.length && !filteredUsers.length && (
            <Typography variant="body2" color="text.secondary">
              No users match the current filters.
            </Typography>
          )}
        </Stack>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.type}
          variant="filled"
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        >
          {toast.text}
        </Alert>
      </Snackbar>
    </>
  );
}
