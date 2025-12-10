import React, { createContext, useContext, useEffect, useState } from "react";
import localApi from "../services/localApi";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "tm_auth_user_v1";
// Predefined admin email (can be overridden via env)
const ADMIN_EMAIL = import.meta.env?.VITE_ADMIN_EMAIL || "admin@example.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const authUser = await localApi.login(email, password);
      setUser(authUser);
      return authUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    try {
      const registered = await localApi.register(email, password);
      return registered;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localApi.logout?.();
  };

  // Admin if role === admin OR matches predefined admin email
  const isAdmin = !!user && (user.role === "admin" || user.email === ADMIN_EMAIL);

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

