import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FadeIn from "../../wrapper/FadeIn";


export default function Demo() {
  const navigate = useNavigate();


  return (
    <Box
      id="demo"
      sx={{
        pt: { xs: 12, md: 18 },
        pb: { xs: 12, md: 16 },
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 78%, rgba(34, 118, 255, 0.08), transparent 20%), linear-gradient(180deg, #081221 0%, #06111d 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(27, 75, 156, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(27, 75, 156, 0.2) 1px, transparent 1px)",
          backgroundSize: { xs: "38px 38px", md: "75px 75px" },
          opacity: 0.55,
        }}
      />


      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(6,17,29,0.04) 0%, rgba(6,17,29,0.18) 52%, rgba(6,17,29,0.08) 100%)",
        }}
      />


      <Container maxWidth={false} sx={{ position: "relative", zIndex: 1, maxWidth: "1280px" }}>
        <FadeIn>
          <Stack alignItems="center" textAlign="center" spacing={0}>
            <Typography
              variant="overline"
              sx={{
                fontFamily: "'Sora', sans-serif",
                color: "#5b9cff",
                letterSpacing: "0.12em",
                fontWeight: 800,
                fontSize: { xs: "0.76rem", md: "0.86rem" },
                lineHeight: 1,
                mb: { xs: 2.5, md: 3.5 },
              }}
            >
              GET STARTED TODAY
            </Typography>


            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(28px, 4vw, 42px)",
                textAlign: "center",
                letterSpacing: "-1px",
                lineHeight: 1.08,
                maxWidth: 860,
                color: "#f1f6ff",
                mb: "12px",
              }}
            >
              Ready to streamline
              <br />
              your requests?
            </Typography>


            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Sora', sans-serif",
                maxWidth: 760,
                color: "rgba(160, 187, 232, 0.82)",
                fontSize: { xs: "0.96rem", md: "1.02rem" },
                lineHeight: 1.78,
                fontWeight: 400,
                mb: { xs: 5, md: 7.5 },
              }}
            >
              Join hundreds of teams already using RequestFlow to resolve faster
              and work smarter.
            </Typography>


            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2, sm: 2.3 }}
              justifyContent="center"
              sx={{ width: "100%", maxWidth: 540 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/register")}
                sx={{
                  fontFamily: "'Sora', sans-serif",
                  minWidth: { xs: "100%", sm: 264 },
                  height: 62,
                  px: 4,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: "0.98rem", md: "1rem" },
                  color: "#f7fbff",
                  background: "linear-gradient(90deg, #2d73f5 0%, #1bbcea 100%)",
                  boxShadow: "0 16px 38px rgba(31, 135, 255, 0.26)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #3a83ff 0%, #25c7ef 100%)",
                    boxShadow: "0 20px 44px rgba(31, 135, 255, 0.3)",
                  },
                }}
              >
                Create Free Account
              </Button>


              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/login")}
                sx={{
                  fontFamily: "'Sora', sans-serif",
                  minWidth: { xs: "100%", sm: 236 },
                  height: 62,
                  px: 4,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: { xs: "0.98rem", md: "1rem" },
                  color: "#e6eefc",
                  borderColor: "rgba(24, 80, 176, 0.5)",
                  backgroundColor: "rgba(6, 17, 29, 0.18)",
                  backdropFilter: "blur(8px)",
                  "&:hover": {
                    borderColor: "rgba(72, 135, 247, 0.72)",
                    backgroundColor: "rgba(9, 23, 40, 0.48)",
                  },
                }}
              >
                Schedule a Demo
              </Button>
            </Stack>
          </Stack>
        </FadeIn>
      </Container>
    </Box>
  );
}


