// src/pages/HelpSupportPage.jsx
import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
} from "@mui/material";
import DashboardLayout from "../components/dashboard/DashboardLayout";

// ─── SVG Icon primitive ───────────────────────────────────────────────────────
const Icon = ({ d, size = 22, strokeWidth = 1.75, ...rest }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    {...rest}
  >
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

// ─── Icons ────────────────────────────────────────────────────────────────────
const IcoBrain     = (p) => <Icon {...p} d={["M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.69A3 3 0 0 1 3.83 9.5 2.5 2.5 0 0 1 7 5.27A2.5 2.5 0 0 1 9.5 2z","M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.69A3 3 0 0 0 20.17 9.5 2.5 2.5 0 0 0 17 5.27A2.5 2.5 0 0 0 14.5 2z"]} />;
const IcoRoute     = (p) => <Icon {...p} d={["M3 17l4-4-4-4","M21 7l-4 4 4 4","M14 5H10a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"]} />;
const IcoShield    = (p) => <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const IcoEye       = (p) => <Icon {...p} d={["M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"]} />;
const IcoScroll    = (p) => <Icon {...p} d={["M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4","M19 7H8","M15 11H8"]} />;
const IcoPlus      = (p) => <Icon {...p} d={["M12 5v14","M5 12h14"]} />;
const IcoSearch    = (p) => <Icon {...p} d={["M21 21l-4.35-4.35","M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"]} />;
const IcoCheck     = (p) => <Icon {...p} d="M20 6L9 17l-5-5" />;
const IcoX         = (p) => <Icon {...p} d={["M18 6L6 18","M6 6l12 12"]} />;
const IcoChevDown  = (p) => <Icon {...p} d="M6 9l6 6 6-6" />;
const IcoMail      = (p) => <Icon {...p} d={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"]} />;
const IcoPhone     = (p) => <Icon {...p} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.71 3.35a2 2 0 0 1 1.95-1.35h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />;
const IcoClock     = (p) => <Icon {...p} d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M12 6v6l4 2"]} />;
const IcoUser      = (p) => <Icon {...p} d={["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2","M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"]} />;
const IcoClipboard = (p) => <Icon {...p} d={["M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2","M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"]} />;
const IcoActivity  = (p) => <Icon {...p} d="M22 12h-4l-3 9L9 3l-3 9H2" />;
const IcoStar      = (p) => <Icon {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
const IcoZap       = (p) => <Icon {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
const IcoHelp      = (p) => <Icon {...p} d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3","M12 17h.01"]} />;

// ─── Static Data ─────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: IcoBrain,     title: "Intelligent Prioritization",   accent: "#3b82f6", tag: "AI-Powered",  bullets: ["Auto-scored by urgency level", "Request type weighting", "Aging factor prevents starvation"] },
  { icon: IcoRoute,     title: "Role-Based Workflow Routing",  accent: "#8b5cf6", tag: "Dynamic",     bullets: ["Predefined approval hierarchies", "Role-based access controls", "Adaptive per request type"] },
  { icon: IcoShield,    title: "SLA Enforcement & Escalation", accent: "#06b6d4", tag: "Automated",   bullets: ["Defined SLA timelines per tier", "Auto-alerts before deadlines", "Zero-touch escalation"] },
  { icon: IcoEye,       title: "Real-Time Visibility",         accent: "#10b981", tag: "Transparent", bullets: ["Live request stage tracking", "Named approver at each step", "Complete request journey"] },
  { icon: IcoScroll,    title: "Audit Trail & Accountability", accent: "#f97316", tag: "Compliant",   bullets: ["Every action timestamped", "Approval/rejection logged", "Full compliance traceability"] },
];

const HOW_TO = [
  { icon: IcoPlus,      phase: "01", accent: "#3b82f6", title: "Submitting a Request",           steps: ['Navigate to "Create Request"', "Select the request type", "Provide all required details", "Submit — auto-routing happens instantly"] },
  { icon: IcoSearch,    phase: "02", accent: "#8b5cf6", title: "Tracking a Request",              steps: ['Go to "My Requests"', "View current status and active stage", "See the responsible approver", "Check timeline and full history"] },
  { icon: IcoClipboard, phase: "03", accent: "#10b981", title: "Approving / Rejecting",          steps: ['Access "Pending Approvals"', "Review full request details", "Approve or reject with comments", "Actions are logged automatically"] },
];

const BEST_PRACTICES = [
  { icon: IcoCheck,    text: "Provide complete and accurate request details upfront." },
  { icon: IcoClock,    text: "Monitor SLA timelines to avoid automatic escalations." },
  { icon: IcoUser,     text: "Use comments for clarity during approvals." },
  { icon: IcoActivity, text: "Review audit logs for detailed action insights." },
];

const FAQ = [
  { q: "How does automatic prioritization work?",         a: "The system scores every incoming request on urgency level, request type, and time pending (aging factor). Higher scores rise to the top of the queue, ensuring critical items are never buried by routine ones." },
  { q: "What happens when an SLA deadline is approaching?", a: "Automated alerts are sent to the responsible approver and their manager. If the deadline passes without action, the request is escalated to the next tier — no manual intervention required." },
  { q: "Can I see who is responsible for my request?",   a: 'Yes. Every request card in "My Requests" shows the current approver and stage. The full approval hierarchy is visible in the request detail view.' },
  { q: "How do I escalate a stalled ticket?",            a: "The system handles escalation automatically based on SLA timers. You can also flag a request manually from the request detail page, which triggers an immediate review notification." },
  { q: "Where can I find the audit trail for a request?", a: 'Open any request and navigate to the "History" tab. Every approval, rejection, comment, and escalation is timestamped and attributed to the responsible actor.' },
];

const CONTACT = [
  { icon: IcoMail,  label: "Email",           value: "helpdesk@requesthub.io" },
  { icon: IcoPhone, label: "Phone",           value: "+1 (555) 204-1102" },
  { icon: IcoClock, label: "SLA",             value: "2 hrs · business days" },
  { icon: IcoZap,   label: "Auto-escalation", value: "After 4 hrs inactivity" },
];

// ─── Timeline Flow (How To Use) ──────────────────────────────────────────────
function TimelineFlow() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Circle node diameter
  const NODE = 60;

  return (
    <Box>
      {/* ── Header row: nodes + connector line ── */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "flex-start",
          mb: 2.5,
        }}
      >
        {HOW_TO.map((step, idx) => {
          const Ic = step.icon;
          const isLast = idx === HOW_TO.length - 1;
          return (
            <Box key={step.phase} sx={{ flex: 1, display: "flex", alignItems: "flex-start" }}>
              {/* Node + label stacked */}
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1.25, flexShrink: 0, minWidth: 0 }}>
                {/* Circle node */}
                <Box
                  sx={{
                    width: NODE,
                    height: NODE,
                    borderRadius: "50%",
                    background: isDark
                      ? alpha(step.accent, 0.18)
                      : alpha(step.accent, 0.08),
                    border: `2.5px solid ${step.accent}`,
                    color: step.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: `0 0 0 5px ${alpha(step.accent, 0.1)}`,
                  }}
                >
                  <Ic size={26} />
                </Box>
                {/* Step label */}
                <Box sx={{ pl: 0.5 }}>
                  <Typography sx={{ color: step.accent, fontWeight: 800, fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", lineHeight: 1, mb: 0.4 }}>
                    Step {step.phase}
                  </Typography>
                  <Typography fontWeight={800} fontSize="1.05rem" color="text.primary" lineHeight={1.25}>
                    {step.title}
                  </Typography>
                </Box>
              </Box>

              {/* Connector line — sits at vertical mid of the circle, grows to fill gap */}
              {!isLast && (
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    // NODE/2 centres line on the circle vertically
                    mt: `${NODE / 2 - 1}px`,
                    mx: 1.5,
                    background: `linear-gradient(90deg, ${step.accent}, ${HOW_TO[idx + 1].accent})`,
                    borderRadius: 1,
                    opacity: 0.45,
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      {/* ── Cards row ── */}
      <Grid container spacing={3} alignItems="stretch">
        {HOW_TO.map((step, idx) => {
          const Ic = step.icon;
          const accentBg = alpha(step.accent, isDark ? 0.18 : 0.1);

          return (
            <Grid item xs={12} md={4} key={step.phase}>
              {/* Mobile: show node + label above card */}
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  alignItems: "center",
                  gap: 2,
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: alpha(step.accent, isDark ? 0.18 : 0.08),
                    border: `2px solid ${step.accent}`,
                    color: step.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Ic size={22} />
                </Box>
                <Box>
                  <Typography sx={{ color: step.accent, fontWeight: 800, fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1, mb: 0.3 }}>
                    Step {step.phase}
                  </Typography>
                  <Typography fontWeight={800} fontSize="1rem" color="text.primary" lineHeight={1.25}>
                    {step.title}
                  </Typography>
                </Box>
              </Box>

              {/* Step card */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "18px",
                  border: `1px solid ${alpha(step.accent, isDark ? 0.25 : 0.18)}`,
                  backgroundColor: isDark ? alpha(step.accent, 0.06) : "#fff",
                  overflow: "hidden",
                  height: "100%",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  "&:hover": {
                    boxShadow: `0 10px 36px ${alpha(step.accent, isDark ? 0.22 : 0.12)}`,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {/* Coloured top bar */}
                <Box sx={{ height: 4, background: `linear-gradient(90deg, ${step.accent}, ${alpha(step.accent, 0.35)})` }} />

                <Stack spacing={0}>
                  {step.steps.map((s, i) => (
                    <Box key={i}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          px: 2.5,
                          py: 2.2,
                          transition: "background 0.15s",
                          "&:hover": { backgroundColor: alpha(step.accent, isDark ? 0.08 : 0.04) },
                        }}
                      >
                        {/* Numbered badge */}
                        <Box
                          sx={{
                            flexShrink: 0,
                            width: 30,
                            height: 30,
                            borderRadius: "9px",
                            backgroundColor: accentBg,
                            color: step.accent,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "0.82rem",
                          }}
                        >
                          {i + 1}
                        </Box>
                        <Typography fontSize="0.95rem" color="text.secondary" lineHeight={1.55}>
                          {s}
                        </Typography>
                      </Box>
                      {i < step.steps.length - 1 && (
                        <Box sx={{ height: "1px", backgroundColor: alpha(step.accent, isDark ? 0.12 : 0.08), mx: 2.5 }} />
                      )}
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

// ─── Reusable: Section heading ────────────────────────────────────────────────
function SectionHeading({ icon: Ic, accentColor, title, subtitle }) {
  const theme = useTheme();
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 0.75 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: "10px", backgroundColor: alpha(accentColor, theme.palette.mode === "dark" ? 0.2 : 0.1), color: accentColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ic size={18} />
        </Box>
        <Typography variant="h5" fontWeight={800} letterSpacing="-0.02em" color="text.primary">
          {title}
        </Typography>
      </Box>
      {subtitle && <Typography color="text.secondary" fontSize="1rem" sx={{ pl: "51px" }}>{subtitle}</Typography>}
    </Box>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ feat }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const Ic = feat.icon;
  const accentBg = alpha(feat.accent, isDark ? 0.18 : 0.1);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3.5,
        borderRadius: "18px",
        border: `1px solid ${alpha(feat.accent, isDark ? 0.25 : 0.15)}`,
        backgroundColor: isDark ? alpha(feat.accent, 0.06) : alpha(feat.accent, 0.03),
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
        "&:hover": {
          boxShadow: `0 12px 40px ${alpha(feat.accent, isDark ? 0.2 : 0.12)}`,
          transform: "translateY(-3px)",
          borderColor: alpha(feat.accent, 0.45),
        },
      }}
    >
      {/* Icon + tag */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box sx={{ width: 52, height: 52, borderRadius: "14px", backgroundColor: accentBg, color: feat.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ic size={24} />
        </Box>
        <Chip
          label={feat.tag}
          size="small"
          sx={{ backgroundColor: accentBg, color: feat.accent, fontWeight: 700, fontSize: "0.72rem", height: 24, "& .MuiChip-label": { px: 1.2 } }}
        />
      </Box>

      {/* Title */}
      <Typography fontWeight={800} fontSize="1.05rem" lineHeight={1.35} color="text.primary">
        {feat.title}
      </Typography>

      {/* Bullets */}
      <Stack spacing={1.2} flex={1}>
        {feat.bullets.map((b) => (
          <Box key={b} sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
            <Box sx={{ mt: "4px", flexShrink: 0, width: 18, height: 18, borderRadius: "50%", backgroundColor: accentBg, color: feat.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IcoCheck size={11} strokeWidth={2.5} />
            </Box>
            <Typography fontSize="0.92rem" color="text.secondary" lineHeight={1.55}>{b}</Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HelpSupportPage() {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Semantic aliases
  const surface  = theme.palette.background.paper;
  const border   = theme.palette.divider;
  const textPri  = theme.palette.text.primary;
  const textSec  = theme.palette.text.secondary;

  return (
    <DashboardLayout showSearch={false}>
      <Stack spacing={5}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 5 },
            borderRadius: "22px",
            background: isDark
              ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a5f 100%)"
              : "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%)",
            position: "relative",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {/* Decorative rings */}
          {[320, 480, 640].map((sz, i) => (
            <Box key={i} sx={{ position: "absolute", right: -sz * 0.28, top: "50%", transform: "translateY(-50%)", width: sz, height: sz, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          ))}

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={2.5}>
                <Chip
                  label="Smart Request Management System"
                  sx={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#93c5fd", fontWeight: 700, fontSize: "0.78rem", width: "fit-content", "& .MuiChip-label": { px: 1.5 }, height: 28 }}
                />
                <Typography variant="h3" fontWeight={900} color="#fff" letterSpacing="-0.03em" lineHeight={1.12}>
                  Help &amp; Support
                </Typography>
                <Typography color="#93c5fd" fontSize="1.05rem" lineHeight={1.7} maxWidth={540}>
                  This platform streamlines internal operational requests — access approvals, IT support, and compliance checks — with intelligent prioritization, dynamic workflows, and complete transparency.
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Button
                    variant="contained"
                    startIcon={<IcoPlus size={16} />}
                    sx={{ backgroundColor: "#3b82f6", borderRadius: "12px", fontWeight: 700, textTransform: "none", fontSize: "0.95rem", px: 3, py: 1.2, "&:hover": { backgroundColor: "#2563eb" } }}
                  >
                    New Request
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<IcoMail size={16} />}
                    sx={{ borderColor: "rgba(255,255,255,0.3)", color: "#e2e8f0", borderRadius: "12px", fontWeight: 700, textTransform: "none", fontSize: "0.95rem", px: 3, py: 1.2, "&:hover": { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.5)" } }}
                  >
                    Contact Support
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Grid container spacing={1.5}>
                {[
                  { Ic: IcoZap,    label: "Auto-Prioritized",   val: "100%",   sub: "of requests" },
                  { Ic: IcoShield, label: "SLA Enforced",       val: "2 hr",   sub: "response time" },
                  { Ic: IcoScroll, label: "Audit Logged",       val: "100%",   sub: "every action" },
                  { Ic: IcoEye,    label: "Full Visibility",    val: "Live",   sub: "stage tracking" },
                ].map(({ Ic, label, val, sub }) => (
                  <Grid item xs={6} key={label}>
                    <Box sx={{ p: 2, borderRadius: "14px", backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
                      <Box sx={{ color: "#60a5fa", mb: 0.75 }}><Ic size={20} /></Box>
                      <Typography fontSize="1.5rem" fontWeight={900} color="#fff" lineHeight={1}>{val}</Typography>
                      <Typography fontSize="0.75rem" color="#94a3b8" mt={0.3}>{sub}</Typography>
                      <Typography fontSize="0.72rem" color="#64748b" mt={0.2} fontWeight={600}>{label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        {/* ── BEFORE / AFTER ───────────────────────────────────────────────── */}
        <Grid container spacing={3}>
          {[
            {
              Ic: IcoX, label: "Before", color: "#ef4444",
              title: "Traditional Handling",
              points: ["Manual, static priorities", "No request ownership clarity", "Zero progress visibility", "Constant manual follow-ups"],
            },
            {
              Ic: IcoCheck, label: "After", color: "#10b981",
              title: "Smart Request System",
              points: ["AI-scored auto-prioritization", "Named approver at every stage", "Real-time stage tracking", "Automated SLA escalation"],
            },
          ].map((col) => {
            const Ic = col.Ic;
            const colBg  = alpha(col.color, isDark ? 0.1 : 0.05);
            const colBdr = alpha(col.color, isDark ? 0.3 : 0.2);
            return (
              <Grid item xs={12} md={6} key={col.label}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: "18px", border: `1px solid ${colBdr}`, backgroundColor: colBg, height: "100%" }}>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: "11px", backgroundColor: alpha(col.color, 0.15), color: col.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Ic size={20} strokeWidth={2.2} />
                    </Box>
                    <Box>
                      <Typography variant="overline" sx={{ color: col.color, fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.1em", lineHeight: 1 }}>{col.label}</Typography>
                      <Typography fontWeight={800} fontSize="1.1rem" color="text.primary" lineHeight={1.2}>{col.title}</Typography>
                    </Box>
                  </Box>
                  <Stack spacing={1.5}>
                    {col.points.map((pt) => (
                      <Box key={pt} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                        <Box sx={{ color: col.color, mt: "2px", flexShrink: 0 }}><Ic size={15} strokeWidth={2.5} /></Box>
                        <Typography fontSize="0.97rem" color="text.secondary" lineHeight={1.55}>{pt}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* ── KEY FEATURES ─────────────────────────────────────────────────── */}
        <Box>
          <SectionHeading icon={IcoZap} accentColor="#3b82f6" title="Key Features" subtitle="Five pillars that make request management faster, smarter, and fully accountable." />
          {/* Row 1 — 3 equal columns */}
          <Grid container spacing={3} alignItems="stretch" sx={{ mb: 4 }}>
            {FEATURES.slice(0, 3).map((f) => (
              <Grid item xs={12} sm={6} md={4} key={f.title}>
                <FeatureCard feat={f} />
              </Grid>
            ))}
          </Grid>
          {/* Row 2 — 2 centred cards: offset by md=1 on left so 1+5+5+1=12 */}
          <Grid container spacing={3} alignItems="stretch" sx={{ mt: 2 }}>
            <Grid item md={1} sx={{ display: { xs: "none", md: "block" } }} />
            {FEATURES.slice(3).map((f) => (
              <Grid item xs={12} sm={6} md={5} key={f.title}>
                <FeatureCard feat={f} />
              </Grid>
            ))}
            <Grid item md={1} sx={{ display: { xs: "none", md: "block" } }} />
          </Grid>
        </Box>

        {/* ── HOW TO USE — Timeline ────────────────────────────────────────── */}
        <Box>
          <SectionHeading icon={IcoUser} accentColor="#8b5cf6" title="How to Use" subtitle="Three flows covering every role in the system." />
          <TimelineFlow />
        </Box>

        {/* ── BEST PRACTICES + FAQ ─────────────────────────────────────────── */}
        <Grid container spacing={3} alignItems="flex-start">
          {/* Best Practices */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ borderRadius: "18px", border: `1px solid ${border}`, backgroundColor: surface, overflow: "hidden", height: "100%" }}>
              <Box sx={{ px: 3.5, pt: 3.5, pb: 2.5 }}>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 0.75 }}>
                  <Box sx={{ color: "#f59e0b" }}><IcoStar size={22} /></Box>
                  <Typography fontWeight={800} fontSize="1.1rem" color="text.primary">Best Practices</Typography>
                </Box>
                <Typography color="text.secondary" fontSize="0.92rem">Follow these to get the most out of the system.</Typography>
              </Box>
              <Divider />
              <Stack divider={<Divider />}>
                {BEST_PRACTICES.map(({ icon: Ic, text }) => (
                  <Box key={text} sx={{ px: 3.5, py: 2.5, display: "flex", gap: 2.5, alignItems: "flex-start", transition: "background 0.15s", "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.04) } }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: "10px", backgroundColor: alpha("#10b981", isDark ? 0.2 : 0.1), color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Ic size={17} strokeWidth={2} />
                    </Box>
                    <Typography fontSize="0.95rem" color="text.secondary" lineHeight={1.6}>{text}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* FAQ */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ borderRadius: "18px", border: `1px solid ${border}`, backgroundColor: surface, overflow: "hidden" }}>
              <Box sx={{ px: 3.5, pt: 3.5, pb: 2.5 }}>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 0.75 }}>
                  <Box sx={{ color: "#3b82f6" }}><IcoHelp size={22} /></Box>
                  <Typography fontWeight={800} fontSize="1.1rem" color="text.primary">Frequently Asked Questions</Typography>
                </Box>
                <Typography color="text.secondary" fontSize="0.92rem">Common questions about the Smart Request Management System.</Typography>
              </Box>
              <Divider />
              {FAQ.map((item, i) => (
                <Accordion
                  key={i}
                  elevation={0}
                  disableGutters
                  expanded={expanded === i}
                  onChange={() => setExpanded(expanded === i ? false : i)}
                  sx={{
                    borderBottom: i < FAQ.length - 1 ? `1px solid ${border}` : "none",
                    "&:before": { display: "none" },
                    backgroundColor: "transparent",
                    "&.Mui-expanded": { backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.06 : 0.03) },
                    transition: "background 0.15s",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<Box sx={{ color: textSec, display: "flex" }}><IcoChevDown size={18} /></Box>}
                    sx={{ px: 3.5, minHeight: 64, "& .MuiAccordionSummary-content": { my: 2 } }}
                  >
                    <Typography fontWeight={700} fontSize="0.98rem" color="text.primary">{item.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3.5, pb: 3, pt: 0 }}>
                    <Typography fontSize="0.95rem" color="text.secondary" lineHeight={1.75}>{item.a}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>
        </Grid>

        {/* ── CONTACT + GOAL ───────────────────────────────────────────────── */}
        <Grid container spacing={3} alignItems="stretch">
          {/* Contact */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 3.5, borderRadius: "18px", border: `1px solid ${border}`, backgroundColor: surface, height: "100%", display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 3 }}>
                <Box sx={{ color: "#3b82f6" }}><IcoHelp size={22} /></Box>
                <Typography fontWeight={800} fontSize="1.15rem" color="text.primary">Need Help?</Typography>
              </Box>

              <Stack spacing={1.5} mb={3} flex={1}>
                {CONTACT.map(({ icon: Ic, label, value }) => (
                  <Box
                    key={label}
                    sx={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      p: 2, borderRadius: "12px",
                      backgroundColor: isDark ? alpha("#fff", 0.04) : alpha("#000", 0.03),
                      border: `1px solid ${border}`,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1.75, alignItems: "center" }}>
                      <Box sx={{ color: textSec }}><Ic size={17} /></Box>
                      <Typography fontSize="0.92rem" color="text.secondary" fontWeight={600}>{label}</Typography>
                    </Box>
                    <Typography fontSize="0.92rem" fontWeight={700} color="text.primary">{value}</Typography>
                  </Box>
                ))}
              </Stack>

              <Stack spacing={1.5}>
                <Button
                  fullWidth variant="contained" disableElevation
                  startIcon={<IcoPlus size={17} />}
                  sx={{ backgroundColor: isDark ? "#3b82f6" : "#1d4ed8", borderRadius: "12px", fontWeight: 700, textTransform: "none", fontSize: "0.97rem", py: 1.4, "&:hover": { backgroundColor: isDark ? "#2563eb" : "#1e40af" } }}
                >
                  Open a Support Ticket
                </Button>
                <Button
                  fullWidth variant="outlined"
                  startIcon={<IcoMail size={17} />}
                  sx={{ borderColor: border, color: "text.primary", borderRadius: "12px", fontWeight: 700, textTransform: "none", fontSize: "0.97rem", py: 1.4, "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.06), borderColor: alpha(theme.palette.primary.main, 0.4) } }}
                >
                  Email Support Team
                </Button>
              </Stack>
            </Paper>
          </Grid>

          {/* Goal */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 5 },
                borderRadius: "18px",
                background: isDark
                  ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a5f 100%)"
                  : "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 4,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {[200, 320].map((sz, i) => (
                <Box key={i} sx={{ position: "absolute", right: -sz * 0.25, bottom: -sz * 0.25, width: sz, height: sz, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", pointerEvents: "none" }} />
              ))}

              <Box>
                <Chip label="Our Goal" size="small" sx={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#93c5fd", fontWeight: 700, fontSize: "0.78rem", mb: 2.5, height: 28 }} />
                <Typography variant="h4" fontWeight={900} color="#fff" letterSpacing="-0.025em" lineHeight={1.2} mb={2}>
                  Make request management faster, smarter, and fully transparent.
                </Typography>
                <Typography color="#93c5fd" fontSize="1rem" lineHeight={1.75}>
                  Zero confusion. Maximum accountability. Every action logged, every stage visible, every SLA enforced — automatically.
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {[
                  { Ic: IcoZap,    label: "Auto-Prioritized",    value: "100%",   sub: "of requests" },
                  { Ic: IcoShield, label: "SLA Compliance",      value: "End-to-end", sub: "enforced" },
                  { Ic: IcoScroll, label: "Audit Logged",        value: "Every",  sub: "action" },
                ].map(({ Ic, label, value, sub }) => (
                  <Grid item xs={4} key={label}>
                    <Box sx={{ p: 2.5, borderRadius: "14px", backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
                      <Box sx={{ color: "#60a5fa", display: "flex", justifyContent: "center", mb: 1 }}><Ic size={20} /></Box>
                      <Typography fontSize="1.15rem" color="#fff" fontWeight={900} lineHeight={1.1}>{value}</Typography>
                      <Typography fontSize="0.72rem" color="#94a3b8" mt={0.4}>{sub}</Typography>
                      <Typography fontSize="0.72rem" color="#64748b" mt={0.3} fontWeight={700}>{label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

      </Stack>
    </DashboardLayout>
  );
}