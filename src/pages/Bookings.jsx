import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, TextField, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel, Modal, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    guestName: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false); // State for modal
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    type: 'single', // Default value for type
    price: '',
    status: 'available',
  });
  const navigate = useNavigate();

  // Fetch bookings and rooms on mount
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
        setBookings(bookingsResponse.data);
        setRooms(roomsResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/access');
        }
      }
    };
    fetchData();
  }, [navigate]);

  // Handle booking form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle booking form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/access');
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings((prev) => [...prev, response.data]);
      setFormData({ guestName: '', roomId: '', checkIn: '', checkOut: '' });
      const roomsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(roomsResponse.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      setLoading(false);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/access');
      }
    }
  };

  // Handle booking cancellation
  const handleCancel = async (id) => {
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/access');
        return;
      }
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings((prev) =>
        prev.map((booking) => (booking._id === id ? response.data : booking))
      );
      const roomsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(roomsResponse.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
      setLoading(false);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/access');
      }
    }
  };

  // Handle room form input changes
  const handleRoomInputChange = (e) => {
    const { name, value } = e.target;
    setRoomFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle room form submission
  const handleAddRoom = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/access');
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rooms`,
        roomFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRooms((prev) => [...prev, response.data]);
      setRoomFormData({ roomNumber: '', type: 'single', price: '', status: 'available' });
      setOpenModal(false); // Close modal after success
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add room');
      setLoading(false);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/access');
      }
    }
  };

  // Toggle modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box className="content">
      <Box className="app-container">
        <Typography variant="h3" className="page-title" gutterBottom>
          Bookings Management
        </Typography>
        <Typography className="page-subtitle">
          Manage room reservations, cancellations, and add new rooms.
        </Typography>

        {/* Add Room Button */}
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ mb: 2 }}
          >
            Add Room
          </Button>
        </Box>

        {/* Booking Form Card */}
        <Box className="card-container">
          <Typography variant="h5" sx={{ mb: 2 }}>
            Create New Booking
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <form className="booking-form" onSubmit={handleSubmit}>
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
                  <InputLabel>Room</InputLabel>
                  <Select
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !formData.roomId}
              sx={{ mt: 3, width: 'fit-content' }}
            >
              {loading ? 'Booking...' : 'Book Room'}
            </Button>
          </form>
        </Box>

        {/* Booking List Card */}
        <Box className="card-container" sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Booking List
          </Typography>
          {loading ? (
            <Typography>Loading bookings...</Typography>
          ) : bookings.length === 0 ? (
            <Typography>No bookings found.</Typography>
          ) : (
            <TableContainer component={Paper} className="table-container">
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
                  {bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{booking.guestName}</TableCell>
                      <TableCell>{booking.room?.roomNumber || 'Invalid Room'}</TableCell>
                      <TableCell>{booking.room?.type || 'N/A'}</TableCell>
                      <TableCell>{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.checkOut).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.status}</TableCell>
                      <TableCell>
                        {booking.status !== 'cancelled' && (
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleCancel(booking._id)}
                            disabled={loading}
                          >
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
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <DialogTitle>Add New Room</DialogTitle>
            <DialogContent>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <form onSubmit={handleAddRoom}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Room Number"
                      variant="outlined"
                      name="roomNumber"
                      value={roomFormData.roomNumber}
                      onChange={handleRoomInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel>Type</InputLabel>
                      <Select
                        name="type"
                        value={roomFormData.type}
                        onChange={handleRoomInputChange}
                        label="Type"
                      >
                        <MenuItem value="single">Single</MenuItem>
                        <MenuItem value="double">Double</MenuItem>
                        <MenuItem value="suite">Suite</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Price per Night ($)"
                      variant="outlined"
                      name="price"
                      type="number"
                      value={roomFormData.price}
                      onChange={handleRoomInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={roomFormData.status}
                        onChange={handleRoomInputChange}
                        label="Status"
                      >
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="occupied">Occupied</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <DialogActions sx={{ mt: 2 }}>
                  <Button onClick={handleCloseModal} disabled={loading}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Room'}
                  </Button>
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