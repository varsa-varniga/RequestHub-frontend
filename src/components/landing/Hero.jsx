import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import {
  ArrowForwardOutlined,
  CheckCircleOutline,
  PlayArrowOutlined,
} from "@mui/icons-material";
import ParticleCanvas from "../../wrapper/ParticleCanvas";


export default function Hero() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });


  return (
    <Box
      id="hero"
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,229,255,0.07) 0%, transparent 65%), #080B14",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />


      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "60%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          left: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />


      <ParticleCanvas />


      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, pt: 14, pb: 10 }}>
        <Grid container alignItems="center" justifyContent="center" spacing={6}>
          <Grid item xs={12} md={9} lg={8}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.6,
                mb: 3,
                borderRadius: "100px",
                border: "1px solid rgba(0,229,255,0.2)",
                backgroundColor: "rgba(0,229,255,0.05)",
                animation: "fadeSlideDown 0.6s ease both",
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#00E5FF",
                  animation: "pulse 2s infinite",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#00E5FF",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Internal Ops Platform
              </Typography>
            </Box>


            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.4rem", md: "3.6rem", lg: "4rem" },
                lineHeight: 1.1,
                mb: 2.5,
                letterSpacing: "-0.03em",
                animation: "fadeSlideDown 0.7s 0.1s ease both",
              }}
            >
              <Box component="span" sx={{ color: "text.primary" }}>
                ReqZen -
              </Box>{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(135deg, #00E5FF 0%, #7C3AED 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Smart Internal Request Management
              </Box>
            </Typography>


            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", md: "1.15rem" },
                lineHeight: 1.75,
                mb: 4,
                maxWidth: 520,
                animation: "fadeSlideDown 0.7s 0.2s ease both",
              }}
            >
              Intelligently manage access approvals, IT support tickets, and compliance
              requests with workflows your team will actually use.
            </Typography>


            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ animation: "fadeSlideDown 0.7s 0.3s ease both" }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardOutlined />}
                sx={{
                  background: "linear-gradient(135deg, #00E5FF, #0891B2)",
                  color: "#080B14",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  px: 3.5,
                  py: 1.5,
                  boxShadow: "0 0 32px rgba(0,229,255,0.25)",
                  "&:hover": {
                    boxShadow: "0 0 48px rgba(0,229,255,0.4)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s",
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PlayArrowOutlined />}
                onClick={() => scrollTo("demo")}
                sx={{
                  borderColor: "rgba(124,58,237,0.5)",
                  color: "#A78BFA",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  px: 3.5,
                  py: 1.5,
                  "&:hover": {
                    borderColor: "#7C3AED",
                    backgroundColor: "rgba(124,58,237,0.08)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s",
                }}
              >
                Learn More
              </Button>
            </Stack>


            <Stack
              direction="row"
              spacing={3}
              sx={{ mt: 5, animation: "fadeSlideDown 0.7s 0.4s ease both" }}
            >
              {["Role-based access", "Real-time status", "Full audit trail"].map((t) => (
                <Stack key={t} direction="row" spacing={0.6} alignItems="center">
                  <CheckCircleOutline sx={{ fontSize: 15, color: "#00E5FF" }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {t}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>


      <Box
        sx={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          animation: "bounce 2s infinite",
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.5 }}>
          scroll
        </Typography>
        <Box
          sx={{
            width: 1,
            height: 40,
            backgroundColor: "rgba(0,229,255,0.3)",
            borderRadius: 4,
          }}
        />
      </Box>
    </Box>
  );
}


