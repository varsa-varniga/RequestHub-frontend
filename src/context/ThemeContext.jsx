// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createAppTheme } from "../theme/theme";

const ThemeModeContext = createContext({
  mode: "dark",
  toggleMode: () => {},
});

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem("rh-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("rh-theme", mode);
    } catch {
      // ignore
    }
  }, [mode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const toggleMode = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}
