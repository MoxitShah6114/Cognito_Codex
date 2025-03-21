import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// For demo purposes, we're simulating API calls
const simulateApiCall = (data, delay = 1000, shouldFail = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('API call failed'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

export const loginUser = async (credentials) => {
  try {
    // In a real app, this would be an API call
    // const response = await axios.post(`${API_URL}/auth/login`, credentials);
    // return response.data;
    
    // Simulated response
    return await simulateApiCall({
      id: 'user123',
      name: 'Test User',
      email: credentials.email,
      phone: '9876543210',
      role: 'user',
      isDocumentVerified: true
    });
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    // In a real app, this would be an API call
    // const response = await axios.post(`${API_URL}/auth/register`, userData);
    // return response.data;
    
    // Simulated response
    return await simulateApiCall({
      id: 'user123',
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: 'user',
      isDocumentVerified: false
    });
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // In a real app, this would be an API call to invalidate the token
    // await axios.post(`${API_URL}/auth/logout`);
    
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    return await simulateApiCall(true);
  } catch (error) {
    throw error;
  }
};

export const checkAuthStatus = async () => {
  try {
    // In a real app, this would validate the token with the backend
    // const response = await axios.get(`${API_URL}/auth/me`);
    // return response.data;
    
    // Simulated auth check (token would be stored in localStorage)
    const token = localStorage.getItem('token');
    
    if (!token) {
      return null;
    }
    
    return await simulateApiCall({
      id: 'user123',
      name: 'Test User',
      email: 'user@example.com',
      phone: '9876543210',
      role: 'user',
      isDocumentVerified: true
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return null;
  }
};
