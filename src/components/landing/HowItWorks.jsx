import { Box, Container, Stack, Typography } from "@mui/material";
import { PLATFORM_CAPABILITIES } from "../../constant/landingData";
import FadeIn from "../../wrapper/FadeIn";


function CapabilityCard({ item, delay = 0 }) {
  const Icon = item.icon;


  return (
    <FadeIn delay={delay}>
      <Box
        className="feat-card"
        sx={{
          height: "100%",
          minHeight: { xs: 210, md: 208 },
          p: "28px",
          borderRadius: "16px",
          background: "rgba(10, 22, 40, 0.85)",
          border: "1px solid rgba(26, 111, 255, 0.18)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
          transition: "transform .2s, box-shadow .2s, border-color .2s",
          "&:hover": {
            transform: "translateY(-4px)",
            borderColor: "rgba(61, 139, 255, 0.34)",
            boxShadow: "0 26px 56px rgba(8,18,36,0.28)",
          },
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "14px",
            mb: 2.2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f2f7ff",
            background: "linear-gradient(180deg, #2f7eff 0%, #3d8bff 100%)",
            boxShadow: "0 10px 26px rgba(41, 120, 255, 0.22)",
          }}
        >
          <Icon sx={{ fontSize: 25 }} />
        </Box>


        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(17px, 1.2vw, 20px)",
            lineHeight: 1.18,
            letterSpacing: "-0.5px",
            color: "#f0f6ff",
            mb: 0.9,
          }}
        >
          {item.title}
        </Typography>


        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            color: "#8ba3c7",
            fontSize: "clamp(13px, 0.92vw, 15px)",
            lineHeight: 1.55,
            maxWidth: 290,
          }}
        >
          {item.desc}
        </Typography>
      </Box>
    </FadeIn>
  );
}


export default function HowItWorks() {
  return (
    <Box
      id="howitworks"
      sx={{
        position: "relative",
        zIndex: 1,
        py: { xs: 10, md: 12 },
        px: { xs: 2, md: 5 },
        background:
          "radial-gradient(circle at 50% 84%, rgba(35, 120, 255, 0.08), transparent 22%), linear-gradient(180deg, #050d1a 0%, #071120 100%)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(26, 111, 255, 0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(26, 111, 255, 0.09) 1px, transparent 1px)",
          backgroundSize: { xs: "48px 48px", md: "75px 75px" },
          opacity: 0.42,
        }}
      />


      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, maxWidth: "1400px !important" }}>
        <FadeIn>
          <Stack alignItems="center" textAlign="center" sx={{ mb: { xs: 5, md: 7 } }}>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#3d8bff",
                fontWeight: 800,
                fontSize: "clamp(14px, 1.1vw, 16px)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                mb: 1.5,
              }}
            >
              Platform Capabilities
            </Typography>


            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(28px, 4vw, 42px)",
                textAlign: "center",
                letterSpacing: "-1px",
                color: "#f0f6ff",
                mb: "12px",
              }}
            >
              Everything you need
            </Typography>


            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#8ba3c7",
                fontSize: "clamp(16px, 1.2vw, 18px)",
                lineHeight: 1.6,
                maxWidth: 680,
              }}
            >
              A complete toolkit to handle requests at any scale.
            </Typography>
          </Stack>
        </FadeIn>


        <Box
          className="features-grid"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: "20px",
            alignItems: "stretch",
          }}
        >
          {PLATFORM_CAPABILITIES.map((item, index) => (
            <Box key={item.title}>
              <CapabilityCard item={item} delay={index * 0.08} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}


