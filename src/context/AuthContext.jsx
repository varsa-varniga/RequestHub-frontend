// src/context/AuthContext.jsx
import { createContext, useEffect, useState, useContext, useCallback } from "react";
import API, { setAuthToken, clearAuth } from "../api/api";

const AuthContext = createContext();
const ACCESS_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const AUTH_USER_KEY = "auth_user";

const readStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser()); // { id, name, email, role, active }
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    return !token && !!refreshToken;
  });

  const normalizeRole = (data) => {
    const raw =
      data?.role ||
      (Array.isArray(data?.roles) ? data.roles[0] : null) ||
      (Array.isArray(data?.authorities) ? data.authorities[0] : null) ||
      data?.authority ||
      "USER";
    return raw.toString().toUpperCase().replace(/^ROLE_/, "");
  };

  const normalizeUser = (data) => ({
    id: data?.id,
    name: data?.name || data?.fullName || data?.displayName || "",
    email: data?.email || data?.username || "",
    role: normalizeRole(data),
    active: data?.active ?? true,
  });

  const persistUser = useCallback((data) => {
    const normalized = normalizeUser(data);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(normalized));
    setUser(normalized);
    return normalized;
  }, []);

  const login = useCallback((authData, userData = authData) => {
    const accessToken = authData?.accessToken || authData?.token;
    const refreshToken = authData?.refreshToken;

    setAuthToken(accessToken);

    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    persistUser(userData);
  }, [persistUser]);

  const clearSession = useCallback(() => {
    clearAuth();
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  }, []);

  const refreshSession = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      clearSession();
      return;
    }

    try {
      const res = await API.post("/auth/refresh", { refreshToken });
      const storedUser = readStoredUser();
      login(res.data, { ...storedUser, ...res.data });
    } catch (err) {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession, login]);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (token) {
      setAuthToken(token);
      const storedUser = readStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    } else if (refreshToken) {
      refreshSession();
    } else {
      setLoading(false);
    }
  }, [refreshSession]);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    try {
      if (refreshToken) {
        await API.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      clearSession();
    }
  }, [clearSession]);

  return <AuthContext.Provider value={{ user, login, logout, loading, refreshSession }}>{children}</AuthContext.Provider>;
};

// custom hook
export const useAuth = () => useContext(AuthContext);
