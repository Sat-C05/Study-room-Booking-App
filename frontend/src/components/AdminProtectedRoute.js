import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const AdminProtectedRoute = ({ children }) => {
  const { user, token } = useContext(AuthContext);

  // If we're still checking for a token, show a loader
  if (token && !user) {
    return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  }

  // If there's no token OR the user is not an admin, redirect
  if (!token || user?.role !== 'admin') {
    return <Navigate to="/dashboard" />; // Redirect to the user dashboard
  }

  // If the user is an admin, show the page
  return children;
};

export default AdminProtectedRoute;