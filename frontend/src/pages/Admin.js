import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  Alert,
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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupIcon from '@mui/icons-material/Group';
import BookOnlineIcon from '@mui/icons-material/BookOnline';

const Admin = () => {
  const { user: loggedInUser, token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomFormData, setRoomFormData] = useState({ name: '', location: '', capacity: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [selectedLocation, setSelectedLocation] = useState('');
  const [isNewLocation, setIsNewLocation] = useState(false);

  useEffect(() => {
    if (token) {
      const config = { headers: { 'x-auth-token': token } };
      const fetchAllData = async () => {
        setIsLoading(true);
        try {
          const [roomsRes, usersRes, bookingsRes] = await Promise.all([
            axios.get(`${process.env.REACT_APP_API_URL}/api/rooms`, config),
            axios.get(`${process.env.REACT_APP_API_URL}/api/users`, config),
            axios.get(`${process.env.REACT_APP_API_URL}/api/bookings`, config)
          ]);
          setRooms(roomsRes.data);
          setUsers(usersRes.data);
          setBookings(bookingsRes.data);
        } catch (err) {
          setError("Failed to load admin data. You may not have permission.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchAllData();
    }
  }, [token]);

  const uniqueLocations = useMemo(() => {
    const locations = new Set(rooms.map(room => room.location).filter(Boolean));
    return Array.from(locations);
  }, [rooms]);

  const handleLocationChange = (event) => {
    const value = event.target.value;
    if (value === 'new') {
      setIsNewLocation(true);
      setSelectedLocation('');
      setRoomFormData({ ...roomFormData, location: '' });
    } else {
      setIsNewLocation(false);
      setSelectedLocation(value);
      setRoomFormData({ ...roomFormData, location: value });
    }
  };

  const handleRoomCreate = (e) => {
    e.preventDefault();
    const config = { headers: { 'x-auth-token': token } };
    axios.post(`${process.env.REACT_APP_API_URL}/api/rooms`, roomFormData, config)
      .then((res) => {
        setMessage(`Room "${roomFormData.name}" created!`);
        setRoomFormData({ name: '', location: '', capacity: '' });
        setSelectedLocation('');
        setIsNewLocation(false);
        setRooms([...rooms, res.data]);
      })
      .catch(() => setError('Error creating room.'));
  };
  
  const handleRoomFormChange = (e) => {
    setRoomFormData({ ...roomFormData, [e.target.name]: e.target.value });
  };

  const clearMessages = () => { setMessage(''); setError(''); };
  const handleDeleteClick = (id, type) => { setItemToDelete({ id, type }); setOpenDialog(true); };
  const handleDialogClose = () => { setOpenDialog(false); setItemToDelete(null); };
  
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const { id, type } = itemToDelete;
    let deleteUrl = '';
    let successCallback;
    const config = { headers: { 'x-auth-token': token } };

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

    axios.delete(deleteUrl, config)
      .then(successCallback)
      .catch(() => setError(`Error deleting ${type}.`));
    
    handleDialogClose();
  };

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Stack spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h3" component="h1" align="center">Admin Panel</Typography>
      {message && <Alert severity="success" onClose={clearMessages}>{message}</Alert>}
      {error && <Alert severity="error" onClose={clearMessages}>{error}</Alert>}
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <MeetingRoomIcon color="primary" />
            <Typography variant="h5" component="h2">Manage Rooms</Typography>
        </Stack>
        <Divider sx={{ mb: 3 }} />
        <Stack as="form" onSubmit={handleRoomCreate} spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField size="small" name="name" label="Room Name" value={roomFormData.name} onChange={handleRoomFormChange} required fullWidth />
            <FormControl size="small" fullWidth>
              <InputLabel>Location</InputLabel>
              <Select value={selectedLocation} label="Location" onChange={handleLocationChange}>
                {uniqueLocations.map(loc => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
                <MenuItem value="new"><em>-- Add New Location --</em></MenuItem>
              </Select>
            </FormControl>
          </Stack>
          {isNewLocation && (
            <TextField size="small" name="location" label="New Location Name" value={roomFormData.location} onChange={handleRoomFormChange} required fullWidth />
          )}
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField size="small" name="capacity" label="Capacity" type="number" value={roomFormData.capacity} onChange={handleRoomFormChange} sx={{ maxWidth: '120px' }} />
            <Button type="submit" variant="contained" color="primary" sx={{ minWidth: '150px' }}>Create Room</Button>
          </Stack>
        </Stack>
        <List>
          {rooms.map(room => (
            <ListItem key={room._id} secondaryAction={
              <IconButton edge="end" onClick={() => handleDeleteClick(room._id, 'room')}>
                <DeleteIcon color="secondary" />
              </IconButton>
            }>
              <ListItemText primary={room.name} secondary={`Location: ${room.location} | Capacity: ${room.capacity}`} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <GroupIcon color="accent" />
                <Typography variant="h5" component="h2">Manage Users</Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <List>
              {users.map(user => (
                <ListItem key={user._id} secondaryAction={
                  loggedInUser?.id !== user._id && (
                    <IconButton edge="end" onClick={() => handleDeleteClick(user._id, 'user')}>
                      <DeleteIcon color="secondary" />
                    </IconButton>
                  )
                }>
                  <ListItemText primary={user.username} secondary={user.role === 'admin' ? 'Admin' : ''} />
                </ListItem>
              ))}
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
              {bookings.map(booking => (
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
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

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
