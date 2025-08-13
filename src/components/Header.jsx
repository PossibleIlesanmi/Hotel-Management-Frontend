import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const { sidebarOpen, setSidebarOpen } = useContext(ThemeContext);

  return (
    <div className="header">
      <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} color="inherit">
        <MenuIcon />
      </IconButton>
      {/* Other header content */}
    </div>
  );
};