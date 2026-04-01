import { Box, Button, Stack } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationsPanel from "../../components/notifications/NotificationsPanel";

export default function AdminNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 1100 }}>
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
  );
}
