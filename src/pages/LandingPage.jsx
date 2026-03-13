// src/pages/LandingPage.jsx
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";

import GlobalStyles from "../wrapper/GlobalStyles";
import BackToTop from "../wrapper/BackToTop";


import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import TechStack from "../components/landing/TechStack";
import Demo from "../components/landing/Demo";
import Footer from "../components/landing/Footer";
import Navbar from "../components/landing/Navbar";


export default function LandingPage() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Box sx={{ backgroundColor: "background.default", color: "text.primary", overflowX: "hidden" }}>
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <TechStack />
        <Demo />
        <Footer />
        <BackToTop />
      </Box>
    </ThemeProvider>
  );
}