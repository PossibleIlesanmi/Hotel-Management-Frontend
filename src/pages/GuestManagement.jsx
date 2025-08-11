import React from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from '@mui/material';

const GuestManagement = () => {
  return (
    <Box className="app-container">
      <Typography variant="h3" gutterBottom color="primary.main" fontWeight="bold">
        Guest Management
      </Typography>
      <Typography>Manage guest information and profiles.</Typography>
      <Paper style={{ marginTop: '20px', width: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Check-In</TableCell>
              <TableCell>Check-Out</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>101</TableCell>
              <TableCell>2025-08-11</TableCell>
              <TableCell>2025-08-13</TableCell>
              <TableCell>
                <Button variant="outlined" color="primary" size="small">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default GuestManagement;  