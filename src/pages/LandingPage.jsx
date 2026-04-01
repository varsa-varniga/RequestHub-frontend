// src/pages/LandingPage.jsx
import { useMemo } from "react";
import { Box, ThemeProvider } from "@mui/material";
import BackToTop from "../wrapper/BackToTop";




import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import TechStack from "../components/landing/TechStack";
import Footer from "../components/landing/Footer";
import Navbar from "../components/landing/Navbar";
import { createAppTheme } from "../theme/theme";




export default function LandingPage() {
  const landingTheme = useMemo(() => createAppTheme("dark"), []);

  return (
    <ThemeProvider theme={landingTheme}>
      <Box sx={{ backgroundColor: "background.default", color: "text.primary", overflowX: "hidden" }}>
        <Navbar />
        <Hero />
        <HowItWorks />
        <Features />
        <TechStack />
        <Footer />
        <BackToTop />
      </Box>
    </ThemeProvider>
  );
}
