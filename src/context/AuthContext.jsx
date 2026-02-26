// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useRef } from "react";
import api, { setToken } from "../api/axiosInstance";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const refreshTimeout = useRef(null);

  // Function to schedule auto-refresh
  const scheduleRefresh = (token) => {
    if (!token) return;

    const decoded = jwt_decode(token);
    const expiresIn = decoded.exp * 1000 - Date.now();

    // Refresh 1 minute before expiry
    const refreshTime = Math.max(expiresIn - 60_000, 0);

    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

    refreshTimeout.current = setTimeout(async () => {
      try {
        const res = await api.post("/refresh-token");
        setToken(res.data.accessToken);
        scheduleRefresh(res.data.accessToken); // schedule next refresh
      } catch (err) {
        console.error("Auto-refresh failed", err);
        logout(); // force logout if refresh fails
      }
    }, refreshTime);
  };

  // On app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await api.post("/refresh-token");
        setToken(res.data.accessToken);
        setUser({ username: "User" });
        scheduleRefresh(res.data.accessToken); // start auto-refresh loop
      } catch (err) {
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();

    return () => {
      if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (username, password) => {
    const res = await api.post("/login", { username, password });
    setToken(res.data.accessToken);
    setUser({ username });
    scheduleRefresh(res.data.accessToken);
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
    setToken(null);
    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};