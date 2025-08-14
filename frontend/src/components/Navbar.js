import React, { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import { AppBar, Toolbar, Typography, Button, Stack, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    handleClose();
  };

  const homeLink = token ? '/dashboard' : '/';

  return (
    <AppBar position="static" sx={{ bgcolor: 'navbar.main', mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to={homeLink} sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          {t('main_title')}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {user && (
            <>
              <Typography sx={{ mr: 1 }}>
                {t('navbar_welcome', { name: user.username })}
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', mr: 1 }} />
            </>
          )}
          {token && (
            <>
              <Button color="inherit" component={RouterLink} to="/bookings">{t('navbar_calendar')}</Button>
              {user?.role === 'admin' && (
                <>
                  <Button color="inherit" component={RouterLink} to="/admin">{t('navbar_admin')}</Button>
                  <Button color="inherit" component={RouterLink} to="/reports">{t('navbar_reports')}</Button>
                </>
              )}
            </>
          )}
          {token ? (
            <Button color="inherit" onClick={handleLogout}>{t('navbar_logout')}</Button>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">{t('navbar_login')}</Button>
              <Button color="inherit" component={RouterLink} to="/register">{t('navbar_register')}</Button>
            </>
          )}
          
          <IconButton color="inherit" onClick={handleMenu}>
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
            <MenuItem onClick={() => handleLanguageChange('es')}>Español</MenuItem>
            <MenuItem onClick={() => handleLanguageChange('hi')}>हिन्दी</MenuItem>
            <MenuItem onClick={() => handleLanguageChange('te')}>తెలుగు</MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
