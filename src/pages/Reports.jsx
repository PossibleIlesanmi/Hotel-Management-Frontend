import React, { useState } from 'react';
import { Typography, Box, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Reports = () => {
  const token = localStorage.getItem('token');
  const API_BASE = `${import.meta.env.VITE_API_URL}/api/reports`; // Updated to backend port 5000

  const downloadFile = async (endpoint, filename) => {
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Authentication failed. Please log in again.');
        }
        const text = await res.text();
        throw new Error(`Network response was not ok: ${res.status}. Response: ${text.substring(0, 100)}`);
      }

      const contentType = res.headers.get('Content-Type');
      if (contentType !== 'application/pdf') {
        const text = await res.text();
        throw new Error(`Expected PDF, but received ${contentType}. Response: ${text.substring(0, 100)}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err.message);
      alert(`Failed to download ${filename}: ${err.message}`);
    }
  };

  return (
    <Box className="app-container">
      <Typography variant="h3" gutterBottom color="primary.main" fontWeight="bold">
        Reports
      </Typography>
      <Typography>Generate financial and occupancy analysis reports.</Typography>

      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => downloadFile('occupancy/pdf', 'occupancy_report.pdf')}
          >
            Download Occupancy Report (PDF)
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => downloadFile('financial/pdf', 'financial_report.pdf')}
          >
            Download Financial Report (PDF)
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;