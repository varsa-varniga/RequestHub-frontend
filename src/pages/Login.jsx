import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox
} from "@mui/material";

export default function Login() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }

    if (isNewUser && !name) {
      setError("Name is required for registration.");
      return;
    }

    // Simulated authentication
    const fakeToken = "dummy-jwt-token";
    localStorage.setItem("token", fakeToken);
    localStorage.setItem("role", isAdmin ? "admin" : "user");


    // Navigate based on role
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)"
      }}
    >
      <Card
        sx={{
          width: 420,
          padding: 3,
          borderRadius: 4,
          backgroundColor: "rgba(255,255,255,0.95)",
          boxShadow: "0 15px 40px rgba(0,0,0,0.3)"
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
            {isNewUser ? "Register & Login" : "Welcome Back"}
          </Typography>

          {isNewUser && (
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
          )}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            }
            label="Login as Admin"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isNewUser}
                onChange={(e) => setIsNewUser(e.target.checked)}
              />
            }
            label="New User / Register"
          />

          {error && (
            <Typography color="error" textAlign="center" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              borderRadius: 3,
              fontWeight: "bold",
              background: "linear-gradient(45deg,#667eea,#764ba2)"
            }}
            onClick={handleSubmit}
          >
            {isNewUser ? "Register & Login" : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
