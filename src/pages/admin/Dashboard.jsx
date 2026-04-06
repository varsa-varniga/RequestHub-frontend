// src/pages/admin/Dashboard.jsx
import { Box, Button, Grid, Paper, Stack, Typography, Chip, Divider } from "@mui/material";
import { AddCircleOutline, Dashboard as DashboardIcon, PendingActions, TaskAlt, ErrorOutline, WarningAmber, History, NotificationsNone } from "@mui/icons-material";
import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAdminData } from "../../context/AdminDataContext";
import { useUnreadNotificationsCount } from "../../hooks/useNotifications";
import { useRequestAnalytics, StatCard } from "./adminShared.jsx";
import { computeRequestSlaRemainingHours } from "../../utils/requestUtils";



export default function AdminDashboardPage() {
  const { requests, users } = useAdminData();
  const { user } = useAuth();
  const { unreadCount } = useUnreadNotificationsCount(user?.id);
  const { stats, slaRisks } = useRequestAnalytics(requests);

  const workflowHealth = useMemo(() => {
    const groups = {
      IT: { label: "IT Workflow", total: 0, stuck: 0 },
      HR: { label: "HR Workflow", total: 0, stuck: 0 },
      Finance: { label: "Finance Workflow", total: 0, stuck: 0 },
    };

    const categorize = (type) => {
      const value = (type || "").toString().toUpperCase();
      if (["IT", "ACCESS", "HARDWARE", "SOFTWARE", "DEVICE", "SECURITY"].some((k) => value.includes(k))) return "IT";
      if (["HR", "LEAVE", "PAYROLL", "BENEFIT", "ONBOARD"].some((k) => value.includes(k))) return "HR";
      if (["FINANCE", "EXPENSE", "PURCHASE", "INVOICE", "BUDGET", "PROCURE"].some((k) => value.includes(k))) return "Finance";
      return "IT";
    };

    const remainingHours = (req) => {
      if (req.status !== "Pending") return null;
      const fromDeadline = computeRequestSlaRemainingHours(req.slaDeadline, req.status);
      if (fromDeadline != null) return fromDeadline;
      if (!req.createdAt || !req.slaHours) return null;
      const created = new Date(req.createdAt);
      if (Number.isNaN(created.getTime())) return null;
      const due = created.getTime() + req.slaHours * 3600 * 1000;
      return Math.max(0, (due - Date.now()) / 36e5);
    };

    requests.forEach((req) => {
      const key = categorize(req.type);
      groups[key].total += 1;
      const remaining = remainingHours(req);
      if (req.status === "Pending" && remaining !== null && remaining <= 0) {
        groups[key].stuck += 1;
      }
    });

    return Object.values(groups);
  }, [requests]);

  const typeDistribution = useMemo(() => {
    const counts = new Map();
    requests.forEach((req) => {
      const label = (req.type || "General").toString();
      counts.set(label, (counts.get(label) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
  }, [requests]);

  const statusDistribution = useMemo(() => {
    const counts = new Map();
    requests.forEach((req) => {
      const label = req.status || "Pending";
      counts.set(label, (counts.get(label) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
  }, [requests]);

  const categoryDistribution = useMemo(() => {
    const counts = { IT: 0, HR: 0, Finance: 0 };
    const categorize = (type) => {
      const value = (type || "").toString().toUpperCase();
      if (["IT", "ACCESS", "HARDWARE", "SOFTWARE", "DEVICE", "SECURITY"].some((k) => value.includes(k))) return "IT";
      if (["HR", "LEAVE", "PAYROLL", "BENEFIT", "ONBOARD"].some((k) => value.includes(k))) return "HR";
      if (["FINANCE", "EXPENSE", "PURCHASE", "INVOICE", "BUDGET", "PROCURE"].some((k) => value.includes(k))) return "Finance";
      return "IT";
    };
    requests.forEach((req) => {
      const key = categorize(req.type);
      counts[key] += 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [requests]);

  const trendByMonth = useMemo(() => {
    const map = new Map();
    requests.forEach((req) => {
      const d = new Date(req.createdAt);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, (map.get(key) || 0) + 1);
    });

    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.push(key);
    }

    const entries = months.map((label) => ({ label, value: map.get(label) || 0 }));
    return entries;
  }, [requests]);

  const slaRiskSplit = useMemo(() => {
    const buckets = { overdue: 0, dueSoon: 0, ok: 0 };
    requests.forEach((req) => {
      if (req.status !== "Pending") return;
      const remaining = computeRequestSlaRemainingHours(req.slaDeadline, req.status);
      if (remaining == null) return;
      if (remaining <= 0) buckets.overdue += 1;
      else if (remaining <= 24) buckets.dueSoon += 1;
      else buckets.ok += 1;
    });
    return [
      { label: "Overdue", value: buckets.overdue },
      { label: "Due <24h", value: buckets.dueSoon },
      { label: "Within SLA", value: buckets.ok },
    ];
  }, [requests]);

  const workload = useMemo(() => {
    const userLookup = new Map();
    (users || []).forEach((u) => {
      const name = u.name || u.fullName || u.displayName || u.username || u.email || "User";
      if (u.id != null) userLookup.set(String(u.id), name);
      if (u.email) userLookup.set(String(u.email), name);
      if (u.username) userLookup.set(String(u.username), name);
    });

    const byApprover = new Map();
    requests.forEach((req) => {
      if (!req.assignedTo) return;
      const key = req.assignedTo.toString();
      const display = userLookup.get(key) || key;
      const entry = byApprover.get(display) || { name: display, total: 0, pending: 0 };
      entry.total += 1;
      if (req.status === "Pending") entry.pending += 1;
      byApprover.set(display, entry);
    });

    const list = Array.from(byApprover.values()).sort((a, b) => b.total - a.total);
    const top5 = list.slice(0, 5);

    const pendingList = list
      .filter((item) => item.pending > 0)
      .sort((a, b) => b.pending - a.pending)
      .slice(0, 8);

    return { top5, pendingList };
  }, [requests]);

  const renderBarList = (items, accent) => {
    const max = Math.max(...items.map((i) => i.value), 1);
    return (
      <Stack spacing={1.2}>
        {items.map((item) => (
          <Stack key={item.label} spacing={0.4}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" fontWeight={600}>
                {item.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.value}
              </Typography>
            </Stack>
            <Box
              sx={{
                height: 8,
                borderRadius: 999,
                backgroundColor: "action.hover",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${Math.max(6, (item.value / max) * 100)}%`,
                  background: accent,
                }}
              />
            </Box>
          </Stack>
        ))}
      </Stack>
    );
  };

  const renderMiniBars = (items, accent) => {
    const max = Math.max(...items.map((i) => i.value), 1);
    return (
      <Stack spacing={1}>
        {items.map((item) => (
          <Stack key={item.label} direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" sx={{ minWidth: 80 }} color="text.secondary">
              {item.label}
            </Typography>
            <Box sx={{ flex: 1, height: 8, borderRadius: 999, backgroundColor: "action.hover", overflow: "hidden" }}>
              <Box sx={{ height: "100%", width: `${Math.max(6, (item.value / max) * 100)}%`, background: accent }} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {item.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    );
  };

  const renderAreaSpark = (items, accent) => {
    if (!items.length) return null;
    const max = Math.max(...items.map((i) => i.value), 1);
    return (
      <Stack spacing={1.2}>
        <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ height: 140 }}>
          {items.map((item) => (
            <Box key={item.label} sx={{ flex: 1, minWidth: 26, height: "100%", display: "flex", alignItems: "flex-end" }}>
              <Box
                sx={{
                  height: `${Math.max(8, (item.value / max) * 100)}%`,
                  borderRadius: 999,
                  background: accent,
                  width: "100%",
                  boxShadow: "0 10px 24px rgba(16,185,129,0.25)",
                }}
              />
            </Box>
          ))}
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          {items.slice(-4).map((item) => (
            <Typography key={item.label} variant="caption" color="text.secondary">
              {item.label}
            </Typography>
          ))}
        </Stack>
      </Stack>
    );
  };

  const renderPie = (items, size = 180, thickness = 22) => {
    const filtered = items.filter((i) => i.value > 0);
    const total = filtered.reduce((sum, i) => sum + i.value, 0);
    if (!total) {
      return (
        <Box sx={{ textAlign: "center", color: "text.secondary", py: 4 }}>
          <Typography variant="body2">No data to display.</Typography>
        </Box>
      );
    }

    const colors = [
      ["#6366F1", "#22D3EE"],
      ["#F59E0B", "#EF4444"],
      ["#22C55E", "#10B981"],
      ["#A78BFA", "#6366F1"],
      ["#F97316", "#F43F5E"],
      ["#14B8A6", "#22D3EE"],
    ];

    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;

    let offset = 0;
    const slices = filtered.map((item, index) => {
      const fraction = item.value / total;
      const length = fraction * circumference;
      const dasharray = `${length} ${circumference - length}`;
      const dashoffset = -offset;
      offset += length;

      return {
        ...item,
        dasharray,
        dashoffset,
        gradient: colors[index % colors.length],
        id: `grad-${index}`,
      };
    });

    return (
      <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 2, alignItems: "center" }}>
        <Box sx={{ position: "relative", width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
              <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="rgba(0,0,0,0.28)" />
              </filter>
              {slices.map((slice) => (
                <linearGradient key={slice.id} id={slice.id} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={slice.gradient[0]} />
                  <stop offset="100%" stopColor={slice.gradient[1]} />
                </linearGradient>
              ))}
            </defs>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(148,163,184,0.25)"
              strokeWidth={thickness}
            />
            {slices.map((slice, i) => (
              <circle
                key={slice.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={`url(#${slice.id})`}
                strokeWidth={thickness}
                strokeDasharray={slice.dasharray}
                strokeDashoffset={slice.dashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                filter="url(#pieShadow)"
                style={{ transition: "stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease" }}
              />
            ))}
          </svg>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
            <Typography variant="h5" fontWeight={800}>
              {total}
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1.1}>
          {slices.map((slice) => (
            <Stack key={slice.label} direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${slice.gradient[0]}, ${slice.gradient[1]})`,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
              />
              <Typography variant="body2" sx={{ minWidth: 80 }}>
                {slice.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {slice.value}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    );
  };

  const cardSx = {
    p: 2.8,
    borderRadius: 3,
    border: (t) => `1px solid ${t.palette.divider}`,
    height: "100%",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
    "&:hover": {
      transform: "translateY(-4px) scale(1.01)",
      borderColor: "rgba(99,102,241,0.35)",
      boxShadow: "0 18px 44px rgba(15,23,42,0.18)",
    },
  };

  return (
    <>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} mb={3}>
        <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">
          Admin Dashboard
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<History />} color="inherit">
            Activity Log
          </Button>
          <Button variant="contained" startIcon={<AddCircleOutline />}>
            Submit New Request
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12, lg: 12 }} mb={3}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard label="Total Requests" value={stats.total} color="#6366F1" icon={<DashboardIcon />} trend="+8%" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard label="Pending" value={stats.Pending} color="#F59E0B" icon={<PendingActions />} trend="+3%" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard label="Approved" value={stats.Approved} color="#22C55E" icon={<TaskAlt />} trend="+5%" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard label="Rejected" value={stats.Rejected} color="#EF4444" icon={<ErrorOutline />} trend="-1%" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard label="SLA Alerts" value={slaRisks.length} color="#EAB308" icon={<WarningAmber />} trend="+2%" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            label="Unread Notifications"
            value={unreadCount || 0}
            color="#22C55E"
            icon={<NotificationsNone />}
            trend={unreadCount > 0 ? `${unreadCount} new` : "All clear"}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3} alignItems="stretch">
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ ...cardSx, position: "relative", overflow: "hidden" }}>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at 20% 0%, rgba(99,102,241,0.08), transparent 45%)",
                pointerEvents: "none",
              }}
            />
            <Typography variant="h6" fontWeight={800} mb={1}>
              Workflow Health Snapshot
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              SLA impact by workflow group.
            </Typography>
            <Stack spacing={1.5}>
              {workflowHealth.map((wf) => (
                <Paper
                  key={wf.label}
                  elevation={0}
                  sx={{
                    p: 1.6,
                    borderRadius: 2,
                    border: (t) => `1px solid ${t.palette.divider}`,
                    backgroundColor: wf.stuck > 0 ? "rgba(239,68,68,0.06)" : "transparent",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack spacing={0.4}>
                      <Typography fontWeight={700}>{wf.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {wf.total} requests
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color={wf.stuck > 0 ? "error.main" : "success.main"}
                    >
                      {wf.stuck > 0 ? `${wf.stuck} stuck` : "smooth"}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={cardSx}>
            <Typography variant="h6" fontWeight={800} mb={1}>
              Request Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              By type and by status.
            </Typography>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
                  By Type (Pie)
                </Typography>
                {typeDistribution.length ? renderPie(typeDistribution, 210, 24) : (
                  <Typography variant="body2" color="text.secondary">
                    No request types yet.
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
                  By Status (Pie)
                </Typography>
                {statusDistribution.length ? renderPie(statusDistribution, 210, 24) : (
                  <Typography variant="body2" color="text.secondary">
                    No status data yet.
                  </Typography>
                )}
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={cardSx}>
            <Typography variant="h6" fontWeight={800} mb={1}>
              Workload Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Busiest approvers and pending load.
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
                  Top 5 busiest users
                </Typography>
                {workload.top5.length ? (
                  <Stack spacing={1.2}>
                    {workload.top5.map((item) => (
                      <Paper
                        key={item.name}
                        elevation={0}
                        sx={{
                          p: 1.4,
                          borderRadius: 2,
                          border: (t) => `1px solid ${t.palette.divider}`,
                          background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(34,211,238,0.06))",
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" fontWeight={700}>
                            {item.name}
                          </Typography>
                          <Chip
                            size="small"
                            label={`${item.total} requests`}
                            sx={{ fontWeight: 700, bgcolor: "rgba(99,102,241,0.12)" }}
                          />
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No approver assignments found yet.
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
                  Pending tasks per user
                </Typography>
                {workload.pendingList.length ? (
                  <Stack spacing={1.2}>
                    {workload.pendingList.map((item) => (
                      <Paper
                        key={item.name}
                        elevation={0}
                        sx={{
                          p: 1.4,
                          borderRadius: 2,
                          border: (t) => `1px solid ${t.palette.divider}`,
                          background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.05))",
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" fontWeight={700}>
                            {item.name}
                          </Typography>
                          <Chip
                            size="small"
                            label={`${item.pending} pending`}
                            sx={{ fontWeight: 700, bgcolor: "rgba(245,158,11,0.12)", color: "#B45309" }}
                          />
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No pending items assigned.
                  </Typography>
                )}
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={cardSx}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
              <Typography variant="h6" fontWeight={800}>
                Category Mix
              </Typography>
              <Chip label="IT / HR / Finance" size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Category-wise request volume.
            </Typography>
            {categoryDistribution.length ? renderPie(categoryDistribution, 230, 26) : (
              <Typography variant="body2" color="text.secondary">
                No category data available.
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={cardSx}>
            <Typography variant="h6" fontWeight={800} mb={1}>
              Request Trend
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Monthly volume based on created dates.
            </Typography>
            {trendByMonth.length ? renderAreaSpark(trendByMonth, "linear-gradient(180deg, #34D399, #10B981)") : (
              <Typography variant="body2" color="text.secondary">
                Not enough data to plot trend.
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={cardSx}>
            <Typography variant="h6" fontWeight={800} mb={1}>
              SLA Risk Split
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Overdue vs due soon vs within SLA.
            </Typography>
            {renderMiniBars(slaRiskSplit, "linear-gradient(90deg, #EF4444, #F59E0B)")}
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={1.5}>
              <Chip label="Overdue" size="small" sx={{ bgcolor: "rgba(239,68,68,0.12)", color: "#EF4444", fontWeight: 700 }} />
              <Chip label="Due <24h" size="small" sx={{ bgcolor: "rgba(245,158,11,0.12)", color: "#F59E0B", fontWeight: 700 }} />
              <Chip label="Within SLA" size="small" sx={{ bgcolor: "rgba(34,197,94,0.12)", color: "#22C55E", fontWeight: 700 }} />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
