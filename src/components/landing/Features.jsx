import { useEffect, useMemo, useState } from "react";
import { ArrowForwardOutlined } from "@mui/icons-material";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FEATURES } from "../../constant/landingData";
import useInView from "../../hooks/useInView";


const featureImageModules = import.meta.glob("../../assets/feature/*.{png,jpg,jpeg,webp,avif,svg}", {
  eager: true,
  import: "default",
});


const featureImages = Object.entries(featureImageModules).reduce((acc, [path, src]) => {
  const name = path.split("/").pop()?.split(".")[0]?.toLowerCase();
  if (name) acc[name] = src;
  return acc;
}, {});


function useRepeatInView(threshold = 0.2) {
  const [node, setNode] = useState(null);
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    if (!node) return undefined;


    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold }
    );


    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold]);


  return [setNode, visible];
}


function scrollToId(id) {
  const target = document.getElementById(id);
  if (!target) return;


  const navOffset = 84;
  const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
  window.scrollTo({ top, behavior: "smooth" });
}


function FeatureImage({ imageKey, accent, visible, title }) {
  const imageSrc = featureImages[imageKey];


  return (
    <Box
      sx={{
        width: { xs: "100%", md: "94%" },
        mx: "auto",
        position: "relative",
        overflow: "hidden",
        borderRadius: "30px",
        padding: { xs: "10px", md: "12px" },
        border: `1px solid ${accent}2c`,
        background: `linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015)), linear-gradient(135deg, ${accent}10, rgba(8,11,20,0.94))`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.34), 0 0 28px ${accent}14, inset 0 1px 0 rgba(255,255,255,0.06)`,
        backdropFilter: "blur(18px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease, border-color 0.35s ease, filter 0.35s ease",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "10px",
          borderRadius: "24px",
          pointerEvents: "none",
          background: `linear-gradient(135deg, ${accent}18, transparent 35%, transparent 65%, rgba(255,255,255,0.05))`,
          opacity: 0.82,
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: "-30%",
          left: "-20%",
          width: "55%",
          height: "160%",
          transform: visible ? "translateX(8%) rotate(18deg)" : "translateX(-12%) rotate(18deg)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02))",
          opacity: visible ? 0.16 : 0.06,
          pointerEvents: "none",
          transition: "transform 0.8s ease, opacity 0.8s ease",
          zIndex: 1,
        },
        "&:hover": {
          boxShadow: `0 30px 74px rgba(0,0,0,0.42), 0 0 36px ${accent}20`,
          borderColor: `${accent}70`,
          filter: "saturate(1.04)",
        },
        "&:hover::after": {
          transform: "translateX(22%) rotate(18deg)",
          opacity: 0.2,
        },
        "&:hover .feature-image": {
          transform: "scale(1.03)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: "12px",
          pointerEvents: "none",
          borderRadius: "22px",
          background: `linear-gradient(180deg, ${accent}08 0%, transparent 24%, transparent 76%, rgba(8,11,20,0.48) 100%)`,
          zIndex: 2,
        }}
      />


      {imageSrc ? (
        <Box
          component="img"
          src={imageSrc}
          alt={title}
          className="feature-image"
          sx={{
            display: "block",
            width: "100%",
            minHeight: { xs: 250, md: 390, lg: 470 },
            maxHeight: { xs: 330, md: 500, lg: 560 },
            objectFit: "contain",
            backgroundColor: "#0a0f1d",
            borderRadius: "22px",
            position: "relative",
            zIndex: 1,
            transition: "transform 0.45s ease, filter 0.45s ease",
            transformOrigin: "center center",
            filter: "brightness(0.98) saturate(1.02)",
          }}
        />
      ) : (
        <Box
          sx={{
            minHeight: { xs: 250, md: 390, lg: 470 },
            display: "grid",
            placeItems: "center",
            px: 3,
            textAlign: "center",
            borderRadius: "22px",
            position: "relative",
            zIndex: 1,
            background:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 22%), linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
          }}
        >
          <Typography color="text.secondary">
            Add `{imageKey}` to `src/assets/feature` to display this section image.
          </Typography>
        </Box>
      )}
    </Box>
  );
}


function FeatureSection({ feature, index, visible }) {
  const [ref, inView] = useRepeatInView(0.2);
  const reversed = index % 2 === 1;


  const panelSx = useMemo(
    () => ({
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(56px)",
      transition: `opacity 0.85s ${0.12 + index * 0.08}s ease, transform 0.85s ${0.12 + index * 0.08}s cubic-bezier(0.22, 1, 0.36, 1)`,
    }),
    [inView, index]
  );


  return (
    <Box
      ref={ref}
      sx={{
        ...panelSx,
        py: { xs: 4.5, md: 6 },
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "14%",
          [reversed ? "left" : "right"]: "-4%",
          width: { xs: 160, md: 260 },
          height: { xs: 160, md: 260 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${feature.accent}22 0%, transparent 68%)`,
          filter: "blur(26px)",
          pointerEvents: "none",
          opacity: inView ? 0.48 : 0,
          transform: inView ? "translateY(0) scale(1)" : "translateY(18px) scale(0.92)",
          transition: `opacity 0.9s ${0.2 + index * 0.08}s ease, transform 0.9s ${0.2 + index * 0.08}s ease`,
        }}
      />


      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: reversed ? "minmax(0, 0.42fr) minmax(0, 1.58fr)" : "minmax(0, 1.58fr) minmax(0, 0.42fr)" },
          gap: { xs: 2, md: 4 },
          alignItems: "center",
        }}
      >
        <Box sx={{ order: { xs: 2, md: reversed ? 2 : 1 } }}>
          <FeatureImage
            imageKey={feature.imageKey}
            accent={feature.accent}
            visible={visible && inView}
            title={feature.title}
          />
        </Box>


        <Box
          sx={{
            order: { xs: 1, md: reversed ? 1 : 2 },
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transition: `opacity 0.75s ${0.24 + index * 0.08}s ease, transform 0.75s ${0.24 + index * 0.08}s cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        >
          <Box
            sx={{
              px: { xs: 0.5, md: 0 },
              py: { xs: 0, md: 0 },
              maxWidth: 360,
              mx: reversed ? { xs: 0, md: "0" } : { xs: 0, md: "auto" },
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: feature.accent,
                letterSpacing: "0.16em",
                fontWeight: 700,
                opacity: 0.9,
              }}
            >
              {feature.eyebrow}
            </Typography>


            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "1.4rem", md: "1.8rem" },
                lineHeight: 1.18,
                letterSpacing: "-0.03em",
                mt: 0.75,
                mb: 1.25,
                fontWeight: 700,
              }}
            >
              {feature.title}
            </Typography>


            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.75,
                fontSize: { xs: "0.92rem", md: "0.98rem" },
                maxWidth: 320,
              }}
            >
              {feature.desc}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}


export default function Features() {
  const navigate = useNavigate();
  const [ref, inView] = useInView(0.16);
  const [revealed, setRevealed] = useState(false);


  useEffect(() => {
    if (!inView) return undefined;
    const timer = window.setTimeout(() => setRevealed(true), 180);
    return () => window.clearTimeout(timer);
  }, [inView]);


  return (
    <Box
      id="features"
      ref={ref}
      sx={{
        py: { xs: 10, md: 14 },
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 15% 20%, rgba(245,185,66,0.09), transparent 28%), radial-gradient(circle at 80% 15%, rgba(59,164,255,0.12), transparent 26%), linear-gradient(180deg, #080b14 0%, #0a0f1d 40%, #080b14 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(180deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      />


      <Box
        sx={{
          position: "absolute",
          top: 120,
          left: "-10%",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,185,66,0.16), transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 320,
          right: "-8%",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,164,255,0.14), transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />


      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          alignItems="center"
          textAlign="center"
          sx={{
            mb: { xs: 6, md: 8 },
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <Chip
            label="Features"
            sx={{
              mb: 2,
              backgroundColor: "rgba(245,185,66,0.1)",
              color: "#f5c257",
              border: "1px solid rgba(245,185,66,0.28)",
              fontWeight: 700,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              maxWidth: 860,
              mb: 2,
            }}
          >
            A guided request journey users can understand before they ever log in
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 720,
              lineHeight: 1.85,
              fontSize: { xs: "1rem", md: "1.05rem" },
            }}
          >
            ReqZen shows how requests are raised, reviewed, routed, and tracked from start to finish. Each step is visible, simple, and built to keep work moving.
          </Typography>
        </Stack>


        <Stack spacing={{ xs: 2, md: 3 }}>
          {FEATURES.map((feature, index) => (
            <FeatureSection key={feature.title} feature={feature} index={index} visible={revealed} />
          ))}
        </Stack>


        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            p: { xs: 3, md: 4.5 },
            borderRadius: "30px",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(245,185,66,0.12), rgba(59,164,255,0.12))",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 26px 70px rgba(0,0,0,0.28)",
            backdropFilter: "blur(18px)",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "1.8rem", md: "2.4rem" },
              letterSpacing: "-0.03em",
              mb: 1.5,
              fontWeight: 800,
            }}
          >
            Ready to move requests from intake to approval without losing visibility?
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ maxWidth: 640, mx: "auto", lineHeight: 1.8, mb: 3 }}
          >
            Start with guided forms, faster approvals, and tracking that stays clear for everyone involved.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardOutlined />}
              onClick={() => scrollToId("demo")}
              sx={{
                textTransform: "none",
                fontWeight: 800,
                px: 3.5,
                py: 1.4,
                color: "#071018",
                background: "linear-gradient(135deg, #f5c257, #ffd86f)",
                boxShadow: "0 14px 30px rgba(245,194,87,0.28)",
                "&:hover": {
                  background: "linear-gradient(135deg, #ffd86f, #ffe392)",
                },
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/login")}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                px: 3.5,
                py: 1.4,
                color: "#8bc3ff",
                borderColor: "rgba(59,164,255,0.42)",
                "&:hover": {
                  borderColor: "#3ba4ff",
                  backgroundColor: "rgba(59,164,255,0.08)",
                },
              }}
            >
              Login to Continue
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}


