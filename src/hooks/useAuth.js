import { useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/auth.api";

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
      setToken(res.token);
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await registerUser(data);
      alert("User registered successfully!");
      return res;
    } catch (err) {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!token;

  return { user, token, loading, login, register, logout, isAuthenticated };
};
