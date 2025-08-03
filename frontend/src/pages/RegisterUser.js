import React, { useState } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  Alert,
  Link
} from '@mui/material';

const RegisterUser = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    // UPDATED URL
    axios.post(`${process.env.REACT_APP_API_URL}/api/users`, { username })
      .then(res => {
        setMessage(res.data.message);
        setUsername('');
      })
      .catch(err => {
        setError(err.response?.data?.message || 'An error occurred.');
      });
  };

  return (
    <Stack as="form" onSubmit={handleSubmit} spacing={2} sx={{ width: '100%', maxWidth: '400px' }}>
      <Typography variant="h4" component="h1" align="center">Create New User</Typography>
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Enter new username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Button type="submit" variant="contained">Create User</Button>
      <Link component={RouterLink} to="/" align="center">Back to Home</Link>
    </Stack>
  );
};

export default RegisterUser;
