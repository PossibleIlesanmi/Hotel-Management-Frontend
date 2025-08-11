import React, { useContext } from 'react';
import { Typography, Box, Button, Grid } from '@mui/material';
import { ThemeContext } from '../App';

const Settings = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const handleCaseStudyToggle = () => {
    alert('Case Study Mode Toggled');
  };

  return (
    <Box className="app-container">
      <Typography variant="h3" gutterBottom color="primary.main" fontWeight="bold">
        Settings
      </Typography>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={4}>
          <Button fullWidth variant="contained" color="primary" onClick={() => alert('Developer Info: Ilesanmi Gbenga Possible @PossibleDeveloper')}>
            Developer
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button fullWidth variant="contained" color="secondary" onClick={() => alert('Account Settings')}>
            Account Settings
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button fullWidth variant="contained" color={darkMode ? 'secondary' : 'primary'} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button fullWidth variant="contained" color="primary" onClick={handleCaseStudyToggle}>
            Case Study Mode
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;