import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import GuestManagement from './pages/GuestManagement';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export const ThemeContext = createContext();

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme({
    palette: {
      primary: { main: '#1E3A8A' },
      secondary: { main: '#F59E0B' },
      success: { main: '#10B981' },
      background: { default: darkMode ? '#1A202C' : '#F9FAFB' },
      text: { primary: darkMode ? '#E2E8F0' : '#1E3A8A' },
    },
    typography: { fontFamily: 'Poppins, sans-serif' },
  });

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <ThemeProvider theme={theme}>
        <div className={darkMode ? 'dark-mode' : ''}>
          <Router>
            <Sidebar />
            <div className="content">
              <Header />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/guests" element={<GuestManagement />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
              <Footer />
            </div>
          </Router>
        </div>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default App;