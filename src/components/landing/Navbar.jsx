// src/components/landing/Navbar.jsx
import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../../constant/landingData";


function Logo() {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "8px",
          background: "linear-gradient(135deg, #00E5FF, #7C3AED)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          fontWeight: 800,
          color: "#080B14",
        }}
      >
        RZ
      </Box>
      <Typography
        variant="body1"
        fontWeight={700}
        sx={{
          background: "linear-gradient(90deg, #00E5FF, #7C3AED)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.01em",
        }}
      >
        ReqZen
      </Typography>
    </Stack>
  );
}


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);


  const scrollTo = (id) => {
    const targetId = id.replace(/\s+/g, "").toLowerCase();
    const element = document.getElementById(targetId);
    if (!element) return;


    const navOffset = 84;
    const top = element.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };


  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: scrolled ? "rgba(8,11,20,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,229,255,0.08)" : "none",
        transition: "all 0.3s ease",
        px: { xs: 2, md: 6 },
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Logo />


      <Stack direction="row" spacing={3.5} sx={{ display: { xs: "none", md: "flex" } }}>
        {NAV_LINKS.map((link) => (
          <Typography
            key={link}
            variant="body2"
            onClick={() => scrollTo(link)}
            sx={{
              color: "text.secondary",
              cursor: "pointer",
              fontWeight: 500,
              "&:hover": { color: "primary.main" },
              transition: "color 0.2s",
            }}
          >
            {link}
          </Typography>
        ))}


      </Stack>


      <Button
        variant="outlined"
        size="small"
        onClick={() => scrollTo("demo")}
        sx={{
          borderColor: "rgba(0,229,255,0.4)",
          color: "primary.main",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.8rem",
          "&:hover": { borderColor: "primary.main", backgroundColor: "rgba(0,229,255,0.06)" },
        }}
      >
        Try Demo
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={() => navigate("/login")}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.8rem",
          ml: 2,
          background: "linear-gradient(90deg, #00E5FF, #7C3AED)",
          "&:hover": { opacity: 0.85 },
        }}
      >
        Login
      </Button>
    </Box>
  );
}


