// src/pages/admin/Dashboard.jsx
import { Avatar, Box, Button, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { AddCircleOutline, Dashboard as DashboardIcon, PendingActions, TaskAlt, ErrorOutline, WarningAmber, History } from "@mui/icons-material";
import { useAdminData } from "../../context/AdminDataContext";
import { useRequestAnalytics, StatCard } from "./adminShared.jsx";
import SlaPanel from "./SlaPanel";
import { useAuth } from "../../context/AuthContext";



export default function AdminDashboardPage() {
  const { requests } = useAdminData();
  const { stats, slaRisks } = useRequestAnalytics(requests);
  const { user } = useAuth();
  const displayName = user?.name || user?.email?.split("@")[0] || "Admin";
  const email = user?.email || "admin@example.com";

  return (
    <>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} mb={3}>
        <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">
          Admin Dashboard
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<History />} color="inherit">
            Activity Log
          </Button>
          <Button variant="contained" startIcon={<AddCircleOutline />}>
            Submit New Request
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12, lg: 15 }} mb={3}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard label="Total Requests" value={stats.total} color="#6366F1" icon={<DashboardIcon />} trend="+8%" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard label="Pending" value={stats.Pending} color="#F59E0B" icon={<PendingActions />} trend="+3%" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard label="Approved" value={stats.Approved} color="#22C55E" icon={<TaskAlt />} trend="+5%" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard label="Rejected" value={stats.Rejected} color="#EF4444" icon={<ErrorOutline />} trend="-1%" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard label="SLA Alerts" value={slaRisks.length} color="#EAB308" icon={<WarningAmber />} trend="+2%" />
        </Grid>
      </Grid>


    

   
    </>
  );
}
