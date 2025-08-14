import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Typography, Button, Stack, TextField, Alert, Link, Paper, Box, Grid, CircularProgress, Divider } from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const BookRoom = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ date: '', startTime: '', endTime: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
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

  const handleSubmit = async (e, suggestedTime = null) => {
    if (e) e.preventDefault();
    setMessage('');
    setError('');
    setSuggestions([]);
    const bookingData = suggestedTime ? { ...formData, ...suggestedTime } : formData;
    if (!token) {
      navigate('/login');
      return;
    }
    if (bookingData.endTime <= bookingData.startTime) {
      setError('End time must be after start time.');
      return;
    }
    const config = { headers: { 'x-auth-token': token } };
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/bookings`, { ...bookingData, room: id }, config);
      setMessage(res.data.message);
      setFormData({ date: '', startTime: '', endTime: '' });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      setError(errorMessage);
      if (err.response?.status === 409) {
        fetchSuggestions(bookingData.startTime);
      }
    }
  };

  const fetchSuggestions = async (requestedStartTime) => {
    const config = { headers: { 'x-auth-token': token } };
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/bookings/suggestions`, {
        room: id,
        date: formData.date,
        requestedStartTime,
      }, config);
      setSuggestions(res.data);
    } catch (err) {
      console.error("Failed to fetch suggestions");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSubmit(null, suggestion);
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
        <Grid item xs={12} md={5}>
          <Stack spacing={2}>
            <Typography variant="h4" component="h1">{room?.name}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'primary.main', my: 3 }}><MeetingRoomIcon sx={{ fontSize: 120 }} /></Box>
            <Typography variant="body1"><strong>Location:</strong> {room?.location}</Typography>
            <Typography variant="body1"><strong>Capacity:</strong> {room?.capacity} people</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={7}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={suggestions.length > 0 ? 8 : 12}>
              <Stack as="form" onSubmit={handleSubmit} spacing={2}>
                <Typography variant="h5" component="h2" align="center">{t('booking_form_details')}</Typography>
                {message && <Alert severity="success">{message}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
                <TextField type="date" name="date" label={t('booking_form_date')} value={formData.date} onChange={handleChange} required InputLabelProps={{ shrink: true }} inputProps={{ min: today }} />
                <TextField label={t('booking_form_start_time')} type="time" name="startTime" value={formData.startTime} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
                <TextField label={t('booking_form_end_time')} type="time" name="endTime" value={formData.endTime} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
                <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 2 }}>{t('booking_form_confirm')}</Button>
                <Link component={RouterLink} to="/dashboard" align="center">{t('booking_form_cancel')}</Link>
              </Stack>
            </Grid>
            {suggestions.length > 0 && (
              <Grid item xs={12} md={4}>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center"><EventAvailableIcon color="action" /><Typography variant="h6">Alternatives:</Typography></Stack>
                    <Divider />
                    {suggestions.map((s, index) => (
                      <Button key={index} variant="outlined" onClick={() => handleSuggestionClick(s)}>{s.startTime} - {s.endTime}</Button>
                    ))}
                  </Stack>
                </motion.div>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BookRoom;
