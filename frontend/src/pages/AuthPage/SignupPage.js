import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Link, FormControlLabel, Checkbox, Stepper, Step, StepLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DigiLockerIntegration from '../../components/auth/DigiLockerIntegration';

const SignupPage = () => {
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [userId, setUserId] = useState(null);
  const [licenseVerified, setLicenseVerified] = useState(false);

  const steps = ['Account Details', 'Document Verification', 'Complete Registration'];

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Phone is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!termsAccepted) {
        alert('Please accept the terms and conditions to proceed');
        return;
      }
      
      setLoading(true);
      try {
        const result = await signup({
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password,
        });
        
        setUserId(result.id);
        setActiveStep(1); // Move to document verification step
      } catch (error) {
        console.error('Signup error:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleLicenseVerificationComplete = async (licenseData) => {
    setLicenseVerified(true);
    setActiveStep(2); // Move to complete registration step
  };

  const handleCompleteRegistration = async () => {
    setLoading(true);
    try {
      // Login the user after successful registration and verification
      await login({
        email: formik.values.email,
        password: formik.values.password,
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error after signup:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        my: 4
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sign Up
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === 0 && (
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              id="name"
              name="name"
              label="Full Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            
            <TextField
              fullWidth
              margin="normal"
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            
            <TextField
              fullWidth
              margin="normal"
              id="phone"
              name="phone"
              label="Phone Number"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
            
            <TextField
              fullWidth
              margin="normal"
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            
            <TextField
              fullWidth
              margin="normal"
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={termsAccepted} 
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I accept the {' '}
                  <Link component={RouterLink} to="/terms" target="_blank">
                    Terms and Conditions
                  </Link>
                </Typography>
              }
            />
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || !termsAccepted}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login">
                  Login
                </Link>
              </Typography>
            </Box>
          </form>
        )}
        
        {activeStep === 1 && userId && (
          <DigiLockerIntegration 
            onVerificationComplete={handleLicenseVerificationComplete}
            userId={userId}
          />
        )}
        
        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom color="success.main">
              Document Verification Successful!
            </Typography>
            
            <Typography variant="body1" paragraph>
              Your driving license has been successfully verified. You can now start using our EV Bike Rental service.
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleCompleteRegistration}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Complete Registration'}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SignupPage;
