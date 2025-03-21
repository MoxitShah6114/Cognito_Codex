// src/pages/AuthPage/DigiLockerCallback.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { exchangeCodeForToken } from '../../services/digilockerService';

const DigiLockerCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get the authorization code from URL query parameters
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (!code) {
          throw new Error('No authorization code received from DigiLocker');
        }

        // Exchange the code for an access token
        const tokenData = await exchangeCodeForToken(code);
        
        // Store the token in session/local storage or context
        sessionStorage.setItem('digilockerToken', tokenData.access_token);
        
        // Redirect back to document verification page
        navigate('/document-verification');
      } catch (err) {
        setError(err.message || 'Failed to process DigiLocker authorization');
      } finally {
        setLoading(false);
      }
    };

    processCallback();
  }, [location, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 8 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Processing DigiLocker authorization...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', my: 8 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Authorization Error
        </Typography>
        <Typography variant="body1">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', my: 8 }}>
      <Typography variant="h6" gutterBottom>
        Authorization Successful
      </Typography>
      <Typography variant="body1">
        You are being redirected...
      </Typography>
    </Box>
  );
};

export default DigiLockerCallback;
