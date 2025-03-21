// src/components/common/Header.js
import React, { useState } from 'react';
// src/components/common/Header.js - Add Divider to your imports
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar, 
  Badge, 
  useMediaQuery,
  Tooltip,
  Divider   // Add this import
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ElectricBikeIcon from '@mui/icons-material/ElectricBike';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

// Animation for logo
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const Header = ({ toggleSidebar }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate('/');
  };

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper', 
        borderBottom: '1px solid', 
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated && (
            <IconButton
              color="primary"
              onClick={toggleSidebar}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none',
              color: 'primary.main',
            }}
          >
            <ElectricBikeIcon 
              sx={{ 
                mr: 1, 
                fontSize: 36, 
                animation: `${pulse} 2s infinite ease-in-out`, 
                color: 'primary.main'
              }} 
            />
            
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                display: { xs: isMobile ? 'none' : 'block', md: 'block' },
                fontWeight: 700, 
                color: 'text.primary',
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              EV Bike Rental
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Tooltip title="Theme">
                <IconButton color="primary" sx={{ ml: { xs: 0.5, md: 1 } }}>
                  <LightModeIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Notifications">
                <IconButton color="primary" onClick={handleNotificationOpen} sx={{ ml: { xs: 0.5, md: 1 } }}>
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationClose}
                PaperProps={{
                  elevation: 3,
                  sx: { width: 320, maxHeight: 400, mt: 1.5, borderRadius: 2 }
                }}
              >
                <MenuItem onClick={handleNotificationClose}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2">New Promotion</Typography>
                    <Typography variant="body2" color="text.secondary">
                      50% off on weekend rides! Book now.
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2">Ride Completed</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your ride was completed successfully.
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2">Account Update</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your profile was updated successfully.
                    </Typography>
                  </Box>
                </MenuItem>
              </Menu>
              
              <Box sx={{ ml: { xs: 0.5, md: 2 } }}>
                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Avatar
                    alt={user?.name || 'User'}
                    src={user?.avatar || ''}
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      border: '2px solid',
                      borderColor: 'primary.main',
                    }}
                  />
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: { minWidth: 180, mt: 1.5, borderRadius: 2 }
                  }}
                >
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>Profile</MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }}>Dashboard</MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>Settings</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <>
              <Button 
                color="primary" 
                component={Link} 
                to="/login" 
                sx={{ 
                  mr: 1,
                  borderRadius: '50px',
                  px: 3,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(33, 150, 243, 0.25)',
                  }
                }}
              >
                Login
              </Button>
              
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/signup"
                sx={{ 
                  borderRadius: '50px',
                  px: 3,
                  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)',
                  }
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
