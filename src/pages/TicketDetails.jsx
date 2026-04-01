// TicketDetails.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Container,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  Business,
  Cancel,
  CheckCircle,
  EscalatorWarning,
  Delete,
  PriorityHigh,
  RadioButtonUnchecked,
  Refresh,
  Schedule,
  ThumbDown,
  ThumbUp,
  WorkOutline,
} from "@mui/icons-material";
import DashboardLayout from "../components/dashboard/DashboardLayout";

const urgencyColor = (u) => {
  if (!u) return "default";
  const m = { HIGH: "error", MEDIUM: "warning", LOW: "success" };
  return m[u?.toUpperCase()] || "default";
};

const statusColor = (s) => {
  if (!s) return "default";
  const m = {
    APPROVED: "success",
    REJECTED: "error",
    PENDING: "warning",
    DONE: "success",
    "NOT STARTED": "default",
    SUBMITTED: "info",
    ESCALATED: "error",
  };
  return m[s?.toUpperCase()] || "default";
};

const statusIcon = (s) => {
  const u = s?.toUpperCase();
  if (u === "DONE" || u === "APPROVED") return <CheckCircle sx={{ fontSize: 20, color: "success.main" }} />;
  if (u === "REJECTED") return <Cancel sx={{ fontSize: 20, color: "error.main" }} />;
  if (u === "PENDING" || u === "SUBMITTED") return <Schedule sx={{ fontSize: 20, color: "warning.main" }} />;
  return <RadioButtonUnchecked sx={{ fontSize: 20, color: "text.disabled" }} />;
};

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const avatarColor = (name = "") => {
  const colors = ["#1565C0", "#2E7D32", "#6A1B9A", "#C62828", "#00838F", "#EF6C00"];
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const formatDate = (dt) => {
  if (!dt) return "-";
  return new Date(dt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isSlaBreached = (deadline) => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};

const slaOverdue = (deadline) => {
  if (!deadline) return "";
  const diff = Math.abs(new Date() - new Date(deadline));
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return hrs > 0 ? `${hrs}h ${mins}m overdue` : `${mins}m overdue`;
};

function DecisionDialog({ open, decision, onClose, onConfirm, loading }) {
  const [comment, setComment] = useState("");

  const handleConfirm = () => {
    onConfirm(decision, comment);
    setComment("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {decision === "APPROVED" ? "Approve Ticket" : "Reject Ticket"}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Comment (optional)"
          multiline
          rows={3}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          color={decision === "APPROVED" ? "success" : "error"}
          onClick={handleConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : decision === "APPROVED" ? <ThumbUp /> : <ThumbDown />}
        >
          {loading ? "Submitting…" : decision === "APPROVED" ? "Approve" : "Reject"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wfLoading, setWfLoading] = useState(false);
  const [error, setError] = useState("");

  const [decisionDialog, setDecisionDialog] = useState({ open: false, decision: "" });
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [decisionError, setDecisionError] = useState("");
  const [decisionSuccess, setDecisionSuccess] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const usersPromise = API.get("/users").catch(() => ({ data: [] }));

      let ticketData = null;
      try {
        if (user?.role && user.role !== "USER") {
          try {
            const res = await API.get("/approvals/requests");
            ticketData = (Array.isArray(res.data) ? res.data : []).find(
              (t) => String(t.id) === String(id)
            );
          } catch {
            // fallback to user requests
          }
        }
        if (!ticketData) {
          const res = await API.get("/user/requests");
          ticketData = (Array.isArray(res.data) ? res.data : []).find(
            (t) => String(t.id) === String(id)
          );
        }
      } catch {
        // ignore
      }

      const usersRes = await usersPromise;
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);

      if (!ticketData) {
        throw new Error("Ticket not found for this user.");
      }

      setTicket(ticketData);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load ticket.");
    } finally {
      setLoading(false);
    }
  }, [id, user?.role]);

  const loadWorkflows = useCallback(async () => {
    setWfLoading(true);
    try {
      const res = await API.get(`/user/requests/${id}/workflow`);
      setWorkflows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err?.response?.status === 403) {
        // Not authorized for workflows; leave empty without error.
        setWorkflows([]);
      } else {
        setWorkflows([]);
      }
    } finally {
      setWfLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAll();
    loadWorkflows();
  }, [loadAll, loadWorkflows]);

  const openDecision = (d) => {
    setDecisionError("");
    setDecisionSuccess("");
    setDecisionDialog({ open: true, decision: d });
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await API.delete(`/user/requests/${id}`);
      navigate("/user/requests");
    } catch (err) {
      setDeleteError(err?.response?.data?.message || "Failed to delete request.");
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  };

  const handleDecision = async (decision, comment) => {
    if (isFinalStatus) {
      setDecisionError(`Request already ${normalizedStatus}.`);
      return;
    }
    setDecisionLoading(true);
    setDecisionError("");
    try {
      await API.post(`/approvals/requests/${id}/decision`, { decision, comment });
      setDecisionSuccess(`Ticket ${decision.toLowerCase()} successfully.`);
      setDecisionDialog({ open: false, decision: "" });
      await loadAll();
    } catch (err) {
      setDecisionError(err?.response?.data?.message || "Failed to submit decision.");
    } finally {
      setDecisionLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadAll();
    await loadWorkflows();
  };

  const resolveUserName = (value) => {
    if (!value) return "";
    const found = users.find((u) => u.email === value || u.name === value);
    return found?.name || value;
  };

  const requesterName = ticket?.createdBy || ticket?.requester?.name || ticket?.requesterName || "Unknown";
  const requesterEmail = ticket?.requester?.email || ticket?.requesterEmail;
  const assignedTo = ticket?.assignedTo || ticket?.assignee || ticket?.approver;
  const assignedToName = resolveUserName(assignedTo);
  const approvalComment = ticket?.approvalComment || "";
  const approvalAuthor = assignedToName || "Approver";
  const commentsList = (() => {
    const base = Array.isArray(ticket?.comments) ? ticket.comments : [];
    const hasApprovalComment = Boolean(approvalComment);
    if (!hasApprovalComment) return base;
    const exists = base.some((c) => (c?.message || c?.comment || c?.text) === approvalComment);
    return exists ? base : [
      {
        author: approvalAuthor,
        message: approvalComment,
      },
      ...base,
    ];
  })();

  const requester = users.find((u) => u.name === requesterName || u.email === requesterName || u.email === requesterEmail);

  const breached = isSlaBreached(ticket?.slaDeadline);
  const requestType = ticket?.requestTypeName || ticket?.requestTypeCode || ticket?.type || "-";
  const status = ticket?.status || ticket?.approvalStatus || "-";
  const normalizedStatus = String(status || "").toUpperCase();
  const isFinalStatus = normalizedStatus === "APPROVED" || normalizedStatus === "REJECTED";
  const currentStageOrder = ticket?.currentStageOrder ?? null;
  const displayStageOrder = isFinalStatus && normalizedStatus === "APPROVED" ? null : currentStageOrder;
  const workflowItems = workflows.length
    ? workflows
    : Array.isArray(ticket?.workflowStages)
      ? ticket.workflowStages
      : [];
  const isRequester = Boolean(
    user &&
      (
        (user.id != null && ticket?.createdById != null && String(user.id) === String(ticket.createdById)) ||
        (user.email && ticket?.createdBy && user.email === ticket.createdBy) ||
        (user.name && ticket?.createdBy && user.name === ticket.createdBy)
      )
  );
  const isAssignedApprover = Boolean(
    user &&
      workflowItems.some((wf) => {
        const ids = Array.isArray(wf.assignedUserIds) ? wf.assignedUserIds : [];
        const role = wf.approverRole ? String(wf.approverRole) : "";
        const matchesUser = (user.id != null && ids.some((idVal) => String(idVal) === String(user.id))) ||
          (user.role && role && String(user.role) === role);
        const matchesStage = currentStageOrder == null || String(wf.stageOrder) === String(currentStageOrder);
        return matchesUser && matchesStage;
      })
  );

  if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!ticket) return null;

  return (
    <DashboardLayout showSearch={false}>
      <Box sx={{ bgcolor: "#e6edf3", minHeight: "100vh", py: 3 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 2, borderRadius: 0, bgcolor: "#eef3f8", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 2 }}>
              <IconButton onClick={() => navigate(-1)} sx={{ color: "text.secondary" }}>
                <ArrowBack />
              </IconButton>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" fontWeight={800}>Ticket Details</Typography>
                <Typography variant="body2" color="text.secondary">
                  #{ticket.id} · {ticket.title || "Untitled request"}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                {isRequester && !isFinalStatus && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setDeleteOpen(true)}
                  >
                    Delete
                  </Button>
                )}
                {ticket.priorityScore != null && (
                  <Chip icon={<PriorityHigh />} label={`Score: ${ticket.priorityScore}`} color="primary" />
                )}
                {ticket.urgency && (
                  <Chip label={ticket.urgency} color={urgencyColor(ticket.urgency)} />
                )}
                {ticket.escalated && (
                  <Chip icon={<EscalatorWarning />} label="Escalated" color="error" />
                )}
                <Tooltip title="Refresh">
                  <IconButton onClick={handleRefresh}><Refresh /></IconButton>
                </Tooltip>
              </Stack>
            </Box>
          </Paper>

          {decisionSuccess && <Alert severity="success" sx={{ mt: 2 }}>{decisionSuccess}</Alert>}
          {decisionError && <Alert severity="error" sx={{ mt: 2 }}>{decisionError}</Alert>}
          {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}

          <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: { xs: "1fr", md: "300px 1fr" }, gap: 2 }}>
            <Paper sx={{ p: 2, borderRadius: 0, bgcolor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.12)" }}>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>Requester</Typography>
              <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
                <Avatar sx={{ bgcolor: avatarColor(requesterName), width: 40, height: 40 }}>
                  {getInitials(requesterName)}
                </Avatar>
                <Box>
                  <Typography fontWeight={600}>{resolveUserName(requesterName)}</Typography>
                  {(requester?.role || ticket?.requester?.role) && (
                    <Typography variant="caption" color="text.secondary">
                      {requester?.role || ticket?.requester?.role}
                    </Typography>
                  )}
                  {requesterEmail && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {requesterEmail}
                    </Typography>
                  )}
                </Box>
              </Stack>
              <Divider sx={{ mb: 1.5 }} />
              {assignedTo && (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <WorkOutline fontSize="small" color="action" />
                  <Typography variant="body2">Assigned to: {assignedToName}</Typography>
                </Stack>
              )}
              {ticket.stageNumber != null && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Business fontSize="small" color="action" />
                  <Typography variant="body2">Stage {ticket.stageNumber}</Typography>
                </Stack>
              )}
            </Paper>

            <Paper sx={{ p: 2, borderRadius: 0, bgcolor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.12)" }}>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>Ticket Info</Typography>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Type</Typography>
                  <Typography>{requestType}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Urgency</Typography>
                  <Chip label={ticket.urgency || "-"} size="small" color={urgencyColor(ticket.urgency)} />
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">Description</Typography>
                  <Typography variant="body2">{ticket.description || "-"}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>

          <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
            <Paper sx={{ p: 2, borderRadius: 0, bgcolor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.12)" }}>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>Workflow Timeline</Typography>
              {wfLoading ? (
                <LinearProgress />
              ) : workflowItems.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No workflow steps found.</Typography>
              ) : (
                <Box sx={{ position: "relative", mt: 1, pl: 2.5 }}>
                  <Box sx={{ position: "absolute", left: 8, top: 6, bottom: 6, width: 2, bgcolor: "#cbd5e1" }} />
                  <Stack spacing={1.8}>
                    {workflowItems
                      .slice()
                      .sort((a, b) => (a.stageOrder ?? 0) - (b.stageOrder ?? 0))
                      .map((wf, idx) => {
                    const name = wf.stageName || wf.name || wf.stepName || wf.stage || `Step ${idx + 1}`;
                    const stageNo = wf.stageOrder ?? idx + 1;
                    const role = wf.approverRole ? String(wf.approverRole).replace(/_/g, " ") : null;
                    const assigneeIds = Array.isArray(wf.assignedUserIds) ? wf.assignedUserIds : [];
                    const assigneeNames = assigneeIds
                      .map((uid) => users.find((u) => String(u.id) === String(uid))?.name || users.find((u) => String(u.id) === String(uid))?.email || null)
                      .filter(Boolean);
                    const isCurrent = displayStageOrder != null && String(stageNo) === String(displayStageOrder);
                    const isDone = normalizedStatus === "APPROVED"
                      ? true
                      : displayStageOrder != null && Number(stageNo) < Number(displayStageOrder);
                    const isRejectedStage = normalizedStatus === "REJECTED" && isCurrent;
                    const dotColor = isDone ? "#2e7d32" : isRejectedStage ? "#dc2626" : isCurrent ? "#f59e0b" : "#64748b";
                    const chipLabel = isDone ? "DONE" : isRejectedStage ? "REJECTED" : isCurrent ? "CURRENT" : "PENDING";
                    const chipColor = isDone ? "success" : isRejectedStage ? "error" : isCurrent ? "warning" : "default";
                    return (
                      <Box key={`${name}-${idx}`} sx={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 1, alignItems: "start" }}>
                        <Box sx={{ mt: 0.6, width: 10, height: 10, borderRadius: "50%", bgcolor: dotColor, boxShadow: "0 0 0 3px #eef3f8" }} />
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <Typography fontWeight={700}>{`Stage ${stageNo}: ${name}`}</Typography>
                            <Chip label={chipLabel} size="small" color={chipColor} />
                          </Stack>
                          {(role || assigneeIds.length) && (
                            <Typography variant="caption" color="text.secondary">
                              {role ? `Approver: ${role}` : "Approver: -"}
                              {assigneeNames.length
                                ? ` · Assigned: ${assigneeNames.join(", ")}`
                                : assigneeIds.length
                                  ? ` · Assigned IDs: ${assigneeIds.join(", ")}`
                                  : ""}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                  </Stack>
                </Box>
              )}
            </Paper>

            <Paper sx={{ p: 2, borderRadius: 0, bgcolor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.12)" }}>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>Comments</Typography>
              {commentsList.length ? (
                <Stack spacing={1.2} mb={2}>
                  {commentsList.map((c, idx) => {
                    const authorRaw = c.author || c.createdBy || c.user || c.createdByName || approvalAuthor;
                    const author = resolveUserName(authorRaw);
                    const message = c.message || c.comment || c.text || "-";
                    const when = c.createdAt || c.time || c.timestamp || null;
                    return (
                      <Paper key={`${author}-${idx}`} variant="outlined" sx={{ p: 1.5, borderRadius: 0 }}>
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor(author), fontSize: 13 }}>
                            {getInitials(author)}
                          </Avatar>
                          <Box>
                            <Typography variant="caption" fontWeight={600}>
                              {author}
                            </Typography>
                            {when && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                {formatDate(when)}
                              </Typography>
                            )}
                            <Typography variant="body2" sx={{ mt: 0.25 }}>{message}</Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>No comments yet.</Typography>
              )}
              {!isRequester && !isFinalStatus && (
                <Typography variant="body2" color="text.secondary">
                  Add comments when approving or rejecting a request.
                </Typography>
              )}
            </Paper>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Paper sx={{ p: 2, borderRadius: 0, bgcolor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.12)" }}>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>SLA</Typography>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Typography variant="body2">Deadline: {ticket.slaDeadline ? formatDate(ticket.slaDeadline) : "-"}</Typography>
                {ticket.slaDeadline ? (
                  breached ? (
                    <Chip label={`BREACHED · ${slaOverdue(ticket.slaDeadline)}`} color="error" />
                  ) : (
                    <Chip label="On Track" color="success" />
                  )
                ) : null}
              </Stack>
            </Paper>
          </Box>

          {!isRequester && isAssignedApprover && !isFinalStatus && (
            <Stack direction="row" spacing={2} mt={3} justifyContent="center">
              <Button
                variant="contained"
                color="success"
                startIcon={<ThumbUp />}
                onClick={() => openDecision("APPROVED")}
                sx={{ minWidth: 160, borderRadius: 0 }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<ThumbDown />}
                onClick={() => openDecision("REJECTED")}
                sx={{ minWidth: 160, borderRadius: 0 }}
              >
                Reject
              </Button>
            </Stack>
          )}
          {isFinalStatus && isAssignedApprover && !isRequester && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This request is already {normalizedStatus}. No further actions are available.
            </Alert>
          )}
          {isFinalStatus && isRequester && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Your request is {normalizedStatus}. No further actions are required.
            </Alert>
          )}

          <DecisionDialog
            open={decisionDialog.open}
            decision={decisionDialog.decision}
            onClose={() => setDecisionDialog({ open: false, decision: "" })}
            onConfirm={handleDecision}
            loading={decisionLoading}
          />
          <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>Delete Request</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary">
                This will permanently delete the request. Are you sure?
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button onClick={() => setDeleteOpen(false)} disabled={deleteLoading}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                disabled={deleteLoading}
                startIcon={deleteLoading ? <CircularProgress size={16} /> : <Delete />}
              >
                {deleteLoading ? "Deleting…" : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </DashboardLayout>
  );
}
