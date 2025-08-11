// client/src/components/Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, styled } from '@mui/material';

const StyledButton = styled(Button)(({ theme }) => ({
  color: '#FFFFFF',
  textTransform: 'none',
  fontFamily: 'Poppins, sans-serif',
  fontSize: '1rem',
  padding: '10px 0',
  display: 'block',
  textAlign: 'left',
  width: '100%',
  '&:hover': {
    color: theme.palette.secondary.main, // #F59E0B
    backgroundColor: 'transparent',
  },
}));

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/access');
  };

  return (
    <div className="sidebar">
      <h2 style={{ marginTop: 0, fontSize: '1.5rem' }}>Hotel System</h2>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/bookings">Bookings</Link>
        <Link to="/guests">Guest Management</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/settings">Settings</Link>
        <StyledButton onClick={handleLogout}>Logout</StyledButton>
      </nav>
    </div>
  );
};

export default Sidebar;