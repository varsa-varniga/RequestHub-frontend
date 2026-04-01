// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Alert,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined, PersonAdd } from "@mui/icons-material";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Encode credentials for Basic Auth
        const token = btoa(`${email}:${password}`);

        // Step 1: Call /auth/me to get authenticated user info including role
        const res = await API.get("/auth/me", {
          headers: { Authorization: `Basic ${token}` },
        });

        const role = (res.data.role || (Array.isArray(res.data.roles) ? res.data.roles[0] : null) || (Array.isArray(res.data.authorities) ? res.data.authorities[0] : null) || res.data.authority || "USER")
          .toString()
          .toUpperCase()
          .replace(/^ROLE_/, "");

        // Store user info in context
        login(token, res.data);

        // Navigate based on role
        if (role === "ADMIN") navigate("/admin/dashboard");
        else navigate("/user/dashboard");
      } else {
        // Registration
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        const payload = { name: name || email.split("@")[0], email, password, role: "USER" };
        await API.post("/users", payload);

        setIsLogin(true);
        setError("Registration successful. Please login.");
      }
    } catch (err) {
      console.error(err);
      setError(isLogin ? "Invalid email or password" : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, #F59E0B18 0%, transparent 60%),
            linear-gradient(#1C1C2612 1px, transparent 1px),
            linear-gradient(90deg, #1C1C2612 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 40px 40px, 40px 40px",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: { xs: 4, sm: 5 },
            border: "1px solid #2A2A38",
            backgroundColor: "background.paper",
            boxShadow: "0 0 60px #F59E0B0A, 0 24px 48px #00000060",
          }}
        >
          <Stack alignItems="center" spacing={1.5} mb={4}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                backgroundColor: isLogin ? "#F59E0B18" : "#00E5FF18",
                border: "1px solid",
                borderColor: isLogin ? "#F59E0B44" : "#00E5FF44",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "primary.main",
              }}
            >
              {isLogin ? <LockOutlined fontSize="small" /> : <PersonAdd fontSize="small" />}
            </Box>
            <Typography variant="h4" color="text.primary">
              {isLogin ? "Welcome back" : "Create Account"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isLogin ? "Sign in to your account to continue" : "Register a new account"}
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5} alignItems="stretch">
              <TextField
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoComplete="email"
                autoFocus
                sx={{ "& .MuiInputBase-root": { height: 56 } }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                autoComplete={isLogin ? "current-password" : "new-password"}
                sx={{ "& .MuiInputBase-root": { height: 56 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                        sx={{ color: "text.secondary", p: 0.5 }}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {isLogin && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  textAlign="right"
                  sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </Typography>
              )}

              {!isLogin && (
                <>
                  <TextField
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                    sx={{ "& .MuiInputBase-root": { height: 56 } }}
                  />
                  <TextField
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    fullWidth
                    sx={{ "& .MuiInputBase-root": { height: 56 } }}
                  />
                </>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 0.5,
                  color: "#0A0A0F",
                  height: 48,
                  "&:hover": { backgroundColor: "#FBBF24" },
                  "&.Mui-disabled": { backgroundColor: "#F59E0B55", color: "#0A0A0F88" },
                }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: "#0A0A0F" }} /> : isLogin ? "Sign in" : "Register"}
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                textAlign="center"
                mt={2}
                sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
                onClick={() => setIsLogin((prev) => !prev)}
              >
                {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled" onClose={() => setError("")} sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
