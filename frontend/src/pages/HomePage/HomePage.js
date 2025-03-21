import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, Paper } from '@mui/material';
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
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 14 },
          position: 'relative',
          bgcolor: 'background.paper',
          borderRadius: { xs: 0, md: 4 },
          mb: 8,
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ fontWeight: 700, mb: 2 }}
              >
                Eco-Friendly Electric Bike Rentals
              </Typography>
              
              <Typography variant="h5" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
                Convenient, sustainable, and affordable transportation for your urban adventures.
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                onClick={handleGetStarted}
                startIcon={<ElectricBikeIcon />}
                sx={{ mr: 2, py: 1.5, px: 4 }}
              >
                Get Started
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary" 
                size="large"
                sx={{ py: 1.5, px: 4 }}
              >
                Learn More
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  bgcolor: 'primary.light', 
                  color: 'white',
                  borderRadius: 4,
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h4" align="center">
                  EV Bike Rental
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Why Choose Our EV Bikes?
        </Typography>
        
        <Grid container spacing={4}>
          {[
            { title: 'Fast & Convenient', description: 'Book a bike in seconds and start your journey right away.' },
            { title: 'Eco-Friendly', description: 'Zero emissions. Reduce your carbon footprint while enjoying a smooth, quiet ride.' },
            { title: 'Affordable', description: 'Pay only for what you use with transparent pricing and no hidden charges.' },
            { title: 'Secure & Safe', description: 'Verified riders, regular maintenance, and real-time tracking for your safety.' }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', p: 3, borderRadius: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* CTA Section */}
      <Container maxWidth="md" sx={{ mb: 10 }}>
        <Card 
          sx={{ 
            borderRadius: 4,
            bgcolor: 'primary.main',
            color: 'white',
            boxShadow: '0 20px 40px rgba(33, 150, 243, 0.3)',
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
              Ready to Go Green?
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of happy riders and start your eco-friendly journey today.
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                py: 1.5,
                px: 5,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              Get Started Now
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default HomePage;
