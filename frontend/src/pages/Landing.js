import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Stack, Paper, Link } from '@mui/material'; // Link is now imported at the top
import SchoolIcon from '@mui/icons-material/School';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Landing = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '70vh' 
      }}
    >
      <Stack spacing={4} alignItems="center" textAlign="center">
        <Typography variant="h2" component="h1" fontWeight="bold">
          Welcome to Study Room Booking
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Please select your role to continue.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 4 }}>
          {/* Student Box */}
          <Paper elevation={3} sx={{ p: 4, width: 280 }}>
            <Stack spacing={2} alignItems="center">
              <SchoolIcon color="primary" sx={{ fontSize: 60 }} />
              <Typography variant="h5">I am a Student</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                component={RouterLink} 
                to="/login"
                fullWidth
              >
                Login
              </Button>
              <Typography variant="body2">
                or <Link component={RouterLink} to="/register">Register Here</Link>
              </Typography>
            </Stack>
          </Paper>
          {/* Admin Box */}
          <Paper elevation={3} sx={{ p: 4, width: 280 }}>
            <Stack spacing={2} alignItems="center">
              <AdminPanelSettingsIcon color="secondary" sx={{ fontSize: 60 }} />
              <Typography variant="h5">I am an Admin</Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                component={RouterLink} 
                to="/login"
                fullWidth
              >
                Login
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Landing;