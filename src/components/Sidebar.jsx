import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 style={{ marginTop: 0, fontSize: '1.5rem' }}>Hotel System</h2>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/bookings">Bookings</Link>
        <Link to="/guests">Guest Management</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/settings">Settings</Link>
      </nav>
    </div>
  );
};

export default Sidebar;