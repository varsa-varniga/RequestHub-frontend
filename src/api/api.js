// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080"
});

// function to set credentials dynamically
export const setAuth = (email, password) => {
  API.defaults.auth = { username: email, password };
};

// function to remove credentials on logout
export const clearAuth = () => {
  delete API.defaults.auth;
};

export default API;