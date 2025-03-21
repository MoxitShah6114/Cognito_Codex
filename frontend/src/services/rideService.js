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

export const getAvailableBikes = async () => {
  try {
    // In a real app, this would call the backend API
    // const response = await axios.get(`${API_URL}/bikes/available`);
    // return response.data;
    
    // Simulated response
    return await simulateApiCall([
      {
        id: 'bike1',
        model: 'EV Sport 2000',
        batteryLevel: 85,
        range: 120,
        location: 'Connaught Place',
        imageUrl: 'https://via.placeholder.com/300x140?text=EV+Sport'
      },
      {
        id: 'bike2',
        model: 'EV City Cruiser',
        batteryLevel: 92,
        range: 150,
        location: 'Lajpat Nagar',
        imageUrl: 'https://via.placeholder.com/300x140?text=EV+Cruiser'
      },
      {
        id: 'bike3',
        model: 'EV Commuter Pro',
        batteryLevel: 78,
        range: 100,
        location: 'Karol Bagh',
        imageUrl: 'https://via.placeholder.com/300x140?text=EV+Commuter'
      }
    ]);
  } catch (error) {
    throw error;
  }
};

export const getRideDetails = async (rideId) => {
  try {
    // In a real app, this would call the backend API
    // const response = await axios.get(`${API_URL}/rides/${rideId}`);
    // return response.data;
    
    // Simulated response
    return await simulateApiCall({
      id: rideId,
      source: 'Connaught Place',
      destination: 'Lajpat Nagar',
      distance: 8.5,
      duration: '35 minutes',
      durationMinutes: 35,
      fare: 242.00,
      baseFare: 100.00,
      distanceCharge: 85.00,
      timeCharge: 35.00,
      tax: 22.00,
      totalFare: 242.00,
      status: 'active',
      bike: {
        id: 'bike1',
        model: 'EV Sport 2000'
      }
    });
  } catch (error) {
    throw error;
  }
};

export const endRide = async (rideId) => {
  try {
    // In a real app, this would call the backend API
    // const response = await axios.post(`${API_URL}/rides/${rideId}/end`);
    // return response.data;
    
    // Simulated response
    return await simulateApiCall({
      id: rideId,
      status: 'completed',
      endTime: new Date().toISOString()
    });
  } catch (error) {
    throw error;
  }
};

export const processPayment = async (rideId, paymentDetails) => {
  try {
    // In a real app, this would call the backend API
    // const response = await axios.post(`${API_URL}/rides/${rideId}/payment`, paymentDetails);
    // return response.data;
    
    // Simulated response
    return await simulateApiCall({
      id: `payment-${Date.now()}`,
      rideId,
      amount: 242.00,
      status: 'completed',
      method: paymentDetails.method,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw error;
  }
};

export const getUserRides = async () => {
  try {
    // In a real app, this would call the backend API
    // const response = await axios.get(`${API_URL}/rides/user`);
    // return response.data;
    
    // Simulated response
    return await simulateApiCall([
      {
        id: 'ride1',
        date: '2023-10-15',
        time: '14:30',
        source: 'Connaught Place',
        destination: 'Lajpat Nagar',
        distance: 8.5,
        durationMinutes: 35,
        fare: 242.00,
        status: 'Completed',
        bikeModel: 'EV Sport 2000',
        rating: 4
      },
      {
        id: 'ride2',
        date: '2023-10-12',
        time: '10:15',
        source: 'Karol Bagh',
        destination: 'Janakpuri',
        distance: 12.3,
        durationMinutes: 50,
        fare: 320.00,
        status: 'Completed',
        bikeModel: 'EV City Cruiser',
        rating: 5
      },
      {
        id: 'ride3',
        date: '2023-10-10',
        time: '19:45',
        source: 'Nehru Place',
        destination: 'Greater Kailash',
        distance: 5.2,
        durationMinutes: 25,
        fare: 180.00,
        status: 'Completed',
        bikeModel: 'EV Commuter Pro',
        rating: 4
      }
    ]);
  } catch (error) {
    throw error;
  }
};

export const getUserPenalties = async () => {
  try {
    // In a real app, this would call the backend API
    // const response = await axios.get(`${API_URL}/penalties/user`);
    // return response.data;
    
    // Simulated response
    return await simulateApiCall([
      {
        id: 'penalty1',
        date: '2023-10-10',
        rideId: 'ride3',
        reason: 'Late Return',
        description: 'Bike returned 35 minutes after the scheduled end time',
        amount: 150.00,
        status: 'Paid'
      },
      {
        id: 'penalty2',
        date: '2023-09-28',
        rideId: 'ride4',
        reason: 'Improper Parking',
        description: 'Bike parked outside designated zone',
        amount: 200.00,
        status: 'Unpaid'
      }
    ]);
  } catch (error) {
    throw error;
  }
};
