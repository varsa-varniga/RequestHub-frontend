import { Box, Button, Stack } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import NotificationsPanel from "../components/notifications/NotificationsPanel";

export default function NotificationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout showSearch={false}>
      <Box sx={{ maxWidth: 1000 }}>
        <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
          <Button
            variant="text"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Stack>
        <NotificationsPanel userId={user?.id} />
      </Box>
    </DashboardLayout>
  );
}
