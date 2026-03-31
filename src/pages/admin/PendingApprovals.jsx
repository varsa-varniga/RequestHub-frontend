// src/pages/admin/PendingApprovals.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import API from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useAdminData } from "../../context/AdminDataContext";
import { StatusChip } from "./adminShared.jsx";

export default function PendingApprovals() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { requests, refreshRequests } = useAdminData();
  const [actionState, setActionState] = useState({ loading: false, comment: "" });

  const incomingRequests = requests.filter((req) => {
    if (!user?.email) return false;
    return (req.assignedTo || "").toLowerCase().includes(user.email.toLowerCase());
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
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={800}>
          Pending Approvals
        </Typography>
        <Chip label={`${incomingRequests.length}`} size="small" />
      </Stack>

      <Box sx={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 920, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Request Title", "Requester", "Priority", "Status", "Created", "Actions"].map((col) => (
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
            {incomingRequests.map((req) => (
              <tr
                key={`pending-${req.id}`}
                style={{ borderBottom: "1px solid #e2e8f0", cursor: "pointer" }}
                onClick={() => navigate(`/requests/${req.id}`)}
              >
                <td style={{ padding: "12px 8px", fontWeight: 700 }}>{req.title}</td>
                <td style={{ padding: "12px 8px" }}>{req.requester || "—"}</td>
                <td style={{ padding: "12px 8px" }}>
                  <Chip label={req.priority} size="small" />
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <StatusChip status={req.status} />
                </td>
                
                <td style={{ padding: "12px 8px", color: "#64748b" }}>
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
            ))}
            {!incomingRequests.length && (
              <tr>
                <td colSpan={7} style={{ padding: "10px 8px", color: "#64748b" }}>
                  No pending approvals for you right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>
    </Paper>
  );
}
