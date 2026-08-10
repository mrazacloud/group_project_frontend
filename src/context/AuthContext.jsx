/**
 * AuthContext — manages JWT token and current user state
 */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem('eventhub_token');
    if (token) {
      authAPI.getProfile()
        .then(setUser)
        .catch(() => localStorage.removeItem('eventhub_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    localStorage.setItem('eventhub_token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (username, email, password) => {
    const data = await authAPI.register({ username, email, password });
    localStorage.setItem('eventhub_token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('eventhub_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
