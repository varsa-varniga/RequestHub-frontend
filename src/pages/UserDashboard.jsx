// src/pages/UserDashboard.jsx
import { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import {
  Alert, Avatar, Box, Button, Chip, CircularProgress, Container,
  Divider, Grid, Paper, Stack, Typography,
} from "@mui/material";
import {
  LogoutOutlined, InboxOutlined, FiberManualRecord,
  AddCircleOutlineOutlined, PendingActionsOutlined,
  CheckCircleOutlined, CancelOutlined, FolderOutlined,
  ExpandMoreOutlined, ExpandLessOutlined, CommentOutlined,
  CalendarTodayOutlined, LabelOutlined, ErrorOutlineOutlined,
} from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import theme from "../theme";
import GlobalStyles from "../wrapper/GlobalStyles";

/* ─── CONFIG ─────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  PENDING:  { color: "#F59E0B", label: "Pending",  bg: "#F59E0B12" },
  APPROVED: { color: "#10B981", label: "Approved", bg: "#10B98112" },
  REJECTED: { color: "#EF4444", label: "Rejected", bg: "#EF444412" },
  CLOSED:   { color: "#7B8DB0", label: "Closed",   bg: "#7B8DB012" },
};

const URGENCY_CONFIG = {
  HIGH:   { color: "#EF4444", label: "High" },
  MEDIUM: { color: "#F59E0B", label: "Medium" },
  LOW:    { color: "#10B981", label: "Low" },
};

const TYPE_COLORS = ["#00E5FF", "#7C3AED", "#F59E0B", "#10B981", "#EF4444", "#06B6D4"];

/* ─── STATUS CHIP ─────────────────────────────────────────────── */
function StatusChip({ status }) {
  const cfg = STATUS_CONFIG[status?.toUpperCase()] ?? { color: "#7B8DB0", label: status ?? "Unknown", bg: "#7B8DB012" };
  return (
    <Chip
      size="small"
      icon={<FiberManualRecord sx={{ fontSize: "8px !important", color: `${cfg.color} !important` }} />}
      label={cfg.label}
      sx={{
        backgroundColor: cfg.bg, color: cfg.color,
        border: `1px solid ${cfg.color}44`,
        fontWeight: 700, fontSize: "0.78rem", height: 28, px: 0.5,
      }}
    />
  );
}

/* ─── STAT CARD ──────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <Paper elevation={0} sx={{
      p: 3, border: "1px solid rgba(255,255,255,0.06)",
      backgroundColor: "background.paper", borderRadius: "16px",
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: `${color}44`,
        transform: "translateY(-2px)",
        boxShadow: `0 8px 32px ${color}12`,
      },
    }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{
          width: 48, height: 48, borderRadius: "14px",
          backgroundColor: `${color}14`,
          border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color, flexShrink: 0,
        }}>
          <Icon sx={{ fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary" lineHeight={1} mb={0.5}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ letterSpacing: "0.03em" }}>
            {label}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

/* ─── TYPE BREAKDOWN ──────────────────────────────────────────── */
function TypeBreakdown({ requests }) {
  const typeCounts = requests.reduce((acc, r) => {
    const key = r.type || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const entries = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const total = requests.length;
  if (entries.length === 0) return null;

  return (
    <Paper elevation={0} sx={{
      p: 3.5, border: "1px solid rgba(255,255,255,0.06)",
      backgroundColor: "background.paper", borderRadius: "16px", height: "100%",
    }}>
      <Typography variant="body1" fontWeight={700} color="text.primary" mb={3}>
        Requests by Type
      </Typography>
      <Box sx={{ display: "flex", borderRadius: "8px", overflow: "hidden", height: 10, mb: 3 }}>
        {entries.map(([type, count], i) => (
          <Box key={type} sx={{
            width: `${(count / total) * 100}%`,
            backgroundColor: TYPE_COLORS[i % TYPE_COLORS.length],
          }} />
        ))}
      </Box>
      <Stack spacing={1.5}>
        {entries.map(([type, count], i) => (
          <Box key={type} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{
                width: 10, height: 10, borderRadius: "3px",
                backgroundColor: TYPE_COLORS[i % TYPE_COLORS.length], flexShrink: 0,
              }} />
              <Typography variant="body2" color="text.secondary">{type}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.primary" fontWeight={700}>{count}</Typography>
              <Typography variant="caption" color="text.secondary">
                {Math.round((count / total) * 100)}%
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

/* ─── URGENCY BREAKDOWN ───────────────────────────────────────── */
function UrgencyBreakdown({ requests }) {
  const counts = {
    HIGH:   requests.filter(r => r.urgency?.toUpperCase() === "HIGH").length,
    MEDIUM: requests.filter(r => r.urgency?.toUpperCase() === "MEDIUM").length,
    LOW:    requests.filter(r => r.urgency?.toUpperCase() === "LOW").length,
  };
  const total = requests.length || 1;

  return (
    <Paper elevation={0} sx={{
      p: 3.5, border: "1px solid rgba(255,255,255,0.06)",
      backgroundColor: "background.paper", borderRadius: "16px", height: "100%",
    }}>
      <Typography variant="body1" fontWeight={700} color="text.primary" mb={3}>
        Urgency Distribution
      </Typography>
      <Stack spacing={2.5}>
        {Object.entries(counts).map(([urgency, count]) => {
          const cfg = URGENCY_CONFIG[urgency];
          const pct = Math.round((count / total) * 100);
          return (
            <Box key={urgency}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: cfg.color }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>{cfg.label}</Typography>
                </Stack>
                <Typography variant="body2" fontWeight={700} sx={{ color: cfg.color }}>{count}</Typography>
              </Box>
              <Box sx={{ height: 6, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 6, overflow: "hidden" }}>
                <Box sx={{
                  height: "100%", width: `${pct}%`,
                  backgroundColor: cfg.color, borderRadius: 6,
                  transition: "width 0.6s ease",
                }} />
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}

/* ─── REQUEST CARD ────────────────────────────────────────────── */
function RequestCard({ request, isLast }) {
  const [expanded, setExpanded] = useState(false);
  const urgencyCfg = URGENCY_CONFIG[request.urgency?.toUpperCase()] ?? { color: "#7B8DB0", label: request.urgency };
  const statusCfg  = STATUS_CONFIG[request.status?.toUpperCase()]   ?? { color: "#7B8DB0" };

  return (
    <>
      <Box sx={{ transition: "background 0.15s", "&:hover": { backgroundColor: "rgba(255,255,255,0.02)" } }}>
        <Box sx={{ px: 3.5, py: 3 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>

            {/* Left */}
            <Stack direction="row" spacing={2.5} flex={1} minWidth={0}>
              {/* Status stripe */}
              <Box sx={{
                width: 3, borderRadius: 4, flexShrink: 0,
                backgroundColor: statusCfg.color, opacity: 0.7,
                minHeight: 44, alignSelf: "stretch",
              }} />

              <Box flex={1} minWidth={0}>
                <Typography variant="body1" fontWeight={600} color="text.primary" mb={0.8} fontSize="1rem">
                  {request.title}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  {request.type && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <LabelOutlined sx={{ fontSize: 13, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary">{request.type}</Typography>
                    </Stack>
                  )}
                  {request.urgency && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <ErrorOutlineOutlined sx={{ fontSize: 13, color: urgencyCfg.color }} />
                      <Typography variant="caption" sx={{ color: urgencyCfg.color, fontWeight: 600 }}>
                        {urgencyCfg.label}
                      </Typography>
                    </Stack>
                  )}
                  {request.createdAt && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CalendarTodayOutlined sx={{ fontSize: 12, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  )}
                  {request.adminComment && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CommentOutlined sx={{ fontSize: 13, color: "#00E5FF" }} />
                      <Typography variant="caption" sx={{ color: "#00E5FF" }}>Has comment</Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
            </Stack>

            {/* Right */}
            <Stack direction="row" alignItems="center" spacing={1} flexShrink={0}>
              <StatusChip status={request.status ?? "PENDING"} />
              <Box
                onClick={() => setExpanded(v => !v)}
                sx={{
                  cursor: "pointer", color: "text.secondary",
                  display: "flex", alignItems: "center",
                  p: 0.5, borderRadius: "6px",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.06)", color: "text.primary" },
                  transition: "all 0.15s",
                }}
              >
                {expanded
                  ? <ExpandLessOutlined sx={{ fontSize: 20 }} />
                  : <ExpandMoreOutlined sx={{ fontSize: 20 }} />}
              </Box>
            </Stack>
          </Box>

          {/* Expanded */}
          {expanded && (
            <Box mt={3} ml={5.5}>
              {request.description && (
                <Box mb={2.5}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}
                    textTransform="uppercase" letterSpacing="0.08em" display="block" mb={1}>
                    Description
                  </Typography>
                  <Typography variant="body2" color="text.primary" lineHeight={1.9} sx={{ maxWidth: 580 }}>
                    {request.description}
                  </Typography>
                </Box>
              )}
              {request.adminComment && (
                <Box sx={{
                  p: 3, borderRadius: "12px",
                  backgroundColor: "rgba(0,229,255,0.04)",
                  border: "1px solid rgba(0,229,255,0.15)",
                }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                    <CommentOutlined sx={{ fontSize: 15, color: "#00E5FF" }} />
                    <Typography variant="caption" fontWeight={700} sx={{ color: "#00E5FF" }}
                      textTransform="uppercase" letterSpacing="0.08em">
                      Admin Comment
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.primary" lineHeight={1.8}>
                    {request.adminComment}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
      {!isLast && <Divider sx={{ borderColor: "rgba(255,255,255,0.04)" }} />}
    </>
  );
}

/* ─── MAIN ────────────────────────────────────────────────────── */
export default function UserDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();

  useEffect(() => {
    API.get("/user/requests")
      .then(res => setRequests(res.data))
      .catch(err => { console.error(err); setError("Failed to load requests. Please refresh."); })
      .finally(() => setLoading(false));
  }, []);

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "??";

  const pending  = requests.filter(r => !r.status || r.status?.toUpperCase() === "PENDING").length;
  const approved = requests.filter(r => r.status?.toUpperCase() === "APPROVED").length;
  const rejected = requests.filter(r => r.status?.toUpperCase() === "REJECTED").length;

  const stats = [
    { label: "Total Requests", value: requests.length, icon: FolderOutlined,         color: "#7B8DB0" },
    { label: "Pending",        value: pending,          icon: PendingActionsOutlined, color: "#F59E0B" },
    { label: "Approved",       value: approved,         icon: CheckCircleOutlined,   color: "#10B981" },
    { label: "Rejected",       value: rejected,         icon: CancelOutlined,        color: "#EF4444" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />

      <Box sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        backgroundImage: `
          radial-gradient(ellipse 70% 40% at 50% -10%, rgba(0,229,255,0.06) 0%, transparent 60%),
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 60px 60px, 60px 60px",
        py: 5,
      }}>
        <Container maxWidth="lg">

          {/* ── Header ── */}
          <Paper elevation={0} sx={{
            p: { xs: 2.5, sm: 3.5 }, mb: 3,
            border: "1px solid rgba(255,255,255,0.06)",
            backgroundColor: "background.paper", borderRadius: "18px",
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            gap: 2, flexWrap: "wrap",
          }}>
            <Stack direction="row" alignItems="center" spacing={2.5}>
              <Avatar sx={{
                width: 52, height: 52,
                background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(124,58,237,0.15))",
                border: "1px solid rgba(0,229,255,0.25)",
                color: "#00E5FF", fontWeight: 800, fontSize: "1.1rem",
              }}>
                {initials}
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" mb={0.2}>
                  Signed in as
                </Typography>
                <Typography variant="body1" fontWeight={700} color="text.primary">
                  {user?.email}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineOutlined />}
                onClick={() => navigate("/user/create")}
                sx={{
                  background: "linear-gradient(135deg, #00E5FF, #0891B2)",
                  color: "#080B14", fontWeight: 700,
                  textTransform: "none", px: 2.5, py: 1,
                  boxShadow: "0 0 20px rgba(0,229,255,0.2)",
                  "&:hover": { boxShadow: "0 0 32px rgba(0,229,255,0.35)", transform: "translateY(-1px)" },
                  transition: "all 0.2s",
                }}
              >
                New Request
              </Button>
              <Button
                variant="outlined"
                startIcon={<LogoutOutlined />}
                onClick={logout}
                sx={{
                  borderColor: "rgba(255,255,255,0.1)", color: "text.secondary",
                  textTransform: "none", px: 2.5, py: 1,
                  "&:hover": { borderColor: "#EF4444", color: "#EF4444", backgroundColor: "rgba(239,68,68,0.06)" },
                  transition: "all 0.2s",
                }}
              >
                Sign out
              </Button>
            </Stack>
          </Paper>

          {/* ── Stats ── */}
          {!loading && !error && (
            <Grid container spacing={2} mb={3}>
              {stats.map(s => (
                <Grid item xs={6} sm={3} key={s.label}>
                  <StatCard {...s} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* ── Charts ── */}
          {!loading && !error && requests.length > 0 && (
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={7}><TypeBreakdown requests={requests} /></Grid>
              <Grid item xs={12} sm={5}><UrgencyBreakdown requests={requests} /></Grid>
            </Grid>
          )}

          {/* ── Requests List ── */}
          <Paper elevation={0} sx={{
            border: "1px solid rgba(255,255,255,0.06)",
            backgroundColor: "background.paper",
            borderRadius: "18px", overflow: "hidden",
          }}>
            <Box sx={{
              px: 3.5, py: 3,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <Box>
                <Typography variant="h6" color="text.primary" fontWeight={700} mb={0.2}>
                  My Requests
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  All requests submitted by you
                </Typography>
              </Box>
              {!loading && !error && requests.length > 0 && (
                <Chip
                  label={`${requests.length} total`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    color: "text.secondary",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontSize: "0.75rem", height: 26, fontWeight: 600,
                  }}
                />
              )}
            </Box>

            {loading && (
              <Box display="flex" justifyContent="center" alignItems="center" py={8}>
                <CircularProgress size={32} sx={{ color: "primary.main" }} />
              </Box>
            )}

            {error && (
              <Box p={4}>
                <Alert severity="error" variant="filled" sx={{ borderRadius: "12px" }}>{error}</Alert>
              </Box>
            )}

            {!loading && !error && requests.length === 0 && (
              <Stack alignItems="center" spacing={2} py={9}>
                <Box sx={{
                  width: 64, height: 64, borderRadius: "18px",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <InboxOutlined sx={{ fontSize: 28, color: "text.secondary", opacity: 0.5 }} />
                </Box>
                <Box textAlign="center">
                  <Typography variant="body1" color="text.primary" fontWeight={600} mb={0.5}>
                    No requests yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create your first request to get started
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutlineOutlined />}
                  onClick={() => navigate("/user/create")}
                  sx={{
                    borderColor: "rgba(0,229,255,0.3)", color: "#00E5FF",
                    textTransform: "none", fontWeight: 600,
                    "&:hover": { borderColor: "#00E5FF", backgroundColor: "rgba(0,229,255,0.06)" },
                  }}
                >
                  Create Request
                </Button>
              </Stack>
            )}

            {!loading && !error && requests.map((r, i) => (
              <RequestCard key={r.id} request={r} isLast={i === requests.length - 1} />
            ))}
          </Paper>

        </Container>
      </Box>
    </ThemeProvider>
  );
}