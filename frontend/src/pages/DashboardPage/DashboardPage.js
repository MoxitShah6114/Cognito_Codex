// src/pages/DashboardPage/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Tabs, 
  Tab, 
  Chip, 
  CircularProgress,
  Avatar,
  Divider,
  LinearProgress,
  useTheme,
  Fade,
  Zoom
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUserRides, getUserPenalties } from '../../services/rideService';
import ElectricBikeIcon from '@mui/icons-material/ElectricBike';
import RouteTwoToneIcon from '@mui/icons-material/RouteTwoTone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExploreIcon from '@mui/icons-material/Explore';
import PaymentIcon from '@mui/icons-material/Payment';
import ShareIcon from '@mui/icons-material/Share';

// Improved weekly activity chart component
const WeeklyActivityChart = () => {
  const theme = useTheme();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Sample data - replace with actual data from your API
  const distances = [3.2, 5.7, 0, 8.3, 4.1, 9.2, 6.5];
  const maxDistance = Math.max(...distances);
  
  return (
    <Box sx={{ position: 'relative', mt: 3, height: 200 }}>
      {/* Background grid lines */}
      {[0.25, 0.5, 0.75].map((line, i) => (
        <Box 
          key={i} 
          sx={{ 
            position: 'absolute', 
            left: 0, 
            right: 0, 
            top: `${100 - line * 100}%`, 
            borderBottom: '1px dashed #e0e0e0',
            zIndex: 1
          }}
        />
      ))}
      
      {/* Bars */}
      <Box sx={{ display: 'flex', height: '100%', alignItems: 'flex-end', position: 'relative', zIndex: 2 }}>
        {distances.map((distance, index) => (
          <Box 
            key={index} 
            sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <Box 
              sx={{ 
                position: 'relative',
                width: 24,
                height: `${(distance / (maxDistance * 1.2)) * 100}%`,
                minHeight: distance ? 4 : 0,
                borderRadius: '4px 4px 0 0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                background: distance ? `linear-gradient(to top, ${theme.palette.primary.main}, ${theme.palette.primary.light})` : 'none',
                '&:hover': {
                  transform: 'scaleX(1.2)',
                  boxShadow: distance ? '0 0 10px rgba(33, 150, 243, 0.4)' : 'none',
                }
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: -35, 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  backgroundColor: 'primary.main',
                  color: 'white',
                  py: 0.5,
                  px: 1,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  opacity: 0,
                  visibility: 'hidden',
                  transition: 'opacity 0.2s, visibility 0.2s',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    marginLeft: '-5px',
                    borderWidth: '5px',
                    borderStyle: 'solid',
                    borderColor: 'primary.main transparent transparent transparent'
                  },
                  '.MuiBox-root:hover &': {
                    opacity: 1,
                    visibility: 'visible'
                  }
                }}
              >
                {distance > 0 ? `${distance} km` : 'No ride'}
              </Box>
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                mt: 1, 
                color: 'text.secondary',
                fontWeight: index === 6 ? 'bold' : 'regular', // Highlight today
                color: index === 6 ? 'primary.main' : 'text.secondary' // Highlight today
              }}
            >
              {days[index]}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Usage stats card component
const StatCard = ({ icon, title, value, color, percent }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ 
      height: '100%', 
      borderRadius: 4,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      overflow: 'visible',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.light`, color: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        
        <Typography variant="h3" component="div" gutterBottom sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
        
        {percent !== undefined && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <LinearProgress 
              variant="determinate" 
              value={percent} 
              sx={{ 
                flexGrow: 1, 
                mr: 2, 
                height: 8, 
                borderRadius: 4,
                bgcolor: theme.palette.grey[100],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: `linear-gradient(to right, ${theme.palette[color].light}, ${theme.palette[color].main})`,
                }
              }} 
            />
            <Typography variant="body2" color="text.secondary">
              {percent}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => {
  const theme = useTheme();
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          My Dashboard
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleNewRide}
          startIcon={<ElectricBikeIcon />}
          sx={{ 
            borderRadius: 8,
            px: 3,
            boxShadow: '0 4px 14px rgba(33, 150, 243, 0.3)',
          }}
        >
          New Ride
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Zoom in={true} style={{ transitionDelay: '100ms' }}>
            <Box>
              <StatCard
                icon={<ElectricBikeIcon />}
                title="Total Rides"
                value={stats.totalRides}
                color="primary"
                percent={85}
              />
            </Box>
          </Zoom>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Zoom in={true} style={{ transitionDelay: '200ms' }}>
            <Box>
              <StatCard
                icon={<RouteTwoToneIcon />}
                title="Total Distance"
                value={`${stats.totalDistance} km`}
                color="success"
                percent={62}
              />
            </Box>
          </Zoom>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Zoom in={true} style={{ transitionDelay: '300ms' }}>
            <Box>
              <StatCard
                icon={<AccessTimeIcon />}
                title="Total Time"
                value={`${stats.totalDuration} min`}
                color="info"
                percent={78}
              />
            </Box>
          </Zoom>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Zoom in={true} style={{ transitionDelay: '400ms' }}>
            <Box>
              <StatCard
                icon={<StarIcon />}
                title="Avg. Rating"
                value={`${stats.avgRating}/5`}
                color="warning"
                percent={parseInt(stats.avgRating) * 20}
              />
            </Box>
          </Zoom>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Fade in={true} timeout={1000}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Weekly Activity
                </Typography>
                <Button 
                  variant="text" 
                  endIcon={<NavigateNextIcon />} 
                  onClick={() => navigate('/ride-history')}
                >
                  View Details
                </Button>
              </Box>
              
              <WeeklyActivityChart />
            </Paper>
          </Fade>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Fade in={true} timeout={1000} style={{ transitionDelay: '300ms' }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<ExploreIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}
                  onClick={() => navigate('/bike-stations')}
                >
                  Explore Bike Stations
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={<ElectricBikeIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}
                  onClick={() => navigate('/ride-history')}
                >
                  View My Routes
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={<PaymentIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}
                  onClick={() => navigate('/payments')}
                >
                  Add Payment Method
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={<ShareIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}
                  onClick={() => navigate('/refer-friend')}
                >
                  Refer a Friend
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          textColor="primary"
          indicatorColor="primary"
          sx={{ 
            px: 2, 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              fontWeight: 600,
            }
          }}
        >
          <Tab label="Ride History" />
          <Tab label="Penalties" />
        </Tabs>
        
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {tabValue === 0 ? (
            rides.length > 0 ? (
              <Box>
                {rides.map((ride, index) => (
                  <Fade in={true} timeout={1000} style={{ transitionDelay: `${index * 100}ms` }} key={ride.id}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={1}>
                          <Avatar sx={{ bgcolor: 'primary.light' }}>
                            <ElectricBikeIcon />
                          </Avatar>
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {ride.date} • {ride.time}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {ride.bikeModel}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                          <Typography variant="body1">
                            From: {ride.source}
                          </Typography>
                          <Typography variant="body1">
                            To: {ride.destination}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            ₹{ride.fare}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {ride.distance} km • {ride.durationMinutes} min
                          </Typography>
                          <Chip 
                            size="small"
                            label={ride.status} 
                            color={ride.status === 'Completed' ? 'success' : 'primary'}
                            sx={{ mt: 1, borderRadius: 1 }}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Fade>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
                No ride history available yet.
              </Typography>
            )
          ) : (
            penalties.length > 0 ? (
              <Box>
                {penalties.map((penalty, index) => (
                  <Fade in={true} timeout={1000} style={{ transitionDelay: `${index * 100}ms` }} key={penalty.id}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={1}>
                          <Avatar sx={{ bgcolor: penalty.status === 'Paid' ? 'success.light' : 'error.light' }}>
                            {penalty.status === 'Paid' ? '✓' : '!'}
                          </Avatar>
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {penalty.date}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Ride ID: {penalty.rideId}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={5}>
                          <Typography variant="body1" fontWeight={500}>
                            {penalty.reason}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {penalty.description}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            ₹{penalty.amount}
                          </Typography>
                          <Chip 
                            size="small"
                            label={penalty.status} 
                            color={penalty.status === 'Paid' ? 'success' : 'error'}
                            sx={{ mt: 1, borderRadius: 1 }}
                          />
                        </Grid>
                        
                        {penalty.status !== 'Paid' && (
                          <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Button size="small" color="primary" variant="contained">Pay Now</Button>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Fade>
                ))}
              </Box>
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
