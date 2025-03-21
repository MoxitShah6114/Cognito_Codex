import React from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ElectricBikeIcon from '@mui/icons-material/ElectricBike';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/ride-select');
    } else {
      navigate('/signup');
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h3" component="h1" gutterBottom>
            Electric Bike Rentals
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Convenient, eco-friendly, and affordable transportation for your city commute.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={handleGetStarted}
            startIcon={<ElectricBikeIcon />}
            sx={{ mt: 2 }}
          >
            Get Started
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <img 
            src="https://via.placeholder.com/600x400?text=EV+Bike+Rental" 
            alt="EV Bike" 
            style={{ maxWidth: '100%', borderRadius: '8px' }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mt: 6 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Easy to Use
            </Typography>
            <Typography variant="body1">
              Simply sign up, verify your documents through DigiLocker, select your bike, and start riding!
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Eco-Friendly
            </Typography>
            <Typography variant="body1">
              Our electric bikes produce zero emissions, helping to reduce air pollution and your carbon footprint.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Affordable
            </Typography>
            <Typography variant="body1">
              Pay only for what you use with our transparent pricing model - no hidden charges.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;