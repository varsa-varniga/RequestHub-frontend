// src/pages/MyRequestsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import API from "../api/api";
import { mapRequestDto } from "../utils/requestUtils";

const MOCK_REQUESTS = [
  {
    id: "REQ-101",
    title: "VPN access for project Nexus",
    type: "IT Access",
    priority: "High",
    status: "Pending",
    stage: "Manager Approval",
    createdAt: "2026-03-10T09:15:00Z",
  },
  {
    id: "REQ-102",
    title: "MacBook Pro replacement",
    type: "Hardware",
    priority: "Medium",
    status: "Approved",
    stage: "Procurement",
    createdAt: "2026-03-06T12:40:00Z",
  },
  {
    id: "REQ-103",
    title: "Compliance training access",
    type: "Compliance",
    priority: "Low",
    status: "Rejected",
    stage: "Closed",
    createdAt: "2026-03-01T08:30:00Z",
  },
];

const STATUS_COLORS = {
  Pending: { bg: "rgba(234,179,8,0.18)", color: "#EAB308" },
  Approved: { bg: "rgba(34,197,94,0.16)", color: "#22C55E" },
  Rejected: { bg: "rgba(239,68,68,0.16)", color: "#EF4444" },
  Escalated: { bg: "rgba(234,179,8,0.18)", color: "#EAB308" },
};

const PRIORITY_COLORS = {
  High: { bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
  Medium: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
  Low: { bg: "rgba(34,197,94,0.12)", color: "#22C55E" },
};

export default function MyRequestsPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("created_desc");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/user/requests")
      .then((res) => setRequests(res.data || []))
      .catch((err) => {
        console.error(err);
        setRequests([]);
      });
  }, []);

  const normalizedRequests = useMemo(
    () =>
      requests.map((req) => mapRequestDto(req)),
    [requests]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return normalizedRequests.filter((r) => {
      const matchesQuery = !q || r.title.toLowerCase().includes(q) || r.type.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
      const matchesPriority = priorityFilter === "ALL" || r.priority === priorityFilter;
      return matchesQuery && matchesStatus && matchesPriority;
    });
  }, [normalizedRequests, query, statusFilter, priorityFilter]);

  const sorted = useMemo(() => {
    const data = [...filtered];
    if (sortBy === "created_asc") return data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "priority") return data.sort((a, b) => a.priority.localeCompare(b.priority));
    if (sortBy === "status") return data.sort((a, b) => a.status.localeCompare(b.status));
    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [filtered, sortBy]);

  const cardBg = isDark ? "#0f172a" : "#fff";
  const cardBorder = isDark ? "rgba(148,163,184,0.18)" : "#e5e7eb";
  const headerColor = isDark ? "#DCE6F5" : "#475569";
  const mutedColor = isDark ? "#B8C7DB" : theme.palette.text.secondary;
  const rowHoverBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.02)";
  const typeChipSx = {
    fontWeight: 700,
    borderRadius: 999,
    borderColor: isDark ? "rgba(191,219,254,0.26)" : "rgba(148,163,184,0.5)",
    color: isDark ? "#EAF2FF" : "#0f172a",
    backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "transparent",
  };

  return (
    <DashboardLayout
      showSearch={false}
      contentSx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 }, maxWidth: "100%", mx: 0, width: "100%" }}
    >
      <Stack spacing={2}>
        <Box>
          <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">
            My Requests
          </Typography>
          <Typography color="text.secondary">
            View and track all of your submitted requests.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or type"
            size="small"
            sx={{ maxWidth: 320 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              {["ALL", "Pending", "Approved", "Rejected", "Escalated"].map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Priority</InputLabel>
            <Select value={priorityFilter} label="Priority" onChange={(e) => setPriorityFilter(e.target.value)}>
              {["ALL", "High", "Medium", "Low"].map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Sort</InputLabel>
            <Select value={sortBy} label="Sort" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="created_desc">Newest</MenuItem>
              <MenuItem value="created_asc">Oldest</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            border: `1px solid ${cardBorder}`,
            backgroundColor: cardBg,
            width: "100%",
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: headerColor, borderBottomColor: cardBorder }}>Request ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: headerColor, borderBottomColor: cardBorder }}>Request Title</TableCell>
                <TableCell sx={{ fontWeight: 700, color: headerColor, borderBottomColor: cardBorder }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700, color: headerColor, borderBottomColor: cardBorder }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 700, color: headerColor, borderBottomColor: cardBorder }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: headerColor, borderBottomColor: cardBorder }}>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((req) => {
                const colors = STATUS_COLORS[req.status] || STATUS_COLORS.Pending;
                const priorityColors = PRIORITY_COLORS[req.priority] || PRIORITY_COLORS.Medium;
                const createdLabel = req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "—";
                return (
                  <TableRow
                    key={req.id}
                    hover
                    sx={{
                      cursor: "pointer",
                      "& td": { borderBottomColor: cardBorder },
                      "&:hover": { backgroundColor: rowHoverBg },
                    }}
                    onClick={() => navigate(`/requests/${req.id}`)}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ color: mutedColor }} fontWeight={700}>
                        {req.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={700} color="text.primary">{req.title}</Typography>
                      <Typography variant="body2" sx={{ color: mutedColor }}>
                        {req.stageLabel}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={req.type} size="small" variant="outlined" sx={typeChipSx} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={req.priority}
                        size="small"
                        sx={{ bgcolor: priorityColors.bg, color: priorityColors.color, fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={req.status} size="small" sx={{ bgcolor: colors.bg, color: colors.color, fontWeight: 700 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: mutedColor }}>
                        {createdLabel}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Stack>
    </DashboardLayout>
  );
}
