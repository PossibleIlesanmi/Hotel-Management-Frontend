import React, { useState } from 'react';
import { Typography, Box, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const navigate = useNavigate();
  const [loadingReport, setLoadingReport] = useState(null); // Track which report is downloading
  const token = localStorage.getItem('token');
  const API_BASE = `${import.meta.env.VITE_API_URL}/api/reports`;

  const downloadFile = async (endpoint, filename) => {
    if (!token) {
      navigate('/access');
      return;
    }

    setLoadingReport(filename);
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          navigate('/access');
          return;
        }
        const text = await res.text();
        throw new Error(
          `Network error: ${res.status}. Server says: ${text.substring(0, 100)}`
        );
      }

      const contentType = res.headers.get('Content-Type');
      if (!contentType.includes('pdf')) {
        const text = await res.text();
        throw new Error(
          `Expected PDF, got ${contentType}. Response: ${text.substring(0, 100)}`
        );
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err.message);
      alert(`Failed to download ${filename}: ${err.message}`);
    } finally {
      setLoadingReport(null);
    }
  };

  return (
    <Box className="app-container">
      <Typography
        variant="h3"
        gutterBottom
        color="primary.main"
        fontWeight="bold"
      >
        Reports
      </Typography>
      <Typography>
        Generate financial and occupancy analysis reports.
      </Typography>

      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() =>
              downloadFile('occupancy/pdf', 'occupancy_report.pdf')
            }
            disabled={loadingReport === 'occupancy_report.pdf'}
          >
            {loadingReport === 'occupancy_report.pdf'
              ? 'Downloading...'
              : 'Download Occupancy Report (PDF)'}
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() =>
              downloadFile('financial/pdf', 'financial_report.pdf')
            }
            disabled={loadingReport === 'financial_report.pdf'}
          >
            {loadingReport === 'financial_report.pdf'
              ? 'Downloading...'
              : 'Download Financial Report (PDF)'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
