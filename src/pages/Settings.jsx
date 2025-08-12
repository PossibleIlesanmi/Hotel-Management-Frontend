import React, { useState } from 'react';
import { Typography, Box, Switch, FormControlLabel, Button, Modal, Paper, Grid } from '@mui/material';
import { styled } from '@mui/system';

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Paper)(({ theme }) => ({
  width: '90%',
  maxWidth: 500,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.mode === 'dark' ? '#2D3748' : '#FFFFFF',
  borderRadius: 8,
  boxShadow: theme.shadows[5],
}));

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box className="app-container" sx={{ padding: 2 }}>
      <Typography variant="h3" gutterBottom color="#1E3A8A" fontWeight="bold">
        Settings
      </Typography>
      <Typography paragraph color="#1E3A8A">
        Configure application preferences.
      </Typography>
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
        label="Dark Mode"
      />
      <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ mt: 2 }}>
        About Developer
      </Button>
      <StyledModal open={openModal} onClose={handleCloseModal}>
        <ModalContent>
          <Typography variant="h5" gutterBottom color="#1E3A8A" fontWeight="bold">
            Developer Details
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="body1" color="text.primary">
                <strong>Name:</strong> Ilesanmi Gbenga Possible
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="text.primary">
                <strong>Role:</strong> Software Developer - Full Stack Developer
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="text.primary">
                <strong>Portfolio:</strong>{' '}
                <a href="https://github.com/PossibleIlesanmi" target="_blank" rel="noopener noreferrer" style={{ color: '#1E3A8A' }}>
                  https://github.com/PossibleIlesanmi
                </a>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="text.primary">
                <strong>Latest Project:</strong> MyFund Enterprise Mobile App
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="text.primary">
                <strong>Socials:</strong>
              </Typography>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>
                  <a href="https://www.linkedin.com/in/ilesanmi-gbenga-possible-238107241" target="_blank" rel="noopener noreferrer" style={{ color: '#1E3A8A' }}>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://web.facebook.com/profile.php?id=100071514043019" target="_blank" rel="noopener noreferrer" style={{ color: '#1E3A8A' }}>
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://github.com/PossibleIlesanmi" target="_blank" rel="noopener noreferrer" style={{ color: '#1E3A8A' }}>
                    GitHub
                  </a>
                </li>
              </ul>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="text.primary">
                <strong>Professional Skills:</strong>
              </Typography>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>✔ Web Design (HTML, CSS, JavaScript, PHP)</li>
                <li>✔ Mobile App Dev. (React Native + Python, Java)</li>
                <li>✔ Desktop App (Java)</li>
              </ul>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="text.primary">
                <strong>Personal Skills:</strong>
              </Typography>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>✔ Leadership (Communication, Follow-up)</li>
              </ul>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="text.primary">
                <strong>Professional Experience:</strong>
              </Typography>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>Fintech — 2+ years</li>
                <li>Product/App Design — 6 years</li>
                <li>Product/App Development — 5 years</li>
              </ul>
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" onClick={handleCloseModal} sx={{ mt: 2 }}>
            Close
          </Button>
        </ModalContent>
      </StyledModal>
    </Box>
  );
};

export default Settings;