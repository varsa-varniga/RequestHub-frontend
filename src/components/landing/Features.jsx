// src/pages/landing/Features.jsx
import { useState } from "react";
import { Box, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import FadeIn from "../../wrapper/FadeIn";
import { FEATURES } from "../../constant/landingData";

function FeatureCard({ feature }) {
  const [hovered, setHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        p: 3.5, height: "100%", borderRadius: "16px",
        backgroundColor: hovered ? "#0E1220" : "rgba(14,18,32,0.6)",
        border: `1px solid ${hovered ? feature.accent + "44" : "rgba(255,255,255,0.06)"}`,
        boxShadow: hovered ? `0 12px 40px ${feature.accent}18` : "none",
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all 0.25s ease",
        cursor: "default",
      }}
    >
      <Box sx={{
        width: 52, height: 52, borderRadius: "14px", mb: 2.5,
        backgroundColor: `${feature.accent}12`,
        border: `1px solid ${feature.accent}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: feature.accent,
        boxShadow: hovered ? `0 0 20px ${feature.accent}25` : "none",
        transition: "all 0.25s ease",
      }}>
        <Icon sx={{ fontSize: 28 }} />
      </Box>
      <Typography variant="h6" fontWeight={700} mb={1} letterSpacing="-0.01em">
        {feature.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" lineHeight={1.75}>
        {feature.desc}
      </Typography>
    </Box>
  );
}

export default function Features() {
  return (
    <Box
      id="features"
      sx={{
        py: { xs: 8, md: 12 }, backgroundColor: "#080B14", position: "relative",
      }}
    >
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background:
          "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)",
      }} />

      <Container maxWidth="lg">
        <FadeIn>
          <Stack alignItems="center" mb={7}>
            <Chip
              label="Features"
              sx={{
                mb: 2, backgroundColor: "rgba(124,58,237,0.1)",
                color: "#A78BFA", border: "1px solid rgba(124,58,237,0.3)", fontWeight: 600,
              }}
            />
            <Typography
              variant="h2"
              textAlign="center"
              sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" }, letterSpacing: "-0.02em", mb: 1.5 }}
            >
              Everything your team needs
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 500 }}>
              From the moment a request is raised to final resolution — ReqZen handles it all.
            </Typography>
          </Stack>
        </FadeIn>

        <Grid container spacing={2.5}>
          {FEATURES.map((feature, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <FadeIn delay={i * 0.1}>
                <FeatureCard feature={feature} />
              </FadeIn>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}