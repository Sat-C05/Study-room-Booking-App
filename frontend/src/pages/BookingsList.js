import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const BookingsList = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  
  // 1. Add a new state to manage the calendar's date
  const [currentDate, setCurrentDate] = useState(new Date());

  // 2. Create a function that updates the date when you click the buttons
  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/bookings')
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
      .catch(err => {
        console.error("Error fetching bookings:", err);
        setError('Could not load bookings.');
      });
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ height: '80vh', padding: '20px' }}>
      <h2>Bookings Calendar</h2>
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        // 3. Add these two props to the Calendar component
        date={currentDate}
        onNavigate={handleNavigate}
      />

      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default BookingsList;