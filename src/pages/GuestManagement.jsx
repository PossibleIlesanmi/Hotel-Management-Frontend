import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
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

  const fetchData = useCallback(async () => {
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

      setBookings(
        bookingsResponse.data.filter((b) => b.status === 'active')
      );
      setRooms(roomsResponse.data);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err.response || err);
      setError(err.response?.data?.message || 'Server error');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/access');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      const roomsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rooms`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRooms(roomsResponse.data);
    } catch (err) {
      console.error('Update error:', err.response || err);
      setError(err.response?.data?.message || 'Server error');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/access');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditBooking(null);
    setFormData({ guestName: '', roomId: '', checkIn: '', checkOut: '' });
    setError('');
  };

  return (
    <Box
      className="app-container"
      sx={{
        minHeight: '100vh',
        p: { xs: 2, sm: 3 },
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        color="primary.main"
        sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem' }, textAlign: 'center' }}
      >
        Guest Management
      </Typography>
      <Typography
        variant="body1"
        sx={{ textAlign: 'center', mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}
      >
        Manage guest information and profiles.
      </Typography>

      {error && (
        <Typography
          color="error"
          sx={{ mb: 2, textAlign: 'center', fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          {error}
        </Typography>
      )}

      {editBooking && (
        <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              textAlign: 'center',
            }}
          >
            Edit Guest Booking
          </Typography>
          <form onSubmit={handleUpdate}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Guest Name"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="room-select-label">Room</InputLabel>
                  <Select
                    labelId="room-select-label"
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleInputChange}
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
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center',
              }}
            >
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
        </Paper>
      )}

      <Typography
        variant="h5"
        sx={{
          mt: 4,
          fontSize: { xs: '1.25rem', sm: '1.75rem' },
          textAlign: 'center',
        }}
      >
        Guest List
      </Typography>

      {loading ? (
        <Typography sx={{ textAlign: 'center', mt: 2 }}>Loading guests...</Typography>
      ) : bookings.length === 0 ? (
        <Typography sx={{ textAlign: 'center', mt: 2 }}>No guests found.</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            mt: 2,
            borderRadius: 2,
            overflowX: 'auto',
          }}
        >
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
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>
                    {booking.room?.roomNumber || 'Invalid Room'}
                  </TableCell>
                  <TableCell>
                    {new Date(booking.checkIn).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </TableCell>
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
      )}
    </Box>
  );
};

export default GuestManagement;
