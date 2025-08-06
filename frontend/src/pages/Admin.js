import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  Alert,
  Link,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupIcon from '@mui/icons-material/Group';
import BookOnlineIcon from '@mui/icons-material/BookOnline';

const Admin = () => {
  const { user: loggedInUser } = useContext(AuthContext); // Get the currently logged-in user
  // All the state and functions remain the same
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomFormData, setRoomFormData] = useState({ name: '', location: '', capacity: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [roomsRes, usersRes, bookingsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/rooms`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/users`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/bookings`)
        ]);
        setRooms(roomsRes.data);
        setUsers(usersRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const clearMessages = () => { setMessage(''); setError(''); };
  const handleDeleteClick = (id, type) => { setItemToDelete({ id, type }); setOpenDialog(true); };
  const handleDialogClose = () => { setOpenDialog(false); setItemToDelete(null); };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const { id, type } = itemToDelete;
    let deleteUrl = '';
    let successCallback;
    if (type === 'room') {
      deleteUrl = `${process.env.REACT_APP_API_URL}/api/rooms/${id}`;
      successCallback = () => { setMessage('Room deleted!'); setRooms(rooms.filter(r => r._id !== id)); };
    } else if (type === 'user') {
      deleteUrl = `${process.env.REACT_APP_API_URL}/api/users/${id}`;
      successCallback = () => { setMessage('User deleted!'); setUsers(users.filter(u => u._id !== id)); };
    } else if (type === 'booking') {
      deleteUrl = `${process.env.REACT_APP_API_URL}/api/bookings/${id}`;
      successCallback = () => { setMessage('Booking deleted!'); setBookings(bookings.filter(b => b._id !== id)); };
    }
    axios.delete(deleteUrl).then(successCallback).catch(() => setError(`Error deleting ${type}.`));
    handleDialogClose();
  };

  const handleRoomCreate = (e) => {
    e.preventDefault();
    clearMessages();
    axios.post(`${process.env.REACT_APP_API_URL}/api/rooms`, roomFormData)
      .then((res) => {
        setMessage(`Room "${roomFormData.name}" created!`);
        setRoomFormData({ name: '', location: '', capacity: '' });
        setRooms([...rooms, res.data]);
      })
      .catch(() => setError('Error creating room.'));
  };
  
  const handleRoomChange = (e) => {
    setRoomFormData({ ...roomFormData, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Stack spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h3" component="h1" align="center">Admin Panel</Typography>
      {message && <Alert severity="success" onClose={clearMessages}>{message}</Alert>}
      {error && <Alert severity="error" onClose={clearMessages}>{error}</Alert>}
      
      {/* Manage Rooms Section */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <MeetingRoomIcon color="primary" />
            <Typography variant="h5" component="h2">Manage Rooms</Typography>
        </Stack>
        <Divider sx={{ mb: 3 }} />
        <Stack as="form" onSubmit={handleRoomCreate} direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField size="small" name="name" label="Room Name" value={roomFormData.name} onChange={handleRoomChange} required fullWidth />
          <TextField size="small" name="location" label="Location" value={roomFormData.location} onChange={handleRoomChange} fullWidth />
          <TextField size="small" name="capacity" label="Capacity" type="number" value={roomFormData.capacity} onChange={handleRoomChange} sx={{ maxWidth: '120px' }} />
          <Button type="submit" variant="contained" color="primary" sx={{ minWidth: '150px' }}>Create Room</Button>
        </Stack>
        <List>
          {rooms.length > 0 ? rooms.map(room => (
            <ListItem key={room._id} secondaryAction={
              <IconButton edge="end" onClick={() => handleDeleteClick(room._id, 'room')}>
                <DeleteIcon color="secondary" />
              </IconButton>
            }>
              <ListItemText primary={room.name} secondary={`Location: ${room.location} | Capacity: ${room.capacity}`} />
            </ListItem>
          )) : <Typography sx={{ p: 2, color: 'text.secondary' }}>No rooms found. Please create one.</Typography>}
        </List>
      </Paper>

      {/* Grid for Users and Bookings */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <GroupIcon color="accent" />
                <Typography variant="h5" component="h2">Manage Users</Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <List>
              {users.length > 0 ? users.map(user => (
                <ListItem key={user._id} secondaryAction={
                  // --- This is the new security check ---
                  // Only show the delete button if the user is NOT the currently logged-in admin
                  loggedInUser?.id !== user._id && (
                    <IconButton edge="end" onClick={() => handleDeleteClick(user._id, 'user')}>
                      <DeleteIcon color="secondary" />
                    </IconButton>
                  )
                }>
                  <ListItemText 
                    primary={user.username} 
                    secondary={user.role === 'admin' ? 'Admin' : ''}
                  />
                </ListItem>
              )) : <Typography sx={{ p: 2, color: 'text.secondary' }}>No users found.</Typography>}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <BookOnlineIcon color="accent" />
                <Typography variant="h5" component="h2">Manage Bookings</Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <List>
              {bookings.length > 0 ? bookings.map(booking => (
                <ListItem key={booking._id} secondaryAction={
                  <IconButton edge="end" onClick={() => handleDeleteClick(booking._id, 'booking')}>
                    <DeleteIcon color="secondary" />
                  </IconButton>
                }>
                  <ListItemText 
                    primary={`${booking.room?.name || 'Deleted Room'}`}
                    secondary={`By: ${booking.user?.username || 'Deleted User'}`} 
                  />
                </ListItem>
              )) : <Typography sx={{ p: 2, color: 'text.secondary' }}>No bookings found.</Typography>}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Dialog is unchanged */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><DialogContentText>Are you sure? This action cannot be undone.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Admin;