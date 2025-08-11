import React from 'react'; // Corrected from "report" to "react"
import { Typography, Box, Button, Grid } from '@mui/material';

const Reports = () => {
  return (
    <Box className="app-container">
      <Typography variant="h3" gutterBottom color="primary.main" fontWeight="bold">
        Reports
      </Typography>
      <Typography>Generate financial and occupancy analysis reports.</Typography>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={6}>
          <Button fullWidth variant="contained" color="primary">
            Generate Occupancy Report
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button fullWidth variant="contained" color="secondary">
            Generate Financial Report
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;