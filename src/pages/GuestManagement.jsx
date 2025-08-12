import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, TextField, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GuestManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [editBooking, setEditBooking] = useState(null);
  const [formData, setFormData] = useState({
    guestName: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/access');
          return;
        }
        setLoading(true);

        const [bookingsResponse, roomsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/rooms`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Filter only active bookings (match backend status)
        setBookings(bookingsResponse.data.filter((booking) => booking.status === 'active'));
        setRooms(roomsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err.response || err);
        setError(err.response?.data?.message || 'Server error');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/access');
        }
      }
    };
    fetchData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (booking) => {
    setEditBooking(booking);
    setFormData({
      guestName: booking.guestName,
      roomId: booking.room?._id || '',
      checkIn: booking.checkIn.split('T')[0],
      checkOut: booking.checkOut.split('T')[0],
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/access');
        return;
      }
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/bookings/${editBooking._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings((prev) =>
        prev.map((b) => (b._id === editBooking._id ? response.data : b))
      );
      setEditBooking(null);
      setFormData({ guestName: '', roomId: '', checkIn: '', checkOut: '' });
      const roomsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(roomsResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Update error:', err.response || err);
      setError(err.response?.data?.message || 'Server error');
      setLoading(false);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/access');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditBooking(null);
    setFormData({ guestName: '', roomId: '', checkIn: '', checkOut: '' });
    setError('');
  };

  return (
    <Box className="content">
      <Box className="app-container">
        <Typography className="page-title">Guest Management</Typography>
        <Typography className="page-subtitle">Manage guest information and profiles.</Typography>
        {error && (
          <Typography color="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Typography>
        )}
        {editBooking && (
          <Box className="card-container">
            <Typography variant="h6" sx={{ mb: 2 }}>Edit Guest Booking</Typography>
            <form className="booking-form" onSubmit={handleUpdate}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Guest Name"
                    variant="outlined"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="room-select-label">Room</InputLabel>
                    <Select
                      labelId="room-select-label"
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleInputChange}
                      label="Room"
                    >
                      <MenuItem value="" disabled>
                        Select a room
                      </MenuItem>
                      {rooms.map((room) => (
                        <MenuItem key={room._id} value={room._id}>
                          {room.roomNumber} ({room.type}, ${room.price}/night)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Check-In"
                    variant="outlined"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Check-Out"
                    variant="outlined"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || !formData.roomId}
                >
                  {loading ? 'Updating...' : 'Update Booking'}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        )}
        <Typography className="page-title" sx={{ mt: 4 }}>Guest List</Typography>
        {loading ? (
          <Typography>Loading guests...</Typography>
        ) : bookings.length === 0 ? (
          <Typography>No guests found.</Typography>
        ) : (
          <Box className="card-container">
            <TableContainer className="table-container" component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Room</TableCell>
                    <TableCell>Check-In</TableCell> {/* Fixed typo here */}
                    <TableCell>Check-Out</TableCell> {/* Fixed typo here */}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{booking.guestName}</TableCell>
                      <TableCell>{booking.room?.roomNumber || 'Invalid Room'}</TableCell>
                      <TableCell>{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.checkOut).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(booking)}
                          disabled={loading}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GuestManagement;