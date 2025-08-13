import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Button, TextField, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel, Modal, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({ guestName: '', roomId: '', checkIn: '', checkOut: '' });
  const [roomFormData, setRoomFormData] = useState({ roomNumber: '', type: 'single', price: '', status: 'available' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // 🔹 Centralized API call with token
  const apiCall = async (method, url, data = null) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/access');
      return null;
    }
    try {
      const res = await axios({
        method,
        url: `${API_URL}${url}`,
        data,
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/access');
      }
      throw new Error(err.response?.data?.message || 'Request failed');
    }
  };

  // 🔹 Load data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsData, roomsData] = await Promise.all([
        apiCall('get', '/api/bookings'),
        apiCall('get', '/api/rooms')
      ]);
      setBookings(bookingsData || []);
      setRooms(roomsData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleRoomInputChange = (e) => setRoomFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // 🔹 Create booking (optimistic update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Create temp booking for instant UI
    const tempId = Date.now();
    const newBooking = {
      _id: tempId,
      guestName: formData.guestName,
      room: rooms.find(r => r._id === formData.roomId) || {},
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      status: 'pending'
    };
    setBookings(prev => [...prev, newBooking]);
    setFormData({ guestName: '', roomId: '', checkIn: '', checkOut: '' });

    try {
      const savedBooking = await apiCall('post', '/api/bookings', formData);
      if (savedBooking) {
        setBookings(prev => prev.map(b => b._id === tempId ? savedBooking : b));
      }
    } catch (err) {
      setBookings(prev => prev.filter(b => b._id !== tempId)); // Rollback if fail
      setError(err.message);
    }
  };

  // 🔹 Cancel booking (optimistic update)
  const handleCancel = async (id) => {
    setError('');
    const originalBookings = [...bookings];
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));

    try {
      const updatedBooking = await apiCall('put', `/api/bookings/${id}/cancel`);
      if (updatedBooking) {
        setBookings(prev => prev.map(b => b._id === id ? updatedBooking : b));
      }
    } catch (err) {
      setBookings(originalBookings); // Rollback
      setError(err.message);
    }
  };

  // 🔹 Add room (optimistic update)
  const handleAddRoom = async (e) => {
    e.preventDefault();
    setError('');

    const tempId = Date.now();
    const newRoom = { _id: tempId, ...roomFormData };
    setRooms(prev => [...prev, newRoom]);
    setRoomFormData({ roomNumber: '', type: 'single', price: '', status: 'available' });
    setOpenModal(false);

    try {
      const savedRoom = await apiCall('post', '/api/rooms', roomFormData);
      if (savedRoom) {
        setRooms(prev => prev.map(r => r._id === tempId ? savedRoom : r));
      }
    } catch (err) {
      setRooms(prev => prev.filter(r => r._id !== tempId)); // Rollback
      setError(err.message);
    }
  };

  return (
    <Box className="content">
      <Box className="app-container">
        <Typography variant="h3" gutterBottom>Bookings Management</Typography>
        <Typography sx={{ mb: 3 }}>Manage reservations, cancellations, and rooms.</Typography>

        <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ mb: 3 }}>
          Add Room
        </Button>

        {/* Booking Form */}
        <Box className="card-container" sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Create New Booking</Typography>
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Guest Name" name="guestName" value={formData.guestName} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Room</InputLabel>
                  <Select name="roomId" value={formData.roomId} onChange={handleInputChange}>
                    <MenuItem value="" disabled>Select a room</MenuItem>
                    {rooms.map(room => (
                      <MenuItem key={room._id} value={room._id}>
                        {room.roomNumber} ({room.type}, ${room.price}/night)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="date" label="Check-In" name="checkIn" value={formData.checkIn} onChange={handleInputChange} InputLabelProps={{ shrink: true }} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="date" label="Check-Out" name="checkOut" value={formData.checkOut} onChange={handleInputChange} InputLabelProps={{ shrink: true }} required />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" disabled={!formData.roomId} sx={{ mt: 3 }}>
              Book Room
            </Button>
          </form>
        </Box>

        {/* Booking List */}
        <Box className="card-container">
          <Typography variant="h5" sx={{ mb: 2 }}>Booking List</Typography>
          {bookings.length === 0 ? (
            <Typography>No bookings yet.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Guest Name</TableCell>
                    <TableCell>Room Number</TableCell>
                    <TableCell>Room Type</TableCell>
                    <TableCell>Check-In</TableCell>
                    <TableCell>Check-Out</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map(booking => (
                    <TableRow key={booking._id}>
                      <TableCell>{booking.guestName}</TableCell>
                      <TableCell>{booking.room?.roomNumber || 'Invalid Room'}</TableCell>
                      <TableCell>{booking.room?.type || 'N/A'}</TableCell>
                      <TableCell>{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.checkOut).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.status}</TableCell>
                      <TableCell>
                        {booking.status !== 'cancelled' && (
                          <Button variant="outlined" onClick={() => handleCancel(booking._id)}>
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        {/* Add Room Modal */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
          }}>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogContent>
              {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
              <form onSubmit={handleAddRoom}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Room Number" name="roomNumber" value={roomFormData.roomNumber} onChange={handleRoomInputChange} required />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Type</InputLabel>
                      <Select name="type" value={roomFormData.type} onChange={handleRoomInputChange}>
                        <MenuItem value="single">Single</MenuItem>
                        <MenuItem value="double">Double</MenuItem>
                        <MenuItem value="suite">Suite</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Price per Night ($)" name="price" type="number" value={roomFormData.price} onChange={handleRoomInputChange} required />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Status</InputLabel>
                      <Select name="status" value={roomFormData.status} onChange={handleRoomInputChange}>
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="occupied">Occupied</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <DialogActions sx={{ mt: 2 }}>
                  <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                  <Button type="submit" variant="contained">Add Room</Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Bookings;
