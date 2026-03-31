// src/context/AdminDataContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import API from "../api/api";
import { sampleRequests } from "../data/mockRequests";
import { mapRequestDto } from "../utils/requestUtils";

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  const [requests, setRequests] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [users, setUsers] = useState([]);

  const refreshRequests = async () => {
    try {
      const res = await API.get("/admin/requests");
      const data = (res.data || []).map((item) => mapRequestDto(item));
      setRequests(data);
    } catch (err) {
      console.warn("Falling back to mock requests", err);
      setRequests(sampleRequests.map((item) => mapRequestDto(item)));
    }
  };

  const refreshWorkflows = async () => {
    try {
      const res = await API.get("/workflows");
      setWorkflows(res.data || []);
    } catch (err) {
      console.warn("Unable to load workflows", err);
      setWorkflows([]);
    }
  };

  const refreshUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.warn("Unable to load users", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    refreshRequests();
    refreshWorkflows();
    refreshUsers();
  }, []);

  const value = useMemo(
    () => ({
      requests,
      workflows,
      users,
      refreshRequests,
      refreshWorkflows,
      refreshUsers,
    }),
    [requests, workflows, users]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export const useAdminData = () => useContext(AdminDataContext);
