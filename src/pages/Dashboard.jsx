import React from 'react';
import { Typography, Grid, Paper, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const Dashboard = () => {
  return (
    <Box className="app-container">
      <Typography variant="h3" gutterBottom color="primary.main" fontWeight="bold">
        Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" color="secondary.main">
              Room Occupancy
            </Typography>
            <Typography variant="h4">60% | 40% Available</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" color="secondary.main">
              Total Bookings
            </Typography>
            <Typography variant="h4">15 Today</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" color="secondary.main">
              Revenue
            </Typography>
            <Typography variant="h4">$5,000 Today</Typography>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;