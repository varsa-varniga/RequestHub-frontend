// src/context/AuthContext.jsx
import { createContext, useEffect, useState, useContext, useCallback } from "react";
import API, { setAuthToken, clearAuth } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, email, role, active }
  const [loading, setLoading] = useState(true);

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

  const login = useCallback((token, userData) => {
    setAuthToken(token);
    localStorage.setItem("auth_token", token);
    setUser(normalizeUser(userData));
  }, []);

  const refreshMe = useCallback(async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(normalizeUser(res.data));
    } catch (err) {
      clearAuth();
      localStorage.removeItem("auth_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setAuthToken(token);
      refreshMe();
    } else {
      setLoading(false);
    }
  }, [refreshMe]);

  const logout = () => {
    clearAuth();
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout, loading, refreshMe }}>{children}</AuthContext.Provider>;
};

// custom hook
export const useAuth = () => useContext(AuthContext);
