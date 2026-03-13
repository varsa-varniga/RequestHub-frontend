// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// Set credentials globally (optional)
export const setAuth = (username, password) => {
  API.defaults.headers.common["Authorization"] = `Basic ${btoa(`${username}:${password}`)}`;
};

// Clear credentials
export const clearAuth = () => {
  delete API.defaults.headers.common["Authorization"];
};

export default API;