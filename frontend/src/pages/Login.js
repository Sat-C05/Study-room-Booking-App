import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import FormContainer from '../components/FormContainer';
import { Typography, Button, Stack, TextField, Alert, Link, Paper, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, formData);
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <FormContainer>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}><LockOutlinedIcon /></Avatar>
        <Typography component="h1" variant="h5">{t('login_title')}</Typography>
        <Stack as="form" onSubmit={handleSubmit} spacing={2} sx={{ mt: 3, width: '100%' }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Username" name="username" value={formData.username} onChange={handleChange} required fullWidth />
          <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required fullWidth />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, mb: 2 }}>{t('login_button')}</Button>
          <Typography align="center" variant="body2">
            <Link component={RouterLink} to="/register" variant="body2">{t('login_no_account')}</Link>
          </Typography>
        </Stack>
      </Paper>
    </FormContainer>
  );
};

export default Login;
