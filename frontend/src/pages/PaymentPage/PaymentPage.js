import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Divider, Grid, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getRideDetails, processPayment } from '../../services/rideService';
import CreditCardForm from '../../components/payment/CreditCardForm';
import { toast } from 'react-toastify';

const PaymentPage = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [ride, setRide] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState(null);

  useEffect(() => {
    const loadRideDetails = async () => {
      try {
        const rideData = await getRideDetails(rideId);
        setRide(rideData);
      } catch (error) {
        console.error('Error loading ride details:', error);
        toast.error('Could not load ride details');
      } finally {
        setLoading(false);
      }
    };

    loadRideDetails();
  }, [rideId]);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCardDetailsChange = (details) => {
    setCardDetails(details);
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card' && !cardDetails) {
      toast.error('Please enter valid card details');
      return;
    }

    setProcessing(true);
    try {
      await processPayment(rideId, {
        method: paymentMethod,
        details: paymentMethod === 'card' ? cardDetails : null
      });
      
      toast.success('Payment successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
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
      <Typography variant="h4" gutterBottom>
        Complete Payment
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ride Summary
            </Typography>
            
            <Box sx={{ my: 2 }}>
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
                Distance: {ride?.distance || '8.5 km'}
              </Typography>
              <Typography variant="body1">
                Duration: {ride?.duration || '35 minutes'}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle1">
                Base Fare: ₹{ride?.baseFare || '100.00'}
              </Typography>
              <Typography variant="subtitle1">
                Distance Charge: ₹{ride?.distanceCharge || '85.00'} 
              </Typography>
              <Typography variant="subtitle1">
                Time Charge: ₹{ride?.timeCharge || '35.00'}
              </Typography>
              <Typography variant="subtitle1">
                Taxes: ₹{ride?.tax || '22.00'}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6">
              Total: ₹{ride?.totalFare || '242.00'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            
            <RadioGroup 
              value={paymentMethod} 
              onChange={handlePaymentMethodChange}
            >
              <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
              <FormControlLabel value="upi" control={<Radio />} label="UPI" />
              <FormControlLabel value="cash" control={<Radio />} label="Cash" />
            </RadioGroup>
            
            {paymentMethod === 'card' && (
              <Box sx={{ mt: 3 }}>
                <CreditCardForm onChange={handleCardDetailsChange} />
              </Box>
            )}
            
            {paymentMethod === 'upi' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" gutterBottom>
                  UPI ID:
                </Typography>
                <input 
                  type="text" 
                  placeholder="Enter your UPI ID"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </Box>
            )}
            
            {paymentMethod === 'cash' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1">
                  Pay the amount to the merchant at the destination.
                </Typography>
              </Box>
            )}
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 4 }}
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? (
                <CircularProgress size={24} />
              ) : (
                `Pay ₹${ride?.totalFare || '242.00'}`
              )}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentPage;
