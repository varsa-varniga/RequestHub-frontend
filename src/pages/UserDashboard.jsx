// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import API, { setAuth, clearAuth } from "../api/api"; 
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  const [requests, setRequests] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    API.get("/user/requests")
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Welcome {user?.email}</h1>
      <button onClick={logout}>Logout</button>
      <h2>My Requests</h2>
      <ul>
        {requests.map(r => (
          <li key={r.id}>{r.title} - {r.status}</li>
        ))}
      </ul>
    </div>
  );
}