// src/pages/admin/SlaPanel.jsx
import { Avatar, Box, Chip, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { WarningAmber } from "@mui/icons-material";
import { useAdminData } from "../../context/AdminDataContext";
import { formatRelativeHours, useRequestAnalytics } from "./adminShared.jsx";

export default function SlaPanel() {
  const { requests } = useAdminData();
  const { slaRisks, timeline } = useRequestAnalytics(requests);

  return (
    <Grid container spacing={2} mb={2}>
      

      <Grid item xs={12} lg={6}>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={800}>
              SLA Indicators
            </Typography>
            <Chip label={`${slaRisks.length} at risk`} color="warning" size="small" />
          </Stack>
          <Stack spacing={1.75}>
            {slaRisks.map((r) => {
              const severity = r.remaining < 8 ? "#EF4444" : "#F59E0B";
              return (
                <Stack
                  key={r.id}
                  direction="row"
                  alignItems="center"
                  spacing={1.25}
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    border: (t) => `1px solid ${t.palette.divider}`,
                    backgroundColor: (t) => (t.palette.mode === "light" ? "rgba(254,240,138,0.18)" : "rgba(251,191,36,0.12)"),
                  }}
                >
                  <WarningAmber sx={{ color: severity }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700} lineHeight={1.2}>
                      {r.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stage: {r.stageLabel || `Stage ${r.stageNumber || 1}`} • {r.requester}
                    </Typography>
                  </Box>
                  <Chip
                    label={formatRelativeHours(r.remaining)}
                    size="small"
                    sx={{ bgcolor: "rgba(0,0,0,0.04)", color: severity, fontWeight: 700, borderRadius: 1.5 }}
                  />
                </Stack>
              );
            })}
            {!slaRisks.length && (
              <Typography variant="body2" color="text.secondary">
                All requests are within SLA.
              </Typography>
            )}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}