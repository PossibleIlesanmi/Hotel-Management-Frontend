import React, { useState } from 'react';
import { Typography, Box, TextField, Button, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  maxWidth: '400px',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s, color 0.3s',
  boxSizing: 'border-box',
}));

const Access = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side validation: ensure 4-digit number
    if (!/^\d{4}$/.test(code)) {
      setError('Please enter a valid 4-digit code');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/access/validate`,
        { code }
      );
      localStorage.setItem('token', response.data.token);
      setError('');
      navigate('/bookings'); // Redirect to bookings page
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code or server error. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        transition: 'background-color 0.3s',
      }}
    >
      <Box className="app-container" sx={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom color="primary.main" fontWeight="bold">
          Hotel Management Access
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ mb: 4 }}>
          Enter the 4-digit admin code to access the system.
        </Typography>
        <StyledForm onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="4-Digit Code"
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputProps={{
              maxLength: 4,
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
            error={!!error}
            helperText={error}
            sx={{
              '& .MuiInputBase-input': {
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: 'background.paper',
                transition: 'background-color 0.3s, color 0.3s',
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'Poppins, sans-serif',
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'secondary.main',
              },
            }}
          >
            Submit
          </Button>
        </StyledForm>
      </Box>
    </Box>
  );
};

export default Access;