import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, TextField, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MapView from '../../components/map/MapView';
import { getAvailableBikes } from '../../services/rideService';
import { geocodeAddress, calculateRoute } from '../../services/mapService';
import { useAuth } from '../../context/AuthContext';

const RideSelectPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [availableBikes, setAvailableBikes] = useState([]);
  const [selectedBike, setSelectedBike] = useState(null);
  const [sourceLocation, setSourceLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [estimatedCost, setEstimatedCost] = useState(null);

  useEffect(() => {
    const loadBikes = async () => {
      setLoading(true);
      try {
        const bikes = await getAvailableBikes();
        setAvailableBikes(bikes);
      } catch (error) {
        console.error('Error loading bikes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBikes();
  }, []);

  const handleSourceChange = async (e) => {
    const address = e.target.value;
    setSourceLocation(address);
    
    if (address.length > 5) {
      try {
        const coords = await geocodeAddress(address);
        setSourceCoords(coords);
        updateRouteInfo();
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    }
  };

  const handleDestinationChange = async (e) => {
    const address = e.target.value;
    setDestinationLocation(address);
    
    if (address.length > 5) {
      try {
        const coords = await geocodeAddress(address);
        setDestCoords(coords);
        updateRouteInfo();
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    }
  };

  const updateRouteInfo = () => {
    if (sourceCoords && destCoords) {
      const routeInfo = calculateRoute(sourceCoords, destCoords);
      setDistance(routeInfo.distance.text);
      setDuration(routeInfo.duration.text);
      
      // Calculate estimated cost (₹15 per km)
      const distanceValue = parseFloat(routeInfo.distance.text);
      setEstimatedCost((distanceValue * 15).toFixed(2));
    }
  };

  const handleSelectBike = (bike) => {
    setSelectedBike(bike);
  };

  const handleBookRide = async () => {
    if (!selectedBike || !sourceLocation || !destinationLocation) {
      alert('Please select a bike and enter both source and destination locations');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would call your API to create a ride
      setTimeout(() => {
        navigate('/ride-tracking/123');
      }, 1500);
    } catch (error) {
      console.error('Error booking ride:', error);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Select Your Ride
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Enter Locations
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Source Location"
              value={sourceLocation}
              onChange={handleSourceChange}
              placeholder="Enter pickup location"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Destination Location"
              value={destinationLocation}
              onChange={handleDestinationChange}
              placeholder="Enter drop-off location"
            />
          </Grid>
        </Grid>
      </Paper>

      {(sourceCoords && destCoords) && (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Route Map
          </Typography>
          
          <MapView 
  sourceLocation={sourceLocation}
  destinationLocation={destinationLocation}
  sourceCoords={sourceCoords}
  destCoords={destCoords}
  height={400}
  onRouteFound={(routeInfo) => {
    setDistance(routeInfo.distance.text);
    setDuration(routeInfo.duration.text);
    
    // Calculate estimated cost (₹15 per km)
    const distanceValue = routeInfo.distance.value / 1000; // Convert to km
    setEstimatedCost((distanceValue * 15).toFixed(2));
  }}
/>
          
          {distance && duration && estimatedCost && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                Distance: {distance} | Estimated Time: {duration}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Estimated Cost: ₹{estimatedCost}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      <Typography variant="h6" gutterBottom>
        Available Bikes
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {availableBikes.map((bike) => (
            <Grid item xs={12} sm={6} md={4} key={bike.id}>
              <Card 
                onClick={() => handleSelectBike(bike)}
                sx={{ 
                  cursor: 'pointer',
                  border: selectedBike?.id === bike.id ? '2px solid #1976d2' : 'none',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={bike.imageUrl || 'https://via.placeholder.com/300x140?text=EV+Bike'}
                  alt={bike.model}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {bike.model}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Battery: {bike.batteryLevel}% | Range: {bike.range} km
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Location: {bike.location}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleBookRide}
          disabled={loading || !selectedBike || !sourceLocation || !destinationLocation}
        >
          {loading ? <CircularProgress size={24} /> : 'Book Ride'}
        </Button>
      </Box>
    </Box>
  );
};

export default RideSelectPage;
