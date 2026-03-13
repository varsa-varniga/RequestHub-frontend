// src/pages/landing/Footer.jsx
import { Box, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import { GitHub } from "@mui/icons-material";

function FooterLogo() {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
      <Box sx={{
        width: 30, height: 30, borderRadius: "8px",
        background: "linear-gradient(135deg, #00E5FF, #7C3AED)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.7rem", fontWeight: 800, color: "#080B14",
      }}>
        RZ
      </Box>
      <Typography fontWeight={700} sx={{
        background: "linear-gradient(90deg, #00E5FF, #7C3AED)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>
        ReqZen
      </Typography>
    </Stack>
  );
}

const PRODUCT_LINKS  = ["Features", "How It Works", "Demo", "Pricing"];
const COMPANY_LINKS  = ["About", "Contact", "Privacy Policy", "Terms"];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#060810",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        py: 5,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start">

          {/* Brand */}
          <Grid item xs={12} md={4}>
            <FooterLogo />
            <Typography variant="caption" color="text.secondary" lineHeight={1.7} display="block" maxWidth={280}>
              Smart internal request management for modern organizations.
              Streamline. Approve. Audit.
            </Typography>
          </Grid>

          {/* Product links */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="caption" fontWeight={700} color="text.primary"
              textTransform="uppercase" letterSpacing="0.1em" display="block" mb={2}
            >
              Product
            </Typography>
            {PRODUCT_LINKS.map(l => (
              <Typography
                key={l} variant="caption" color="text.secondary"
                display="block" mb={1.2}
                sx={{ cursor: "pointer", "&:hover": { color: "primary.main" }, transition: "color 0.2s" }}
              >
                {l}
              </Typography>
            ))}
          </Grid>

          {/* Company links */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="caption" fontWeight={700} color="text.primary"
              textTransform="uppercase" letterSpacing="0.1em" display="block" mb={2}
            >
              Company
            </Typography>
            {COMPANY_LINKS.map(l => (
              <Typography
                key={l} variant="caption" color="text.secondary"
                display="block" mb={1.2}
                sx={{ cursor: "pointer", "&:hover": { color: "primary.main" }, transition: "color 0.2s" }}
              >
                {l}
              </Typography>
            ))}
          </Grid>

          {/* Built with */}
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 2.5, borderRadius: "14px",
              border: "1px solid rgba(0,229,255,0.1)",
              backgroundColor: "rgba(0,229,255,0.03)", textAlign: "center",
            }}>
              <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                Built with
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ color: "#00E5FF" }}>
                React · Spring Boot · MySQL · MUI
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", my: 4 }} />

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} ReqZen. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <GitHub sx={{
              fontSize: 18, color: "text.secondary", cursor: "pointer",
              "&:hover": { color: "primary.main" }, transition: "color 0.2s",
            }} />
            <Typography variant="caption" color="text.secondary">v1.0.0</Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}