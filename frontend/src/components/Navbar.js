import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';

const Navbar = () => {
  // Get the full user object from context
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const homeLink = token ? '/dashboard' : '/';

  return (
    <AppBar position="static" sx={{ bgcolor: 'navbar.main', mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to={homeLink} sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          Study Room Booking
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          {user && (
            <Typography sx={{ mr: 2 }}>
              Welcome, {user.username}
            </Typography>
          )}
          {token && (
            <>
              <Button color="inherit" component={RouterLink} to="/bookings">Calendar</Button>
              {/* Only show Admin button if user's role is 'admin' */}
              {user?.role === 'admin' && (
                <Button color="inherit" component={RouterLink} to="/admin">Admin</Button>
              )}
            </>
          )}
          {token ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/register">Register</Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
