// src/context/AuthContext.jsx
import { createContext, useState, useContext } from "react";
import { setAuth, clearAuth } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, role }

  const login = (email, password, role) => {
    setAuth(email, password);
    setUser({ email, role });
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => useContext(AuthContext);