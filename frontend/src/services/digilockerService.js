// src/services/digilockerService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// For demo purposes, we're simulating API calls
const simulateApiCall = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Get DigiLocker OAuth authorization URL
export const getDigiLockerAuthUrl = () => {
  // In a real implementation, this would come from your backend
  // The backend would generate the proper URL with state parameter for security
  const redirectUri = encodeURIComponent(window.location.origin + '/auth/digilocker/callback');
  
  // This is a simulated URL - actual implementation would come from your backend
  return `https://api.digitallocker.gov.in/public/oauth2/1/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=${redirectUri}&response_type=code&state=${generateRandomState()}`;
};

// Generate random state for CSRF protection
const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Exchange authorization code for access token
export const exchangeCodeForToken = async (code) => {
  // In a real implementation, this would call your backend API
  // which would then securely call DigiLocker API
  return simulateApiCall({
    access_token: 'simulated-access-token',
    refresh_token: 'simulated-refresh-token',
    expires_in: 3600
  });
};

// Get user's DL (Driving License) from DigiLocker
export const fetchDrivingLicenseFromDigiLocker = async (token) => {
  // In a real implementation, this would call your backend API
  // which would use DigiLocker's issued documents API
  return simulateApiCall({
    documentType: 'DRIVING_LICENSE',
    documentId: 'DL' + Math.floor(10000000 + Math.random() * 90000000),
    name: 'John Doe',
    dob: '1990-01-01',
    issueDate: '2021-05-15',
    validUntil: '2031-05-14',
    issuingAuthority: 'Regional Transport Office',
    verified: true,
    documentData: {
      dlNumber: 'DL' + Math.floor(10000000 + Math.random() * 90000000),
      vehicleCategories: ['LMV', 'MCWG'],
      address: '123 Main St, New Delhi, 110001'
    }
  });
};

// Verify the driving license with your backend
export const verifyDrivingLicense = async (licenseData, userId) => {
  // In a real implementation, this would call your backend API
  // which would verify the license details and update user status
  return simulateApiCall({
    verified: true,
    message: 'Driving license verified successfully',
    userId: userId
  });
};
