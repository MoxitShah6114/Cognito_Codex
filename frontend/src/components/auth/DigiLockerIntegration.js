// src/components/auth/DigiLockerIntegration.js
import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Stepper, Step, StepLabel, CircularProgress } from '@mui/material';
import { getDigiLockerAuthUrl, exchangeCodeForToken, fetchDrivingLicenseFromDigiLocker, verifyDrivingLicense } from '../../services/digilockerService';

const DigiLockerIntegration = ({ onVerificationComplete, userId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [licenseData, setLicenseData] = useState(null);

  const steps = ['Connect DigiLocker', 'Fetch Documents', 'Verify License'];

  const handleConnectDigiLocker = () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would redirect to DigiLocker OAuth page
      const authUrl = getDigiLockerAuthUrl();
      
      // For demo, we'll simulate the OAuth flow
      simulateOAuthFlow()
        .then(code => {
          return exchangeCodeForToken(code);
        })
        .then(tokenData => {
          setActiveStep(1);
          return fetchDrivingLicenseFromDigiLocker(tokenData.access_token);
        })
        .then(dlData => {
          setLicenseData(dlData);
          setActiveStep(2);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to connect to DigiLocker: ' + err.message);
          setLoading(false);
        });
    } catch (err) {
      setError('Failed to start DigiLocker authorization: ' + err.message);
      setLoading(false);
    }
  };

  // Simulate OAuth flow for demo purposes
  const simulateOAuthFlow = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('simulated-auth-code');
      }, 1500);
    });
  };

  const handleVerifyLicense = async () => {
    if (!licenseData) {
      setError('No license data available to verify');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await verifyDrivingLicense(licenseData, userId);
      if (result.verified) {
        onVerificationComplete(licenseData);
      } else {
        setError('License verification failed: ' + result.message);
      }
    } catch (err) {
      setError('Error during verification: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Driver's License Verification
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 2 }}>
        {activeStep === 0 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" paragraph>
              Connect to DigiLocker to verify your driving license securely.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConnectDigiLocker}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Connecting...' : 'Connect to DigiLocker'}
            </Button>
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" paragraph>
              Fetching your documents from DigiLocker...
            </Typography>
            <CircularProgress />
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            {licenseData && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Driving License Details:
                </Typography>
                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2">Name: {licenseData.name}</Typography>
                  <Typography variant="body2">License Number: {licenseData.documentData.dlNumber}</Typography>
                  <Typography variant="body2">Valid Until: {licenseData.validUntil}</Typography>
                  <Typography variant="body2">Issuing Authority: {licenseData.issuingAuthority}</Typography>
                </Box>
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleVerifyLicense}
              disabled={loading || !licenseData}
              startIcon={loading && <CircularProgress size={20} />}
              fullWidth
            >
              {loading ? 'Verifying...' : 'Verify License'}
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default DigiLockerIntegration;
