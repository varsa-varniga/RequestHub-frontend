// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../api/api";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Avatar,
  Divider,
  Badge,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import InboxIcon from "@mui/icons-material/Inbox";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

const STATUS_COLORS = {
  PENDING: "#F59E0B",
  APPROVED: "#22C55E",
  REJECTED: "#EF4444",
};

const STAT_CARDS = [
  {
    key: "total",
    label: "Total Requests",
    icon: <InboxIcon sx={{ fontSize: 28, color: "#818CF8" }} />,
    color: "#818CF8",
    bg: "rgba(129,140,248,0.08)",
    border: "rgba(129,140,248,0.18)",
  },
  {
    key: "PENDING",
    label: "Pending",
    icon: <HourglassEmptyIcon sx={{ fontSize: 28, color: "#F59E0B" }} />,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.18)",
  },
  {
    key: "APPROVED",
    label: "Approved",
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 28, color: "#22C55E" }} />,
    color: "#22C55E",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.18)",
  },
  {
    key: "REJECTED",
    label: "Rejected",
    icon: <CancelOutlinedIcon sx={{ fontSize: 28, color: "#EF4444" }} />,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.18)",
  },
];

// Decode logged-in admin email from Basic Auth header
function getAdminEmail() {
  try {
    const auth = API.defaults.headers.common["Authorization"] || "";
    if (!auth.startsWith("Basic ")) return null;
    const decoded = atob(auth.replace("Basic ", ""));
    return decoded.split(":")[0] || null;
  } catch {
    return null;
  }
}

// Derive display name: take part before @ and capitalise
function formatAdminName(email) {
  if (!email) return "Admin";
  const local = email.split("@")[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [comments, setComments] = useState({});

  const adminEmail = getAdminEmail();
  const adminName = formatAdminName(adminEmail);
  const adminInitial = adminName.charAt(0).toUpperCase();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id, decision) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: true }));
      await API.post(`/admin/requests/${id}/decision`, {
        decision,
        comment: comments[id] || "",
      });
      setSuccess(`Request ${decision.toLowerCase()} successfully`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      setError("Failed to update request");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const statusCounts = requests.reduce(
    (acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    },
    { PENDING: 0, APPROVED: 0, REJECTED: 0 }
  );

  const chartData = [
    { name: "Pending", value: statusCounts.PENDING, color: STATUS_COLORS.PENDING },
    { name: "Approved", value: statusCounts.APPROVED, color: STATUS_COLORS.APPROVED },
    { name: "Rejected", value: statusCounts.REJECTED, color: STATUS_COLORS.REJECTED },
  ];

  const pendingCount = statusCounts.PENDING;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#07070F",
        backgroundImage:
          "radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 10%, rgba(34,197,94,0.04) 0%, transparent 50%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── TOP HEADER BAR ── */}
      <Box
        sx={{
          px: { xs: 2, md: 5 },
          py: 2,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(13,13,22,0.95)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: Brand */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AdminPanelSettingsIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
              }}
            >
              Control Center
            </Typography>
            <Typography sx={{ color: "#4B4B6A", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Admin Portal
            </Typography>
          </Box>
        </Stack>

        {/* Right: Notifications + Admin Identity */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Badge
            badgeContent={pendingCount}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#F59E0B",
                color: "#000",
                fontWeight: 700,
                fontSize: "0.65rem",
                minWidth: 18,
                height: 18,
              },
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.2s",
                "&:hover": { background: "rgba(255,255,255,0.08)" },
              }}
            >
              <NotificationsNoneIcon sx={{ color: "#9CA3AF", fontSize: 20 }} />
            </Box>
          </Badge>

          <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.07)", mx: 0.5 }} />

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg, #6366F1, #A78BFA)",
                fontSize: "0.85rem",
                fontWeight: 700,
                border: "2px solid rgba(99,102,241,0.4)",
              }}
            >
              {adminInitial}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography sx={{ color: "#E5E7EB", fontWeight: 600, fontSize: "0.875rem", lineHeight: 1.2 }}>
                {adminName}
              </Typography>
              <Typography sx={{ color: "#4B4B6A", fontSize: "0.7rem" }}>
                {adminEmail || "Administrator"}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* ── PAGE CONTENT ── */}
      <Box sx={{ px: { xs: 2, md: 5 }, py: 4 }}>

        {/* Page Title */}
        <Stack direction="row" alignItems="flex-end" justifyContent="space-between" mb={4}>
          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 800,
                fontSize: { xs: "1.6rem", md: "2rem" },
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Request Dashboard
            </Typography>
            <Typography sx={{ color: "#4B4B6A", fontSize: "0.875rem", mt: 0.5 }}>
              Review and manage all incoming requests
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={fetchRequests}
            sx={{
              borderColor: "rgba(99,102,241,0.4)",
              color: "#818CF8",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              fontSize: "0.8rem",
              "&:hover": { borderColor: "#818CF8", background: "rgba(99,102,241,0.08)" },
            }}
          >
            Refresh
          </Button>
        </Stack>

        {/* ── STAT CARDS ── */}
        <Grid container spacing={2} mb={4}>
          {STAT_CARDS.map((card) => {
            const value =
              card.key === "total" ? requests.length : statusCounts[card.key];
            return (
              <Grid item xs={6} md={3} key={card.key}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    background: card.bg,
                    border: `1px solid ${card.border}`,
                    borderRadius: "14px",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 32px ${card.border}`,
                    },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography sx={{ color: "#6B7280", fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", mb: 0.5 }}>
                        {card.label}
                      </Typography>
                      <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "2rem", lineHeight: 1, letterSpacing: "-0.02em" }}>
                        {value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        background: `rgba(${card.color === "#818CF8" ? "129,140,248" : card.color === "#F59E0B" ? "245,158,11" : card.color === "#22C55E" ? "34,197,94" : "239,68,68"},0.12)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* ── CHART ── */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            background: "rgba(13,13,22,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
          }}
        >
          <Typography sx={{ color: "#9CA3AF", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", mb: 2 }}>
            Request Breakdown
          </Typography>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#13131A",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "0.8rem",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: "#9CA3AF", fontSize: "0.8rem" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Paper>

        {/* ── REQUESTS LIST ── */}
        <Typography sx={{ color: "#9CA3AF", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", mb: 2 }}>
          All Requests
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={8}>
            <CircularProgress sx={{ color: "#6366F1" }} />
          </Box>
        ) : requests.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              border: "1px dashed rgba(255,255,255,0.07)",
              borderRadius: "16px",
            }}
          >
            <InboxIcon sx={{ fontSize: 48, color: "#2A2A40", mb: 1 }} />
            <Typography sx={{ color: "#4B4B6A" }}>No requests found.</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {requests.map((req) => (
              <Paper
                key={req.id}
                elevation={0}
                sx={{
                  p: 3,
                  background: "rgba(13,13,22,0.8)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px",
                  transition: "border-color 0.2s, transform 0.2s",
                  "&:hover": {
                    borderColor: "rgba(99,102,241,0.25)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography
                    sx={{
                      color: "#E5E7EB",
                      fontWeight: 700,
                      fontSize: "1rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {req.title}
                  </Typography>
                  <Chip
                    label={req.status}
                    size="small"
                    sx={{
                      backgroundColor: `${STATUS_COLORS[req.status]}18`,
                      color: STATUS_COLORS[req.status],
                      border: `1px solid ${STATUS_COLORS[req.status]}40`,
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      letterSpacing: "0.05em",
                      height: 24,
                    }}
                  />
                </Stack>

                <Typography sx={{ color: "#9CA3AF", fontSize: "0.875rem", mb: 1.5, lineHeight: 1.6 }}>
                  {req.description}
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                  {[
                    { label: "Type", value: req.requestType },
                    { label: "Urgency", value: req.urgency },
                    { label: "Stage", value: req.stageNumber != null ? `Stage ${req.stageNumber}` : "—" },
                  ].map((meta) => (
                    <Box key={meta.label}>
                      <Typography component="span" sx={{ color: "#4B4B6A", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {meta.label}:{" "}
                      </Typography>
                      <Typography component="span" sx={{ color: "#6B7280", fontSize: "0.75rem", fontWeight: 500 }}>
                        {meta.value}
                      </Typography>
                    </Box>
                  ))}
                  {/* Created By User ID badge */}
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.6,
                      px: 1.2,
                      py: 0.3,
                      borderRadius: "6px",
                      background: "rgba(129,140,248,0.08)",
                      border: "1px solid rgba(129,140,248,0.18)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #6366F1, #A78BFA)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.55rem",
                        color: "#fff",
                        fontWeight: 800,
                        lineHeight: 1,
                      }}
                    >
                      U
                    </Box>
                    <Typography sx={{ color: "#818CF8", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.02em" }}>
                      User #{req.createdBy}
                    </Typography>
                  </Box>
                </Stack>

                {req.status === "PENDING" && (
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    mt={2.5}
                    alignItems="center"
                    sx={{
                      pt: 2.5,
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <TextField
                      size="small"
                      placeholder="Add a comment..."
                      fullWidth
                      value={comments[req.id] || ""}
                      onChange={(e) =>
                        setComments((prev) => ({ ...prev, [req.id]: e.target.value }))
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "#E5E7EB",
                          fontSize: "0.85rem",
                          borderRadius: "10px",
                          background: "rgba(255,255,255,0.03)",
                          "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                          "&:hover fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                          "&.Mui-focused fieldset": { borderColor: "#6366F1" },
                        },
                        "& .MuiInputBase-input::placeholder": { color: "#4B4B6A" },
                      }}
                    />
                    <Button
                      variant="contained"
                      disabled={actionLoading[req.id]}
                      onClick={() => handleDecision(req.id, "APPROVED")}
                      startIcon={!actionLoading[req.id] && <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        background: "rgba(34,197,94,0.15)",
                        color: "#22C55E",
                        border: "1px solid rgba(34,197,94,0.3)",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        borderRadius: "10px",
                        px: 2.5,
                        whiteSpace: "nowrap",
                        boxShadow: "none",
                        "&:hover": { background: "rgba(34,197,94,0.25)", boxShadow: "none" },
                        "&.Mui-disabled": { opacity: 0.5 },
                      }}
                    >
                      {actionLoading[req.id] ? <CircularProgress size={16} sx={{ color: "#22C55E" }} /> : "Approve"}
                    </Button>
                    <Button
                      variant="contained"
                      disabled={actionLoading[req.id]}
                      onClick={() => handleDecision(req.id, "REJECTED")}
                      startIcon={!actionLoading[req.id] && <CancelOutlinedIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        background: "rgba(239,68,68,0.15)",
                        color: "#EF4444",
                        border: "1px solid rgba(239,68,68,0.3)",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        borderRadius: "10px",
                        px: 2.5,
                        whiteSpace: "nowrap",
                        boxShadow: "none",
                        "&:hover": { background: "rgba(239,68,68,0.25)", boxShadow: "none" },
                        "&.Mui-disabled": { opacity: 0.5 },
                      }}
                    >
                      {actionLoading[req.id] ? <CircularProgress size={16} sx={{ color: "#EF4444" }} /> : "Reject"}
                    </Button>
                  </Stack>
                )}
              </Paper>
            ))}
          </Stack>
        )}
      </Box>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="error" sx={{ borderRadius: "10px" }}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" sx={{ borderRadius: "10px" }}>{success}</Alert>
      </Snackbar>
    </Box>
  );
}