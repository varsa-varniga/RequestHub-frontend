// src/pages/admin/AuditLogs.jsx
import { Paper, Typography } from "@mui/material";

export default function AuditLogs() {
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
      <Typography variant="h6" fontWeight={800}>
        Audit Logs
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>
        This section will show audit history once the backend exposes it.
      </Typography>
    </Paper>
  );
}
