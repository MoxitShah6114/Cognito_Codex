// src/components/common/Layout.js
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Box, Container, useMediaQuery, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, loading } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    setShowSidebar(isAuthenticated && !isMobile);
  }, [isAuthenticated, isMobile]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {loading && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            height: 3
          }}
        />
      )}
      
      <Header toggleSidebar={toggleSidebar} />
      
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {isAuthenticated && (
          <Sidebar open={showSidebar} onClose={() => setShowSidebar(false)} />
        )}
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${showSidebar ? 240 : 0}px)` },
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Container 
            maxWidth="lg" 
            sx={{ 
              py: { xs: 3, md: 5 },
              px: { xs: 2, sm: 3, md: 4 }
            }}
          >
            <Outlet />
          </Container>
        </Box>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Layout;
