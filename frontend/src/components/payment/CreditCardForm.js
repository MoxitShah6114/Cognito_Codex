// src/components/payment/CreditCardForm.js
import React, { useState } from 'react';
import { TextField, Grid, Paper, Box } from '@mui/material';

const CreditCardForm = ({ onChange }) => {
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setCardData({
      ...cardData,
      [name]: value
    });
    
    onChange({
      ...cardData,
      [name]: value
    });
  };

  return (
    <>
      <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: '#f8f8f8' }}>
        <Box sx={{ 
          p: 2, 
          bgcolor: '#2d2d2d', 
          color: 'white', 
          borderRadius: 1,
          height: 200,
          position: 'relative',
          mb: 2
        }}>
          <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
            VISA
          </Box>
          <Box sx={{ position: 'absolute', bottom: 60, left: 20 }}>
            {cardData.number ? cardData.number : '•••• •••• •••• ••••'}
          </Box>
          <Box sx={{ position: 'absolute', bottom: 30, left: 20 }}>
            {cardData.name ? cardData.name : 'YOUR NAME'}
          </Box>
          <Box sx={{ position: 'absolute', bottom: 30, right: 70 }}>
            {cardData.expiry ? cardData.expiry : 'MM/YY'}
          </Box>
        </Box>
      </Paper>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Card Number"
            name="number"
            value={cardData.number}
            onChange={handleInputChange}
            fullWidth
            inputProps={{ maxLength: 16 }}
            placeholder="1234 5678 9012 3456"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Cardholder Name"
            name="name"
            value={cardData.name}
            onChange={handleInputChange}
            fullWidth
            placeholder="John Doe"
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            label="Expiry Date"
            name="expiry"
            value={cardData.expiry}
            onChange={handleInputChange}
            fullWidth
            inputProps={{ maxLength: 5 }}
            placeholder="MM/YY"
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            label="CVC"
            name="cvc"
            value={cardData.cvc}
            onChange={handleInputChange}
            fullWidth
            inputProps={{ maxLength: 3 }}
            placeholder="123"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default CreditCardForm;
