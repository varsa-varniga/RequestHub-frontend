// src/pages/landing/HowItWorks.jsx
import { Box, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import FadeIn from "../../wrapper/FadeIn";
import { STEPS } from "../../constant/landingData";

export default function HowItWorks() {
  return (
    <Box id="howitworks" sx={{ py: { xs: 8, md: 12 }, backgroundColor: "#0A0D18" }}>
      <Container maxWidth="lg">
        <FadeIn>
          <Stack alignItems="center" mb={7}>
            <Chip
              label="How It Works"
              sx={{
                mb: 2, backgroundColor: "rgba(0,229,255,0.08)",
                color: "#00E5FF", border: "1px solid rgba(0,229,255,0.25)", fontWeight: 600,
              }}
            />
            <Typography
              variant="h2"
              textAlign="center"
              sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" }, letterSpacing: "-0.02em", mb: 1.5 }}
            >
              From request to resolution
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 500 }}>
              A streamlined four-step workflow that keeps everyone informed and nothing stuck.
            </Typography>
          </Stack>
        </FadeIn>

        <Box sx={{ position: "relative" }}>
          {/* Desktop connector line */}
          <Box sx={{
            display: { xs: "none", md: "block" },
            position: "absolute", top: 32,
            left: "calc(12.5% + 16px)", right: "calc(12.5% + 16px)",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(0,229,255,0.2) 20%, rgba(124,58,237,0.2) 80%, transparent)",
          }} />

          <Grid container spacing={3}>
            {STEPS.map((step, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <FadeIn delay={i * 0.12}>
                  <Stack
                    alignItems={{ xs: "flex-start", md: "center" }}
                    textAlign={{ xs: "left", md: "center" }}
                    spacing={2}
                  >
                    <Box sx={{
                      width: 64, height: 64, borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, rgba(0,229,255,0.12), rgba(124,58,237,0.12))",
                      border: "1px solid rgba(0,229,255,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Typography
                        variant="body2"
                        fontWeight={800}
                        sx={{
                          background: "linear-gradient(135deg, #00E5FF, #7C3AED)",
                          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                          fontSize: "1rem",
                        }}
                      >
                        {step.num}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" fontWeight={700} mb={0.8}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                        {step.desc}
                      </Typography>
                    </Box>
                  </Stack>
                </FadeIn>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}