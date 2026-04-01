import { useCallback, useEffect, useRef, useState } from "react";
import API from "../api/api";

export function useUnreadNotificationsCount(userId, pollMs = 20000) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  const fetchCount = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`/notifications/${userId}/unread-count`);
      const count = typeof res.data === "number" ? res.data : Number(res.data?.count || 0);
      setUnreadCount(Number.isNaN(count) ? 0 : count);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setUnreadCount(0);
      return undefined;
    }

    fetchCount();
    if (pollMs > 0) {
      pollRef.current = setInterval(fetchCount, pollMs);
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [userId, pollMs, fetchCount]);

  return { unreadCount, loading, error, refresh: fetchCount };
}
