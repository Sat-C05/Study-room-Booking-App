import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { AppBar, Toolbar, Typography, Button, Stack, Divider } from '@mui/material';

const Navbar = () => {
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
        {/* Increased spacing from 1 to 2 */}
        <Stack direction="row" spacing={2} alignItems="center">
          {user && (
            <>
              <Typography sx={{ mr: 1 }}>
                Welcome, {user.username}
              </Typography>
              {/* Added a vertical divider */}
              <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', mr: 1 }} />
            </>
          )}
          {token && (
            <>
              <Button color="inherit" component={RouterLink} to="/bookings">Calendar</Button>
              {user?.role === 'admin' && (
                <>
                  <Button color="inherit" component={RouterLink} to="/admin">Admin</Button>
                  <Button color="inherit" component={RouterLink} to="/reports">Reports</Button>
                </>
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
