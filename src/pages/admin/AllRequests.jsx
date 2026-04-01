// src/pages/admin/AllRequests.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, InputBase, LinearProgress, Paper, Stack, Typography, useTheme } from "@mui/material";
import API from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useAdminData } from "../../context/AdminDataContext";
import { computeSlaRemainingHours } from "../../utils/requestUtils";
import { formatRelativeHours, StatusChip } from "./adminShared.jsx";

export default function AllRequests() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requests, refreshRequests } = useAdminData();
  const REQUEST_TYPES = ["IT", "LEAVE", "EXPENSE", "PURCHASE", "ACCESS"];
  const [filters, setFilters] = useState({ status: "ALL", urgency: "ALL", type: "ALL", q: "" });
  const [actionState, setActionState] = useState({ loading: false, comment: "" });

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesStatus = filters.status === "ALL" || req.status === filters.status;
      const matchesUrgency = filters.urgency === "ALL" || req.urgency?.toUpperCase() === filters.urgency;
      const matchesType = filters.type === "ALL" || req.type === filters.type;
      const matchesSearch =
        !filters.q || req.title.toLowerCase().includes(filters.q.toLowerCase()) || req.requester?.toLowerCase().includes(filters.q.toLowerCase());
      return matchesStatus && matchesUrgency && matchesType && matchesSearch;
    });
  }, [requests, filters]);

  const incomingRequests = filteredRequests.filter((req) => {
    if (!user?.email) return false;
    return (req.assignedTo || "").toLowerCase().includes(user.email.toLowerCase());
  });

  const outgoingRequests = filteredRequests.filter((req) => {
    if (!user?.email) return false;
    return (req.requester || "").toLowerCase() === user.email.toLowerCase();
  });

  const handleDecision = async (id, decision) => {
    setActionState((s) => ({ ...s, loading: true }));
    try {
      await API.post(`/admin/requests/${id}/force-decision`, {
        decision,
        comment: actionState.comment,
      });
      refreshRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setActionState((s) => ({ ...s, loading: false, comment: "" }));
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: (t) => `1px solid ${t.palette.divider}`,
          background: theme.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.04)",
        }}
      >
        <Stack spacing={1.5} mb={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={800}>
              All Requests
            </Typography>
            <Button size="small" variant="outlined" color="inherit" onClick={refreshRequests}>
              Refresh
            </Button>
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
            <InputBase
              placeholder="Search title or requester"
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              sx={{
                px: 1.5,
                py: 0.8,
                border: (t) => `1px solid ${t.palette.divider}`,
                borderRadius: 2,
                flex: 1,
                backgroundColor: theme.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.04)",
              }}
            />
            {["status", "urgency", "type"].map((key) => (
              <select
                key={key}
                value={filters[key]}
                onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: `1px solid ${theme.palette.divider}`,
                  background: theme.palette.mode === "light" ? "#fff" : "#0f172a",
                  color: theme.palette.text.primary,
                  minWidth: 120,
                }}
              >
                <option value="ALL">All {key}</option>
                {key === "status" && ["Pending", "Approved", "Rejected", "Escalated"].map((v) => (
                  <option value={v} key={v}>{v}</option>
                ))}
                {key === "urgency" && ["HIGH", "MEDIUM", "LOW"].map((v) => (
                  <option value={v} key={v}>{v}</option>
                ))}
                {key === "type" && REQUEST_TYPES.map((v) => (
                  <option value={v} key={v}>{v}</option>
                ))}
              </select>
            ))}
          </Stack>
          
        </Stack>

        <Box sx={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 920, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Request Title", "Request Type", "Priority", "Status", "Current Stage", "SLA Remaining", "Created", "Actions"].map((col) => (
                  <th
                    key={col}
                    style={{
                      textAlign: "left",
                      padding: "10px 8px",
                      fontSize: "0.8rem",
                      color: theme.palette.text.secondary,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => {
                const slaRemainingHours = computeSlaRemainingHours(req.slaDeadline);
                return (
                  <tr
                    key={req.id}
                    style={{ borderBottom: `1px solid ${theme.palette.divider}`, cursor: "pointer" }}
                    onClick={() => navigate(`/requests/${req.id}`)}
                  >
                    <td style={{ padding: "12px 8px", fontWeight: 700 }}>{req.title}</td>
                    <td style={{ padding: "12px 8px" }}>
                      <Chip label={req.type} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1.5 }} />
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <Chip
                        label={req.priority}
                        size="small"
                        sx={{
                          borderRadius: 1.5,
                          bgcolor: req.priority === "High" ? "rgba(239,68,68,0.12)" : "rgba(99,102,241,0.12)",
                          color: req.priority === "High" ? "#DC2626" : "#4338CA",
                          fontWeight: 700,
                        }}
                      />
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <StatusChip status={req.status} />
                    </td>
                    <td style={{ padding: "12px 8px", color: theme.palette.text.secondary }}>
                      {req.stageLabel || `Stage ${req.stageNumber || 1}`}
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LinearProgress
                          variant="determinate"
                          value={
                            slaRemainingHours == null
                              ? 0
                              : Math.min(100, (1 - Math.min(1, slaRemainingHours / Math.max(1, req.slaHours))) * 100)
                          }
                          sx={{
                            width: 90,
                            height: 6,
                            borderRadius: 999,
                            backgroundColor: theme.palette.mode === "light" ? "#E5E7EB" : "rgba(255,255,255,0.06)",
                            "& .MuiLinearProgress-bar": {
                              background: slaRemainingHours < 8 ? "#EF4444" : slaRemainingHours < 24 ? "#F59E0B" : "#22C55E",
                            },
                          }}
                        />
                        <Typography variant="caption" color={slaRemainingHours < 8 ? "#EF4444" : slaRemainingHours < 24 ? "#F59E0B" : "text.secondary"}>
                          {slaRemainingHours == null ? "—" : formatRelativeHours(slaRemainingHours)}
                        </Typography>
                      </Stack>
                    </td>
                    <td style={{ padding: "12px 8px", color: theme.palette.text.secondary }}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 8px" }} onClick={(e) => e.stopPropagation()}>
                      {["APPROVED", "REJECTED"].includes(String(req.status || "").toUpperCase()) ? (
                        <Typography variant="body2" color="text.secondary">
                          {req.status}
                        </Typography>
                      ) : (
                        <Stack direction="row" spacing={0.5}>
                          <Button size="small" variant="outlined" onClick={() => handleDecision(req.id, "APPROVED")} disabled={actionState.loading}>
                            Approve
                          </Button>
                          <Button size="small" color="error" variant="outlined" onClick={() => handleDecision(req.id, "REJECTED")} disabled={actionState.loading}>
                            Reject
                          </Button>
                        </Stack>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      </Paper>

     
    </>
  );
}
