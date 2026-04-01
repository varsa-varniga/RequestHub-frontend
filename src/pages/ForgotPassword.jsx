// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import API from "../api/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await API.post("/auth/forgot-password", { email });
    } catch (err) {
      console.error("Forgot password failed:", err);
    } finally {
      setLoading(false);
      setMessage("If an account exists for this email, reset instructions have been sent.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -20%, #38BDF818 0%, transparent 60%),
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
          boxShadow: "0 0 60px #0EA5E90A, 0 24px 48px #00000060",
        }}
      >
        <Stack spacing={2} mb={3} alignItems="center">
          <Typography variant="h4" color="text.primary">
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Enter your email and we&apos;ll send reset instructions.
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
              sx={{ "& .MuiInputBase-root": { height: 56 } }}
            />
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
                "&:hover": { backgroundColor: "#38BDF8" },
                "&.Mui-disabled": { backgroundColor: "#38BDF855", color: "#0A0A0F88" },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: "#0A0A0F" }} /> : "Send reset link"}
            </Button>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              textAlign="center"
              sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
              onClick={() => navigate("/login")}
            >
              Back to sign in
            </Typography>
          </Stack>
        </Box>

        {message && (
          <Alert severity="info" sx={{ mt: 3 }}>
            {message}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
