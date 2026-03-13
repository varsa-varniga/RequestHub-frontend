// src/theme/index.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00E5FF" },
    secondary: { main: "#7C3AED" },
    background: { default: "#080B14", paper: "#0E1220" },
    text: { primary: "#EEF2FF", secondary: "#7B8DB0" },
  },
  typography: {
    fontFamily: "'Sora', sans-serif",
    h1: { fontFamily: "'Sora', sans-serif", fontWeight: 800 },
    h2: { fontFamily: "'Sora', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Sora', sans-serif", fontWeight: 700 },
  },
  shape: { borderRadius: 14 },
});

export default theme;


