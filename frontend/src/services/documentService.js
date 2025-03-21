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

export const uploadDocument = async (documentType, file, authCode) => {
  try {
    // In a real app, this would upload to your backend which then sends to DigiLocker
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('authCode', authCode);
    
    // const response = await axios.post(`${API_URL}/documents/upload`, formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });
    // return response.data;
    
    // Simulated response
    return await simulateApiCall({
      id: 'doc123',
      type: documentType,
      status: 'uploaded',
      filename: file.name
    });
  } catch (error) {
    throw error;
  }
};

export const verifyDocuments = async (userId) => {
  try {
    // In a real app, this would call the backend API
    // const response = await axios.post(`${API_URL}/documents/verify/${userId}`);
    // return response.data;
    
    // Store token in localStorage (in a real app, this would come from the backend)
    localStorage.setItem('token', 'sample-jwt-token');
    
    // Simulated response
    return await simulateApiCall({
      verified: true,
      message: 'Documents verified successfully'
    });
  } catch (error) {
    throw error;
  }
};
