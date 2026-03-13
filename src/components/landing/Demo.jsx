// src/pages/landing/Demo.jsx
import { useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ArrowForwardOutlined, CheckCircleOutline } from "@mui/icons-material";
import FadeIn from "../../wrapper/FadeIn"; 

export default function Demo() {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      id="demo"
      sx={{
        py: { xs: 10, md: 14 },
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0A0D18 0%, #0E0B1A 100%)",
      }}
    >
      {/* Gradient orbs */}
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background:
          "radial-gradient(ellipse 70% 50% at 30% 50%, rgba(0,229,255,0.07) 0%, transparent 60%), " +
          "radial-gradient(ellipse 60% 50% at 70% 50%, rgba(124,58,237,0.10) 0%, transparent 60%)",
      }} />

      {/* Grid */}
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage:
          "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), " +
          "linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }} />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <FadeIn>
          {/* Badge */}
          <Box sx={{
            display: "inline-block", px: 2, py: 0.6, mb: 3, borderRadius: "100px",
            background: "linear-gradient(135deg, rgba(0,229,255,0.1), rgba(124,58,237,0.1))",
            border: "1px solid rgba(0,229,255,0.2)",
          }}>
            <Typography variant="caption" sx={{
              color: "#00E5FF", fontWeight: 600,
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              Ready to get started?
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{ fontSize: { xs: "2rem", md: "3rem" }, letterSpacing: "-0.03em", mb: 2 }}
          >
            See ReqZen{" "}
            <Box component="span" sx={{
              background: "linear-gradient(135deg, #00E5FF, #7C3AED)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              in action
            </Box>
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={5} lineHeight={1.75}>
            Explore the full workflow — from submission to approval — with our live demo environment.
          </Typography>

          {/* CTA button */}
          <Box
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{ display: "inline-block" }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={
                <ArrowForwardOutlined sx={{
                  transition: "transform 0.2s",
                  transform: hovered ? "translateX(4px)" : "none",
                }} />
              }
              sx={{
                background: hovered
                  ? "linear-gradient(135deg, #00E5FF, #7C3AED)"
                  : "linear-gradient(135deg, #0891B2, #6D28D9)",
                color: "#EEF2FF", fontWeight: 700, fontSize: "1rem",
                textTransform: "none", px: 5, py: 1.8,
                boxShadow: hovered
                  ? "0 0 60px rgba(0,229,255,0.35)"
                  : "0 0 30px rgba(0,229,255,0.15)",
                transform: hovered ? "scale(1.03) translateY(-2px)" : "none",
                transition: "all 0.25s ease",
              }}
            >
              Try Demo
            </Button>
          </Box>

          {/* Trust pills */}
          <Stack direction="row" justifyContent="center" spacing={4} mt={5}>
            {["Free sandbox", "No setup needed", "Full feature access"].map(t => (
              <Stack key={t} direction="row" spacing={0.7} alignItems="center">
                <CheckCircleOutline sx={{ fontSize: 14, color: "#00E5FF" }} />
                <Typography variant="caption" color="text.secondary" fontWeight={500}>{t}</Typography>
              </Stack>
            ))}
          </Stack>
        </FadeIn>
      </Container>
    </Box>
  );
}