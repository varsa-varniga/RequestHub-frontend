// src/pages/UserApprovals.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Select,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function UserApprovals() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchApprovals = (status = statusFilter) => {
    setLoading(true);
    setError("");
    API.get(`/approvals/my?status=${status}`)
      .then((res) => {
        setRequests(res.data || []);
      })
      .catch((err) => {
        if (err?.response?.status === 403) {
          setRequests([]);
          setError("Access denied. Your account is not allowed to view approvals.");
          return;
        }
      })
      .catch(() =>
        API.get(`/approvals/my?status=${status}`)
          .then((res) => setRequests(res.data || []))
          .catch((err) => {
            console.error(err);
            setError("Failed to load approvals.");
            setRequests([]);
          })
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleDecision = async (id, decision) => {
    setActionLoading(true);
    setError("");
    try {
      await API.post(
        `/approvals/requests/${id}/decision`,
        { decision, comment: "" }
      );
      fetchApprovals();
    } catch (err) {
      console.error(err);
      setError("Failed to submit decision.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResubmit = async (id) => {
    setActionLoading(true);
    setError("");
    try {
      await API.post(
        `/approvals/requests/${id}/resubmit`,
        {}
      );
      fetchApprovals();
    } catch (err) {
      console.error(err);
      setError("Failed to resubmit request.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout showSearch={false}>
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={1.5} mb={2}>
          <Typography variant="h6" fontWeight={800}>
            My Approvals
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Select
              size="small"
              value={statusFilter}
              onChange={(e) => {
                const val = e.target.value;
                setStatusFilter(val);
                fetchApprovals(val);
              }}
              sx={{ minWidth: 140 }}
            >
              {["ALL", "PENDING", "APPROVED", "REJECTED"].map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                {requests.length} total
              </Typography>
            )}
          </Stack>
        </Stack>

        {error && (
          <Typography variant="body2" color="error" mb={2}>
            {error}
          </Typography>
        )}

        <Box sx={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 920, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Title", "Description", "Urgency", "Priority Score", "SLA Deadline", "Actions"].map((col) => (
                  <th
                    key={col}
                    style={{
                      textAlign: "left",
                      padding: "10px 8px",
                      fontSize: "0.8rem",
                      color: "#64748b",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr
                  key={`approval-${req.id}`}
                  style={{ borderBottom: "1px solid #e2e8f0", cursor: "pointer" }}
                  onClick={() => navigate(`/requests/${req.id}`)}
                >
                  <td style={{ padding: "12px 8px", fontWeight: 700 }}>{req.title}</td>
                  <td style={{ padding: "12px 8px", color: "#64748b" }}>{req.description || "-"}</td>
                  <td style={{ padding: "12px 8px" }}>{req.urgency || "-"}</td>
                  <td style={{ padding: "12px 8px" }}>{req.priorityScore ?? "-"}</td>
                  <td style={{ padding: "12px 8px", color: "#64748b" }}>
                    {req.slaDeadline ? new Date(req.slaDeadline).toLocaleString() : "-"}
                  </td>
                  <td style={{ padding: "12px 8px" }} onClick={(e) => e.stopPropagation()}>
                    <Stack direction="row" spacing={0.5}>
                      {["APPROVED", "REJECTED"].includes(String(req.status || "").toUpperCase()) ? (
                        <Typography variant="body2" color="text.secondary">
                          {req.status}
                        </Typography>
                      ) : (
                        <>
                          <Button size="small" variant="outlined" onClick={() => handleDecision(req.id, "APPROVED")} disabled={actionLoading}>
                            Approve
                          </Button>
                          <Button size="small" color="error" variant="outlined" onClick={() => handleDecision(req.id, "REJECTED")} disabled={actionLoading}>
                            Reject
                          </Button>
                          <Button size="small" variant="text" onClick={() => handleResubmit(req.id)} disabled={actionLoading}>
                            Resubmit
                          </Button>
                        </>
                      )}
                    </Stack>
                  </td>
                </tr>
              ))}
              {!loading && !requests.length && (
                <tr>
                  <td colSpan={6} style={{ padding: "10px 8px", color: "#64748b" }}>
                    No approvals assigned to you right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </Paper>
    </DashboardLayout>
  );
}
