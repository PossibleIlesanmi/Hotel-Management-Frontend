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
      console.log('Fetching dashboard with token:', token.substring(0, 5) + '...'); // Log token for debug
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const data = await response.json();
      setDashboardData(data);
      setError(null); // Clear error on success
    } catch (err) {
      console.error('Error fetching dashboard data:', err.message);
      setError(`Failed to load dashboard data. Check server or token. Details: ${err.message}`);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchDashboardData();

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000); // 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  return (
    <Box className="app-container">
      <Typography variant="h3" gutterBottom color="primary.main" fontWeight="bold">
        Dashboard
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        startIcon={<RefreshIcon />}
        onClick={handleRefresh}
        sx={{ mb: 2 }}
      >
        Refresh
      </Button>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" color="secondary.main">
              Room Occupancy
            </Typography>
            <Typography variant="h4">{dashboardData.occupancyRate}</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" color="secondary.main">
              Total Bookings
            </Typography>
            <Typography variant="h4">{dashboardData.totalBookings}</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" color="secondary.main">
              Revenue
            </Typography>
            <Typography variant="h4">{dashboardData.revenue}</Typography>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;