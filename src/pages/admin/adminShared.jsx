// src/pages/admin/adminShared.jsx
import { useMemo } from "react";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { PendingActions, TaskAlt, ErrorOutline, WarningAmber } from "@mui/icons-material";
import { computeSlaRemainingHours } from "../../utils/requestUtils";

export const STATUS_CONFIG = {
  Pending: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", icon: <PendingActions fontSize="small" /> },
  Approved: { color: "#22C55E", bg: "rgba(34,197,94,0.12)", icon: <TaskAlt fontSize="small" /> },
  Rejected: { color: "#EF4444", bg: "rgba(239,68,68,0.12)", icon: <ErrorOutline fontSize="small" /> },
  Escalated: { color: "#EAB308", bg: "rgba(234,179,8,0.14)", icon: <WarningAmber fontSize="small" /> },
};

export function formatRelativeHours(hours) {
  if (hours <= 0) return "Due now";
  if (hours < 1) return "<1h";
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = Math.floor(hours / 24);
  const rem = Math.round(hours % 24);
  return `${days}d ${rem}h`;
}

export function useRequestAnalytics(requests) {
  const now = useMemo(() => new Date(), []);

  const stats = useMemo(() => {
    const totals = { total: requests.length, Pending: 0, Approved: 0, Rejected: 0, Escalated: 0 };
    requests.forEach((r) => {
      totals[r.status] = (totals[r.status] || 0) + 1;
    });
    return totals;
  }, [requests]);

  const slaRisks = useMemo(
    () =>
      requests
        .map((r) => {
          const remaining = r.status === "Pending"
            ? r.slaDeadline
              ? computeSlaRemainingHours(r.slaDeadline)
              : Math.max(0, (new Date(r.createdAt).getTime() + r.slaHours * 3600 * 1000 - now.getTime()) / 36e5)
            : null;
          return { ...r, remaining };
        })
        .filter((r) => r.status === "Pending" || (r.remaining != null && r.remaining < 24))
        .sort((a, b) => a.remaining - b.remaining),
    [requests, now]
  );

  const timeline = useMemo(() => {
    const items = [];
    requests.forEach((r) =>
      r.timeline?.forEach((t) => {
        items.push({ ...t, requestId: r.id });
      })
    );
    return items.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);
  }, [requests]);

  return { stats, slaRisks, timeline };
}

export function StatCard({ label, value, color, icon, trend }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.2,
        borderRadius: 0,
        border: (t) => `1px solid ${t.palette.divider}`,
        background: (t) => (t.palette.mode === "light" ? "#fff" : "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))"),
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">
            {value}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={trend} size="small" sx={{ bgcolor: "rgba(34,197,94,0.12)", color: "#16A34A", fontWeight: 700 }} />
            <Typography variant="caption" color="text.secondary">
              vs last week
            </Typography>
          </Stack>
        </Stack>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            backgroundColor: color,
            color: "#fff",
            boxShadow: `0 10px 30px ${color}30`,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
}

export function StatusChip({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        fontWeight: 700,
        borderRadius: 1.5,
      }}
      icon={cfg.icon}
    />
  );
}
