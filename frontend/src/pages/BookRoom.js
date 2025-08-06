import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  Typography,
  Button,
  Stack,
  TextField,
  Alert,
  Link,
  Paper,
  Box,
  Grid,
  CircularProgress
} from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

const BookRoom = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ date: '', startTime: '', endTime: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/rooms/${id}`)
      .then(res => {
        setRoom(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Could not find the requested room.');
        setIsLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- THIS IS THE CORRECTED FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      navigate('/login');
      return;
    }

    if (formData.endTime <= formData.startTime) {
      setError('End time must be after start time.');
      return;
    }

    const config = {
      headers: {
        'x-auth-token': token
      }
    };

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/bookings`, { ...formData, room: id }, config);
      setMessage(res.data.message);
      setFormData({ date: '', startTime: '', endTime: '' }); // Clear form on success
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  }

  if (error && !room) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Grid container spacing={5}>
        {/* Left Column: Room Details */}
        <Grid item xs={12} md={5}>
          <Stack spacing={2}>
            <Typography variant="h4" component="h1">{room.name}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'primary.main', my: 3 }}>
              <MeetingRoomIcon sx={{ fontSize: 120 }} />
            </Box>
            <Typography variant="body1">
              <strong>Location:</strong> {room.location}
            </Typography>
            <Typography variant="body1">
              <strong>Capacity:</strong> {room.capacity} people
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Please select your desired date and time to book this room. All bookings are for the current academic year.
            </Typography>
          </Stack>
        </Grid>

        {/* Right Column: Booking Form */}
        <Grid item xs={12} md={7}>
          <Stack as="form" onSubmit={handleSubmit} spacing={2}>
            <Typography variant="h5" component="h2" align="center">
              Booking Details
            </Typography>
            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            
            <TextField 
              type="date" 
              name="date" 
              label="Booking Date"
              value={formData.date} 
              onChange={handleChange} 
              required 
              InputLabelProps={{ shrink: true }} 
              inputProps={{ min: today }} 
            />
            <TextField label="Start Time" type="time" name="startTime" value={formData.startTime} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
            <TextField label="End Time" type="time" name="endTime" value={formData.endTime} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
            
            <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 2 }}>
              Confirm Booking
            </Button>
            <Link component={RouterLink} to="/" align="center">Cancel</Link>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BookRoom;