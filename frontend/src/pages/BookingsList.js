import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography, Alert, Paper, Stack, Divider } from '@mui/material';

const localizer = momentLocalizer(moment);

const BookingsList = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/bookings`)
      .then(res => {
        const formattedEvents = res.data.map(booking => ({
          title: `${booking.room?.name || 'Deleted Room'} (${booking.user?.username || 'Deleted User'})`,
          start: new Date(`${booking.date}T${booking.startTime}`),
          end: new Date(`${booking.date}T${booking.endTime}`),
          allDay: false,
        }));
        setEvents(formattedEvents);
      })
      .catch(() => {
        setError('Could not load bookings.');
      });
  }, []);

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" align="center">
          Bookings Calendar
        </Typography>
        
        <Divider />

        <Box sx={{ height: '70vh' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            date={currentDate}
            onNavigate={setCurrentDate}
            view={view}
            onView={setView}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export default BookingsList;