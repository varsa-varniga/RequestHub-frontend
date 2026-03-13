// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography, Stack, Snackbar, Alert, Paper } from "@mui/material";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/users", form); 
      alert("User registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        backgroundColor: "#0A0A0F",
      }}
    >
      <Paper sx={{ p: 5, maxWidth: 480, width: "100%", boxShadow: "0 0 60px #F59E0B0A" }}>
        <Typography variant="h4" textAlign="center" mb={3}>
          Create Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
              required
              sx={{ "& .MuiInputBase-root": { height: 56 } }}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
              required
              sx={{ "& .MuiInputBase-root": { height: 56 } }}
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              fullWidth
              required
              sx={{ "& .MuiInputBase-root": { height: 56 } }}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={form.role}
                label="Role"
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <MenuItem value="USER">USER</MenuItem>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ height: 48 }}>
              {loading ? "Loading..." : "Register"}
            </Button>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              textAlign="center"
              sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
              onClick={() => navigate("/login")}
            >
              Already have an account? Sign in
            </Typography>
          </Stack>
        </form>
      </Paper>

      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError("")}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
}