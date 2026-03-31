// src/pages/admin/WorkflowManagement.jsx
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useAdminData } from "../../context/AdminDataContext";
import API from "../../api/api";

export default function WorkflowManagement() {
  const { workflows, refreshWorkflows, users, refreshUsers } = useAdminData();
  const getWorkflowTypeLabel = (workflow) => {
    const rt = workflow?.requestType;
    if (rt && typeof rt === "object") {
      return rt.name || rt.code || "Unknown";
    }
    const label = workflow?.requestTypeName || workflow?.requestTypeCode || rt || workflow?.type || workflow?.requestTypeLabel;
    if (!label || label === "INVALID") return "Unknown";
    return label;
  };
  const [form, setForm] = useState({
    name: "",
    requestType: "",
    stages: [{ stageName: "", approverRole: "", stageOrder: 1, assignedUserIds: [] }],
  });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "success", text: "" });

  const notify = (text, type = "success") => setToast({ open: true, type, text });

  const handleStageChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      stages: prev.stages.map((stage, i) => (i === index ? { ...stage, [field]: value } : stage)),
    }));
  };

  const handleAddStage = () => {
    setForm((prev) => ({
      ...prev,
      stages: [
        ...prev.stages,
        { stageName: "", approverRole: "", stageOrder: prev.stages.length + 1, assignedUserIds: [] },
      ],
    }));
  };

  const handleRemoveStage = (index) => {
    setForm((prev) => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitWorkflow = async () => {
    if (!form.name.trim() || !form.requestType.trim()) {
      notify("Workflow name and request type are required.", "error");
      return;
    }
    if (!form.stages.length || form.stages.some((s) => !s.stageName.trim())) {
      notify("Please provide a name for each stage.", "error");
      return;
    }

    const payload = {
      name: form.name.trim(),
      requestType: form.requestType.trim(),
      stages: form.stages.map((stage, idx) => ({
        stageName: stage.stageName.trim(),
        approverRole: stage.approverRole.trim() || null,
        stageOrder: Number(stage.stageOrder) || idx + 1,
        assignedUserIds: (stage.assignedUserIds || [])
          .map((v) => Number(v))
          .filter((v) => Number.isFinite(v)),
      })),
    };

    setSaving(true);
    try {
      if (editingId) {
        await API.put(`/workflows/${editingId}`, payload);
        notify("Workflow updated successfully.");
      } else {
        await API.post("/workflows", payload);
        notify("Workflow created successfully.");
      }
      setForm({
        name: "",
        requestType: "",
        stages: [{ stageName: "", approverRole: "", stageOrder: 1, assignedUserIds: [] }],
      });
      setEditingId(null);
      refreshWorkflows();
    } catch (err) {
      console.error("Unable to create workflow", err);
      notify("Failed to save workflow. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEditWorkflow = (workflow) => {
    setEditingId(workflow.id);
    setForm({
      name: workflow.name || "",
      requestType: getWorkflowTypeLabel(workflow) || "",
      stages: (workflow.stages || []).map((stage, idx) => ({
        stageName: stage.stageName || "",
        approverRole: stage.approverRole || "",
        stageOrder: stage.stageOrder ?? idx + 1,
        assignedUserIds: stage.assignedUserIds || [],
      })),
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      requestType: "",
      stages: [{ stageName: "", approverRole: "", stageOrder: 1, assignedUserIds: [] }],
    });
  };

  const handleDeleteWorkflow = async (workflowId) => {
    setSaving(true);
    try {
      await API.delete(`/workflows/${workflowId}`);
      notify("Workflow deleted successfully.");
      if (editingId === workflowId) {
        handleCancelEdit();
      }
      refreshWorkflows();
    } catch (err) {
      console.error("Unable to delete workflow", err);
      notify("Failed to delete workflow.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
   <>
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 1.5,
      boxShadow: 1,
      background: (t) =>
        t.palette.mode === "light"
          ? "#ffffff"
          : t.palette.background.paper,
      border: (t) => `1px solid ${t.palette.divider}`,
    }}
  >
    {/* HEADER */}
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: "-0.02em" }}>
        Workflow Management
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="contained" onClick={refreshUsers}>
          Refresh Users
        </Button>
        <Button size="small" variant="contained" onClick={refreshWorkflows}>
          Refresh
        </Button>
      </Stack>
    </Stack>

    {/* CREATE / EDIT WORKFLOW */}
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 1.5,
        boxShadow: 1,
        background: (t) =>
          t.palette.mode === "light"
            ? "linear-gradient(180deg, #ffffff, #fafafa)"
            : "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
        border: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Typography fontWeight={700} mb={2}>
        {editingId ? "Edit Workflow" : "Create New Workflow"}
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Workflow Name"
          size="small"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          fullWidth
        />

        <TextField
          label="Request Type"
          size="small"
          value={form.requestType}
          onChange={(e) => setForm((prev) => ({ ...prev, requestType: e.target.value }))}
          fullWidth
        />

        <Divider />

        {/* STAGES */}
        <Stack spacing={2}>
          <Typography variant="subtitle2" fontWeight={700}>
            Stages
          </Typography>

          {form.stages.map((stage, index) => (
            <Paper
              key={`stage-${index}`}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1.5,
                boxShadow: 1,
                display: "grid",
                gap: 1.2,
                borderLeft: "4px solid #6366F1",
                backgroundColor: (t) => (t.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.02)"),
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  Stage {index + 1}
                </Typography>

                {form.stages.length > 1 && (
                  <IconButton size="small" onClick={() => handleRemoveStage(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              <TextField
                label="Stage Name"
                size="small"
                value={stage.stageName}
                onChange={(e) => handleStageChange(index, "stageName", e.target.value)}
                fullWidth
              />

              <TextField
                label="Approver Role"
                size="small"
                value={stage.approverRole}
                onChange={(e) => handleStageChange(index, "approverRole", e.target.value)}
                fullWidth
              />

              <TextField
                label="Order"
                size="small"
                type="number"
                inputProps={{ min: 1 }}
                value={stage.stageOrder}
                onChange={(e) => handleStageChange(index, "stageOrder", e.target.value)}
                fullWidth
              />

              <FormControl size="small" fullWidth>
                <InputLabel>Assigned Users</InputLabel>
                <Select
                  multiple
                  value={stage.assignedUserIds}
                  onChange={(e) => handleStageChange(index, "assignedUserIds", e.target.value)}
                  renderValue={(selected) => {
                    if (!selected.length) return "Select users";
                    return selected
                      .map((id) => {
                        const user = users.find((u) => Number(u.id) === Number(id));
                        return user?.name || user?.email || `#${id}`;
                      })
                      .join(", ");
                  }}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Checkbox checked={stage.assignedUserIds.indexOf(user.id) > -1} />
                      <ListItemText
                        primary={user.name || user.email}
                        secondary={user.email}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          ))}

          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddStage}
            sx={{ alignSelf: "flex-start", borderRadius: 1 }}
          >
            Add Stage
          </Button>
        </Stack>

        {/* ACTION BUTTONS */}
        <Box display="flex" justifyContent="flex-end">
          {editingId && (
            <Button variant="text" onClick={handleCancelEdit} sx={{ mr: 1 }}>
              Cancel
            </Button>
          )}

          <Button variant="contained" onClick={handleSubmitWorkflow}>
            {saving ? (editingId ? "Saving..." : "Creating...") : editingId ? "Save Changes" : "Create Workflow"}
          </Button>
        </Box>
      </Stack>
    </Paper>

    {/* WORKFLOW LIST */}
    <Stack spacing={2} mt={3}>
      {workflows.map((workflow) => (
        <Paper
          key={workflow.id}
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 1.5,
            boxShadow: 1,
            borderLeft: "4px solid #22C55E",
            border: (t) => `1px solid ${t.palette.divider}`,
            backgroundColor: (t) => (t.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.02)"),
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={700}>{workflow.name}</Typography>

            <Stack direction="row" spacing={1}>
              <Button size="small" variant="contained" onClick={() => handleEditWorkflow(workflow)}>
                Edit
              </Button>
              <Button size="small" color="error" variant="contained" onClick={() => handleDeleteWorkflow(workflow.id)}>
                Delete
              </Button>
            </Stack>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Type: {getWorkflowTypeLabel(workflow)}
          </Typography>

          <Stack spacing={1} mt={1}>
            {(workflow.stages || []).map((stage) => (
              <Stack
                key={stage.id || `${workflow.id}-${stage.stageOrder}`}
                direction="row"
                spacing={1}
                flexWrap="wrap"
                sx={{
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: (t) => (t.palette.mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.06)"),
                }}
              >
                <Chip size="small" label={`Stage ${stage.stageOrder}`} />
                <Typography variant="body2" fontWeight={600}>
                  {stage.stageName}
                </Typography>
                <Chip size="small" variant="outlined" label={stage.approverRole || "Any"} />
              </Stack>
            ))}
          </Stack>
        </Paper>
      ))}

      {!workflows.length && (
        <Typography color="text.secondary">
          No workflows configured yet.
        </Typography>
      )}
    </Stack>
  </Paper>

  {/* SNACKBAR */}
  <Snackbar
    open={toast.open}
    autoHideDuration={3000}
    onClose={() => setToast((prev) => ({ ...prev, open: false }))}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  >
    <Alert severity={toast.type} variant="filled">
      {toast.text}
    </Alert>
  </Snackbar>
</>
  );
}
