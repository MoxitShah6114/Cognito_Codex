// src/pages/PaymentPage/PaymentsPage.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  IconButton, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  CircularProgress, 
  Tabs, 
  Tab,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';

// Simulated payment methods and transactions
const paymentMethods = [
  { id: 1, type: 'card', name: 'HDFC Credit Card', last4: '4242', expiryMonth: '09', expiryYear: '2025', isDefault: true },
  { id: 2, type: 'upi', name: 'Google Pay', id: 'user@okbank', isDefault: false }
];

const transactions = [
  { id: 101, date: '2023-10-15', amount: 242.00, description: 'Ride from Connaught Place to Lajpat Nagar', status: 'Completed', paymentMethod: 'HDFC Credit Card ****4242' },
  { id: 102, date: '2023-10-12', amount: 320.00, description: 'Ride from Karol Bagh to Janakpuri', status: 'Completed', paymentMethod: 'Google Pay' },
  { id: 103, date: '2023-10-10', amount: 180.00, description: 'Ride from Nehru Place to Greater Kailash', status: 'Completed', paymentMethod: 'Google Pay' },
  { id: 104, date: '2023-10-05', amount: 150.00, description: 'Late return penalty', status: 'Paid', paymentMethod: 'HDFC Credit Card ****4242' }
];

const PaymentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [methods, setMethods] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [paymentType, setPaymentType] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    upiId: ''
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMethods(paymentMethods);
      setTransactionHistory(transactions);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    // Reset form
    setPaymentType('card');
    setFormData({
      cardNumber: '',
      cardName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      upiId: ''
    });
  };

  const handlePaymentTypeChange = (event, newType) => {
    setPaymentType(newType);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddPaymentMethod = () => {
    // In a real app, this would send the data to your server
    let newMethod;
    
    if (paymentType === 'card') {
      newMethod = {
        id: Date.now(),
        type: 'card',
        name: `${formData.cardName}'s Card`,
        last4: formData.cardNumber.slice(-4),
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        isDefault: methods.length === 0 // Make default if first card
      };
    } else {
      newMethod = {
        id: Date.now(),
        type: 'upi',
        name: 'UPI',
        id: formData.upiId,
        isDefault: methods.length === 0 // Make default if first method
      };
    }
    
    setMethods([...methods, newMethod]);
    handleCloseAddDialog();
  };

  const handleSetDefault = (id) => {
    const updatedMethods = methods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    
    setMethods(updatedMethods);
  };

  const handleDeleteMethod = (id) => {
    const updatedMethods = methods.filter(method => method.id !== id);
    setMethods(updatedMethods);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Payments
      </Typography>
      
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}
      >
        <Tab label="Payment Methods" />
        <Tab label="Transaction History" />
      </Tabs>
      
      {activeTab === 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Your Payment Methods
            </Typography>
            
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
            >
              Add Method
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {methods.map(method => (
              <Grid item xs={12} sm={6} md={4} key={method.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    border: method.isDefault ? '2px solid' : '1px solid',
                    borderColor: method.isDefault ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    position: 'relative',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {method.isDefault && (
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10, 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}
                    >
                      DEFAULT
                    </Box>
                  )}
                  
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {method.type === 'card' ? (
                        <CreditCardIcon sx={{ mr: 1, color: 'primary.main' }} />
                      ) : (
                        <AccountBalanceIcon sx={{ mr: 1, color: 'success.main' }} />
                      )}
                      <Typography variant="h6">
                        {method.name}
                      </Typography>
                    </Box>
                    
                    {method.type === 'card' ? (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        **** **** **** {method.last4}<br />
                        Expires: {method.expiryMonth}/{method.expiryYear}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        UPI ID: {method.id}
                      </Typography>
                    )}
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      {!method.isDefault && (
                        <Button 
                          size="small" 
                          onClick={() => handleSetDefault(method.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      
                      <Box sx={{ ml: 'auto' }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteMethod(method.id)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {methods.length === 0 && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider'
              }}
            >
              <Typography variant="body1" gutterBottom>
                You don't have any payment methods yet.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleOpenAddDialog}
                sx={{ mt: 2 }}
              >
                Add Payment Method
              </Button>
            </Paper>
          )}
        </>
      )}
      
      {activeTab === 1 && (
        <>
          <Typography variant="h6" gutterBottom>
            Transaction History
          </Typography>
          
          {transactionHistory.length > 0 ? (
            transactionHistory.map((transaction) => (
              <Paper
                key={transaction.id}
                elevation={0}
                sx={{ 
                  p: { xs: 2, md: 3 }, 
                  mb: 2, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={1}>
                    <Box 
                      sx={{ 
                        bgcolor: 'primary.light', 
                        color: 'primary.main',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {transaction.description.includes('penalty') ? 
                        <PaymentIcon /> : <ReceiptIcon />}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={7}>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {transaction.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(transaction.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })} • {transaction.paymentMethod}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    <Typography variant="h6" color={transaction.description.includes('penalty') ? 'error.main' : 'text.primary'}>
                      ₹{transaction.amount.toFixed(2)}
                    </Typography>
                    <Chip 
                      label={transaction.status} 
                      size="small" 
                      color="success"
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))
          ) : (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider'
              }}
            >
              <Typography variant="body1">
                No transactions yet.
              </Typography>
            </Paper>
          )}
        </>
      )}
      
      {/* Add Payment Method Dialog */}
      <Dialog open={addDialogOpen} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Payment Method</DialogTitle>
        <DialogContent>
          <Tabs 
            value={paymentType} 
            onChange={handlePaymentTypeChange} 
            sx={{ mb: 3 }}
          >
            <Tab 
              value="card" 
              label="Credit/Debit Card" 
              icon={<CreditCardIcon />} 
              iconPosition="start" 
            />
            <Tab 
              value="upi" 
              label="UPI" 
              icon={<AccountBalanceIcon />} 
              iconPosition="start" 
            />
          </Tabs>
          
          {paymentType === 'card' ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleFormChange}
                  placeholder="1234 5678 9012 3456"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cardholder Name"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleFormChange}
                  placeholder="John Smith"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry Month (MM)"
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleFormChange}
                  placeholder="MM"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry Year (YY)"
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={handleFormChange}
                  placeholder="YY"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleFormChange}
                  placeholder="123"
                  type="password"
                />
              </Grid>
            </Grid>
          ) : (
            <TextField
              fullWidth
              label="UPI ID"
              name="upiId"
              value={formData.upiId}
              onChange={handleFormChange}
              placeholder="yourname@upibank"
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddPaymentMethod} variant="contained">
            Add Payment Method
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentsPage;
