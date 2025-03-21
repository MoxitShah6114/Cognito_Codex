import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Grid, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { getRideDetails, endRide } from '../../services/rideService';
import { captureRideImage } from '../../services/cameraService';
import CameraCapture from '../../components/camera/CameraCapture';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const RideTrackingPage = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ride, setRide] = useState(null);
  const [directions, setDirections] = useState(null);
  const [rideStatus, setRideStatus] = useState('active');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [startImage, setStartImage] = useState(null);

  useEffect(() => {
    const loadRideDetails = async () => {
      try {
        const rideData = await getRideDetails(rideId);
        setRide(rideData);
        
        // Simulate directions data
        setDirections({
          routes: [{
            legs: [{
              steps: [],
              distance: { text: '8.5 km' },
              duration: { text: '30 mins' }
            }]
          }]
        });
      } catch (error) {
        console.error('Error loading ride details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRideDetails();
  }, [rideId]);

  useEffect(() => {
    // Timer for ride duration
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCaptureStart = async (image) => {
    try {
      await captureRideImage(rideId, 'start', image);
      setStartImage(image);
      setShowCamera(false);
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const handleEndRide = async () => {
    setLoading(true);
    try {
      await endRide(rideId);
      navigate(`/payment/${rideId}`);
    } catch (error) {
      console.error('Error ending ride:', error);
      setLoading(false);
    }
  };

  if (loading && !ride) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Ride
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Ride Details
            </Typography>
            <Typography variant="body1">
              Bike: {ride?.bike?.model || 'EV Bike'}
            </Typography>
            <Typography variant="body1">
              From: {ride?.source || 'Source Location'}
            </Typography>
            <Typography variant="body1">
              To: {ride?.destination || 'Destination Location'}
            </Typography>
            <Typography variant="body1">
              Distance: {directions?.routes[0]?.legs[0]?.distance?.text || 'Calculating...'}
            </Typography>
            <Typography variant="body1">
              Estimated Duration: {directions?.routes[0]?.legs[0]?.duration?.text || 'Calculating...'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Current Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                label={rideStatus === 'active' ? 'Active' : 'Completed'} 
                color={rideStatus === 'active' ? 'success' : 'primary'}
                sx={{ mr: 2 }}
              />
              <Typography variant="body1">
                Elapsed Time: {formatTime(elapsedTime)}
              </Typography>
            </Box>
            
            {!startImage && (
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => setShowCamera(true)}
                sx={{ mb: 2 }}
              >
                Take Photo of Bike Before Starting
              </Button>
            )}
            
            {startImage && (
              <>
                <Typography variant="body2" gutterBottom>
                  Start Image Captured
                </Typography>
                <img 
                  src={startImage} 
                  alt="Start of ride" 
                  style={{ maxWidth: '100%', maxHeight: '150px', marginBottom: '10px' }} 
                />
              </>
            )}
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={handleEndRide}
              disabled={loading || !startImage}
            >
              {loading ? <CircularProgress size={24} /> : 'End Ride'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Track Your Ride
        </Typography>
        
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: 28.6139, lng: 77.2090 }}
            zoom={13}
          >
            {/* Source marker */}
            <Marker position={{ lat: 28.6139, lng: 77.2090 }} />
            {/* Destination marker */}
            <Marker position={{ lat: 28.7041, lng: 77.1025 }} />
            {/* Current location marker */}
            <Marker 
              position={{ lat: 28.6500, lng: 77.1800 }}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              }}
            />
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </LoadScript>
      </Paper>

      {showCamera && (
        <CameraCapture 
          onCapture={handleCaptureStart} 
          onCancel={() => setShowCamera(false)} 
        />
      )}
    </Box>
  );
};

export default RideTrackingPage;
