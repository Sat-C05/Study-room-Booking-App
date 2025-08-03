import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  Alert,
  Link,
  Divider
} from '@mui/material';

const Admin = () => {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]); // New state for bookings
  const [roomFormData, setRoomFormData] = useState({ name: '', location: '', capacity: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch all data when the component loads
  useEffect(() => {
    fetchRooms();
    fetchUsers();
    fetchBookings();
  }, []);

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  // --- Data Fetching Functions ---
  const fetchRooms = () => {
    axios.get('http://localhost:5000/api/rooms')
      .then(res => setRooms(res.data))
      .catch(() => setError("Could not fetch rooms."));
  };

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/users')
      .then(res => setUsers(res.data))
      .catch(() => setError("Could not fetch users."));
  };

  const fetchBookings = () => {
    axios.get('http://localhost:5000/api/bookings')
      .then(res => setBookings(res.data))
      .catch(() => setError("Could not fetch bookings."));
  };

  // --- Handler Functions ---
  const handleRoomCreate = (e) => {
    e.preventDefault();
    clearMessages();
    axios.post('http://localhost:5000/api/rooms', roomFormData)
      .then(() => {
        setMessage(`Room "${roomFormData.name}" created!`);
        setRoomFormData({ name: '', location: '', capacity: '' });
        fetchRooms();
      })
      .catch(() => setError('Error creating room.'));
  };

  const handleRoomDelete = (roomId) => {
    clearMessages();
    axios.delete(`http://localhost:5000/api/rooms/${roomId}`)
      .then(() => {
        setMessage('Room deleted!');
        fetchRooms();
      })
      .catch(() => setError('Error deleting room.'));
  };

  const handleUserDelete = (userId) => {
    clearMessages();
    axios.delete(`http://localhost:5000/api/users/${userId}`)
      .then(() => {
        setMessage('User deleted!');
        fetchUsers();
      })
      .catch(() => setError('Error deleting user.'));
  };

  const handleBookingDelete = (bookingId) => {
    clearMessages();
    axios.delete(`http://localhost:5000/api/bookings/${bookingId}`)
      .then(() => {
        setMessage('Booking deleted!');
        fetchBookings(); // Refresh the list of bookings
      })
      .catch(() => setError('Error deleting booking.'));
  };


  return (
    <Stack spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h3" component="h1" align="center">
        Admin Panel
      </Typography>

      {message && <Alert severity="success" onClose={clearMessages}>{message}</Alert>}
      {error && <Alert severity="error" onClose={clearMessages}>{error}</Alert>}
      
      <Link component={RouterLink} to="/" align="center">Back to Home</Link>
      <Divider />

      {/* Section for Managing Rooms */}
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>Manage Rooms</Typography>
        <Stack as="form" onSubmit={handleRoomCreate} direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField size="small" name="name" label="Room Name" value={roomFormData.name} onChange={(e) => setRoomFormData({ ...roomFormData, name: e.target.value })} required />
          <TextField size="small" name="location" label="Location" value={roomFormData.location} onChange={(e) => setRoomFormData({ ...roomFormData, location: e.target.value })} />
          <TextField size="small" name="capacity" label="Capacity" type="number" value={roomFormData.capacity} onChange={(e) => setRoomFormData({ ...roomFormData, capacity: e.target.value })} />
          <Button type="submit" variant="contained" color="primary">Create Room</Button>
        </Stack>
        <Stack spacing={1}>
          {rooms.map(room => (
            <Stack key={room._id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1, borderBottom: '1px solid grey' }}>
              <Typography><strong>{room.name}</strong> ({room.location})</Typography>
              <Button variant="contained" color="secondary" onClick={() => handleRoomDelete(room._id)}>Delete</Button>
            </Stack>
          ))}
        </Stack>
      </Box>

      <Divider />

      {/* Section for Managing Users */}
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>Manage Users</Typography>
        <Stack spacing={1}>
          {users.map(user => (
            <Stack key={user._id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1, borderBottom: '1px solid grey' }}>
              <Typography>{user.username}</Typography>
              <Button variant="contained" color="secondary" onClick={() => handleUserDelete(user._id)}>Delete</Button>
            </Stack>
          ))}
        </Stack>
      </Box>

      <Divider />

      {/* NEW Section for Managing Bookings */}
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>Manage Bookings</Typography>
        <Stack spacing={1}>
          {bookings.map(booking => (
            <Stack key={booking._id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1, borderBottom: '1px solid grey' }}>
              <Typography>
                <strong>{booking.room?.name || 'Deleted Room'}</strong> booked by <em>{booking.user?.username || 'Deleted User'}</em>
              </Typography>
              <Button variant="contained" color="secondary" onClick={() => handleBookingDelete(booking._id)}>Delete</Button>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default Admin;