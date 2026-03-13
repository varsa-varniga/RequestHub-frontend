// src/components/landing/BackToTop.jsx
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!show) return null;

  return (
    <Box
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      sx={{
        position: "fixed", bottom: 24, right: 24, zIndex: 99,
        width: 44, height: 44, borderRadius: "50%",
        background: "linear-gradient(135deg, #00E5FF, #7C3AED)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", boxShadow: "0 4px 20px rgba(0,229,255,0.3)",
        "&:hover": { transform: "scale(1.1)" },
        transition: "transform 0.2s",
      }}
    >
      <KeyboardArrowUp sx={{ color: "#080B14", fontSize: 22 }} />
    </Box>
  );
}