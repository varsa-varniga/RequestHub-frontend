// src/pages/admin/ReportsAnalytics.jsx
import { Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { WarningAmber } from "@mui/icons-material";
import { useAdminData } from "../../context/AdminDataContext";

export default function ReportsAnalytics() {
  const { workflows } = useAdminData();

  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
      <Typography variant="h6" fontWeight={800} mb={2}>
        Request Types & SLA
      </Typography>
      <Stack spacing={1.2}>
        {workflows.map((workflow) => (
          <Stack key={workflow.id} direction="row" spacing={1} alignItems="center">
            <Chip label={workflow.requestType || "Unknown"} size="small" color="primary" variant="outlined" />
            <Typography variant="body2" color="text.secondary">
              {workflow.stages?.length || 0} stages
            </Typography>
          </Stack>
        ))}
        {!workflows.length && (
          <Typography variant="body2" color="text.secondary">
            Add workflows in the backend to define available request types.
          </Typography>
        )}
        <Divider />
        <Stack direction="row" spacing={1} alignItems="center">
          <WarningAmber color="warning" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            Track SLA breaches and overdue items. Escalations trigger notifications.
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
