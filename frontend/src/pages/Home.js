import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  CardMedia,
  Stack,
  Alert,
  Paper,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider // This was the missing import
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const Home = () => {
  const { t } = useTranslation();
  const { token } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [capacityFilter, setCapacityFilter] = useState(0);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/rooms`)
      .then(res => setRooms(res.data))
      .catch(() => setError('Could not fetch rooms.'));
  }, []);

  const uniqueLocations = useMemo(() => {
    const locations = new Set(rooms.map(room => room.location).filter(Boolean));
    return ['All', ...Array.from(locations)];
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const locationMatch = locationFilter === 'All' || room.location === locationFilter;
      const capacityMatch = capacityFilter === 0 || room.capacity >= capacityFilter;
      return locationMatch && capacityMatch;
    });
  }, [rooms, locationFilter, capacityFilter]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={4} sx={{ width: '100%' }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, textAlign: 'center', background: 'linear-gradient(135deg, #ffffff 30%, #f5f5f5 90%)', color: 'text.primary', borderRadius: 2 }}>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>{t('main_title')}</Typography>
          <Typography variant="h6" component="p" sx={{ maxWidth: '600px', margin: 'auto', color: 'text.secondary' }}>
            Instantly find and reserve quiet study spaces on campus. Simple, fast, and conflict-free.
          </Typography>
        </motion.div>
      </Paper>
      
      {!token && (
        <Alert severity="info" sx={{ justifyContent: 'center' }}>
          Welcome! Please <Link component={RouterLink} to="/login" sx={{ fontWeight: 'bold', mx: 0.5 }}>Login</Link> or <Link component={RouterLink} to="/register" sx={{ fontWeight: 'bold', mx: 0.5 }}>Register</Link> to book a room.
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <FilterListIcon color="primary" />
          <Typography variant="h5" component="h2">Find Your Space</Typography>
        </Stack>
        <Divider sx={{ mb: 3 }}/>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <FormControl fullWidth>
            <InputLabel>Location</InputLabel>
            <Select value={locationFilter} label="Location" onChange={(e) => setLocationFilter(e.target.value)}>
              {uniqueLocations.map(loc => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Minimum Capacity</InputLabel>
            <Select value={capacityFilter} label="Minimum Capacity" onChange={(e) => setCapacityFilter(Number(e.target.value))}>
              <MenuItem value={0}>Any</MenuItem>
              <MenuItem value={2}>2+ People</MenuItem>
              <MenuItem value={4}>4+ People</MenuItem>
              <MenuItem value={6}>6+ People</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Box>
        <Grid container spacing={4} component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
          {filteredRooms.length > 0 ? filteredRooms.map(room => (
            <Grid item xs={12} sm={6} md={4} key={room._id}>
              <motion.div variants={itemVariants} style={{ height: '100%' }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 } }}>
                  <CardMedia component="img" height="160" image={`https://placehold.co/600x400/e3f2fd/0d47a1?text=${encodeURIComponent(room.name)}`} alt={`Study room ${room.name}`} />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div" fontWeight="600">{room.name}</Typography>
                    <Typography variant="body2" color="text.secondary">Location: {room.location}</Typography>
                    <Typography variant="body2" color="text.secondary">Capacity: {room.capacity}</Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button variant="contained" color="primary" component={RouterLink} to={`/book/${room._id}`} fullWidth>{t('book_now')}</Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          )) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', p: 4 }}>
                 <Typography variant="h6" color="text.secondary">No rooms match your search.</Typography>
                 <Typography color="text.secondary">Please try a different filter selection.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Stack>
  );
};

export default Home;
