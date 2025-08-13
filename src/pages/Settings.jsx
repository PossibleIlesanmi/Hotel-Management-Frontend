import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Button,
  Modal,
  Paper,
  Grid,
  Link,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalContent = styled(Paper)(({ theme }) => ({
  width: '90%',
  maxWidth: 500,
  padding: theme.spacing(3),
  backgroundColor:
    theme.palette.mode === 'dark' ? '#2D3748' : theme.palette.background.paper,
  borderRadius: 8,
  boxShadow: theme.shadows[5],
}));

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    document.body.classList.toggle('dark-mode', savedMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.body.classList.toggle('dark-mode', newMode);
  };

  return (
    <Box className="app-container" sx={{ p: 2 }}>
      <Typography variant="h3" gutterBottom color="primary" fontWeight="bold">
        Settings
      </Typography>

      <Typography paragraph color="text.primary">
        Configure application preferences.
      </Typography>

      <FormControlLabel
        control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
        label="Dark Mode"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
        sx={{ mt: 2 }}
      >
        About Developer
      </Button>

      <StyledModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="developer-details-title"
      >
        <ModalContent>
          <Typography
            id="developer-details-title"
            variant="h5"
            gutterBottom
            color="primary"
            fontWeight="bold"
          >
            Developer Details
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography>
                <strong>Name:</strong> Ilesanmi Gbenga Possible
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography>
                <strong>Role:</strong> Software Developer - Full Stack Developer
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography>
                <strong>Portfolio:</strong>{' '}
                <Link
                  href="https://github.com/PossibleIlesanmi"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                  underline="hover"
                >
                  github.com/PossibleIlesanmi
                </Link>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography>
                <strong>Latest Project:</strong> MyFund Enterprise Mobile App
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography>
                <strong>Socials:</strong>
              </Typography>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>
                  <Link
                    href="https://www.linkedin.com/in/ilesanmi-gbenga-possible-238107241"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="primary"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://web.facebook.com/profile.php?id=100071514043019"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="primary"
                  >
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/PossibleIlesanmi"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="primary"
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </Grid>

            <Grid item xs={12}>
              <Typography>
                <strong>Professional Skills:</strong>
              </Typography>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>✔ Web Design (HTML, CSS, JavaScript, PHP)</li>
                <li>✔ Mobile App Dev. (React Native + Python, Java)</li>
                <li>✔ Desktop App (Java)</li>
              </ul>
            </Grid>

            <Grid item xs={12}>
              <Typography>
                <strong>Personal Skills:</strong>
              </Typography>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>✔ Leadership (Communication, Follow-up)</li>
              </ul>
            </Grid>

            <Grid item xs={12}>
              <Typography>
                <strong>Professional Experience:</strong>
              </Typography>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>Fintech — 2+ years</li>
                <li>Product/App Design — 6 years</li>
                <li>Product/App Development — 5 years</li>
              </ul>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenModal(false)}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </ModalContent>
      </StyledModal>
    </Box>
  );
};

export default Settings;
