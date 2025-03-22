// src/pages/RidePage/RideHistoryPage.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  InputAdornment, 
  CircularProgress, 
  Divider, 
  Avatar, 
  Chip, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUserRides } from '../../services/rideService';
import SearchIcon from '@mui/icons-material/Search';
import ElectricBikeIcon from '@mui/icons-material/ElectricBike';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RepeatIcon from '@mui/icons-material/Repeat';
import StarRateIcon from '@mui/icons-material/StarRate';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import CloseIcon from '@mui/icons-material/Close';
// Import MapView conditionally to prevent crashes
// import MapView from '../../components/map/MapView';

const RideHistoryPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedRide, setSelectedRide] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);

  useEffect(() => {
    const loadRides = async () => {
      setLoading(true);
      try {
        // Fetch ride data
        const ridesData = await getUserRides();
        
        // Make sure all rides have the expected properties
        const processedRides = ridesData.map(ride => ({
          ...ride,
          // Ensure numeric values for proper sorting/calculations
          fare: typeof ride.fare === 'number' ? ride.fare : parseFloat(ride.fare) || 0,
          distance: typeof ride.distance === 'number' ? ride.distance : parseFloat(ride.distance) || 0,
          durationMinutes: typeof ride.durationMinutes === 'number' ? ride.durationMinutes : parseFloat(ride.durationMinutes) || 0,
          rating: typeof ride.rating === 'number' ? ride.rating : 0
        }));
        
        setRides(processedRides);
        setFilteredRides(processedRides);
      } catch (error) {
        console.error('Error loading rides:', error);
        setError('Failed to load ride history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadRides();
  }, []);

  useEffect(() => {
    try {
      // Apply filters and sorting
      if (!rides || !rides.length) return;
      
      let result = [...rides];
      
      // Apply status filter
      if (filterStatus !== 'all') {
        result = result.filter(ride => 
          ride.status && ride.status.toLowerCase() === filterStatus.toLowerCase()
        );
      }
      
      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(ride => 
          (ride.source && ride.source.toLowerCase().includes(query)) || 
          (ride.destination && ride.destination.toLowerCase().includes(query)) ||
          (ride.bikeModel && ride.bikeModel.toLowerCase().includes(query))
        );
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'date-desc':
          result.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
          break;
        case 'date-asc':
          result.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
          break;
        case 'price-desc':
          result.sort((a, b) => (b.fare || 0) - (a.fare || 0));
          break;
        case 'price-asc':
          result.sort((a, b) => (a.fare || 0) - (b.fare || 0));
          break;
        case 'distance-desc':
          result.sort((a, b) => (b.distance || 0) - (a.distance || 0));
          break;
        case 'distance-asc':
          result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
          break;
        default:
          break;
      }
      
      setFilteredRides(result);
    } catch (error) {
      console.error('Error filtering rides:', error);
      // If filtering fails, just show the original rides
      setFilteredRides(rides);
    }
  }, [rides, searchQuery, filterStatus, sortBy]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleViewDetails = (ride) => {
    setSelectedRide(ride);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedRide(null);
  };

  const handleRepeatRide = (ride) => {
    // Implement function to set up a new ride with the same source/destination
    navigate('/ride-select', { 
      state: { 
        source: ride.source, 
        destination: ride.destination 
      } 
    });
  };

  const handleOpenRatingDialog = () => {
    setRatingDialogOpen(true);
  };

  const handleCloseRatingDialog = () => {
    setRatingDialogOpen(false);
  };

  const handleRatingChange = (newValue) => {
    setRatingValue(newValue);
  };

  const handleSubmitRating = () => {
    // Here you would send the rating to your backend
    console.log(`Submitted rating ${ratingValue} for ride ${selectedRide?.id}`);
    setRatingDialogOpen(false);
    
    if (selectedRide && rides) {
      // Update the ride rating in the local state
      const updatedRides = rides.map(ride => 
        ride.id === selectedRide.id ? { ...ride, rating: ratingValue } : ride
      );
      setRides(updatedRides);
    }
  };

  const handleDownloadReceipt = (ride) => {
    // In a real app, this would generate and download a PDF receipt
    console.log(`Downloading receipt for ride ${ride.id}`);
    alert(`Receipt for ride on ${ride.date} is being downloaded...`);
  };

  const getStatusColor = (status) => {
    if (!status) return 'default';
    
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'in progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Ride History
      </Typography>
      
      {/* Search and Filter Bar */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by location or bike model..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="filter-by-label">Filter By</InputLabel>
              <Select
                labelId="filter-by-label"
                value={filterStatus}
                label="Filter By"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Rides</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="in progress">In Progress</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
              >
                <MenuItem value="date-desc">Date (Newest first)</MenuItem>
                <MenuItem value="date-asc">Date (Oldest first)</MenuItem>
                <MenuItem value="price-desc">Price (High to Low)</MenuItem>
                <MenuItem value="price-asc">Price (Low to High)</MenuItem>
                <MenuItem value="distance-desc">Distance (Long to Short)</MenuItem>
                <MenuItem value="distance-asc">Distance (Short to Long)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Ride List */}
      {filteredRides && filteredRides.length > 0 ? (
        <Grid container spacing={3}>
          {filteredRides.map((ride) => (
            <Grid item xs={12} key={ride.id}>
              <Card 
                sx={{ 
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.light',
                          width: 50,
                          height: 50
                        }}
                      >
                        <ElectricBikeIcon />
                      </Avatar>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {ride.date || 'N/A'} {ride.time ? `• ${ride.time}` : ''}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ride.bikeModel || 'Electric Bike'}
                      </Typography>
                      {ride.rating ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Box key={star} component="span">
                              {ride.rating >= star ? (
                                <StarRateIcon sx={{ color: 'warning.main', fontSize: 18 }} />
                              ) : (
                                <StarOutlineIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                              )}
                            </Box>
                          ))}
                        </Box>
                      ) : null}
                    </Grid>
                    
                    <Grid item xs={12} sm={5} md={4}>
                      <Typography variant="body1" sx={{ mb: 0.5 }}>
                        From: <span style={{ fontWeight: 500 }}>{ride.source || 'N/A'}</span>
                      </Typography>
                      <Typography variant="body1">
                        To: <span style={{ fontWeight: 500 }}>{ride.destination || 'N/A'}</span>
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {ride.status && (
                          <Chip 
                            size="small" 
                            label={ride.status} 
                            color={getStatusColor(ride.status)}
                            sx={{ mr: 1 }}
                          />
                        )}
                        <Chip 
                          size="small" 
                          label={`${ride.distance || 0} km`} 
                          variant="outlined" 
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Chip 
                          size="small" 
                          label={`${ride.durationMinutes || 0} min`}
                          variant="outlined"
                          color="secondary"
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                      <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                        ₹{(ride.fare || 0).toFixed(2)}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => handleViewDetails(ride)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="contained" 
                          size="small"
                          startIcon={<RepeatIcon />}
                          onClick={() => handleRepeatRide(ride)}
                        >
                          Repeat
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <Typography variant="h6" gutterBottom>
            No rides found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {searchQuery || filterStatus !== 'all' 
              ? 'Try changing your search or filter criteria' 
              : 'You haven\'t taken any rides yet'}
          </Typography>
          
          <Button 
            variant="contained" 
            sx={{ mt: 3 }}
            onClick={() => navigate('/ride-select')}
          >
            Book Your First Ride
          </Button>
        </Paper>
      )}
      
      {/* Ride Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={handleCloseDetails} 
        maxWidth="md" 
        fullWidth
      >
        {selectedRide && (
          <>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Ride Details</Typography>
              <IconButton
                aria-label="close"
                onClick={handleCloseDetails}
                sx={{ color: 'grey.500' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      Date & Time
                    </Typography>
                    <Typography variant="h6">
                      {selectedRide.date || 'N/A'} {selectedRide.time ? `• ${selectedRide.time}` : ''}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      Bike Details
                    </Typography>
                    <Typography variant="h6">
                      {selectedRide.bikeModel || 'Electric Bike'}
                    </Typography>
                    {selectedRide.status && (
                      <Chip 
                        label={selectedRide.status} 
                        color={getStatusColor(selectedRide.status)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      Route
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>From:</strong> {selectedRide.source || 'N/A'}
                    </Typography>
                    <Typography variant="body1">
                      <strong>To:</strong> {selectedRide.destination || 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      Ride Stats
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Distance
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedRide.distance || 0} km
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedRide.durationMinutes || 0} min
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Fare
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          ₹{(selectedRide.fare || 0).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Your Rating
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {selectedRide.rating ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                                {selectedRide.rating}/5
                              </Typography>
                              <StarRateIcon sx={{ color: 'warning.main', fontSize: 18 }} />
                            </Box>
                          ) : (
                            <Button 
                              size="small" 
                              variant="outlined" 
                              onClick={handleOpenRatingDialog}
                            >
                              Rate
                            </Button>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  {/* Map placeholder - comment out the actual MapView for now */}
                  <Box sx={{ 
                    height: 300, 
                    mb: 2, 
                    bgcolor: 'action.hover', 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography>
                      Route Map
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Payment Details
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={8}>
                        <Typography variant="body2">Base Fare</Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">₹{((selectedRide.fare || 0) * 0.6).toFixed(2)}</Typography>
                      </Grid>
                      
                      <Grid item xs={8}>
                        <Typography variant="body2">Distance Charge</Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">₹{((selectedRide.fare || 0) * 0.2).toFixed(2)}</Typography>
                      </Grid>
                      
                      <Grid item xs={8}>
                        <Typography variant="body2">Time Charge</Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">₹{((selectedRide.fare || 0) * 0.1).toFixed(2)}</Typography>
                      </Grid>
                      
                      <Grid item xs={8}>
                        <Typography variant="body2">Taxes</Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">₹{((selectedRide.fare || 0) * 0.1).toFixed(2)}</Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>
                      
                      <Grid item xs={8}>
                        <Typography variant="subtitle2">Total Amount</Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle2">₹{(selectedRide.fare || 0).toFixed(2)}</Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Paid via Credit Card •••• 4242
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button 
                startIcon={<ReceiptIcon />}
                onClick={() => handleDownloadReceipt(selectedRide)}
              >
                Download Receipt
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<RepeatIcon />}
                onClick={() => handleRepeatRide(selectedRide)}
              >
                Book Similar Ride
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onClose={handleCloseRatingDialog}>
        <DialogTitle>Rate Your Ride</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            How would you rate your experience with this ride?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconButton 
                key={star}
                onClick={() => handleRatingChange(star)}
                sx={{ 
                  mx: 1,
                  color: ratingValue >= star ? 'warning.main' : 'text.disabled'
                }}
              >
                <StarRateIcon sx={{ fontSize: 40 }} />
              </IconButton>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRatingDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitRating} 
            variant="contained" 
            disabled={!ratingValue}
          >
            Submit Rating
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RideHistoryPage;
