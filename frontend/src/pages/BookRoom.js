import React, { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  Alert,
  Link
} from '@mui/material';

const BookRoom = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: '',
    date: '',
    startTime: '',
    endTime: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // UPDATED URL
    axios.post(`${process.env.REACT_APP_API_URL}/api/bookings`, { ...formData, room: id })
      .then(res => {
        setMessage(res.data.message);
        setFormData({ username: '', date: '', startTime: '', endTime: '' });
      })
      .catch(err => {
        setError(err.response?.data?.message || 'An unexpected error occurred.');
      });
  };

  return (
    <Stack as="form" onSubmit={handleSubmit} spacing={2} sx={{ width: '100%', maxWidth: '400px' }}>
      <Typography variant="h4" component="h1" align="center">Book This Room</Typography>
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Your Username" name="username" value={formData.username} onChange={handleChange} required />
      <TextField type="date" name="date" value={formData.date} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
      <TextField label="Start Time" type="time" name="startTime" value={formData.startTime} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
      <TextField label="End Time" type="time" name="endTime" value={formData.endTime} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
      <Button type="submit" variant="contained" color="primary">Confirm Booking</Button>
      <Link component={RouterLink} to="/" align="center">Back to Home</Link>
    </Stack>
  );
};

export default BookRoom;