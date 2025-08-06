import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // New state to hold user info

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const decodedUser = jwtDecode(storedToken).user;
      setUser(decodedUser); // Set user info on initial load
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const decodedUser = jwtDecode(newToken).user;
    setUser(decodedUser); // Set user info on login
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null); // Clear user info on logout
  };

  // We now provide the user object as well
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};