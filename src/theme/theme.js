// src/theme/theme.js
import { createTheme } from "@mui/material/styles";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: { main: "#0B5FFF" },
          secondary: { main: "#7C3AED" },
          background: { default: "#F4F6FA", paper: "#FFFFFF" },
          text: { primary: "#0F172A", secondary: "#4B5563" },
        }
      : {
          primary: { main: "#00E5FF" },
          secondary: { main: "#7C3AED" },
          background: { default: "#080B14", paper: "#0E1220" },
          text: { primary: "#EEF2FF", secondary: "#A0AEC0" },
        }),
    divider: mode === "light" ? "rgba(15, 23, 42, 0.12)" : "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: "'Sora', sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
