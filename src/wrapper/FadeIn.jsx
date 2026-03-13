// src/components/landing/FadeIn.jsx
import { Box } from "@mui/material";
import useInView from "../hooks/useInView";

const TRANSFORMS = {
  up:    "translateY(32px)",
  down:  "translateY(-32px)",
  left:  "translateX(-32px)",
  right: "translateX(32px)",
};

export default function FadeIn({ children, delay = 0, direction = "up", sx = {} }) {
  const [ref, visible] = useInView();

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : (TRANSFORMS[direction] ?? "translateY(32px)"),
        transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease`,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}