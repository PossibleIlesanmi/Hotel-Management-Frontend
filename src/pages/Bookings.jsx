import React from 'react';
import { Typography, Box, Button, TextField, Grid } from '@mui/material';
import { styled } from '@mui/system';

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  maxWidth: '600px',
  marginTop: theme.spacing(2),
}));

const Bookings = () => {
  return (
    <Box className="app-container">
      <Typography variant="h3" gutterBottom color="primary.main" fontWeight="bold">
        Bookings
      </Typography>
      <Typography>Manage room reservations and cancellations.</Typography>
      <StyledForm>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Guest Name" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Room Number" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Check-In" variant="outlined" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Check-Out" variant="outlined" InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Book Room
        </Button>
        <Button variant="outlined" color="secondary" style={{ marginTop: '10px' }}>
          Cancel Booking
        </Button>
      </StyledForm>
    </Box>
  );
};

export default Bookings;