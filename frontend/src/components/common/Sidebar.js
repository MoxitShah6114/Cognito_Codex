// src/components/common/Sidebar.js
import React from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  useMediaQuery,
  useTheme,
  Avatar,
  Typography
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ElectricBikeIcon from '@mui/icons-material/ElectricBike';
import HistoryIcon from '@mui/icons-material/History';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const drawerWidth = 240;

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'New Ride', icon: <ElectricBikeIcon />, path: '/ride-select' },
    { text: 'Ride History', icon: <HistoryIcon />, path: '/history' },
    { text: 'Payments', icon: <PaymentIcon />, path: '/payments' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Help & Support', icon: <HelpIcon />, path: '/help' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ text: 'Admin Panel', icon: <AdminPanelSettingsIcon />, path: '/admin' });
  }

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          src={user?.avatar || ''}
          alt={user?.name || 'User'}
          sx={{ 
            width: 80, 
            height: 80,
            mb: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        />
        <Typography variant="h6" noWrap component="div" align="center">
          {user?.name || 'User'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {user?.email || 'user@example.com'}
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ flexGrow: 1, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              sx={{
                borderRadius: 2,
                py: 1.5,
                bgcolor: location.pathname === item.path ? 'primary.light' : 'transparent',
                color: location.pathname === item.path ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  bgcolor: location.pathname === item.path ? 'primary.main' : 'action.hover',
                },
              }}
              onClick={() => handleNavigate(item.path)}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'primary.contrastText' : 'inherit',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          EV Bike Rental © {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: open ? drawerWidth : 0 }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
