import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography, Link, Alert } from '@mui/material';

const localizer = momentLocalizer(moment);

const BookingsList = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  useEffect(() => {
    // UPDATED URL
    axios.get(`${process.env.REACT_APP_API_URL}/api/bookings`)
      .then(res => {
        const formattedEvents = res.data.map(booking => {
          const startDate = new Date(`${booking.date}T${booking.startTime}`);
          const endDate = new Date(`${booking.date}T${booking.endTime}`);
          
          return {
            title: `${booking.room?.name || 'Deleted Room'} (${booking.user?.username || 'Deleted User'})`,
            start: startDate,
            end: endDate,
            allDay: false,
          };
        });
        setEvents(formattedEvents);
      })
      .catch(() => {
        setError('Could not load bookings.');
      });
  }, []);

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Bookings Calendar
      </Typography>
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        date={currentDate}
        onNavigate={handleNavigate}
      />

      <Link component={RouterLink} to="/" align="center" sx={{ display: 'block', mt: 2 }}>
        Back to Home
      </Link>
    </Box>
  );
};

export default BookingsList;