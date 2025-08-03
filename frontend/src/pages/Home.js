import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Stack,
  Alert
} from '@mui/material';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/rooms')
      .then(res => setRooms(res.data))
      .catch(() => setError('Could not fetch rooms.'));
  }, []);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 4 }}>
        <Button 
          size="small" 
          variant={i18n.language === 'en' ? 'contained' : 'outlined'} 
          onClick={() => i18n.changeLanguage('en')}
        >
          English
        </Button>
        <Button 
          size="small" 
          variant={i18n.language === 'es' ? 'contained' : 'outlined'} 
          onClick={() => i18n.changeLanguage('es')}
        >
          Español
        </Button>
        <Button 
          size="small" 
          variant={i18n.language === 'hi' ? 'contained' : 'outlined'} 
          onClick={() => i18n.changeLanguage('hi')}
        >
          हिन्दी
        </Button>
        <Button 
          size="small" 
          variant={i18n.language === 'te' ? 'contained' : 'outlined'} 
          onClick={() => i18n.changeLanguage('te')}
        >
          తెలుగు
        </Button>
      </Stack>

      <Typography variant="h2" component="h1" align="center" gutterBottom>
        {t('main_title')}
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        <Button variant="outlined" component={RouterLink} to="/register">{t('create_user')}</Button>
        <Button variant="outlined" component={RouterLink} to="/bookings">{t('view_bookings')}</Button>
        <Button variant="outlined" component={RouterLink} to="/admin">{t('admin_panel')}</Button>
      </Stack>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6 }}>
        {t('available_rooms')}
      </Typography>

      <Grid container spacing={3}>
        {rooms.map(room => (
          <Grid item xs={12} sm={6} md={4} key={room._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {room.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {room.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Capacity: {room.capacity}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={RouterLink} 
                  to={`/book/${room._id}`}
                  fullWidth
                >
                  {t('book_now')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;