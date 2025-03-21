import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Tabs, Tab, Button, Chip, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUserRides, getUserPenalties } from '../../services/rideService';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [rides, setRides] = useState([]);
  const [penalties, setPenalties] = useState([]);
  const [stats, setStats] = useState({
    totalRides: 0,
    totalDistance: 0,
    totalDuration: 0,
    avgRating: 0
  });

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const [ridesData, penaltiesData] = await Promise.all([
          getUserRides(),
          getUserPenalties()
        ]);
        
        setRides(ridesData);
        setPenalties(penaltiesData);
        
        // Calculate statistics
        const totalDistance = ridesData.reduce((sum, ride) => sum + (ride.distance || 0), 0);
        const totalDuration = ridesData.reduce((sum, ride) => sum + (ride.durationMinutes || 0), 0);
        const totalRatings = ridesData.reduce((sum, ride) => sum + (ride.rating || 0), 0);
        
        setStats({
          totalRides: ridesData.length,
          totalDistance: totalDistance.toFixed(1),
          totalDuration: Math.round(totalDuration),
          avgRating: ridesData.length ? (totalRatings / ridesData.length).toFixed(1) : 0
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNewRide = () => {
    navigate('/ride-select');
  };

  const getChartData = () => {
    const labels = rides.slice(0, 7).map(ride => ride.date).reverse();
    const distances = rides.slice(0, 7).map(ride => ride.distance).reverse();
    
    return {
      labels,
      datasets: [
        {
          label: 'Distance (km)',
          data: distances,
          fill: false,
          backgroundColor: 'rgb(75, 192, 192)',
          borderColor: 'rgba(75, 192, 192, 0.8)',
        },
      ],
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          My Dashboard
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleNewRide}
        >
          New Ride
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Rides
            </Typography>
            <Typography variant="h4">
              {stats.totalRides}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Distance
            </Typography>
            <Typography variant="h4">
              {stats.totalDistance} km
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Time
            </Typography>
            <Typography variant="h4">
              {stats.totalDuration} min
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Avg. Rating
            </Typography>
            <Typography variant="h4">
              {stats.avgRating}/5
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Line data={getChartData()} />
        </Box>
      </Paper>

      <Paper elevation={3}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Ride History" />
          <Tab label="Penalties" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 ? (
            rides.length > 0 ? (
              rides.map((ride) => (
                <Paper 
                  key={ride.id}
                  elevation={1}
                  sx={{ p: 2, mb: 2 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">
                        {ride.date} • {ride.time}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bike: {ride.bikeModel}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={5}>
                      <Typography variant="body1">
                        From: {ride.source}
                      </Typography>
                      <Typography variant="body1">
                        To: {ride.destination}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                      <Typography variant="subtitle1">
                        ₹{ride.fare}
                      </Typography>
                      <Typography variant="body2">
                        {ride.distance} km • {ride.durationMinutes} min
                      </Typography>
                      <Chip 
                        size="small"
                        label={ride.status} 
                        color={ride.status === 'Completed' ? 'success' : 'primary'}
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
                No ride history available yet.
              </Typography>
            )
          ) : (
            penalties.length > 0 ? (
              penalties.map((penalty) => (
                <Paper 
                  key={penalty.id}
                  elevation={1}
                  sx={{ p: 2, mb: 2 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">
                        {penalty.date}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ride ID: {penalty.rideId}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={5}>
                      <Typography variant="body1">
                        Reason: {penalty.reason}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {penalty.description}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                      <Typography variant="subtitle1">
                        ₹{penalty.amount}
                      </Typography>
                      <Chip 
                        size="small"
                        label={penalty.status} 
                        color={penalty.status === 'Paid' ? 'success' : 'error'}
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
                No penalties recorded.
              </Typography>
            )
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default DashboardPage;
