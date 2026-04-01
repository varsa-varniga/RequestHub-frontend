// src/pages/landing/TechStack.jsx
import { Box, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import FadeIn from "../../wrapper/FadeIn";
import { TECH } from "../../constant/landingData";


export default function TechStack() {
  return (
    <Box
      id="techstack"
      sx={{
        py: { xs: 8, md: 10 },
        backgroundColor: "#080B14",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <Container maxWidth="md">
        <FadeIn>
          <Stack alignItems="center" mb={6}>
            <Chip
              label="Tech Stack"
              sx={{
                mb: 2, backgroundColor: "rgba(255,255,255,0.04)",
                color: "text.secondary", border: "1px solid rgba(255,255,255,0.1)", fontWeight: 600,
              }}
            />
            <Typography
              variant="h2"
              textAlign="center"
              sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, letterSpacing: "-0.02em" }}
            >
              Built on proven foundations
            </Typography>
          </Stack>
        </FadeIn>


        <Grid container spacing={2.5} justifyContent="center">
          {TECH.map((tech, i) => (
            <Grid item xs={6} sm={3} key={i}>
              <FadeIn delay={i * 0.1}>
                <Box sx={{
                  p: 3, textAlign: "center", borderRadius: "16px",
                  backgroundColor: "rgba(14,18,32,0.7)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  "&:hover": {
                    borderColor: `${tech.color}44`,
                    transform: "translateY(-3px)",
                    boxShadow: `0 8px 30px ${tech.color}12`,
                  },
                  transition: "all 0.2s ease",
                }}>
                  <Typography sx={{ fontSize: "2rem", mb: 1, lineHeight: 1 }}>
                    {tech.symbol}
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="text.primary">
                    {tech.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {tech.sub}
                  </Typography>
                </Box>
              </FadeIn>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}