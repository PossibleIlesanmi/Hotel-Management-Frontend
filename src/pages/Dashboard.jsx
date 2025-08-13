import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Grid, Paper, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import RefreshIcon from '@mui/icons-material/Refresh';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'background-color 0.3s, color 0.3s',
}));

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    occupancyRate: '0% | 100% Available',
    totalBookings: '0 Today',
    revenue: '$0.00 Today',
  });
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      console.log(
        'Fetching dashboard with token:',
        token.substring(0, 5) + '...'
      );

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err.message);
      setError(
        `Failed to load dashboard data. Check server or token. Details: ${err.message}`
      );
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  return (
    <Box
      className="app-container"
      sx={{
        minHeight: '100vh',
        p: { xs: 2, sm: 3 },
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        color="primary.main"
        fontWeight="bold"
        sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem' }, textAlign: 'center' }}
      >
        Dashboard
      </Typography>

      {error && (
        <Typography
          color="error"
          sx={{ mb: 2, textAlign: 'center', fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        startIcon={<RefreshIcon />}
        onClick={handleRefresh}
        sx={{
          alignSelf: 'center',
          mb: 2,
          width: { xs: '100%', sm: 'auto' },
          fontWeight: 'bold',
        }}
      >
        Refresh
      </Button>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography
              variant="h6"
              color="secondary.main"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Room Occupancy
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 'bold' }}
            >
              {dashboardData.occupancyRate}
            </Typography>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography
              variant="h6"
              color="secondary.main"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Total Bookings
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 'bold' }}
            >
              {dashboardData.totalBookings}
            </Typography>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography
              variant="h6"
              color="secondary.main"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Revenue
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 'bold' }}
            >
              {dashboardData.revenue}
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
