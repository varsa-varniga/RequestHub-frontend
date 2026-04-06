// src/theme/index.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00E5FF" },
    secondary: { main: "#7C3AED" },
    background: { default: "#080B14", paper: "#0E1220" },
    text: { primary: "#F8FBFF", secondary: "#A9B8D3" },
  },
  typography: {
    fontFamily: "'Sora', sans-serif",
    h1: { fontFamily: "'Sora', sans-serif", fontWeight: 800 },
    h2: { fontFamily: "'Sora', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Sora', sans-serif", fontWeight: 700 },
    h4: { fontFamily: "'Sora', sans-serif", fontWeight: 700 },
    h5: { fontFamily: "'Sora', sans-serif", fontWeight: 700 },
    h6: { fontFamily: "'Sora', sans-serif", fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body1: { fontWeight: 500 },
    body2: { fontWeight: 500 },
    button: { fontWeight: 700, textTransform: "none" },
    caption: { fontWeight: 500 },
  },
  shape: { borderRadius: 14 },
});

export default theme;


