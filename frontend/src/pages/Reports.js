import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      const config = { headers: { 'x-auth-token': token } };
      axios.get(`${process.env.REACT_APP_API_URL}/api/reports/room-usage`, config)
        .then(res => {
          const data = res.data;
          if (data && data.length > 0) {
            setChartData({
              labels: data.map(item => item.roomName || 'Unnamed Room'),
              datasets: [
                {
                  label: 'Number of Bookings',
                  data: data.map(item => item.count),
                  backgroundColor: 'rgba(25, 118, 210, 0.6)',
                  borderColor: 'rgba(25, 118, 210, 1)',
                  borderWidth: 1,
                },
              ],
            });
          } else {
            setChartData(null);
          }
          setIsLoading(false);
        })
        .catch(() => {
          setError('Could not fetch report data.');
          setIsLoading(false);
        });
    }
  }, [token]);

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        {t('reports_title')}
      </Typography>
      <Box sx={{ height: '60vh' }}>
        {chartData ? (
          <Bar data={chartData} options={{ maintainAspectRatio: false, indexAxis: 'y' }} />
        ) : (
          <Typography align="center" sx={{ mt: 4 }}>No booking data available to generate a report.</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default Reports;
