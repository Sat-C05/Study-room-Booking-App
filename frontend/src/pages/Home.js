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
  Stack,
  Alert,
  Paper,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Avatar
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const { token } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');

  // State for Filters
  const [locationFilter, setLocationFilter] = useState('All');
  const [capacityFilter, setCapacityFilter] = useState(0);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/rooms`)
      .then(res => setRooms(res.data))
      .catch(() => setError('Could not fetch rooms.'));
  }, []);

  // Filtering Logic
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
      {/* --- Hero Section --- */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 6 }, 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #e3f2fd 30%, #bbdefb 90%)',
          color: 'text.primary', 
          borderRadius: 3,
        }}
      >
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
            {t('main_title')}
          </Typography>
          <Typography variant="h6" component="p" sx={{ maxWidth: '600px', margin: 'auto', color: 'text.secondary' }}>
            Instantly find and reserve quiet study spaces on campus. Simple, fast, and conflict-free.
          </Typography>
        </motion.div>
      </Paper>
      
      {/* --- Language & User Status Section --- */}
      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" flexWrap="wrap">
        {['en', 'es', 'hi', 'te'].map((lang) => (
          <Button 
            key={lang}
            size="small" 
            variant={i18n.language === lang ? 'contained' : 'outlined'} 
            onClick={() => i18n.changeLanguage(lang)}
          >
            {lang === 'en' ? 'English' : lang === 'es' ? 'Español' : lang === 'hi' ? 'हिन्दी' : 'తెలుగు'}
          </Button>
        ))}
      </Stack>

      {!token && (
        <Alert severity="info" sx={{ justifyContent: 'center' }}>
          Welcome! Please <Link component={RouterLink} to="/login" sx={{ fontWeight: 'bold', mx: 0.5 }}>Login</Link> or <Link component={RouterLink} to="/register" sx={{ fontWeight: 'bold', mx: 0.5 }}>Register</Link> to book a room.
        </Alert>
      )}

      {/* --- Integrated "Find Your Space" Hub --- */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        {/* Filter Section */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <FilterListIcon color="primary" />
          <Typography variant="h5" component="h2">Find Your Space</Typography>
        </Stack>
        <Divider sx={{ mb: 3 }}/>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 4 }}>
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

        {/* Results List */}
        <Stack
          spacing={2}
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredRooms.length > 0 ? filteredRooms.map(room => (
            <motion.div key={room._id} variants={itemVariants}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  transition: 'background-color 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    boxShadow: 3,
                  }
                }}
              >
                <Avatar 
                  src={`https://placehold.co/100x100/e3f2fd/0d47a1?text=${encodeURIComponent(room.name.charAt(0))}`} 
                  sx={{ width: 56, height: 56 }} 
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="600">{room.name}</Typography>
                  <Stack direction="row" spacing={2} color="text.secondary" alignItems="center">
                    <Stack direction="row" spacing={0.5} alignItems="center"><LocationOnIcon fontSize="small" /><Typography variant="body2">{room.location}</Typography></Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center"><PeopleIcon fontSize="small" /><Typography variant="body2">{room.capacity} People</Typography></Stack>
                  </Stack>
                </Box>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={RouterLink} 
                  to={`/book/${room._id}`}
                >
                  {t('book_now')}
                </Button>
              </Paper>
            </motion.div>
          )) : (
            <Box sx={{ textAlign: 'center', p: 4 }}>
               <Typography variant="h6" color="text.secondary">No rooms match your search.</Typography>
               <Typography color="text.secondary">Please try a different filter selection.</Typography>
            </Box>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Home;
