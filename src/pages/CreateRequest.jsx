// src/pages/CreateRequest.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  AddCircleOutlineOutlined,
  ArrowBack,
  ArrowUpwardOutlined,
  RemoveOutlined,
  DragHandleOutlined,
} from "@mui/icons-material";

const URGENCY_OPTIONS = [
  { value: "LOW",    label: "Low",    icon: <RemoveOutlined fontSize="small" />,    color: "#10B981" },
  { value: "MEDIUM", label: "Medium", icon: <DragHandleOutlined fontSize="small" />, color: "#F59E0B" },
  { value: "HIGH",   label: "High",   icon: <ArrowUpwardOutlined fontSize="small" />, color: "#EF4444" },
];

const FALLBACK_TYPES = ["IT", "LEAVE", "EXPENSE", "PURCHASE", "ACCESS"];
const TYPE_LABELS = {
  IT: "IT",
  LEAVE: "Leave",
  EXPENSE: "Expense",
  PURCHASE: "Purchase",
  ACCESS: "Access",
};

const EMPTY = { title: "", description: "", type: "", urgency: "LOW" };

export default function CreateRequest() {
  const navigate = useNavigate();
  const [req, setReq] = useState(EMPTY);
  const [types, setTypes] = useState(FALLBACK_TYPES);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });

  const set = (field) => (e) => setReq((prev) => ({ ...prev, [field]: e.target.value }));

  useEffect(() => {
    API.get("/workflows")
      .then((res) => {
        const workflowTypes = (res.data || []).map((w) => w.requestType).filter(Boolean);
        const merged = Array.from(new Set([...FALLBACK_TYPES, ...workflowTypes]));
        setTypes(merged);
        setReq((prev) => ({ ...prev, type: prev.type || merged[0] }));
      })
      .catch(() => {
        setTypes(FALLBACK_TYPES);
        setReq((prev) => ({ ...prev, type: prev.type || FALLBACK_TYPES[0] }));
      });
  }, []);

  const submit = async () => {
    const requestTypeCode = (req.type || "").trim().toUpperCase();
    if (!req.title.trim() || !requestTypeCode) {
      setSnack({ open: true, severity: "error", message: "Title and type are required." });
      return;
    }
    setLoading(true);
    try {
      await API.post("/user/requests", {
        title: req.title.trim(),
        description: req.description,
        requestTypeCode,
        urgency: req.urgency,
      });
      setSnack({ open: true, severity: "success", message: "Request submitted successfully!" });
      setReq(EMPTY);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: "error", message: "Failed to submit request. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const activeUrgency = URGENCY_OPTIONS.find((o) => o.value === req.urgency);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');`}</style>

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          backgroundImage: `
            radial-gradient(ellipse 70% 40% at 50% -10%, #F59E0B12 0%, transparent 60%),
            linear-gradient(#1C1C2610 1px, transparent 1px),
            linear-gradient(90deg, #1C1C2610 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 40px 40px, 40px 40px",
          py: 5,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #2A2A38",
              backgroundColor: "background.paper",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                px: 3,
                py: 2.5,
                borderBottom: "1px solid #2A2A38",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Button
                onClick={() => navigate(-1)}
                variant="text"
                sx={{
                  minWidth: 0,
                  px: 1,
                  color: "text.secondary",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <ArrowBack fontSize="small" />
              </Button>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  backgroundColor: "#F59E0B18",
                  border: "1px solid #F59E0B44",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "primary.main",
                }}
              >
                <AddCircleOutlineOutlined fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h5" color="text.primary" fontSize="1.15rem">
                  New Request
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Fill in the details below to submit your request
                </Typography>
              </Box>
            </Box>

            {/* Form body */}
            <Stack spacing={3} p={3}>
              <TextField
                label="Title"
                placeholder="Brief summary of your request"
                value={req.title}
                onChange={set("title")}
                fullWidth
                required
              />

              <TextField
                label="Description"
                placeholder="Provide additional context or details…"
                value={req.description}
                onChange={set("description")}
                fullWidth
                multiline
                rows={4}
              />

              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select value={req.type} label="Type" onChange={set("type")}>
                  {types.map((t) => {
                    const code = String(t || "").toUpperCase();
                    return (
                      <MenuItem key={code} value={code}>
                        {TYPE_LABELS[code] || code}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              {/* Urgency toggle */}
              <Box>
                <Typography variant="caption" color="text.secondary" mb={1} display="block">
                  Urgency
                </Typography>
                <ToggleButtonGroup
                  value={req.urgency}
                  exclusive
                  onChange={(_, val) => val && setReq((prev) => ({ ...prev, urgency: val }))}
                  fullWidth
                  sx={{ gap: 1 }}
                >
                  {URGENCY_OPTIONS.map((opt) => (
                    <ToggleButton
                      key={opt.value}
                      value={opt.value}
                      sx={{
                        flex: 1,
                        border: "1px solid #2A2A38 !important",
                        borderRadius: "10px !important",
                        color: "text.secondary",
                        backgroundColor: "#1C1C26",
                        gap: 0.75,
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        transition: "all 0.15s",
                        "&.Mui-selected": {
                          backgroundColor: `${opt.color}18`,
                          borderColor: `${opt.color}55 !important`,
                          color: opt.color,
                        },
                        "&:hover": {
                          backgroundColor: `${opt.color}10`,
                          borderColor: `${opt.color}44 !important`,
                          color: opt.color,
                        },
                      }}
                    >
                      {opt.icon}
                      {opt.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>

              <Divider sx={{ borderColor: "#2A2A38" }} />

              <Button
                variant="contained"
                color="primary"
                onClick={submit}
                disabled={loading}
                fullWidth
                sx={{
                  color: "#0A0A0F",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  py: 1.4,
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#FBBF24" },
                  "&.Mui-disabled": { backgroundColor: "#F59E0B55", color: "#0A0A0F88" },
                }}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "#0A0A0F" }} />
                ) : (
                  "Submit Request"
                )}
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}
