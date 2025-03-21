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

export const captureRideImage = async (rideId, imageType, imageData) => {
  try {
    // In a real app, this would upload the image to your backend
    // const formData = new FormData();
    // formData.append('image', dataURItoBlob(imageData));
    // formData.append('type', imageType);
    
    // const response = await axios.post(`${API_URL}/rides/${rideId}/image`, formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });
    // return response.data;
    
    // Simulated response
    return await simulateApiCall({
      id: `img-${Date.now()}`,
      rideId,
      type: imageType,
      url: imageData,
      uploadedAt: new Date().toISOString()
    });
  } catch (error) {
    throw error;
  }
};

// Helper function to convert data URI to Blob
const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeString });
};
