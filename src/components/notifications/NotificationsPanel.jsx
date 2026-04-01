import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import {
  DoneAll,
  MarkEmailRead,
  NotificationsNone,
  Refresh,
} from "@mui/icons-material";
import API from "../../api/api";

function normalizeNotification(item) {
  return {
    id: item?.id ?? item?.notificationId ?? item?._id ?? item?.uuid,
    title: item?.title || item?.subject || item?.type || "Notification",
    message: item?.message || item?.description || item?.details || item?.text || "",
    createdAt: item?.createdAt || item?.time || item?.timestamp || null,
    read: item?.read ?? item?.isRead ?? item?.status === "READ" ?? false,
  };
}

export default function NotificationsPanel({ userId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`/notifications/${userId}`);
      const list = Array.isArray(res.data) ? res.data : [];
      setItems(list.map(normalizeNotification));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    if (!notificationId) return;
    try {
      await API.put(`/notifications/${notificationId}/read`);
      setItems((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (err) {
      setError(err);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      await API.put(`/notifications/${userId}/read-all`);
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      setError(err);
    }
  };

  const visibleItems =
    filter === "unread" ? items.filter((n) => !n.read) : items;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        border: (t) => `1px solid ${t.palette.divider}`,
        backgroundColor: "background.paper",
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ md: "center" }}>
        <Stack spacing={0.5}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Typography variant="h5" fontWeight={800}>
              Notifications
            </Typography>
            <Chip
              size="small"
              label={`${unreadCount} unread`}
              color={unreadCount > 0 ? "error" : "default"}
              variant={unreadCount > 0 ? "filled" : "outlined"}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Updates triggered by SLA events and ticket changes.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Chip
            label="All"
            clickable
            onClick={() => setFilter("all")}
            color={filter === "all" ? "primary" : "default"}
            variant={filter === "all" ? "filled" : "outlined"}
          />
          <Chip
            label={`Unread (${unreadCount})`}
            clickable
            onClick={() => setFilter("unread")}
            color={filter === "unread" ? "primary" : "default"}
            variant={filter === "unread" ? "filled" : "outlined"}
          />
        </Stack>
      </Stack>

      <Divider sx={{ my: 2.5 }} />

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchNotifications}
          disabled={loading || !userId}
        >
          Refresh
        </Button>
        <Button
          size="small"
          variant="contained"
          startIcon={<DoneAll />}
          onClick={markAllAsRead}
          disabled={loading || unreadCount === 0 || !userId}
        >
          Mark All Read
        </Button>
      </Stack>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error" variant="body2">
            Unable to load notifications. Please try again.
          </Typography>
        </Box>
      )}

      {loading && (
        <Typography variant="body2" color="text.secondary">
          Loading notifications...
        </Typography>
      )}

      {!loading && visibleItems.length === 0 && (
        <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
          <NotificationsNone sx={{ fontSize: 40, mb: 1.5, opacity: 0.6 }} />
          <Typography variant="body1" fontWeight={600}>
            No notifications here.
          </Typography>
          <Typography variant="body2">
            You are all caught up.
          </Typography>
        </Box>
      )}

      <Stack spacing={1.5}>
        {visibleItems.map((n) => (
          <Paper
            key={n.id}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: (t) => `1px solid ${t.palette.divider}`,
              backgroundColor: n.read ? "transparent" : "rgba(25,118,210,0.06)",
            }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="space-between">
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={700} sx={{ mb: 0.5 }}>
                  {n.title}
                </Typography>
                {n.message && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.8 }}>
                    {n.message}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : "Just now"}
                </Typography>
              </Box>
              {!n.read && (
                <Button
                  size="small"
                  variant="text"
                  startIcon={<MarkEmailRead />}
                  onClick={() => markAsRead(n.id)}
                >
                  Mark Read
                </Button>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Box sx={{ mt: 2, fontSize: "0.85rem", color: "text.secondary" }}>
        Tip: refresh every 10–30 seconds or load when the panel opens.
      </Box>
    </Paper>
  );
}
