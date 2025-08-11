import React, { useContext } from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import { ThemeContext } from '../App';

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const handleToggle = (event) => {
    setDarkMode(event.target.checked);
  };

  return (
    <FormControlLabel
      control={<Switch checked={darkMode} onChange={handleToggle} />}
      label="Dark Mode"
    />
  );
};

export default ThemeToggle;