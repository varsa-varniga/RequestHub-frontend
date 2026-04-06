// src/api/api.js
import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "https://reqzen.onrender.com").replace(/\/+$/, "");

const API = axios.create({
  baseURL: apiBaseUrl,
});

const ACCESS_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete API.defaults.headers.common.Authorization;
};

export const clearAuth = () => {
  delete API.defaults.headers.common.Authorization;
};

API.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      clearAuth();
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem("auth_user");
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const { data } = await axios.post(`${API.defaults.baseURL}/auth/refresh`, {
        refreshToken,
      });

      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

      const existingUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          ...existingUser,
          email: data.email || existingUser.email || "",
          role: data.role || existingUser.role || "USER",
        })
      );

      setAuthToken(data.accessToken);
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

      return API(originalRequest);
    } catch (refreshError) {
      clearAuth();
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem("auth_user");
      return Promise.reject(refreshError);
    }
  }
);

export default API;
