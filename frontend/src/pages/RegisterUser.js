import React, { useState } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import {
  Typography,
  Button,
  Stack,
  TextField,
  Alert,
  Link,
  Paper,
  Avatar
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const RegisterUser = () => {
  // Add email to the form state
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, formData)
      .then(res => {
        setMessage(res.data.message);
        // Clear all fields on success
        setFormData({ username: '', email: '', password: '' });
      })
      .catch(err => {
        setError(err.response?.data?.message || 'An error occurred.');
      });
  };

  return (
    <FormContainer>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'accent.main' }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Stack as="form" onSubmit={handleSubmit} spacing={2} sx={{ mt: 3, width: '100%' }}>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Enter new username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
          />
          {/* --- New Email Field --- */}
          <TextField
            label="Enter email address"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />
          {/* ----------------------- */}
          <TextField
            label="Enter password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            Create Account
          </Button>
          <Typography align="center" variant="body2">
            Already have an account? <Link component={RouterLink} to="/login" variant="body2">Login here</Link>
          </Typography>
        </Stack>
      </Paper>
    </FormContainer>
  );
};

export default RegisterUser;