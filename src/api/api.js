// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// Set credentials globally (optional)
export const setAuth = (username, password) => {
  const token = btoa(`${username}:${password}`);
  API.defaults.headers.common["Authorization"] = `Basic ${token}`;
  return token;
};

export const setAuthToken = (token) => {
  if (!token) return;
  API.defaults.headers.common["Authorization"] = `Basic ${token}`;
};

// Clear credentials
export const clearAuth = () => {
  delete API.defaults.headers.common["Authorization"];
};

export default API;
