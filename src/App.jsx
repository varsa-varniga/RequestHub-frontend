import React from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, Container, Typography } from "@mui/material";

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route
          path="/"
          element={
            <Container>
              <Typography variant="h4" sx={{ mt: 4 }}>
                Login Page
              </Typography>
            </Container>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Container>
              <Typography variant="h4" sx={{ mt: 4 }}>
                Dashboard Page
              </Typography>
            </Container>
          }
        />
        <Route
          path="*"
          element={
            <Container>
              <Typography variant="h4" sx={{ mt: 4 }}>
                404 - Page Not Found
              </Typography>
            </Container>
          }
        />
      </Routes>
    </>
  );
}

export default App;
